# Database migrations

The clinical schema, as ordered migrations. They are kept for the clinical release and are not applied by any script in this repository. Applying them to a live database before the [clinical release](../../docs/CLINICAL-RELEASE.md) blockers are fixed would create incompatible contracts and policies.

| Migration | Purpose |
|---|---|
| `001_initial_schema.sql` | Intake tables |
| `002_auth_rbac.sql` | User profiles and roles |
| `003_rbac_policies.sql` | Row-level security policies |
| `004_encryption.sql` | Field-level encryption helpers |
| `005_audit_logging.sql` | Audit tables and triggers |
| `006_consent_tracking.sql` | Consent records |
| `007_fhir_schema.sql` | FHIR resources |
| `008_data_retention.sql` | Retention and deletion |
| `009_breach_notification.sql` | Incident detection |
| `010_compliance_hardening.sql` | Cross-cutting schema and control changes |
| `011_pgaudit_and_fhir_audit.sql` | pgAudit and FHIR audit extensions |

## Upgrade procedure

1. Inventory the live schema, extensions, permissions and migration history. Take a private snapshot and confirm it can be restored.
2. Reconcile differences locally. Test a clean install and an upgrade from the current state with sample data.
3. Align encrypted writers, readers and keys. Test anonymous, patient, clinician, staff and admin access, including cross-tenant denial.
4. Test holds, consent withdrawal, export, erasure and restore together; a restore must not bring back revoked access.
5. Use expand, migrate and contract steps with bounded backfills and lock budgets. Identify irreversible steps and plan roll-forward recovery.
6. Compare integrity checks and row counts, and stop if access widens or records disappear unexpectedly.

Database integration tests are not written yet; the frontend tests do not exercise PostgreSQL, RLS or encryption. See Supabase's guides to [migrations](https://supabase.com/docs/guides/deployment/database-migrations) and [database testing](https://supabase.com/docs/guides/database/testing).
