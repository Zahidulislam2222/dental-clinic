# API contracts

## Current handler response

All eleven clinical handlers return the shared guard before business input:

```http
HTTP/1.1 503 Service Unavailable
Content-Type: application/json
Cache-Control: no-store
Retry-After: 86400

{"error":"Clinical services are not available in this demonstration."}
```

Hosting gateways can reject requests before the handler, including authentication failures. Verify the body, not just status 503. The guard is not a usable CORS/clinical integration. Historical unreachable payloads are not stable public contracts. See the [function inventory](../supabase/functions/README.md).

## Future contract acceptance

Publish versioned schemas and synthetic examples, plus OpenAPI for non-FHIR operations. Select a FHIR version and partner implementation guide, publish an accurate CapabilityStatement and test every supported interaction.

| Concern | Required contract/test |
|---|---|
| Identity | Token issuer/audience/expiry, MFA and revocation |
| Authorization | Server-derived tenant/subject; negative ownership/care-assignment tests |
| Input | Typed schemas, unknown-field policy, size limits and content types |
| Writes | Idempotency scope/expiry, concurrency preconditions and conflict semantics |
| Pagination | Bounded pages/cursors; exports use separately controlled jobs |
| Errors | Stable codes and correlation IDs; no stacks, SQL, secrets or patient data |
| Limits | Atomic actor/tenant/operation budgets and retry behavior |
| Caching | Public cache separated from private/no-store health responses |
| Webhooks | Signature over raw body, time tolerance, replay ledger and retries |
| Jobs | Authorized status retrieval, bounded retries and cancellation |
| Audit | Actor, operation, target reference, result and time; minimized payload |

Proposed status semantics: 400 invalid syntax; 401 invalid identity; 403 denied permission; 404 concealed/absent resource; 409 conflict; 422 domain validation; 429 throttling; 503 unavailable dependency. Implement and test these before offering them as an API contract.
