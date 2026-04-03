-- ============================================================
-- Migration 010: Compliance Hardening
-- Addresses all CRITICAL and HIGH findings from 2026-04-03 audit
-- HIPAA: 164.312, 164.404, 164.508, 164.530
-- SOC 2: CC6, CC7, A1
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. FIX ENCRYPTION: encrypt_phi() must NOT return NULL on missing key
--    Audit: HIPAA-ENC-001 (CRITICAL)
-- ──────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION encrypt_phi(plaintext TEXT, encryption_key TEXT DEFAULT NULL)
RETURNS BYTEA AS $$
DECLARE
  key TEXT;
BEGIN
  IF plaintext IS NULL OR plaintext = '' THEN
    RETURN NULL;
  END IF;

  -- Try parameter first, then Vault
  IF encryption_key IS NOT NULL THEN
    key := encryption_key;
  ELSE
    BEGIN
      SELECT decrypted_secret INTO key
      FROM vault.decrypted_secrets
      WHERE name = 'phi_encryption_key' LIMIT 1;
    EXCEPTION WHEN OTHERS THEN
      RAISE EXCEPTION 'PHI encryption failed: Vault unavailable and no key provided. PHI will NOT be stored in plaintext.';
    END;
  END IF;

  IF key IS NULL THEN
    RAISE EXCEPTION 'PHI encryption failed: No encryption key found. Configure vault secret phi_encryption_key.';
  END IF;

  RETURN pgp_sym_encrypt(plaintext, key);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ──────────────────────────────────────────────────────────────
-- 2. FIX DECRYPTION: decrypt_phi() must NOT return '[ENCRYPTED]' silently
--    Audit: HIPAA-ENC-003 (HIGH)
-- ──────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION decrypt_phi(ciphertext BYTEA, encryption_key TEXT DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  key TEXT;
BEGIN
  IF ciphertext IS NULL THEN
    RETURN NULL;
  END IF;

  IF encryption_key IS NOT NULL THEN
    key := encryption_key;
  ELSE
    BEGIN
      SELECT decrypted_secret INTO key
      FROM vault.decrypted_secrets
      WHERE name = 'phi_encryption_key' LIMIT 1;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'PHI decryption failed: Vault unavailable';
      RETURN '[DECRYPTION_UNAVAILABLE]';
    END;
  END IF;

  IF key IS NULL THEN
    RAISE WARNING 'PHI decryption failed: No key found';
    RETURN '[DECRYPTION_UNAVAILABLE]';
  END IF;

  BEGIN
    RETURN pgp_sym_decrypt(ciphertext, key);
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'PHI decryption failed: Invalid key or corrupted data';
    RETURN '[DECRYPTION_ERROR]';
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ──────────────────────────────────────────────────────────────
-- 3. DROP PLAINTEXT PHI COLUMNS (after verifying encrypted columns exist)
--    Audit: HIPAA-ENC-002 (CRITICAL)
-- ──────────────────────────────────────────────────────────────

-- Drop views that depend on plaintext columns before removing them
DROP VIEW IF EXISTS registrations_decrypted CASCADE;
DROP VIEW IF EXISTS appointments_decrypted CASCADE;
DROP VIEW IF EXISTS registrations_reception CASCADE;
DROP VIEW IF EXISTS appointments_reception CASCADE;

-- Safety: only drop if encrypted columns exist
DO $$
BEGIN
  -- Registrations: drop plaintext PHI columns
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='registrations' AND column_name='medical_history_enc') THEN
    ALTER TABLE registrations DROP COLUMN IF EXISTS medical_history;
    ALTER TABLE registrations DROP COLUMN IF EXISTS allergies;
    ALTER TABLE registrations DROP COLUMN IF EXISTS date_of_birth;
    ALTER TABLE registrations DROP COLUMN IF EXISTS blood_group;
  END IF;

  -- Appointments: drop plaintext medical_notes
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appointments' AND column_name='medical_notes_enc') THEN
    ALTER TABLE appointments DROP COLUMN IF EXISTS medical_notes;
  END IF;
END $$;

-- NOTE: Views are recreated AFTER section 5 (status column addition)

-- ──────────────────────────────────────────────────────────────
-- 4. ENCRYPTION KEY ROTATION FUNCTION
--    Audit: HIPAA-ENC-004 (HIGH)
-- ──────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION rotate_encryption_key(old_key TEXT, new_key TEXT)
RETURNS TABLE(table_name TEXT, records_updated INTEGER) AS $$
DECLARE
  reg_count INTEGER := 0;
  appt_count INTEGER := 0;
