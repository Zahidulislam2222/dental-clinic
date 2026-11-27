# Edge Functions

Every entry point returns the shared [503 release guard](_shared/release-boundary.ts) before running its logic. The table describes what each function is designed to do and what must be proven before it is enabled. See [API](../../docs/API.md) and [Clinical release](../../docs/CLINICAL-RELEASE.md).

| Function | Purpose | Required before enabling |
|---|---|---|
| `submit-form` | Contact, appointment and registration intake | Schema compatibility, validation and abuse protection |
| `get-patient-data` | Patient and staff record retrieval | Fixed table and column allowlists; patient and tenant denial tests |
| `cancel-appointment` | Cancel an appointment the caller owns | Ownership checks, valid state transitions, retry and concurrency behavior |
| `admin-query` | Staff queries | Least privilege, scoped columns, bounded pagination |
| `admin-manage-user` | User and role administration | MFA, no privilege escalation, audit trail |
| `admin-resolve-request` | Process data-rights requests | Identity checks, holds, retention and completion evidence |
| `fhir-api` | FHIR read, search and write | Resource ownership and implementation-guide validation |
| `fhir-export` | Export a patient's FHIR bundle | Patient scope, bounded export, secure delivery |
| `send-notification` | Transactional notifications | Authorized caller, approved recipients and templates |
| `breach-check` | Evaluate incident-detection rules | Authenticated scheduler, complete rule coverage |
| `stripe-payment` | Payments and webhook handling | Server-owned amounts, signature and replay checks |

Shared helpers in `_shared/` (rate limiting, sessions, CORS) exist in code, but their enforcement has not been verified end to end. Client-side rate limits and UI session timers are not server authorization.
