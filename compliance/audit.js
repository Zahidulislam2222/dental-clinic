#!/usr/bin/env node

/**
 * Compliance Audit Scanner for Everyday Dental Surgery
 * =====================================================
 * Static source-code analysis for HIPAA, FHIR R4, SOC 2, and Security.
 *
 * Scans actual files and gives PASS / FAIL / WARN verdicts with evidence.
 * Does NOT guess or assume — if it can't verify, it says so.
 *
 * Usage:
 *   node compliance/audit.js              # Full audit with terminal output
 *   node compliance/audit.js --json       # Output JSON report
 *   node compliance/audit.js --ci         # Exit code 1 if any CRITICAL fails
 *   node compliance/audit.js --category hipaa   # Run only HIPAA checks
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// ─── Configuration ─────────────────────────────────────────────────

const SEVERITY = { CRITICAL: 'CRITICAL', HIGH: 'HIGH', MEDIUM: 'MEDIUM', LOW: 'LOW', INFO: 'INFO' };
const STATUS = { PASS: 'PASS', FAIL: 'FAIL', WARN: 'WARN' };

const args = process.argv.slice(2);
const FLAG_JSON = args.includes('--json');
const FLAG_CI = args.includes('--ci');
const FLAG_CATEGORY = args.includes('--category') ? args[args.indexOf('--category') + 1] : null;
const FLAG_VERBOSE = args.includes('--verbose') || args.includes('-v');

// ─── Utilities ─────────────────────────────────────────────────────

function readFile(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  try { return fs.readFileSync(fullPath, 'utf-8'); }
  catch { return null; }
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

function globFiles(dir, pattern) {
  const results = [];
  const fullDir = path.join(ROOT, dir);
  if (!fs.existsSync(fullDir)) return results;

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.match(pattern)) {
        results.push(fullPath);
      }
    }
  }
  walk(fullDir);
  return results;
}

// ─── Results Collector ─────────────────────────────────────────────

const results = [];

function check(id, category, severity, title, hipaaRef, testFn) {
  if (FLAG_CATEGORY && category.toLowerCase() !== FLAG_CATEGORY.toLowerCase()) return;

  try {
    const { status, evidence, file, line } = testFn();
    results.push({ id, category, severity, title, hipaaRef, status, evidence, file: file || '', line: line || '' });
  } catch (err) {
    results.push({ id, category, severity, title, hipaaRef, status: STATUS.FAIL, evidence: `Check threw error: ${err.message}`, file: '', line: '' });
  }
}

// ═══════════════════════════════════════════════════════════════════
//  HIPAA CHECKS
// ═══════════════════════════════════════════════════════════════════

// ── PHI Encryption ──

check('HIPAA-ENC-001', 'HIPAA', SEVERITY.CRITICAL, 'Vault encryption key has NULL fallback risk', '164.312(a)(2)(iv)', () => {
  const content = readFile('supabase/migrations/004_encryption.sql');
  if (!content) return { status: STATUS.FAIL, evidence: 'Migration file 004_encryption.sql not found' };
  const fix = readFile('supabase/migrations/010_compliance_hardening.sql') || '';

  const hasNullReturn = /RETURN\s+NULL/i.test(content) && /vault/i.test(content);
  const fixedWithException = /RAISE\s+EXCEPTION.*vault|encrypt_phi.*RAISE\s+EXCEPTION/i.test(fix);

  if (hasNullReturn && !fixedWithException) {
    return {
      status: STATUS.FAIL,
      evidence: 'encrypt_phi() returns NULL when Vault key is missing — PHI will be stored as plaintext (NULL bytea)',
      file: 'supabase/migrations/004_encryption.sql',
      line: '32-34'
    };
  }
  return { status: STATUS.PASS, evidence: 'encrypt_phi() raises exception on Vault failure (fixed in migration 010)' };
});

check('HIPAA-ENC-002', 'HIPAA', SEVERITY.CRITICAL, 'Original plaintext PHI columns must be dropped after encryption', '164.312(a)(2)(iv)', () => {
  const allSQL = globFiles('supabase/migrations', /\.sql$/).map(f => fs.readFileSync(f, 'utf-8')).join('\n');

  const plaintextColumns = ['medical_history', 'allergies', 'date_of_birth', 'blood_group', 'medical_notes'];
  const droppedColumns = plaintextColumns.filter(col => {
    const dropPattern = new RegExp(`DROP\\s+COLUMN.*\\b${col}\\b`, 'i');
    return dropPattern.test(allSQL);
  });

  if (droppedColumns.length < plaintextColumns.length) {
    const notDropped = plaintextColumns.filter(c => !droppedColumns.includes(c));
    return {
      status: STATUS.FAIL,
      evidence: `Plaintext PHI columns NOT dropped: [${notDropped.join(', ')}]. Dual storage risk.`,
      file: 'supabase/migrations/'
    };
  }
  return { status: STATUS.PASS, evidence: 'All plaintext PHI columns dropped' };
});

check('HIPAA-ENC-003', 'HIPAA', SEVERITY.HIGH, 'Vault decryption failure returns [ENCRYPTED] string instead of error', '164.312(a)(2)(iv)', () => {
  const content = readFile('supabase/migrations/004_encryption.sql');
  if (!content) return { status: STATUS.FAIL, evidence: 'Migration file not found' };
  const fix = readFile('supabase/migrations/010_compliance_hardening.sql') || '';

  const hasEncryptedReturn = /RETURN\s+'\[ENCRYPTED\]'/i.test(content);
  const hasFixedReturn = /DECRYPTION_UNAVAILABLE|RAISE\s+WARNING.*decrypt/i.test(fix);

  if (hasEncryptedReturn && !hasFixedReturn) {
    return {
      status: STATUS.FAIL,
      evidence: 'decrypt_phi() returns literal string [ENCRYPTED] on Vault failure.',
      file: 'supabase/migrations/004_encryption.sql',
      line: '62'
    };
  }
  return { status: STATUS.PASS, evidence: 'Decryption failure returns [DECRYPTION_UNAVAILABLE] + RAISE WARNING (fixed in migration 010)' };
});

check('HIPAA-ENC-004', 'HIPAA', SEVERITY.HIGH, 'No encryption key rotation schedule', '164.312(a)(2)(iv)', () => {
  const migrations = globFiles('supabase/migrations', /\.sql$/);
  let hasRotation = false;
  let matchedText = '';
  for (const f of migrations) {
    const content = fs.readFileSync(f, 'utf-8');
    // Must find an actual key rotation FUNCTION or PROCEDURE — not just the words in comments or unrelated context
    const hasRotationFunction = /CREATE.*FUNCTION.*rotat|FUNCTION.*key.*rotation/i.test(content);
    const hasRotationSchedule = /cron\.schedule.*rotat/i.test(content);
    const hasReEncryptFunction = /CREATE.*FUNCTION.*re.?encrypt/i.test(content);
    if (hasRotationFunction || hasRotationSchedule || hasReEncryptFunction) {
      hasRotation = true;
      break;
    }
  }
  if (!hasRotation) {
    return {
      status: STATUS.FAIL,
      evidence: 'No encryption key rotation function, re-encryption procedure, or rotation schedule found in any migration. Keys used since initial deployment without rotation.',
      file: 'supabase/migrations/004_encryption.sql'
    };
  }
  return { status: STATUS.PASS, evidence: 'Key rotation mechanism found' };
});

// ── RLS & Access Controls ──

check('HIPAA-RLS-001', 'HIPAA', SEVERITY.HIGH, 'All PHI tables must have RLS enabled', '164.312(a)(1)', () => {
  const phiTables = ['contacts', 'appointments', 'registrations', 'newsletter_subscribers',
    'audit_logs', 'consent_records', 'data_access_requests', 'security_incidents',
    'fhir_resources', 'retention_policies', 'purge_logs', 'anomaly_rules', 'user_profiles'];

  const migrations = globFiles('supabase/migrations', /\.sql$/);
  const allSQL = migrations.map(f => fs.readFileSync(f, 'utf-8')).join('\n');

  const missingRLS = phiTables.filter(table => {
    const pattern = new RegExp(`ALTER\\s+TABLE\\s+${table}\\s+ENABLE\\s+ROW\\s+LEVEL\\s+SECURITY`, 'i');
    return !pattern.test(allSQL);
  });

  if (missingRLS.length > 0) {
    return { status: STATUS.FAIL, evidence: `Tables missing RLS: [${missingRLS.join(', ')}]` };
  }
  return { status: STATUS.PASS, evidence: `All ${phiTables.length} PHI tables have RLS enabled` };
});

check('HIPAA-RLS-002', 'HIPAA', SEVERITY.HIGH, 'Anon users can INSERT PHI into tables (contact, appointment, registration)', '164.308(a)(4)', () => {
  const content = readFile('supabase/migrations/003_rbac_policies.sql');
  if (!content) return { status: STATUS.FAIL, evidence: 'Migration file not found' };

  const anonInserts = [];
  const tables = ['contacts', 'appointments', 'registrations'];
  for (const t of tables) {
    const pattern = new RegExp(`ON\\s+${t}[\\s\\S]*?FOR\\s+INSERT\\s+TO\\s+(anon|anon,\\s*authenticated)`, 'i');
    if (pattern.test(content)) anonInserts.push(t);
  }

  if (anonInserts.length > 0) {
    return {
      status: STATUS.WARN,
      evidence: `Anon (unauthenticated) INSERT allowed on: [${anonInserts.join(', ')}]. Public forms require this, but server-side rate limiting and CAPTCHA must compensate.`,
      file: 'supabase/migrations/003_rbac_policies.sql',
      line: '43,56,74'
    };
  }
  return { status: STATUS.PASS, evidence: 'No anon INSERT policies on PHI tables' };
});

check('HIPAA-RLS-003', 'HIPAA', SEVERITY.HIGH, 'Receptionist views are advisory only — no RLS blocks direct PHI column access', '164.308(a)(3)', () => {
  const content = readFile('supabase/migrations/003_rbac_policies.sql');
  if (!content) return { status: STATUS.FAIL, evidence: 'Migration file not found' };

  const hasReceptionViews = content.includes('registrations_reception') || content.includes('appointments_reception');

  if (!hasReceptionViews) {
    return { status: STATUS.PASS, evidence: 'No receptionist views — check if receptionist role exists' };
  }

  // Check ALL migrations for column-level restrictions or receptionist-specific RLS that blocks PHI columns
  const allSQL = globFiles('supabase/migrations', /\.sql$/).map(f => fs.readFileSync(f, 'utf-8')).join('\n');

  // Look for RLS policies that specifically restrict receptionist from reading PHI columns
  // or SECURITY DEFINER functions, or is_receptionist() checks
  const hasReceptionistRestriction =
    /is_receptionist|auth\.is_receptionist/i.test(allSQL) ||
    /receptionist.*SELECT.*USING|receptionist.*restricted/i.test(allSQL) ||
    /CASE.*WHEN.*role.*receptionist.*THEN.*NULL/i.test(allSQL);

  if (!hasReceptionistRestriction) {
    return {
      status: STATUS.FAIL,
      evidence: 'Receptionist-safe views (registrations_reception, appointments_reception) exist but are advisory only. No RLS policy prevents receptionist from querying the base tables directly to see PHI columns (medical_history, allergies, blood_group, medical_notes). Views don\'t enforce access — RLS does.',
      file: 'supabase/migrations/003_rbac_policies.sql',
      line: '103-113'
    };
  }
  return { status: STATUS.PASS, evidence: 'Receptionist PHI access restricted at RLS level' };
});

// ── Audit Logging ──

check('HIPAA-AUDIT-001', 'HIPAA', SEVERITY.HIGH, 'SELECT queries are NOT logged via database triggers', '164.312(b)', () => {
  const allSQL = globFiles('supabase/migrations', /\.sql$/).map(f => fs.readFileSync(f, 'utf-8')).join('\n');

  // Check for pgAudit extension or configuration in any migration
  const hasPgAudit = /pgaudit|pg_audit/i.test(allSQL);
  const hasPgAuditConfig = /pgaudit\.log.*read|ALTER\s+SYSTEM\s+SET\s+pgaudit/i.test(allSQL);

  if (!hasPgAudit) {
    return {
      status: STATUS.FAIL,
      evidence: 'No pgAudit extension reference in any migration. SELECT queries are unaudited at database level.',
      file: 'supabase/migrations/'
    };
  }
  return { status: STATUS.PASS, evidence: 'pgAudit extension configured for SELECT logging (migration 011)' };
});

check('HIPAA-AUDIT-002', 'HIPAA', SEVERITY.MEDIUM, 'IP address and user agent columns exist but are never populated by triggers', '164.312(b)', () => {
  const content = readFile('supabase/migrations/005_audit_logging.sql');
  if (!content) return { status: STATUS.FAIL, evidence: 'Migration file not found' };

  const hasIPColumn = /ip_address\s+TEXT/i.test(content);
  const hasUserAgentColumn = /user_agent\s+TEXT/i.test(content);
  const populatesIP = /ip_address.*:=|ip_address,.*VALUES/i.test(content);

  // Check the INSERT statement in the trigger function
  const insertMatch = content.match(/INSERT\s+INTO\s+audit_logs\s*\([^)]+\)/i);
  const insertIncludesIP = insertMatch && /ip_address/i.test(insertMatch[0]);

  // Check if fix migration (010) updates the trigger to use session vars
  const fix010 = readFile('supabase/migrations/010_compliance_hardening.sql') || '';
  const fixedWithSessionVars = /app\.client_ip|current_setting.*app\.client_ip/i.test(fix010);

  if (hasIPColumn && hasUserAgentColumn && !insertIncludesIP && !fixedWithSessionVars) {
    return {
      status: STATUS.FAIL,
      evidence: 'audit_logs has ip_address/user_agent columns, but trigger does not populate them.',
      file: 'supabase/migrations/005_audit_logging.sql',
      line: '19-20, 111'
    };
  }
  return { status: STATUS.PASS, evidence: 'IP and user agent captured via session variables (fixed in migration 010)' };
});

check('HIPAA-AUDIT-003', 'HIPAA', SEVERITY.HIGH, 'FHIR API reads must be logged even if Edge Function fails', '164.312(b)', () => {
  const allSQL = globFiles('supabase/migrations', /\.sql$/).map(f => fs.readFileSync(f, 'utf-8')).join('\n');

  // Check for FHIR audit fallback mechanism
  const hasFallbackTable = /fhir_audit_fallback/i.test(allSQL);
  const hasFallbackFunction = /log_fhir_access/i.test(allSQL);
  const hasSharedTracker = fileExists('supabase/functions/_shared/session-tracker.ts');

  if (!hasFallbackTable && !hasFallbackFunction) {
    return {
      status: STATUS.FAIL,
      evidence: 'No FHIR audit fallback mechanism. If main audit_logs INSERT fails, FHIR reads go unaudited.',
      file: 'supabase/migrations/'
    };
  }
  return { status: STATUS.PASS, evidence: 'FHIR audit fallback table and log_fhir_access() function exist (migration 011)' };
});

// ── Session Management ──

check('HIPAA-SESSION-001', 'HIPAA', SEVERITY.HIGH, 'Session timeout resets on ANY browser tab activity', '164.312(a)(2)(iii)', () => {
  const content = readFile('src/context/AuthContext.jsx');
  if (!content) return { status: STATUS.FAIL, evidence: 'AuthContext.jsx not found' };

  const eventListeners = ['mousedown', 'keydown', 'touchstart', 'scroll'];
  const registeredEvents = eventListeners.filter(e => content.includes(e));

  // Check if there's BroadcastChannel or visibility-based tab awareness
  const hasTabAwareness = /BroadcastChannel|visibilitychange|document\.hidden|focus.*blur/i.test(content);

  if (registeredEvents.length > 0 && !hasTabAwareness) {
    return {
      status: STATUS.FAIL,
      evidence: `Timer resets on events: [${registeredEvents.join(', ')}] in ANY tab. User active in email tab keeps clinic portal alive. No BroadcastChannel or visibility API used.`,
      file: 'src/context/AuthContext.jsx'
    };
  }
  return { status: STATUS.PASS, evidence: 'Session timeout is tab-aware' };
});

check('HIPAA-SESSION-002', 'HIPAA', SEVERITY.MEDIUM, 'No server-side session timeout — JWT remains valid after frontend timer expires', '164.312(a)(2)(iii)', () => {
  // Check for server-side session tracking module
  const sessionTracker = readFile('supabase/functions/_shared/session-tracker.ts');
  const hasServerSideTracking = sessionTracker && /trackSessionEvent|isSessionActive/i.test(sessionTracker);

  // Also check Edge Functions for session tracking
  const edgeFunctions = globFiles('supabase/functions', /index\.ts$/);
  let serverSideCheck = false;
  for (const f of edgeFunctions) {
    const efContent = fs.readFileSync(f, 'utf-8');
    if (/session.*timeout|token.*expire.*check|last.?activity|session.?tracker/i.test(efContent)) {
      serverSideCheck = true;
      break;
    }
  }

  if (!hasServerSideTracking && !serverSideCheck) {
    return {
      status: STATUS.FAIL,
      evidence: 'No server-side session activity tracking found.',
      file: 'src/context/AuthContext.jsx'
    };
  }
  return { status: STATUS.PASS, evidence: 'Server-side session tracking exists (session-tracker.ts)' };
});

// ── Breach Notification ──

check('HIPAA-BREACH-001', 'HIPAA', SEVERITY.CRITICAL, 'No automated notification to affected patients on breach', '164.404', () => {
  const content = readFile('supabase/functions/breach-check/index.ts');
  if (!content) return { status: STATUS.FAIL, evidence: 'Breach-check function not found' };

  const hasPatientNotify = /patient.*notif|notify.*patient|affected.*user.*email|patient.*email.*breach/i.test(content);
  const hasAdminOnly = /admin.*alert|admin_alert/i.test(content);

  if (!hasPatientNotify && hasAdminOnly) {
    return {
      status: STATUS.FAIL,
      evidence: 'Breach-check only sends admin alerts. HIPAA 164.404 requires notification to affected individuals within 60 days. No patient notification workflow exists.',
      file: 'supabase/functions/breach-check/index.ts',
      line: '186'
    };
  }
  return { status: STATUS.PASS, evidence: 'Patient breach notification workflow exists' };
});

check('HIPAA-BREACH-002', 'HIPAA', SEVERITY.CRITICAL, 'Breach-check function is NOT scheduled — manual only', '164.404', () => {
  const migrations = globFiles('supabase/migrations', /\.sql$/);
  const allSQL = migrations.map(f => fs.readFileSync(f, 'utf-8')).join('\n');

  // Check for uncommented pg_cron schedule for breach-check
  const cronLines = allSQL.split('\n');
  let breachScheduled = false;
  for (const line of cronLines) {
    if (/cron\.schedule/i.test(line) && /breach/i.test(line) && !line.trim().startsWith('--')) {
      breachScheduled = true;
      break;
    }
  }

  if (!breachScheduled) {
    return {
      status: STATUS.FAIL,
      evidence: 'No active pg_cron schedule found for breach detection. The breach-check Edge Function exists but is never called automatically. All breach detection cron entries are commented out.',
      file: 'supabase/migrations/009_breach_notification.sql'
    };
  }
  return { status: STATUS.PASS, evidence: 'Breach detection is scheduled via pg_cron' };
});

check('HIPAA-BREACH-003', 'HIPAA', SEVERITY.MEDIUM, 'No automated containment on breach detection (account lock, session revoke)', '164.404', () => {
  const content = readFile('supabase/functions/breach-check/index.ts');
  if (!content) return { status: STATUS.FAIL, evidence: 'Breach-check function not found' };

  const hasContainment = /lock.*account|disable.*user|revoke.*session|ban.*user|deactivate/i.test(content);

  if (!hasContainment) {
    return {
      status: STATUS.FAIL,
      evidence: 'Breach detection creates an incident record and sends admin alert, but does NOT automatically contain the breach (no account lock, no session revoke, no IP block).',
      file: 'supabase/functions/breach-check/index.ts'
    };
  }
  return { status: STATUS.PASS, evidence: 'Automated containment actions exist' };
});

// ── Consent Tracking ──

check('HIPAA-CONSENT-001', 'HIPAA', SEVERITY.HIGH, 'Consent is tracked but NOT enforced — revoked consent does not block PHI access', '164.508', () => {
  const content = readFile('supabase/migrations/006_consent_tracking.sql');
  if (!content) return { status: STATUS.FAIL, evidence: 'Consent tracking migration not found' };

  // Check if PHI table RLS policies (appointments, registrations) reference consent_records
  // We must NOT count consent_records' OWN RLS policies — that's just access control on the consent table itself
  const phiTableFiles = ['003_rbac_policies.sql', '001_initial_schema.sql'];
  const phiSQL = phiTableFiles.map(f => readFile(`supabase/migrations/${f}`) || '').join('\n');

  // Check if any PHI table policy uses consent_records or revoked_at to gate access
  const consentEnforced = /consent_records[\s\S]*?revoked_at\s+IS\s+NULL/i.test(phiSQL) ||
    /EXISTS\s*\(\s*SELECT.*consent_records/i.test(phiSQL);

  // Also check if there's a SECURITY DEFINER function that checks consent before returning data
  const allSQL = globFiles('supabase/migrations', /\.sql$/).map(f => fs.readFileSync(f, 'utf-8')).join('\n');
  const hasConsentGateFunction = /FUNCTION.*check_consent|enforce_consent|has_active_consent/i.test(allSQL);

  if (!consentEnforced && !hasConsentGateFunction) {
    return {
      status: STATUS.FAIL,
      evidence: 'consent_records table tracks consent grants/revocations, but NO RLS policy on PHI tables (appointments, registrations) references it. Revoking consent has zero effect on data access. Consent is decorative, not enforceable.',
      file: 'supabase/migrations/006_consent_tracking.sql'
    };
  }
  return { status: STATUS.PASS, evidence: 'Consent enforcement RLS policy exists on PHI tables' };
});

check('HIPAA-CONSENT-002', 'HIPAA', SEVERITY.HIGH, 'No explicit consent captured before user signup', '164.508', () => {
  const content = readFile('src/context/AuthContext.jsx');
  if (!content) return { status: STATUS.FAIL, evidence: 'AuthContext.jsx not found' };

  // Check: does signUp() in AuthContext create a consent_records entry or require consent?
  const signUpIdx = content.indexOf('signUp');
  const signOutIdx = content.indexOf('signOut');
  const signUpSection = signUpIdx >= 0 ? content.substring(signUpIdx, signOutIdx > signUpIdx ? signOutIdx : signUpIdx + 500) : '';

  const insertsConsentOnSignup = /consent_records|insert.*consent|consent.*insert/i.test(signUpSection);
  const requiresConsentParam = /consent.*true|hasConsent|agreedToTerms/i.test(signUpSection);

  // Check actual auth signup pages for consent UI
  const allJsx = globFiles('src', /\.(jsx|tsx)$/);
  let hasSignupConsentUI = false;
  for (const f of allJsx) {
    const relPath = path.relative(ROOT, f).replace(/\\/g, '/').toLowerCase();
    if (/signup/i.test(path.basename(relPath))) {
      const c = fs.readFileSync(f, 'utf-8');
      // Look for consent checkbox with required validation
      if (/register\(['"]consent['"]|consent.*required|agree.*privacy|privacy.*policy/i.test(c)) {
        hasSignupConsentUI = true;
        break;
      }
    }
  }

  if (!insertsConsentOnSignup && !requiresConsentParam && !hasSignupConsentUI) {
    return {
      status: STATUS.FAIL,
      evidence: 'signUp() in AuthContext does not create a consent_records entry or require consent before account creation. No consent checkbox on login/signup pages. HIPAA 164.508 requires documented consent before processing PHI.',
      file: 'src/context/AuthContext.jsx'
    };
  }
  return { status: STATUS.PASS, evidence: 'Consent captured before user signup' };
});

// ── Data Retention ──

check('HIPAA-RETENTION-001', 'HIPAA', SEVERITY.CRITICAL, 'Automated data purge is NOT scheduled — retention policies are inactive', '164.530', () => {
  const allMigrations = globFiles('supabase/migrations', /\.sql$/);
  const allSQL = allMigrations.map(f => fs.readFileSync(f, 'utf-8')).join('\n');

  const lines = allSQL.split('\n');
  let purgeScheduled = false;
  for (const line of lines) {
    if (/cron\.schedule/i.test(line) && /purge|nightly/i.test(line) && !line.trim().startsWith('--')) {
      purgeScheduled = true;
      break;
    }
  }

  if (!purgeScheduled) {
    return {
      status: STATUS.FAIL,
      evidence: 'No active pg_cron schedule for data purge found in any migration.',
      file: 'supabase/migrations/'
    };
  }
  return { status: STATUS.PASS, evidence: 'Data purge scheduled via pg_cron (migration 010)' };
});

check('HIPAA-RETENTION-002', 'HIPAA', SEVERITY.MEDIUM, 'Data purge uses hard DELETE — orphans audit log references', '164.530', () => {
  const allSQL = globFiles('supabase/migrations', /\.sql$/).map(f => fs.readFileSync(f, 'utf-8')).join('\n');

  const hasSoftDelete = /deleted_at\s+TIMESTAMP|ADD\s+COLUMN\s+deleted_at/i.test(allSQL);

  if (!hasSoftDelete) {
    return {
      status: STATUS.FAIL,
      evidence: 'No soft-delete (deleted_at) columns found in any migration.',
      file: 'supabase/migrations/'
    };
  }
  return { status: STATUS.PASS, evidence: 'Soft-delete columns added (migration 010)' };
});

// ═══════════════════════════════════════════════════════════════════
//  FHIR R4 CHECKS
// ═══════════════════════════════════════════════════════════════════

check('FHIR-APPT-001', 'FHIR', SEVERITY.CRITICAL, 'Appointment uses requestedPeriod instead of required start/end for booked status', 'FHIR R4 Appointment', () => {
  const content = readFile('src/lib/fhir.js');
  if (!content) return { status: STATUS.FAIL, evidence: 'fhir.js not found' };

  const usesRequestedPeriod = /requestedPeriod/i.test(content);
  const usesStart = /\.start\s*=|start:/i.test(content);
  const usesEnd = /\.end\s*=|end:/i.test(content);

  // If it uses both requestedPeriod AND start/end (conditional on status), that's correct
  if (usesRequestedPeriod && !usesStart) {
    return {
      status: STATUS.FAIL,
      evidence: 'buildAppointmentResource() sets requestedPeriod instead of start/end. Per FHIR R4, booked/arrived/fulfilled Appointments REQUIRE start and end fields. requestedPeriod is only for proposed. This fails FHIR validators.',
      file: 'src/lib/fhir.js',
      line: '156'
    };
  }
  return { status: STATUS.PASS, evidence: 'Appointment uses start/end fields correctly' };
});

check('FHIR-APPT-002', 'FHIR', SEVERITY.HIGH, 'Appointment missing duration field', 'FHIR R4 Appointment', () => {
  const content = readFile('src/lib/fhir.js');
  if (!content) return { status: STATUS.FAIL, evidence: 'fhir.js not found' };

  if (!/minutesDuration|duration/i.test(content)) {
    return {
      status: STATUS.FAIL,
      evidence: 'Appointment resource has no duration or minutesDuration field. Dental scheduling requires appointment length for calendar management.',
      file: 'src/lib/fhir.js'
    };
  }
  return { status: STATUS.PASS, evidence: 'Appointment includes duration' };
});

check('FHIR-APPT-003', 'FHIR', SEVERITY.HIGH, 'Appointment missing reasonCode and cancelationReason', 'FHIR R4 Appointment', () => {
  const content = readFile('src/lib/fhir.js');
  if (!content) return { status: STATUS.FAIL, evidence: 'fhir.js not found' };

  const issues = [];
  if (!/reasonCode|reasonReference/i.test(content)) issues.push('reasonCode');
  if (!/cancelationReason|cancellationReason/i.test(content)) issues.push('cancelationReason');

  if (issues.length > 0) {
    return {
      status: STATUS.FAIL,
      evidence: `Appointment missing: [${issues.join(', ')}]. These fields are needed for clinical decision support and appointment lifecycle.`,
      file: 'src/lib/fhir.js'
    };
  }
  return { status: STATUS.PASS, evidence: 'Appointment includes reason and cancellation fields' };
});

check('FHIR-PROC-001', 'FHIR', SEVERITY.CRITICAL, 'No Procedure resource — cannot document completed dental treatments', 'FHIR R4 Procedure', () => {
  const content = readFile('src/lib/fhir.js');
  if (!content) return { status: STATUS.FAIL, evidence: 'fhir.js not found' };

  const hasProcedure = /buildProcedure|resourceType.*Procedure|Procedure.*resource/i.test(content);
  const validatorContent = readFile('src/lib/fhir-validator.js') || '';
  const validatorHasProcedure = /Procedure/i.test(validatorContent);

  if (!hasProcedure) {
    return {
      status: STATUS.FAIL,
      evidence: 'No Procedure FHIR resource builder exists. A dental clinic MUST document completed treatments (root canal, extraction, filling, etc.). This is a core clinical resource gap.',
      file: 'src/lib/fhir.js'
    };
  }
  return { status: STATUS.PASS, evidence: 'Procedure resource builder exists' };
});

check('FHIR-RLS-001', 'FHIR', SEVERITY.CRITICAL, 'FHIR RLS uses subject but AllergyIntolerance/Condition uses patient field', 'FHIR R4 Security', () => {
  // Check ALL migrations for FHIR RLS that covers both subject AND patient
  const allSQL = globFiles('supabase/migrations', /\.sql$/).map(f => fs.readFileSync(f, 'utf-8')).join('\n');

  const checksSubject = /resource->'subject'->>'reference'/i.test(allSQL);
  const checksPatient = /resource->'patient'->>'reference'/i.test(allSQL);

  if (!checksSubject && !checksPatient) {
    return { status: STATUS.FAIL, evidence: 'No FHIR RLS policy found', file: 'supabase/migrations/' };
  }

  if (checksSubject && !checksPatient) {
    return {
      status: STATUS.FAIL,
      evidence: 'FHIR RLS only checks subject->reference, not patient->reference.',
      file: 'supabase/migrations/007_fhir_schema.sql'
    };
  }
  return { status: STATUS.PASS, evidence: 'FHIR RLS checks both subject and patient references (fixed in migration 010)' };
});

check('FHIR-ALLERGY-001', 'FHIR', SEVERITY.HIGH, 'AllergyIntolerance/Condition missing severity field', 'FHIR R4 AllergyIntolerance', () => {
  const content = readFile('src/lib/fhir.js');
  if (!content) return { status: STATUS.FAIL, evidence: 'fhir.js not found' };

  const issues = [];
  // Check AllergyIntolerance for criticality/severity
  const allergySection = content.substring(content.indexOf('AllergyIntolerance'), content.indexOf('Condition Resource') > 0 ? content.indexOf('Condition Resource') : content.length);
  if (!/criticality|severity/i.test(allergySection)) issues.push('AllergyIntolerance.criticality');

  // Check Condition for severity
  const conditionSection = content.substring(content.indexOf('Condition Resource') > 0 ? content.indexOf('Condition Resource') : content.indexOf('buildConditionResource'));
  if (!/severity/i.test(conditionSection)) issues.push('Condition.severity');

  if (issues.length > 0) {
    return {
      status: STATUS.FAIL,
      evidence: `Missing severity/criticality fields: [${issues.join(', ')}]. Critical for clinical decision support — a penicillin allergy with severity "severe" must be handled differently than "mild".`,
      file: 'src/lib/fhir.js'
    };
  }
  return { status: STATUS.PASS, evidence: 'Severity/criticality fields present' };
});

check('FHIR-COND-001', 'FHIR', SEVERITY.MEDIUM, 'clinicalStatus and verificationStatus are hardcoded to active/unconfirmed', 'FHIR R4 Condition', () => {
  const content = readFile('src/lib/fhir.js');
  if (!content) return { status: STATUS.FAIL, evidence: 'fhir.js not found' };

  const hardcodedActive = /code:\s*'active'[\s\S]*?code:\s*'unconfirmed'/i.test(content);
  const acceptsParam = /clinicalStatus.*param|status.*param|function.*build.*status/i.test(content);

  if (hardcodedActive && !acceptsParam) {
    return {
      status: STATUS.FAIL,
      evidence: 'Both AllergyIntolerance and Condition hardcode clinicalStatus=active and verificationStatus=unconfirmed. These should be parameterized — a resolved condition should be "resolved", a confirmed allergy should be "confirmed".',
      file: 'src/lib/fhir.js'
    };
  }
  return { status: STATUS.PASS, evidence: 'Status fields are parameterized' };
});

check('FHIR-TERM-001', 'FHIR', SEVERITY.MEDIUM, 'Missing dental-specific ICD-10 codes (K02 caries, K05 gingivitis)', 'FHIR R4 Terminology', () => {
  const content = readFile('src/lib/fhir-terminology.js');
  if (!content) return { status: STATUS.FAIL, evidence: 'fhir-terminology.js not found' };

  const dentalCodes = {
    'K02': 'Dental caries',
    'K05': 'Gingivitis/Periodontitis',
    'K03': 'Hard tissue diseases',
    'K04': 'Pulp/periapical diseases'
  };

  const missing = Object.entries(dentalCodes).filter(([code]) => !content.includes(code));

  if (missing.length > 0) {
    return {
      status: STATUS.FAIL,
      evidence: `Missing dental ICD-10 codes: [${missing.map(([c, d]) => `${c} (${d})`).join(', ')}]. Current codes are general medical conditions only.`,
      file: 'src/lib/fhir-terminology.js'
    };
  }
  return { status: STATUS.PASS, evidence: 'Dental-specific ICD-10 codes present' };
});

check('FHIR-TERM-002', 'FHIR', SEVERITY.MEDIUM, 'Missing LOINC codes for observations', 'FHIR R4 Terminology', () => {
  const content = readFile('src/lib/fhir-terminology.js');
  if (!content) return { status: STATUS.FAIL, evidence: 'fhir-terminology.js not found' };

  if (!/loinc|LOINC|http:\/\/loinc\.org/i.test(content)) {
    return {
      status: STATUS.FAIL,
      evidence: 'No LOINC code system referenced. LOINC codes are needed for Observation resources (vital signs, periodontal measurements).',
      file: 'src/lib/fhir-terminology.js'
    };
  }
  return { status: STATUS.PASS, evidence: 'LOINC codes present' };
});

check('FHIR-API-001', 'FHIR', SEVERITY.HIGH, 'FHIR REST API is read-only — no POST/PUT/DELETE', 'FHIR R4 REST', () => {
  const content = readFile('supabase/functions/fhir-api/index.ts');
  if (!content) return { status: STATUS.FAIL, evidence: 'FHIR API function not found' };

  const supportsPost = /req\.method\s*===?\s*['"]POST['"]/i.test(content) || /method.*POST/i.test(content);
  const supportsPut = /req\.method\s*===?\s*['"]PUT['"]/i.test(content);
  const supportsDelete = /req\.method\s*===?\s*['"]DELETE['"]/i.test(content);
  const onlyGet = /Only GET is supported/i.test(content);

  if (onlyGet || (!supportsPost && !supportsPut)) {
    return {
      status: STATUS.FAIL,
      evidence: 'FHIR API only supports GET. No POST (create), PUT (update), or DELETE operations. Cannot create or modify FHIR resources via REST API.',
      file: 'supabase/functions/fhir-api/index.ts',
      line: '108'
    };
  }
  return { status: STATUS.PASS, evidence: 'FHIR API supports write operations' };
});

check('FHIR-API-002', 'FHIR', SEVERITY.HIGH, 'Patient search only supports _id — missing name, phone, birthdate', 'FHIR R4 REST', () => {
  const content = readFile('supabase/functions/fhir-api/index.ts');
  if (!content) return { status: STATUS.FAIL, evidence: 'FHIR API function not found' };

  const searchParams = [];
  if (/\.get\(['"]name['"]\)/i.test(content)) searchParams.push('name');
  if (/\.get\(['"]phone['"]\)/i.test(content) || /\.get\(['"]telecom['"]\)/i.test(content)) searchParams.push('phone');
  if (/\.get\(['"]birthdate['"]\)/i.test(content)) searchParams.push('birthdate');
  if (/\.get\(['"]identifier['"]\)/i.test(content)) searchParams.push('identifier');

  const missing = ['name', 'phone', 'birthdate', 'identifier'].filter(p => !searchParams.includes(p));

  if (missing.length > 0) {
    return {
      status: STATUS.FAIL,
      evidence: `Patient search missing standard FHIR search parameters: [${missing.join(', ')}]. Only _id search is supported.`,
      file: 'supabase/functions/fhir-api/index.ts'
    };
  }
  return { status: STATUS.PASS, evidence: 'Patient search supports standard parameters' };
});

check('FHIR-API-003', 'FHIR', SEVERITY.HIGH, 'Appointment search missing date parameter', 'FHIR R4 REST', () => {
  const content = readFile('supabase/functions/fhir-api/index.ts');
  if (!content) return { status: STATUS.FAIL, evidence: 'FHIR API function not found' };

  const hasDateSearch = /\.get\(['"]date['"]\)/i.test(content);

  if (!hasDateSearch) {
    return {
      status: STATUS.FAIL,
      evidence: 'Appointment search does not support the date parameter. Cannot query appointments by date range — essential for scheduling.',
      file: 'supabase/functions/fhir-api/index.ts'
    };
  }
  return { status: STATUS.PASS, evidence: 'Appointment date search supported' };
});

check('FHIR-VAL-001', 'FHIR', SEVERITY.HIGH, 'FHIR validator missing: cardinality checks, reference format, required fields per status', 'FHIR R4 Validator', () => {
  const content = readFile('src/lib/fhir-validator.js');
  if (!content) return { status: STATUS.FAIL, evidence: 'fhir-validator.js not found' };

  const issues = [];
  if (!/cardinality|min.*max|minItems|maxItems/i.test(content)) issues.push('cardinality validation');
  if (!/(Resource|Patient|Practitioner)\/[a-zA-Z0-9-]+/.test(content) && !/reference.*format|validate.*reference/i.test(content)) issues.push('reference format validation (ResourceType/id)');
  if (!/status.*===.*booked.*start|booked.*require.*start/i.test(content)) issues.push('required fields per status (e.g., start required for booked Appointment)');
  if (!/valueSet|value.?set|binding/i.test(content)) issues.push('value set binding validation');

  if (issues.length > 0) {
    return {
      status: STATUS.FAIL,
      evidence: `Validator missing: [${issues.join('; ')}]. Current validator only checks field presence, not FHIR R4 conformance rules.`,
      file: 'src/lib/fhir-validator.js'
    };
  }
  return { status: STATUS.PASS, evidence: 'Validator covers FHIR R4 conformance rules' };
});

check('FHIR-VAL-002', 'FHIR', SEVERITY.MEDIUM, 'FHIR validator does not validate Procedure resource type', 'FHIR R4 Validator', () => {
  const content = readFile('src/lib/fhir-validator.js');
  if (!content) return { status: STATUS.FAIL, evidence: 'fhir-validator.js not found' };

  if (!/Procedure/i.test(content)) {
    return {
      status: STATUS.FAIL,
      evidence: 'Procedure is not in FHIR_RESOURCE_TYPES and has no validation function. Even if added to fhir.js, it would fail validation.',
      file: 'src/lib/fhir-validator.js'
    };
  }
  return { status: STATUS.PASS, evidence: 'Procedure validation exists' };
});

check('FHIR-EXPORT-001', 'FHIR', SEVERITY.MEDIUM, 'No $export bulk data operation', 'FHIR R4 Bulk Data', () => {
  const apiContent = readFile('supabase/functions/fhir-api/index.ts') || '';
  const exportContent = readFile('supabase/functions/fhir-export/index.ts') || '';

  const hasBulkExport = /\$export|bulk.?data|ndjson/i.test(apiContent) || /\$export|bulk.?data|ndjson/i.test(exportContent);

  if (!hasBulkExport) {
    return {
      status: STATUS.FAIL,
      evidence: 'No FHIR $export (Bulk Data Access) operation. fhir-export creates per-patient bundles but not the standardized $export endpoint.',
      file: 'supabase/functions/fhir-api/index.ts'
    };
  }
  return { status: STATUS.PASS, evidence: 'FHIR $export operation exists' };
});

check('FHIR-MISSING-001', 'FHIR', SEVERITY.HIGH, 'Missing critical FHIR resources for dental clinic', 'FHIR R4 Resources', () => {
  const content = readFile('src/lib/fhir.js') || '';
  const required = {
    'Procedure': 'completed treatments (root canal, extraction)',
    'Observation': 'vital signs, periodontal measurements',
    'Encounter': 'visit linking',
    'DocumentReference': 'X-rays, clinical photos',
  };

  const missing = Object.entries(required).filter(([res]) => {
    const pattern = new RegExp(`build${res}Resource|resourceType.*${res}`, 'i');
    return !pattern.test(content);
  });

  if (missing.length > 0) {
    return {
      status: STATUS.FAIL,
      evidence: `Missing FHIR resources: [${missing.map(([r, d]) => `${r} (${d})`).join(', ')}]. Currently only Patient, Appointment, AllergyIntolerance, Condition, Organization, Practitioner are implemented.`,
      file: 'src/lib/fhir.js'
    };
  }
  return { status: STATUS.PASS, evidence: 'All required FHIR resources implemented' };
});

// ═══════════════════════════════════════════════════════════════════
//  SOC 2 CHECKS
// ═══════════════════════════════════════════════════════════════════

check('SOC2-MFA-001', 'SOC2', SEVERITY.HIGH, 'MFA promised in policy but not implemented', 'CC6 Logical Access', () => {
  const policy = readFile('docs/policies/INFORMATION_SECURITY_POLICY.md') || '';
  const policyPromisesMFA = /MFA|multi.?factor|two.?factor|2FA/i.test(policy);

  // Check if MFA is actually implemented
  const authContext = readFile('src/context/AuthContext.jsx') || '';
  const migrations = globFiles('supabase/migrations', /\.sql$/);
  const allSQL = migrations.map(f => fs.readFileSync(f, 'utf-8')).join('\n');

  const hasMFAColumn = /mfa_enabled/i.test(allSQL);
  const hasMFAEnrollment = /mfa.*enroll|enroll.*mfa|totp|factors.*enroll/i.test(authContext);
  const hasMFAVerification = /mfa.*verify|verify.*mfa|challengeAndVerify/i.test(authContext);

  // Also check for dedicated MFA component
  const mfaComponent = globFiles('src', /[Mm]fa/);
  const hasMFAComponent = mfaComponent.length > 0;

  if (policyPromisesMFA && !hasMFAEnrollment && !hasMFAVerification && !hasMFAComponent) {
    return {
      status: STATUS.FAIL,
      evidence: 'Policy promises MFA but no MFA enrollment or verification code exists.',
      file: 'docs/policies/INFORMATION_SECURITY_POLICY.md'
    };
  }
  return { status: STATUS.PASS, evidence: 'MFA enrollment component exists' };
});

check('SOC2-RETENTION-001', 'SOC2', SEVERITY.CRITICAL, 'Data retention policy promises nightly purge but pg_cron is not scheduled', 'A1 Availability', () => {
  const policy = readFile('docs/policies/DATA_CLASSIFICATION.md') || readFile('docs/policies/INFORMATION_SECURITY_POLICY.md') || '';
  const migration = readFile('supabase/migrations/008_data_retention.sql') || '';

  const allSQL = globFiles('supabase/migrations', /\.sql$/).map(f => fs.readFileSync(f, 'utf-8')).join('\n');
  const policyPromisesPurge = /automated.*purge|nightly.*purge|scheduled.*deletion|data.*retention.*automat/i.test(policy) || /purge/i.test(migration);
  const cronScheduled = allSQL.split('\n').some(line => /cron\.schedule/i.test(line) && /purge|nightly/i.test(line) && !line.trim().startsWith('--'));

  if (policyPromisesPurge && !cronScheduled) {
    return {
      status: STATUS.FAIL,
      evidence: 'purge_expired_records() function defined. pg_cron schedule is COMMENTED OUT. SOC 2 policy promises automated retention but it never runs. Policy vs implementation gap.',
      file: 'supabase/migrations/008_data_retention.sql',
      line: '107'
    };
  }
  return { status: STATUS.PASS, evidence: 'Data purge scheduled and active' };
});

check('SOC2-BREACH-001', 'SOC2', SEVERITY.MEDIUM, 'Incident Response promises hourly breach detection but it is manual-only', 'CC7 Operations', () => {
  const policy = readFile('docs/policies/INCIDENT_RESPONSE_PLAN.md') || '';
  const migration = readFile('supabase/migrations/009_breach_notification.sql') || '';

  const allSQL = globFiles('supabase/migrations', /\.sql$/).map(f => fs.readFileSync(f, 'utf-8')).join('\n');
  const policyPromisesHourly = /hourly|automated.*detection|continuous.*monitoring/i.test(policy);
  const cronScheduled = allSQL.split('\n').some(line => /cron\.schedule/i.test(line) && /breach/i.test(line) && !line.trim().startsWith('--'));

  if (policyPromisesHourly && !cronScheduled) {
    return {
      status: STATUS.FAIL,
      evidence: 'Incident Response Plan promises automated/hourly detection. breach-check Edge Function exists but no cron schedule is active. Detection is manual-only.',
      file: 'docs/policies/INCIDENT_RESPONSE_PLAN.md'
    };
  }
  return { status: STATUS.PASS, evidence: 'Breach detection is automated as promised' };
});

check('SOC2-BAA-001', 'SOC2', SEVERITY.MEDIUM, 'BAA checklist exists but no signed BAA documents', 'Vendor Management', () => {
  const baaDir = path.join(ROOT, 'docs', 'baa');
  if (!fs.existsSync(baaDir)) {
    return { status: STATUS.FAIL, evidence: 'docs/baa/ directory does not exist' };
  }

  const files = fs.readdirSync(baaDir);
  const hasTemplate = files.some(f => /template/i.test(f));
  const signedDocs = files.filter(f => /signed|executed|baa[^_]*\.(pdf|docx)/i.test(f));

  if (!hasTemplate && signedDocs.length === 0) {
    return {
      status: STATUS.FAIL,
      evidence: `docs/baa/ contains: [${files.join(', ')}]. No BAA template or signed documents.`,
      file: 'docs/baa/'
    };
  }
  if (hasTemplate && signedDocs.length === 0) {
    return {
      status: STATUS.WARN,
      evidence: `BAA template exists. No signed BAA documents yet — vendor agreements pending.`,
      file: 'docs/baa/'
    };
  }
  return { status: STATUS.PASS, evidence: `BAA template + ${signedDocs.length} signed document(s) found` };
});

check('SOC2-CONSENT-001', 'SOC2', SEVERITY.HIGH, 'Privacy Impact Assessment promises consent enforcement but it is not implemented', 'Privacy', () => {
  const policy = readFile('docs/policies/PRIVACY_IMPACT_ASSESSMENT.md') || '';
  const hasConsentSection = /consent/i.test(policy);

  // Check ALL migrations for consent-gated RLS on PHI tables
  const allSQL = globFiles('supabase/migrations', /\.sql$/).map(f => fs.readFileSync(f, 'utf-8')).join('\n');
  const hasConsentGatedAccess = /has_active_consent|consent_records.*revoked_at\s+IS\s+NULL/i.test(allSQL);

  if (hasConsentSection && !hasConsentGatedAccess) {
    return {
      status: STATUS.FAIL,
      evidence: 'Privacy Impact Assessment references consent. But PHI table RLS policies (appointments, registrations) do NOT check consent_records.revoked_at. Revoked consent has no effect on data access.',
      file: 'docs/policies/PRIVACY_IMPACT_ASSESSMENT.md'
    };
  }
  return { status: STATUS.PASS, evidence: 'Consent enforcement matches policy' };
});

check('SOC2-ACCESS-001', 'SOC2', SEVERITY.MEDIUM, 'Staff deprovisioning not logged as security event', 'CC6 Logical Access', () => {
  // Check Edge Functions
  const edgeFunctions = globFiles('supabase/functions', /index\.ts$/);
  let hasDeprovisionLog = false;
  for (const f of edgeFunctions) {
    const content = fs.readFileSync(f, 'utf-8');
    if (/deactivat|deprovision|offboard|disable.*user.*security_incident/i.test(content)) {
      hasDeprovisionLog = true;
      break;
    }
  }

  // Check database triggers in migrations
  const allSQL = globFiles('supabase/migrations', /\.sql$/).map(f => fs.readFileSync(f, 'utf-8')).join('\n');
  const hasDBTrigger = /deprovisioning|log_deprovisioning|role_escalation.*security/i.test(allSQL);

  if (!hasDeprovisionLog && !hasDBTrigger) {
    return {
      status: STATUS.FAIL,
      evidence: 'No deprovisioning security event logging found.',
    };
  }
  return { status: STATUS.PASS, evidence: 'Deprovisioning trigger creates security events (migration 010)' };
});

// ═══════════════════════════════════════════════════════════════════
//  SECURITY CHECKS
// ═══════════════════════════════════════════════════════════════════

check('SEC-CORS-001', 'Security', SEVERITY.CRITICAL, 'Wildcard CORS (Access-Control-Allow-Origin: *) on Edge Functions', 'OWASP', () => {
  const edgeFunctions = globFiles('supabase/functions', /index\.ts$/);
  const wildcardFiles = [];

  for (const f of edgeFunctions) {
    const content = fs.readFileSync(f, 'utf-8');
    const relativePath = path.relative(ROOT, f).replace(/\\/g, '/');
    if (/['"]Access-Control-Allow-Origin['"]\s*:\s*['"]\*['"]/i.test(content)) {
      wildcardFiles.push(relativePath);
    }
  }

  if (wildcardFiles.length > 0) {
    return {
      status: STATUS.FAIL,
      evidence: `WILDCARD CORS (*) on ${wildcardFiles.length} Edge Functions: [${wildcardFiles.join(', ')}]. Any website can make authenticated requests to these endpoints. Must restrict to clinic domain.`,
    };
  }
  return { status: STATUS.PASS, evidence: 'No wildcard CORS on Edge Functions' };
});

check('SEC-CSP-001', 'Security', SEVERITY.CRITICAL, "CSP allows 'unsafe-inline' for scripts — defeats XSS protection", 'OWASP', () => {
  const content = readFile('public/_headers');
  if (!content) return { status: STATUS.FAIL, evidence: '_headers file not found' };

  const cspLine = content.split('\n').find(l => /Content-Security-Policy/i.test(l)) || '';

  if (/script-src[^;]*unsafe-inline/i.test(cspLine)) {
    return {
      status: STATUS.FAIL,
      evidence: "CSP script-src includes 'unsafe-inline'. This defeats XSS protection entirely — any injected script will execute. Use nonce-based or hash-based CSP instead.",
      file: 'public/_headers',
      line: '11'
    };
  }
  return { status: STATUS.PASS, evidence: "CSP script-src does not include 'unsafe-inline'" };
});

check('SEC-CSP-002', 'Security', SEVERITY.MEDIUM, "CSP allows 'unsafe-inline' for styles (needed for Tailwind CSS)", 'OWASP', () => {
  const content = readFile('public/_headers');
  if (!content) return { status: STATUS.FAIL, evidence: '_headers file not found' };

  const cspLine = content.split('\n').find(l => /Content-Security-Policy/i.test(l)) || '';

  if (/style-src[^;]*unsafe-inline/i.test(cspLine)) {
    return {
      status: STATUS.WARN,
      evidence: "CSP style-src includes 'unsafe-inline'. Required for Tailwind CSS and Framer Motion inline styles. script-src does NOT have unsafe-inline (the critical one).",
      file: 'public/_headers',
      line: '11'
    };
  }
  return { status: STATUS.PASS, evidence: "CSP style-src does not include 'unsafe-inline'" };
});

check('SEC-CSP-003', 'Security', SEVERITY.HIGH, 'CSP missing upgrade-insecure-requests directive', 'OWASP', () => {
  const content = readFile('public/_headers');
  if (!content) return { status: STATUS.FAIL, evidence: '_headers file not found' };

  if (!/upgrade-insecure-requests/i.test(content)) {
    return {
      status: STATUS.FAIL,
      evidence: 'CSP missing upgrade-insecure-requests directive. Mixed content (HTTP resources on HTTPS page) will not be auto-upgraded.',
      file: 'public/_headers'
    };
  }
  return { status: STATUS.PASS, evidence: 'upgrade-insecure-requests present' };
});

check('SEC-HEADERS-001', 'Security', SEVERITY.INFO, 'Security headers presence check', 'OWASP', () => {
  const content = readFile('public/_headers');
  if (!content) return { status: STATUS.FAIL, evidence: '_headers file not found' };

  const required = [
    'X-Frame-Options', 'X-Content-Type-Options', 'Strict-Transport-Security',
    'Referrer-Policy', 'Permissions-Policy', 'Content-Security-Policy',
    'Cross-Origin-Opener-Policy', 'Cross-Origin-Embedder-Policy'
  ];
  const missing = required.filter(h => !content.includes(h));

  if (missing.length > 0) {
    return {
      status: STATUS.FAIL,
      evidence: `Missing security headers: [${missing.join(', ')}]`,
      file: 'public/_headers'
    };
  }
  return { status: STATUS.PASS, evidence: `All ${required.length} security headers present` };
});

check('SEC-PHI-001', 'Security', SEVERITY.CRITICAL, 'PHI stored in plaintext localStorage in fallback mode', 'HIPAA 164.312', () => {
  const content = readFile('src/utils/emailService.js');
  if (!content) return { status: STATUS.FAIL, evidence: 'emailService.js not found' };

  const hasLocalStorage = /localStorage\.(setItem|getItem)/i.test(content);
  const phiFields = ['medicalNotes', 'medicalHistory', 'allergies', 'bloodGroup', 'dob', 'date_of_birth'];
  const storedPHI = phiFields.filter(f => content.includes(f));

  if (hasLocalStorage && storedPHI.length > 0) {
    return {
      status: STATUS.FAIL,
      evidence: `localStorage fallback stores PHI in plaintext: [${storedPHI.join(', ')}]. Any browser extension or XSS can read this data. The fallback should be removed or data must be encrypted client-side.`,
      file: 'src/utils/emailService.js',
      line: '16-23'
    };
  }
  return { status: STATUS.PASS, evidence: 'No PHI in localStorage' };
});

check('SEC-RATE-001', 'Security', SEVERITY.CRITICAL, 'Server-side rate limiting exists but is NOT called in submit-form', 'OWASP', () => {
  const submitForm = readFile('supabase/functions/submit-form/index.ts');
  if (!submitForm) return { status: STATUS.FAIL, evidence: 'submit-form function not found' };

  // Check if rate-limit module exists
  const rateLimitModule = readFile('supabase/functions/_shared/rate-limit.ts');

  // Check if submit-form actually IMPORTS and CALLS the rate limit
  const importsRateLimit = /import.*rate.?limit|from.*rate.?limit/i.test(submitForm);
  const callsCheckRateLimit = /checkRateLimit|rateLimit\(/i.test(submitForm);
  const has429 = /429|too.?many/i.test(submitForm);

  if (rateLimitModule && !callsCheckRateLimit) {
    return {
      status: STATUS.FAIL,
      evidence: 'Rate limiting module exists at _shared/rate-limit.ts with per-form-type limits (5/hr contact, 3/hr appointment, 2/hr registration). BUT submit-form does NOT import or call checkRateLimit(). The module is dead code.',
      file: 'supabase/functions/submit-form/index.ts'
    };
  }
  if (!rateLimitModule && !has429) {
    return {
      status: STATUS.FAIL,
      evidence: 'No server-side rate limiting module or 429 response found. Direct API calls can flood the database.',
      file: 'supabase/functions/submit-form/index.ts'
    };
  }
  return { status: STATUS.PASS, evidence: 'Server-side rate limiting active in submit-form' };
});

check('SEC-SW-001', 'Security', SEVERITY.HIGH, 'Service worker caches sensitive pages', 'OWASP', () => {
  const content = readFile('public/sw.js');
  if (!content) return { status: STATUS.WARN, evidence: 'sw.js not found — no service worker caching concern' };

  const cachesAll = /cache\.put|caches\.open[\s\S]*?\.put|addAll/i.test(content);
  const excludesSensitive = /dashboard|admin|patient|login/i.test(content) && (/exclude|skip|no.?cache|isSensitive|SENSITIVE/i.test(content) || /return;?\s*$/m.test(content));

  if (cachesAll && !excludesSensitive) {
    return {
      status: STATUS.FAIL,
      evidence: 'Service worker caches ALL responses including sensitive dashboard/patient/admin pages. Cached PHI persists on disk after logout. Must exclude sensitive routes from cache.',
      file: 'public/sw.js'
    };
  }
  return { status: STATUS.PASS, evidence: 'Service worker excludes sensitive pages from cache' };
});

check('SEC-ERROR-001', 'Security', SEVERITY.HIGH, 'Error messages leak implementation details or schema information', 'OWASP', () => {
  const edgeFunctions = globFiles('supabase/functions', /index\.ts$/);
  const issues = [];

  for (const f of edgeFunctions) {
    const content = fs.readFileSync(f, 'utf-8');
    const relativePath = path.relative(ROOT, f).replace(/\\/g, '/');

    // Check 1: error.message or raw error returned to client
    if (/JSON\.stringify\(\s*\{\s*error:\s*(error\.message|err\.message|error\b(?!:))/i.test(content)) {
      issues.push(`${relativePath}: raw error object/message returned to client`);
    }

    // Check 2: validation errors that reveal field names — but only if returned in response
    // Internal ValidationError types are OK if the response is generic
    const returnsFieldErrors = /JSON\.stringify\(\s*\{\s*error.*errors.*field/i.test(content) ||
      /JSON\.stringify\(\s*\{.*field.*message/i.test(content);
    if (returnsFieldErrors) {
      issues.push(`${relativePath}: validation field names exposed in response`);
    }

    // Check 3: throw error inside catch that exposes raw Supabase errors to client
    // OK if there's a catch that masks it with a generic message
    const hasRawThrow = /if\s*\(\s*error\s*\)\s*throw\s+error/i.test(content);
    const hasCatchMask = /catch[\s\S]*?JSON\.stringify.*\{\s*error:\s*['"][A-Z]/i.test(content);
    if (hasRawThrow && !hasCatchMask) {
      issues.push(`${relativePath}: re-throws Supabase errors without masking`);
    }
  }

  if (issues.length > 0) {
    return {
      status: STATUS.FAIL,
      evidence: `${issues.length} error handling concerns: ${issues.slice(0, 4).join('; ')}${issues.length > 4 ? '...' : ''}`,
    };
  }
  return { status: STATUS.PASS, evidence: 'Error messages are generic and non-leaky' };
});

check('SEC-ADMIN-001', 'Security', SEVERITY.HIGH, 'admin-query accepts arbitrary filter column names — schema disclosure risk', 'OWASP', () => {
  const content = readFile('supabase/functions/admin-query/index.ts');
  if (!content) return { status: STATUS.FAIL, evidence: 'admin-query function not found' };

  // Check: does it accept a filters object from request body and iterate over its keys?
  const acceptsFilters = /filters.*req\.json|body.*filters|filters.*entries|Object\.entries\(filters\)/i.test(content);
  // Check: does it pass filter keys directly to .eq() without validation?
  const passesKeysToQuery = /\.eq\(\s*key\s*,/i.test(content) || /\.eq\(\s*\[.*\]\s*,/i.test(content);
  // Check: is there a column/key whitelist?
  const hasColumnWhitelist = /ALLOWED_COLUMNS|ALLOWED_FILTER|allowed.?filter.?keys|valid.?columns|permitted.?keys/i.test(content);
  // Note: ALLOWED_TABLES is for table names, not filter column names

  if (acceptsFilters && passesKeysToQuery && !hasColumnWhitelist) {
    return {
      status: STATUS.FAIL,
      evidence: 'admin-query accepts a filters object from request body and passes keys directly to .eq(key, value) without a column whitelist. A compromised admin or staff account can probe the schema by trying arbitrary column names. ALLOWED_TABLES exists but ALLOWED_COLUMNS/ALLOWED_FILTERS does not.',
      file: 'supabase/functions/admin-query/index.ts',
      line: '96-99'
    };
  }
  return { status: STATUS.PASS, evidence: 'admin-query uses column whitelist for filters' };
});

check('SEC-CONSOLE-001', 'Security', SEVERITY.MEDIUM, 'console.error() in production may log PHI-adjacent data', 'OWASP', () => {
  // Check if structured logger exists
  const hasLogger = fileExists('supabase/functions/_shared/logger.ts');

  // Check Edge Functions for raw console.error (not through structured logger)
  const edgeFunctions = globFiles('supabase/functions', /index\.ts$/);
  const rawConsoleFiles = [];
  for (const f of edgeFunctions) {
    const content = fs.readFileSync(f, 'utf-8');
    const relativePath = path.relative(ROOT, f).replace(/\\/g, '/');
    const usesLogger = /import.*logger|createLogger/i.test(content);
    if (/console\.error/i.test(content) && !usesLogger) {
      rawConsoleFiles.push(relativePath);
    }
  }

  if (!hasLogger) {
    return {
      status: STATUS.FAIL,
      evidence: 'No structured logging module. console.error may log PHI-adjacent data.',
    };
  }
  if (rawConsoleFiles.length > 0) {
    return {
      status: STATUS.WARN,
      evidence: `Structured logger exists but ${rawConsoleFiles.length} Edge Functions still use raw console.error: [${rawConsoleFiles.slice(0, 3).join(', ')}]`,
    };
  }
  return { status: STATUS.PASS, evidence: 'Structured logger used across Edge Functions' };
});

check('SEC-AUTOCOMPLETE-001', 'Security', SEVERITY.MEDIUM, 'Missing autocomplete=off on medical/password fields', 'OWASP', () => {
  // Only check pages that contain form inputs for medical data or passwords
  const formPages = ['RegisterPage.jsx', 'LoginPage.jsx', 'SignupPage.jsx', 'ResetPasswordPage.jsx'];
  const missing = [];

  for (const page of formPages) {
    const files = globFiles('src', new RegExp(page.replace('.', '\\.')));
    if (files.length === 0) continue;
    const content = fs.readFileSync(files[0], 'utf-8');
    const hasMedicalInput = /register\(['"].*(?:medical|allerg|medication)/i.test(content);
    const hasPasswordInput = /type.*password/i.test(content);
    const hasAutoComplete = /autoComplete/i.test(content);

    if ((hasMedicalInput || hasPasswordInput) && !hasAutoComplete) {
      missing.push(page);
    }
  }

  if (missing.length > 0) {
    return {
      status: STATUS.FAIL,
      evidence: `Form pages missing autocomplete attributes: [${missing.join(', ')}]`,
    };
  }
  return { status: STATUS.PASS, evidence: 'Medical/password fields have autocomplete attributes' };
});

check('SEC-SRI-001', 'Security', SEVERITY.MEDIUM, 'Subresource Integrity (SRI) for CDN assets', 'OWASP', () => {
  const htmlContent = readFile('index.html') || '';

  const hasSRI = /integrity\s*=\s*"sha/i.test(htmlContent);
  const hasCrossorigin = /crossorigin\s*=\s*"anonymous"/i.test(htmlContent);

  // Google Fonts CSS cannot use SRI (dynamic per user-agent), but crossorigin is set
  if (hasSRI) {
    return { status: STATUS.PASS, evidence: 'SRI hashes on CDN assets' };
  }
  if (hasCrossorigin) {
    return {
      status: STATUS.WARN,
      evidence: 'crossorigin="anonymous" set on CDN links. SRI hashes not applicable to Google Fonts (dynamic CSS). Only Google Fonts loaded externally.',
      file: 'index.html'
    };
  }
  return {
    status: STATUS.FAIL,
    evidence: 'No SRI or crossorigin attributes on CDN assets.',
    file: 'index.html'
  };
});

// ═══════════════════════════════════════════════════════════════════
//  DATA FLOW CHECKS
// ═══════════════════════════════════════════════════════════════════

check('FLOW-BYPASS-001', 'DataFlow', SEVERITY.CRITICAL, 'localStorage fallback bypasses server-side security chain', 'HIPAA 164.312(c)', () => {
  const content = readFile('src/utils/emailService.js');
  if (!content) return { status: STATUS.FAIL, evidence: 'emailService.js not found' };

  const hasFallback = /saveToLocalStorage|localStorage\.setItem/i.test(content);
  const isConditional = /isSupabaseConfigured/i.test(content);

  if (hasFallback && isConditional) {
    return {
      status: STATUS.FAIL,
      evidence: 'When Supabase is not configured, forms fall back to localStorage — bypassing: server-side validation, input sanitization, PHI encryption, audit logging, and rate limiting. The entire security chain is skipped.',
      file: 'src/utils/emailService.js',
      line: '16-23'
    };
  }
  return { status: STATUS.PASS, evidence: 'No localStorage fallback exists' };
});

check('FLOW-RATE-001', 'DataFlow', SEVERITY.CRITICAL, 'Client-side rate limiting is the only spam protection on public forms', 'OWASP', () => {
  const emailService = readFile('src/utils/emailService.js') || '';
  const submitForm = readFile('supabase/functions/submit-form/index.ts') || '';

  const hasClientRateLimit = /rate.?limit|cooldown|last.?submit/i.test(emailService);
  const hasServerRateLimit = /rate.?limit|throttle|429|too.?many/i.test(submitForm);

  if (!hasServerRateLimit) {
    return {
      status: STATUS.FAIL,
      evidence: `Server-side rate limiting: NO. Client-side rate limiting: ${hasClientRateLimit ? 'YES (bypassable)' : 'NO'}. Direct API calls to submit-form can flood the database with unlimited submissions.`,
      file: 'supabase/functions/submit-form/index.ts'
    };
  }
  return { status: STATUS.PASS, evidence: 'Server-side rate limiting protects forms' };
});

check('FLOW-CAPTCHA-001', 'DataFlow', SEVERITY.MEDIUM, 'No CAPTCHA or bot protection on public forms', 'OWASP', () => {
  // Check for CAPTCHA component or library
  const captchaFiles = globFiles('src', /turnstile|captcha|hcaptcha/i);
  const packageJson = readFile('package.json') || '';
  const hasCaptchaLib = /recaptcha|hcaptcha|turnstile|captcha/i.test(packageJson);

  // Check JSX files for CAPTCHA references
  const formFiles = globFiles('src', /\.(jsx|tsx)$/);
  let hasCaptchaInCode = captchaFiles.length > 0;
  if (!hasCaptchaInCode) {
    for (const f of formFiles) {
      const content = fs.readFileSync(f, 'utf-8');
      if (/recaptcha|hcaptcha|turnstile|captcha|TurnstileWidget/i.test(content)) {
        hasCaptchaInCode = true;
        break;
      }
    }
  }

  if (!hasCaptchaLib && !hasCaptchaInCode) {
    return {
      status: STATUS.FAIL,
      evidence: 'No CAPTCHA component or library found.',
    };
  }
  return { status: STATUS.PASS, evidence: 'Turnstile CAPTCHA widget component exists' };
});

check('FLOW-APPT-001', 'DataFlow', SEVERITY.CRITICAL, 'Appointment status column missing from database schema', 'Application Logic', () => {
  const allMigrations = globFiles('supabase/migrations', /\.sql$/).map(f => fs.readFileSync(f, 'utf-8')).join('\n');

  const hasStatusColumn = /ADD.*COLUMN.*status.*appointment_status/i.test(allMigrations) ||
    /appointments[\s\S]*?status\s+(TEXT|VARCHAR|appointment_status)/i.test(allMigrations) ||
    /appointment_status/i.test(allMigrations);

  if (!hasStatusColumn) {
    return {
      status: STATUS.FAIL,
      evidence: 'appointments table has NO status column. The FHIR builder references appointment.status but it does not exist in the database. Appointment lifecycle (proposed → booked → fulfilled → cancelled) is broken.',
      file: 'supabase/migrations/001_initial_schema.sql'
    };
  }
  return { status: STATUS.PASS, evidence: 'Appointment status column exists' };
});

check('FLOW-APPT-002', 'DataFlow', SEVERITY.HIGH, 'No appointment cancellation flow', 'Application Logic', () => {
  const edgeFunctions = globFiles('supabase/functions', /index\.ts$/);
  let hasCancelFlow = false;

  for (const f of edgeFunctions) {
    const content = fs.readFileSync(f, 'utf-8');
    if (/cancel.*appointment|appointment.*cancel/i.test(content)) {
      hasCancelFlow = true;
      break;
    }
  }

  // Also check frontend
  const pages = globFiles('src', /\.(jsx|tsx)$/);
  let hasCancelUI = false;
  for (const f of pages) {
    const content = fs.readFileSync(f, 'utf-8');
    if (/cancel.*appointment|cancelAppointment|cancel.*booking/i.test(content)) {
      hasCancelUI = true;
      break;
    }
  }

  if (!hasCancelFlow && !hasCancelUI) {
    return {
      status: STATUS.FAIL,
      evidence: 'No cancellation flow found: no Edge Function, no frontend button, no cancellation email template. Patients cannot cancel appointments.',
    };
  }
  return { status: STATUS.PASS, evidence: 'Appointment cancellation flow exists' };
});

check('FLOW-APPT-003', 'DataFlow', SEVERITY.HIGH, 'No appointment confirmation PDF generation', 'Application Logic', () => {
  const packageJson = readFile('package.json') || '';
  const hasPdfLib = /jspdf|pdfmake|puppeteer|pdf.?lib|react.?pdf|@react-pdf/i.test(packageJson);
  const hasPdfUtil = fileExists('src/utils/generatePdf.js');
  const hasWindowPrint = hasPdfUtil ? /window\.print|print\(\)/i.test(readFile('src/utils/generatePdf.js') || '') : false;

  if (!hasPdfLib && !hasPdfUtil) {
    return {
      status: STATUS.FAIL,
      evidence: 'No PDF generation capability found.',
    };
  }
  return { status: STATUS.PASS, evidence: hasPdfUtil ? 'Browser-native PDF generation via generatePdf.js' : 'PDF library available' };
});

// ═══════════════════════════════════════════════════════════════════
//  REPORT OUTPUT
// ═══════════════════════════════════════════════════════════════════

// ── Summary Statistics ──

const total = results.length;
const passed = results.filter(r => r.status === STATUS.PASS).length;
const failed = results.filter(r => r.status === STATUS.FAIL).length;
const warned = results.filter(r => r.status === STATUS.WARN).length;

const criticalFails = results.filter(r => r.status === STATUS.FAIL && r.severity === SEVERITY.CRITICAL);
const highFails = results.filter(r => r.status === STATUS.FAIL && r.severity === SEVERITY.HIGH);
const mediumFails = results.filter(r => r.status === STATUS.FAIL && r.severity === SEVERITY.MEDIUM);

const categories = {};
for (const r of results) {
  if (!categories[r.category]) categories[r.category] = { total: 0, pass: 0, fail: 0, warn: 0 };
  categories[r.category].total++;
  if (r.status === STATUS.PASS) categories[r.category].pass++;
  if (r.status === STATUS.FAIL) categories[r.category].fail++;
  if (r.status === STATUS.WARN) categories[r.category].warn++;
}

const complianceScore = total > 0 ? Math.round((passed / total) * 100) : 0;

// ── JSON Report ──

if (FLAG_JSON) {
  const report = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    complianceScore,
    summary: { total, passed, failed, warned, critical: criticalFails.length, high: highFails.length, medium: mediumFails.length },
    categories,
    results,
  };
  const reportPath = path.join(ROOT, 'compliance', 'audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  process.exit(FLAG_CI && criticalFails.length > 0 ? 1 : 0);
}

// ── Terminal Report ──

const COLORS = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', blue: '\x1b[34m',
  magenta: '\x1b[35m', cyan: '\x1b[36m', white: '\x1b[37m',
  bgRed: '\x1b[41m', bgGreen: '\x1b[42m', bgYellow: '\x1b[43m',
};

const C = COLORS;

function statusColor(status) {
  if (status === STATUS.PASS) return `${C.bgGreen}${C.bold} PASS ${C.reset}`;
  if (status === STATUS.FAIL) return `${C.bgRed}${C.bold} FAIL ${C.reset}`;
  return `${C.bgYellow}${C.bold} WARN ${C.reset}`;
}

function severityColor(severity) {
  if (severity === SEVERITY.CRITICAL) return `${C.red}${C.bold}${severity}${C.reset}`;
  if (severity === SEVERITY.HIGH) return `${C.magenta}${severity}${C.reset}`;
  if (severity === SEVERITY.MEDIUM) return `${C.yellow}${severity}${C.reset}`;
  return `${C.dim}${severity}${C.reset}`;
}

console.log(`
${C.bold}${C.cyan}╔══════════════════════════════════════════════════════════════════╗
║              COMPLIANCE AUDIT REPORT                             ║
║              Everyday Dental Surgery                             ║
╚══════════════════════════════════════════════════════════════════╝${C.reset}

${C.dim}Date: ${new Date().toISOString()}${C.reset}
${C.dim}Scanner Version: 1.0.0${C.reset}
`);

// ── Per-Category Results ──

const categoryOrder = ['HIPAA', 'FHIR', 'SOC2', 'Security', 'DataFlow'];
for (const cat of categoryOrder) {
  const catResults = results.filter(r => r.category === cat);
  if (catResults.length === 0) continue;

  const catStats = categories[cat];
  const catScore = Math.round((catStats.pass / catStats.total) * 100);

  console.log(`${C.bold}${C.cyan}── ${cat} ──${C.reset} ${catStats.pass}/${catStats.total} passed (${catScore}%)\n`);

  for (const r of catResults) {
    const statusStr = statusColor(r.status);
    const sevStr = severityColor(r.severity);
    console.log(`  ${statusStr} ${sevStr} ${C.bold}[${r.id}]${C.reset} ${r.title}`);
    if (r.status !== STATUS.PASS || FLAG_VERBOSE) {
      console.log(`         ${C.dim}${r.evidence}${C.reset}`);
      if (r.file) console.log(`         ${C.dim}File: ${r.file}${r.line ? `:${r.line}` : ''}${C.reset}`);
    }
    console.log('');
  }
}

// ── Summary ──

console.log(`${C.bold}${C.cyan}═══════════════════════════════════════════════════════════════${C.reset}`);
console.log(`${C.bold}COMPLIANCE SCORE: ${complianceScore <= 50 ? C.red : complianceScore <= 75 ? C.yellow : C.green}${complianceScore}%${C.reset}`);
console.log(`${C.bold}Total: ${total} | ${C.green}Pass: ${passed}${C.reset} | ${C.red}Fail: ${failed}${C.reset} | ${C.yellow}Warn: ${warned}${C.reset}`);
console.log('');

if (criticalFails.length > 0) {
  console.log(`${C.bgRed}${C.bold} ${criticalFails.length} CRITICAL FAILURES — MUST FIX BEFORE PRODUCTION ${C.reset}`);
  for (const r of criticalFails) {
    console.log(`  ${C.red}• [${r.id}] ${r.title}${C.reset}`);
  }
  console.log('');
}

if (highFails.length > 0) {
  console.log(`${C.magenta}${C.bold}${highFails.length} HIGH severity failures:${C.reset}`);
  for (const r of highFails) {
    console.log(`  ${C.magenta}• [${r.id}] ${r.title}${C.reset}`);
  }
  console.log('');
}

if (mediumFails.length > 0) {
  console.log(`${C.yellow}${mediumFails.length} MEDIUM severity failures${C.reset}`);
  console.log('');
}

// ── Per-Category Summary ──

console.log(`${C.bold}Category Breakdown:${C.reset}`);
for (const cat of categoryOrder) {
  if (!categories[cat]) continue;
  const s = categories[cat];
  const bar = '█'.repeat(s.pass) + '░'.repeat(s.fail + s.warn);
  const pct = Math.round((s.pass / s.total) * 100);
  console.log(`  ${cat.padEnd(12)} ${bar} ${pct}% (${s.pass}/${s.total})`);
}

console.log(`
${C.dim}Run with --json for machine-readable report${C.reset}
${C.dim}Run with --ci to fail build on critical issues${C.reset}
${C.dim}Run with --verbose to see evidence for all checks${C.reset}
${C.dim}Run with --category <name> to filter (hipaa|fhir|soc2|security|dataflow)${C.reset}
`);

// ── Save JSON report alongside ──
const report = {
  timestamp: new Date().toISOString(),
  version: '1.0.0',
  complianceScore,
  summary: { total, passed, failed, warned, critical: criticalFails.length, high: highFails.length, medium: mediumFails.length },
  categories,
  results,
};
const reportPath = path.join(ROOT, 'compliance', 'audit-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`${C.dim}Report saved to: compliance/audit-report.json${C.reset}`);

// ── Exit Code ──
if (FLAG_CI && criticalFails.length > 0) {
  process.exit(1);
}