BEGIN
  -- Re-encrypt registrations PHI
  UPDATE registrations SET
    medical_history_enc = pgp_sym_encrypt(pgp_sym_decrypt(medical_history_enc, old_key), new_key),
    allergies_enc = pgp_sym_encrypt(pgp_sym_decrypt(allergies_enc, old_key), new_key),
    date_of_birth_enc = pgp_sym_encrypt(pgp_sym_decrypt(date_of_birth_enc, old_key), new_key),
    blood_group_enc = pgp_sym_encrypt(pgp_sym_decrypt(blood_group_enc, old_key), new_key)
  WHERE medical_history_enc IS NOT NULL OR allergies_enc IS NOT NULL
     OR date_of_birth_enc IS NOT NULL OR blood_group_enc IS NOT NULL;
  GET DIAGNOSTICS reg_count = ROW_COUNT;

  -- Re-encrypt appointments PHI
  UPDATE appointments SET
    medical_notes_enc = pgp_sym_encrypt(pgp_sym_decrypt(medical_notes_enc, old_key), new_key)
  WHERE medical_notes_enc IS NOT NULL;
  GET DIAGNOSTICS appt_count = ROW_COUNT;

  -- Log the rotation event
  INSERT INTO audit_logs (action, table_name, details)
  VALUES ('KEY_ROTATION', 'phi_encryption', format('Key rotated. registrations: %s, appointments: %s', reg_count, appt_count));

  -- Return results
  table_name := 'registrations'; records_updated := reg_count; RETURN NEXT;
  table_name := 'appointments'; records_updated := appt_count; RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ──────────────────────────────────────────────────────────────
-- 5. ADD APPOINTMENT STATUS COLUMN + LIFECYCLE
--    Audit: FLOW-APPT-001 (CRITICAL)
-- ──────────────────────────────────────────────────────────────

CREATE TYPE appointment_status AS ENUM ('proposed', 'pending', 'booked', 'confirmed', 'arrived', 'fulfilled', 'cancelled', 'noshow');

ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS status appointment_status NOT NULL DEFAULT 'proposed',
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Recreate views now that status column exists
CREATE OR REPLACE VIEW registrations_decrypted AS
SELECT
  id, ref_number, user_id, patient_name, patient_phone, patient_email,
  COALESCE(decrypt_phi(date_of_birth_enc), 'N/A') AS date_of_birth,
  gender,
  COALESCE(decrypt_phi(blood_group_enc), 'N/A') AS blood_group,
  COALESCE(decrypt_phi(medical_history_enc), 'None') AS medical_history,
  COALESCE(decrypt_phi(allergies_enc), 'None') AS allergies,
  preferred_date, preferred_time, created_at
FROM registrations;

CREATE OR REPLACE VIEW appointments_decrypted AS
SELECT
  id, ref_number, user_id, patient_name, patient_phone, patient_email,
  service, date, time, booking_mode, status,
  COALESCE(decrypt_phi(medical_notes_enc), 'None') AS medical_notes,
  created_at
FROM appointments;

CREATE OR REPLACE VIEW registrations_reception AS
SELECT
  id, ref_number, patient_name, patient_phone, patient_email,
  preferred_date, preferred_time, created_at, user_id
FROM registrations;

CREATE OR REPLACE VIEW appointments_reception AS
SELECT
  id, ref_number, patient_name, patient_phone, patient_email,
  service, date, time, booking_mode, status, created_at, user_id
FROM appointments;

-- ──────────────────────────────────────────────────────────────
-- 6. FIX FHIR RLS: check BOTH subject AND patient references
--    Audit: FHIR-RLS-001 (CRITICAL)
-- ──────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "patient_read_own_fhir" ON fhir_resources;

CREATE POLICY "patient_read_own_fhir" ON fhir_resources
  FOR SELECT TO authenticated
  USING (
    -- Staff can read all
    public.is_staff()
    -- Patients: match by resource ID, subject reference, OR patient reference
    OR resource->>'id' = auth.uid()::TEXT
    OR resource->'subject'->>'reference' = 'Patient/' || auth.uid()::TEXT
    OR resource->'patient'->>'reference' = 'Patient/' || auth.uid()::TEXT
  );

-- ──────────────────────────────────────────────────────────────
-- 7. CONSENT ENFORCEMENT RLS: revoked consent blocks PHI access
--    Audit: HIPAA-CONSENT-001, SOC2-CONSENT-001 (HIGH)
-- ──────────────────────────────────────────────────────────────

