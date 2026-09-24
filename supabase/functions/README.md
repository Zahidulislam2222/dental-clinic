# Edge Function inventory

All entrypoints return the [503 release guard](_shared/release-boundary.ts). Descriptions below are prototype intent, not available API functionality. See [API](../../docs/API.md) and [clinical gates](../../docs/CLINICAL-RELEASE.md).

| Function | Intent | Required activation evidence |
|---|---|---|
| submit-form | Contact/appointment/registration intake | Schema compatibility, validation and abuse controls |
| get-patient-data | Patient/staff retrieval | Fixed table/column allowlists and subject/tenant denial |
| cancel-appointment | Owned appointment cancellation | Ownership, transitions and retry/concurrency behavior |
| admin-query | Staff queries | Least privilege, scoped columns and bounded pagination |
| admin-manage-user | Role/user administration | MFA, no privilege escalation and audit |
| admin-resolve-request | Data-rights processing | Identity, holds, retention and completion evidence |
| fhir-api | FHIR-oriented read/search/write | Resource ownership and implementation-guide validation |
| fhir-export | Patient bundle | Subject scope, bounded export and secure delivery |
| send-notification | Transactional notifications | Authorized caller and approved recipient/template |
| breach-check | Incident rule evaluation | Authenticated scheduler and complete rule coverage |
| stripe-payment | Payment/webhook prototype | Server-owned amount, signature and replay checks |

Shared helper existence does not prove runtime enforcement. Client rate limits and UI session timers are not server authorization. Review helper call sites and failure behavior before activation.
