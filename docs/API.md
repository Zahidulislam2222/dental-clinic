# API

## Current behavior

The clinical API is not available. All eleven Edge Functions return the same response before reading any input:

```http
HTTP/1.1 503 Service Unavailable
Content-Type: application/json
Cache-Control: no-store
Retry-After: 86400

{"error":"Clinical services are not available on this site."}
```

A hosting gateway may answer some requests itself (for example with an authentication error) before they reach the function, so check the response body, not only the status code. The guard lives in [`supabase/functions/_shared/release-boundary.ts`](../supabase/functions/_shared/release-boundary.ts); the [function inventory](../supabase/functions/README.md) lists what each endpoint is designed to do.

## Contract standard for the clinical API

Before any endpoint is enabled it must publish a versioned schema with sample payloads: OpenAPI for regular endpoints, and for FHIR endpoints a chosen FHIR version, implementation guide and accurate `CapabilityStatement`. Each endpoint must meet these requirements:

| Concern | Requirement |
|---|---|
| Identity | Validated token issuer, audience and expiry; staff MFA; immediate revocation |
| Authorization | Tenant and patient derived on the server; tests for every denied case |
| Input | Typed schemas, an explicit unknown-field policy, size and content-type limits |
| Writes | Idempotency keys, concurrency preconditions and defined conflict responses |
| Pagination | Bounded page size with cursors; bulk exports run as separate jobs |
| Errors | Stable error codes and correlation IDs; never stack traces, SQL, secrets or patient data |
| Rate limits | Atomic per-user, per-tenant and per-operation budgets with documented retry behavior |
| Caching | `no-store` on all private health responses |
| Webhooks | Signature over the raw body, timestamp tolerance, replay protection and retries |
| Jobs | Authorized status checks, bounded retries and cancellation |
| Audit | Actor, operation, target, result and time, with minimal payload |

### Status codes

| Code | Meaning |
|---|---|
| 400 | Malformed request |
| 401 | Missing or invalid identity |
| 403 | Identity valid, permission denied |
| 404 | Resource absent, or hidden from this caller |
| 409 | Conflict with current state |
| 422 | Valid syntax, failed business validation |
| 429 | Rate limit exceeded |
| 503 | Dependency or service unavailable |