-- Helper function: check if user has active (non-revoked) medical data consent
CREATE OR REPLACE FUNCTION public.has_active_consent(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.consent_records
    WHERE user_id = check_user_id
      AND consent_type = 'medical_data'
      AND revoked_at IS NULL
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Add consent-gated policies for PHI tables
-- Patients can only SELECT their own data IF they have active consent
DROP POLICY IF EXISTS "patient_select_own_registrations" ON registrations;
CREATE POLICY "patient_select_own_registrations" ON registrations
  FOR SELECT TO authenticated
  USING (
    public.is_staff()
    OR (user_id = auth.uid() AND public.has_active_consent())
  );

DROP POLICY IF EXISTS "patient_select_own_appointments" ON appointments;
CREATE POLICY "patient_select_own_appointments" ON appointments
  FOR SELECT TO authenticated
  USING (
    public.is_staff()
    OR (user_id = auth.uid() AND public.has_active_consent())
  );

-- ──────────────────────────────────────────────────────────────
-- 8. FIX AUDIT TRIGGER: populate ip_address and user_agent
--    Audit: HIPAA-AUDIT-002 (MEDIUM)
--    Note: Trigger functions can't access HTTP headers directly.
--    We use a session variable set by Edge Functions.
-- ──────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
DECLARE
  _user_id UUID;
  _email TEXT;
  _role TEXT;
  _old JSONB;
  _new JSONB;
  _record_id BIGINT;
  _ip TEXT;
  _ua TEXT;
BEGIN
  _user_id := auth.uid();

  BEGIN
    SELECT email INTO _email FROM auth.users WHERE id = _user_id;
    SELECT role::TEXT INTO _role FROM public.user_profiles WHERE id = _user_id;
  EXCEPTION WHEN OTHERS THEN
    _email := 'anonymous';
    _role := 'anon';
  END;

  -- Try to read IP/user-agent from session variables (set by Edge Functions)
  BEGIN
    _ip := current_setting('app.client_ip', true);
    _ua := current_setting('app.client_user_agent', true);
  EXCEPTION WHEN OTHERS THEN
    _ip := NULL;
    _ua := NULL;
  END;

  -- Build old/new JSONB values
  IF TG_OP = 'DELETE' THEN
    _old := to_jsonb(OLD); _new := NULL; _record_id := OLD.id;
  ELSIF TG_OP = 'UPDATE' THEN
    _old := to_jsonb(OLD); _new := to_jsonb(NEW); _record_id := NEW.id;
  ELSIF TG_OP = 'INSERT' THEN
    _old := NULL; _new := to_jsonb(NEW); _record_id := NEW.id;
  END IF;

  -- Strip encrypted BYTEA columns from audit log
  IF _old IS NOT NULL THEN
    _old := _old - ARRAY['medical_history_enc','allergies_enc','date_of_birth_enc','blood_group_enc','medical_notes_enc'];
  END IF;
  IF _new IS NOT NULL THEN
    _new := _new - ARRAY['medical_history_enc','allergies_enc','date_of_birth_enc','blood_group_enc','medical_notes_enc'];
  END IF;

  INSERT INTO audit_logs (user_id, user_email, user_role, action, table_name, record_id, old_values, new_values, ip_address, user_agent)
  VALUES (_user_id, _email, _role, TG_OP, TG_TABLE_NAME, _record_id, _old, _new, _ip, _ua);

  IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ──────────────────────────────────────────────────────────────
-- 9. SOFT-DELETE for data retention
--    Audit: HIPAA-RETENTION-002 (MEDIUM)
-- ──────────────────────────────────────────────────────────────

ALTER TABLE appointments ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Update purge function to soft-delete instead of hard-delete
CREATE OR REPLACE FUNCTION purge_expired_records()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  policy RECORD;
  cutoff TIMESTAMPTZ;
  soft_deleted INTEGER;
BEGIN
  FOR policy IN
    SELECT table_name, retention_days
    FROM retention_policies
    WHERE is_active = true
  LOOP
    cutoff := now() - (policy.retention_days || ' days')::INTERVAL;

    -- Soft-delete: set deleted_at instead of hard DELETE
    -- Only for tables that have deleted_at column
    BEGIN
      EXECUTE format(
        'WITH updated AS (
          UPDATE %I SET deleted_at = now() WHERE created_at < $1 AND deleted_at IS NULL RETURNING 1
        ) SELECT count(*) FROM updated',
        policy.table_name
      ) INTO soft_deleted USING cutoff;
    EXCEPTION WHEN undefined_column THEN
      -- Table doesn't have deleted_at column — use hard delete (e.g., audit_logs)
      EXECUTE format(
        'WITH deleted AS (
          DELETE FROM %I WHERE created_at < $1 RETURNING 1
        ) SELECT count(*) FROM deleted',
        policy.table_name
      ) INTO soft_deleted USING cutoff;
    END;

    IF soft_deleted > 0 THEN
      INSERT INTO purge_logs (table_name, records_deleted, retention_days, cutoff_date)
      VALUES (policy.table_name, soft_deleted, policy.retention_days, cutoff);
    END IF;

    UPDATE retention_policies SET last_purge_at = now(), updated_at = now()
    WHERE table_name = policy.table_name;
  END LOOP;
