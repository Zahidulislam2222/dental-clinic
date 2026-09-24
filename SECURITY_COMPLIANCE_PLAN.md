# Security and clinical readiness delivery plan

Updated 2026-09-24. This plan supersedes the old frontend/prototype completion checklist. The current application is a synthetic demo with guarded clinical functions. Source-pattern matches and policy documents are not completed legal or clinical assurance.

| Workstream | Current boundary | Next acceptance gate |
|---|---|---|
| Frontend | Synthetic fixtures, read-only intake, no clinical client | Preserve browser privacy/accessibility regressions; extend full typing |
| Identity/authorization | Demo policy only; prototypes guarded | Verified identity/MFA, care assignment, tenant/subject scope and revocation tests |
| Database/encryption | Historical migrations retained | Fresh/upgrade compatibility, RLS, key recovery and integrity tests |
| APIs | Fixed 503 guard | Typed contracts, payload bounds, atomic rate limits and denial tests |
| Payments/messages | Disabled | Approved provider, sandbox signature/idempotency/recipient validation |
| Audit/retention | Sample illustration and historical schema | Durable authorized events, legal schedules, holds and restore reconciliation |
| Supply chain | Lockfile and local/security CI tooling | Current scans, registry verification for new dependencies and independent review |
| Governance | Proposed policies and jurisdiction research | Actual operator, vendor terms, notices, training and legal sign-off |
| Scale/reliability | Models and proposed SLOs | Staged load/failure tests, monitoring and measured recovery |

Use [clinical blockers](docs/CLINICAL-RELEASE.md) as the authoritative repair register, [roadmap](ROADMAP.md) for sequencing, [verification](docs/VERIFICATION.md) for results and [policy catalog](docs/policies/README.md) for proposed operations. Every completion claim must link to dated implementation and real-flow evidence.
