# Backend guide

This directory preserves **11 Edge Function prototypes and 11 SQL migrations**. Every function returns the shared release boundary before business logic. It is a foundation for future clinical implementation.

## Current contract

[The guard](functions/_shared/release-boundary.ts) returns HTTP 503 with a fixed JSON message and no-store caching. No environment flag enables execution. The frontend has no configured clinical client. See [API contracts](../docs/API.md).

| Directory | Purpose |
|---|---|
| [functions](functions/README.md) | Eleven Deno/TypeScript entrypoints and shared helpers |
| [migrations](migrations/README.md) | Eleven ordered historical schema migrations |

## Local development

The root `npm ci` installs the project CLI dependency. Synthetic frontend development requires neither Docker nor a cloud project. Root `npm test` checks guard behavior/source coverage; `npm run typecheck` covers the guard, not the entire backend.

A clinical workstream must establish an isolated local Supabase environment, pinned CLI configuration, synthetic fixtures and a tested migration chain. There is no committed config.toml in this snapshot, so the backend is not a one-command bootstrap. Follow [local development](https://supabase.com/docs/guides/local-development) and [database testing](https://supabase.com/docs/guides/database/testing). Do not link experiments to production or remove guards to make a test pass.

## Activation requirements

Repair schema/encryption compatibility, table allowlists, subject/tenant ownership, privileged caller authentication, consent, atomic rate limiting, payment verification, retention, MFA and audit persistence. Establish typed server settings and safe environment examples. The authoritative [clinical blocker register](../docs/CLINICAL-RELEASE.md) also requires vendor contracts, operating ownership and recovery evidence.

Validate fresh/upgrade migrations, RLS denial, cross-tenant access, revoked roles, concurrent booking and retry behavior. Graduate through [roadmap](../ROADMAP.md) gates.

## Deployment

GitHub publication does not deploy functions or execute SQL. Before deployment, snapshot and compare live code/schema, reconcile drift locally, test migrations and recovery, deploy a reviewed artifact and verify source parity. Service-role keys never belong in frontend configuration.
