# Clinical prototype release gate

Scope note (2026-09-24): deployment counts below are historical September release evidence. This documentation publication does not retest or alter live clinical services. The [backend guide](../supabase/README.md), [API contract](API.md), [governance checklist](GOVERNANCE.md) and [roadmap](../ROADMAP.md) describe the current source and future implementation path.

The `supabase/` directory preserves historical clinical prototypes. Every Edge Function entrypoint now returns a shared 503 boundary before processing a request. No environment variable can bypass it. The original function source was downloaded and all 15 recovered source files matched the Git baseline. The owner restored the historical project. After explicit owner approval, all 11 guards were deployed and each returned the expected HTTP 503 response. All 16 downloaded deployed source files matched local SHA256. No database records or migrations have been changed.

The following defects were recorded in the previous dossier and reconfirmed in inspected source. They are not falsely relabeled as repaired by disabling public access. Removing the release guard requires a dedicated clinical implementation, isolated test database and independent review.

| Blocker | Required repair and verification |
|---|---|
| Plaintext writers versus migration 010 | Reconcile every encrypted write/read with the final schema; empty and upgrade migration tests |
| Patient-selected query tables | Fixed operation/column allowlists, tenant/subject scope, row limits and negative authorization matrix |
| FHIR subject ownership | Enforce ownership for every patient-linked resource and search/export; test IDOR and care-assignment boundaries |
| Notification and breach authority | Verified caller/scheduler identity, fixed recipient/template policy, audited admin authority, no public service-role utility |
| Rate limiter | Atomic shared limiter, trusted proxy policy, fail closed on dependency errors and test concurrent requests |
| Consent | Purpose-specific grant/withdraw journey with legal-basis distinction, RLS and downstream enforcement |
| Payments | Server-owned catalog/amount, verified provider signatures, replay/idempotency handling; sandbox-only before separate approval |
| Retention | Jurisdiction-specific schedule, legal holds, dry run, approval, scheduler and restoration behavior |
| MFA/sessions | Actual staff MFA enforcement, revoked-role/session tests, token expiry and inactivity policy |
| Audit | Durable authorized server events, verified failure behavior, redaction, access review and tamper evidence |
| Configuration | Central typed server settings; inventory all Deno variables, limits, provider endpoints and templates |
| Operations | Vendor agreements, keys, encrypted off-server backups, restore rehearsal, monitoring and incident ownership |

Do not apply historical migrations to an unknown live database. Inventory and export the schema/functions first, compare them with local source, preserve existing records, and build a tested upgrade/rollback plan. Never place service-role credentials in frontend configuration. Never send real patient data to a free-tier provider without verified legal and contractual suitability.

The frontend sample is deliberately not a substitute for this gate. Browser-selected roles only illustrate policy decisions. The static demo proves neither database RLS nor backend encryption nor clinical FHIR interoperability. These limits should remain visible to clients and developers.
