# Clinical release

This document lists everything that must be true before Everyday Dental handles real patient data. Until every gate below is closed, the clinical backend stays disabled and the public site runs on sample data only.

## Current state

- The `supabase/` directory holds the clinical backend (early build): 11 Edge Functions and 11 SQL migrations.
- Every function returns `503 Service Unavailable` before running any logic. No environment variable can bypass this.
- The guarded functions were deployed to the Supabase project in September 2026; all 11 returned the expected 503 response, and the downloaded deployed source matched the repository file for file (SHA-256). A later CORS cleanup (October 2026) changed shared helper code but was not redeployed, because the guard returns before that code runs.
- No database records or migrations were changed when the guard was deployed.
- The frontend has no Supabase client configured.

## Engineering blockers

These defects were found in the early backend code. Disabling the endpoints contains them; it does not fix them. Each needs a repair and the listed verification.

| Area | Problem | Repair and verification |
|---|---|---|
| Encryption | Writers store plaintext; migration 010 expects encrypted fields | Align every read and write with the final schema; test clean install and upgrade |
| Data queries | Callers can choose which table to query | Fixed operation and column allowlists, tenant and patient scope, row limits, denial tests |
| FHIR | Resources are not checked against the requesting patient | Enforce ownership on every read, search and export; test IDOR and care-assignment cases |
| Notifications and breach checks | Callers are not authenticated as an authorized scheduler or admin | Verified caller identity, fixed recipients and templates, audited admin actions |
| Rate limiting | Limiter is not atomic and fails open | Shared atomic limiter, trusted proxy handling, fail closed, concurrency tests |
| Consent | No complete grant and withdrawal journey | Purpose-specific consent, enforced in RLS and downstream jobs |
| Payments | Amount and webhook not verified server-side | Server-owned prices, signature verification, replay protection; sandbox only until approved |
| Retention | No jurisdiction-specific schedule | Retention schedule, legal holds, dry runs, approvals and restore behavior |
| MFA and sessions | Staff MFA not enforced end to end | Enforced MFA, revoked-role and session tests, token expiry and inactivity policy |
| Audit | Persistence, authorization and failure behavior of audit events are unverified | Durable server-side events, redaction, access review and tamper evidence |
| Configuration | Provider URLs, limits and templates are scattered in function code | One typed, validated server settings module |

## Database rules

- Never apply the historical migrations to a live database whose state is unknown. Export and compare the live schema first, preserve existing records, and test the upgrade and rollback path.
- Service-role keys never go into frontend configuration.
- Test clean installs and upgrades, row-level security denials, cross-tenant access, revoked roles, concurrent bookings and retries against real PostgreSQL.

## Launch readiness

Engineering is only part of a clinical launch. A named operator must also complete the following.

### Legal and jurisdiction

| Market | Decision required |
|---|---|
| United States | Covered entity or business associate status; state health privacy, dental licensing and advertising rules |
| European Union | GDPR scope, controller and processor roles, Article 6 and 9 legal bases, national health law, international transfers |
| Bangladesh | Personal Data Protection Act 2026, Cyber Protection Act 2026, BMDC professional duties, facility registration |
| Any market | Where patients and staff are, where data is stored and processed, and by which vendors |

Background research: [US and EU](LEGAL-RESEARCH.md) · [Bangladesh](LEGAL-BANGLADESH.md)

### Public information

Publish the real operator identity and contact channel, verified clinician qualifications, current prices and cancellation terms, a privacy notice, terms of service and an accessibility contact. The privacy notice must cover data categories, purposes, legal bases, vendors and transfers, retention, rights and complaints, in reviewed English and Bangla. Marketing consent stays separate from treatment. No advertising pixels or session replay on clinical pages.

### Patient rights and records

- A retention schedule per record type, with jurisdiction, legal basis, period, trigger, hold exceptions and owner.
- Proportionate identity checks for rights requests; scoped exports; corrections; documented refusals.
- Explicit workflows for children and guardians, deceased patients, emergency access and disputed authority.

### Accessibility

Target WCAG 2.2 AA. Test keyboard-only use, focus, screen readers, error recovery, contrast, zoom and reflow, reduced motion and touch targets, in both languages. Automated axe results are one input, not a conformance certificate.

### Vendors

For every vendor: data flow, contract or BAA where required, security evidence, permitted regions, subprocessors, support, retention, export and exit plan. Confirm purchased features rather than assuming a plan includes backups or health-data eligibility. See the [BAA templates](templates/BAA.md) and [operating policy templates](templates/OPERATING-POLICIES.md).

### Operations

Rehearse backup restoration, incident notification, staff offboarding and role revocation, manual scheduling during downtime and post-recovery reconciliation. Define support hours, on-call coverage and clinical escalation. See [Operations](OPERATIONS.md).

## Sign-off

A clinical release requires all of the following, recorded with dated evidence:

- [ ] Every engineering blocker closed, with tests
- [ ] Security and accessibility findings resolved or formally accepted
- [ ] Legal and contract approval for the target jurisdiction
- [ ] Measured capacity and a rehearsed restore
- [ ] Named incident responders and support model
- [ ] Approved budget
- [ ] Independent code review

Reassess after any change of jurisdiction, vendor, clinical purpose or data flow.