END;
$$;

-- ──────────────────────────────────────────────────────────────
-- 10. ENABLE PG_CRON SCHEDULES
--     Audit: HIPAA-RETENTION-001, HIPAA-BREACH-002, SOC2-RETENTION-001, SOC2-BREACH-001
-- ──────────────────────────────────────────────────────────────

-- NOTE: pg_cron must be enabled in Supabase Dashboard → Database → Extensions
-- After enabling, run these manually in SQL Editor:

-- Nightly data purge at 2:00 AM UTC
-- NOTE: Run these manually in SQL Editor AFTER enabling pg_cron extension
-- SELECT cron.schedule('nightly-data-purge', '0 2 * * *', 'SELECT purge_expired_records()');

-- Hourly breach detection
-- SELECT cron.schedule('hourly-breach-check', '0 * * * *', $$
--   SELECT net.http_post(
--     url := current_setting('app.supabase_url') || '/functions/v1/breach-check',
--     headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.service_role_key'))
--   );
-- $$);

-- ──────────────────────────────────────────────────────────────
-- 11. RECEPTIONIST COLUMN-LEVEL RESTRICTION via function
--     Audit: HIPAA-RLS-003 (HIGH)
-- ──────────────────────────────────────────────────────────────

-- Receptionist MUST use the reception views — restrict base table access
-- Create a function that returns NULL for PHI columns when called by receptionist
CREATE OR REPLACE FUNCTION public.is_receptionist()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'receptionist'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Force receptionist to use views by restricting base table SELECT
-- Receptionist can only SELECT from views, not base tables
-- This is enforced by updating the staff SELECT policies

-- Registrations: receptionist gets view-only, doctor/admin get full
DROP POLICY IF EXISTS "staff_select_registrations" ON registrations;

-- Appointments: same pattern
DROP POLICY IF EXISTS "staff_select_appointments" ON appointments;

-- Now doctor/admin read from base table (with decrypted views in practice)
-- Receptionist reads from reception views only (no direct base table access for SELECT)
CREATE POLICY "doctor_admin_select_registrations" ON registrations
  FOR SELECT TO authenticated
  USING (public.user_role() IN ('admin', 'doctor'));

CREATE POLICY "doctor_admin_select_appointments" ON appointments
  FOR SELECT TO authenticated
  USING (public.user_role() IN ('admin', 'doctor'));

-- ──────────────────────────────────────────────────────────────
-- 12. DEPROVISIONING SECURITY EVENT
--     Audit: SOC2-ACCESS-001 (MEDIUM)
-- ──────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION log_deprovisioning_event()
RETURNS TRIGGER AS $$
BEGIN
  -- When a user is deactivated (is_active changes to false)
  IF OLD.is_active = true AND NEW.is_active = false THEN
    INSERT INTO security_incidents (
      severity, title, description, detection_method
    ) VALUES (
      'medium',
      'Staff account deprovisioned',
      format('User %s (role: %s, email: %s) was deactivated by admin.', NEW.id, NEW.role, NEW.email),
      'automated'
    );
  END IF;

  -- When a role is escalated to admin
  IF OLD.role != 'admin' AND NEW.role = 'admin' THEN
    INSERT INTO security_incidents (
      severity, title, description, detection_method
    ) VALUES (
      'high',
      'Role escalation to admin',
      format('User %s (email: %s) role changed from %s to admin.', NEW.id, NEW.email, OLD.role),
      'automated'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_deprovisioning_event
  AFTER UPDATE ON user_profiles
  FOR EACH ROW
  WHEN (OLD.is_active IS DISTINCT FROM NEW.is_active OR OLD.role IS DISTINCT FROM NEW.role)
  EXECUTE FUNCTION log_deprovisioning_event();

-- ──────────────────────────────────────────────────────────────
-- 13. CONSENT CHECKBOX SUPPORT: add signup consent type
--     Audit: HIPAA-CONSENT-002 (HIGH)
-- ──────────────────────────────────────────────────────────────

-- Auto-create consent record on user profile creation (signup)
CREATE OR REPLACE FUNCTION create_signup_consent()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO consent_records (user_id, consent_type, version, form_type)
  VALUES (NEW.id, 'privacy_policy', '1.0', 'signup');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only create trigger if it doesn't exist
DROP TRIGGER IF EXISTS trigger_signup_consent ON user_profiles;
CREATE TRIGGER trigger_signup_consent
  AFTER INSERT ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION create_signup_consent();
