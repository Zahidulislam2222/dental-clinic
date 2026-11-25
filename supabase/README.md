# Clinical backend (prototype)

This directory contains the prototype clinical backend: **11 Supabase Edge Functions** (Deno, TypeScript) and **11 PostgreSQL migrations** covering intake, roles and row-level security, encryption, audit logging, consent, FHIR resources, retention and breach detection.

The backend is **disabled**. Every function returns `503 Service Unavailable` from a shared guard, [`functions/_shared/release-boundary.ts`](functions/_shared/release-boundary.ts), before running any logic. No environment variable can turn it on, and the frontend has no client configured for it.

| Directory | Contents |
|---|---|
| [`functions/`](functions/README.md) | Edge Function entry points and shared helpers |
| [`migrations/`](migrations/README.md) | Ordered SQL migrations |

## Local development

The public site does not need this backend, Docker or a Supabase account. `npm test` checks that every function is guarded, and `npm run typecheck` covers the guard module.

To work on the backend itself you need an isolated local Supabase environment with a pinned CLI version and sample data. There is no `config.toml` in the repository yet, so this is not a one-command setup. Follow Supabase's guides to [local development](https://supabase.com/docs/guides/local-development) and [database testing](https://supabase.com/docs/guides/database/testing), and never link experiments to the production project.

## Enabling the backend

The guard is removed only after every item in [Clinical release](../docs/CLINICAL-RELEASE.md) is closed, including:

- encrypted reads and writes aligned with the final schema;
- fixed table and column allowlists with tenant and patient scope;
- authenticated callers for admin, notification and scheduled functions;
- atomic rate limiting, verified payments, consent, retention, MFA and durable audit logging;
- one typed settings module for all provider configuration;
- tests for clean install and upgrade, RLS denial, cross-tenant access, revoked roles, concurrent bookings and retries.

## Deployment

Publishing to GitHub does not deploy functions or run SQL. Before a deployment, snapshot and compare the live code and schema, reconcile any differences locally, test migrations and recovery, deploy a reviewed build and confirm the deployed source matches. Service-role keys never belong in frontend configuration.
