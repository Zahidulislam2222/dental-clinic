# Vendor management policy

**Draft for adoption — 2026-09-24.** Listing a library/provider is not evidence of a signed agreement, suitable plan or active clinical service.

| Service category | Review before use |
|---|---|
| Hosting/CDN | Network metadata, caching, logs, regions, TLS and support access |
| Clinical database/identity | PHI/health-data suitability, contracts, MFA, RLS, backups and recovery |
| Notifications | Contextual health disclosure, approved recipients/templates and delivery logging |
| Payments | Operator-country eligibility, hosted payment scope, settlement/refunds and webhooks |
| Monitoring/support | Redaction, retention, access and sub-processors |
| Media/fonts/maps | Licenses and visitor-request disclosure; prefer approved first-party assets |

Record purpose, data categories, processing locations, controller/processor or business-associate role, security evidence, agreement status, sub-processors, incident contacts, retention/export/deletion, costs and exit plan. Request current independent assurance reports where appropriate; SOC 2 is an attestation, not a blanket product certification.

HIPAA BAA applicability depends on actual PHI handling, including context and metadata; do not label email/CDN vendors automatically exempt. See [BAA guidance](../baa/README.md). Review before onboarding, at renewal and after material changes. No signed BAA is asserted in this public repository.
