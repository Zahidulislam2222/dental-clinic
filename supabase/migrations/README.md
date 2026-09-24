# Database migrations

Historical prototypes, retained in order. This publication does not execute SQL. Applying them to live data before resolving [clinical blockers](../../docs/CLINICAL-RELEASE.md) risks incompatible contracts and policies.

| Migration | Intended responsibility |
|---|---|
| 001_initial_schema.sql | Initial intake tables |
| 002_auth_rbac.sql | Identity/profile and roles |
| 003_rbac_policies.sql | Row-level access policies |
| 004_encryption.sql | Sensitive-field encryption helpers |
| 005_audit_logging.sql | Audit tables/triggers |
| 006_consent_tracking.sql | Consent records and policy |
| 007_fhir_schema.sql | FHIR-oriented resources |
| 008_data_retention.sql | Retention/deletion structures |
| 009_breach_notification.sql | Incident/detection structures |
| 010_compliance_hardening.sql | Cross-cutting schema/control changes |
| 011_pgaudit_and_fhir_audit.sql | Database and FHIR audit extensions |

## Safe upgrade sequence

1. Inventory actual schema, extensions, permissions and migration history. Preserve a private snapshot and tested recovery path.
2. Reconcile drift locally. Test an empty install and upgrade from the previous supported state with synthetic data.
3. Align encrypted writers/readers and keys. Test anonymous, patient, clinician, staff and admin access, including cross-tenant denial.
4. Exercise holds, withdrawal, export, erasure and restoration together; restore must not resurrect revoked permissions.
5. Use compatible expand/migrate/contract changes with bounded backfills and lock budgets. Identify irreversible steps and roll-forward recovery.
6. Compare integrity assertions and row counts; halt if access expands or records disappear unexpectedly.

Database/migration integration tests remain future work. Frontend tests do not prove PostgreSQL, RLS or encryption correctness. See [Supabase migrations](https://supabase.com/docs/guides/deployment/database-migrations) and [database testing](https://supabase.com/docs/guides/database/testing).
