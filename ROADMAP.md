# Product and engineering roadmap

Planning baseline: 2026-09-24. Milestones are dependency-based, not delivery promises. The current synthetic application is the starting point. The destination is a regional clinical platform and a measured **1M+ concurrent-user** public experience, with separately qualified clinical traffic.

## Milestones and exit criteria

| Stage | Deliverable | Accountable role | Exit evidence |
|---|---|---|---|
| A — public foundation | Cohesive source/docs, guarded backend, local tests and safe publication | Maintainer | Reviewed source, public-safe tree and reproducible verification |
| B — clinical correctness | Typed settings, schema reconciliation, tenant/subject scope, consent, payments and audit | Backend/security leads | Every clinical blocker closed; migration, RLS, integration and negative tests |
| C — controlled pilot | One approved jurisdiction/operator, support model and recovery | Product/privacy/operations leads | Legal/vendor approval, staff training, restore rehearsal, limited synthetic then approved clinical pilot |
| D — 10k active readers | Measured CDN/API boundaries, performance budgets and monitoring | Performance lead | Agreed mixed workload passes warm/cold, burst and sustained tests |
| E — 100k active readers | Multi-origin resilience, pooled database, asynchronous jobs and tenant limits | Platform lead | Failure-domain drill, queue/backpressure and database saturation evidence |
| F — 1M+ active readers | Regional delivery and capacity headroom with rehearsed failover | Platform/operations leads | Distributed load-generator evidence, 1M baseline plus 25% proposed headroom, regional failure and restore tests |
| G — mature clinical service | Independently qualified clinical workloads and stronger availability | Clinical/product/operations leads | Contracted workloads, measured SLOs, reviewed access controls and continuing incident exercises |

Roles are responsibilities to assign, not claims that a staffed team exists. Clinical launch does not depend on reaching a million public readers; public scale does not establish clinical safety. Dates and budgets follow measured estimates and owner approval.

## Workstreams

| Workstream | Next work | Dependency / acceptance |
|---|---|---|
| Product | Define real clinic, tenant boundaries, care assignment, scheduling and support scope | Approved requirements and synthetic journey acceptance |
| Frontend | Full typing, localized notices/errors, bundle budgets and accessible form recovery | Keyboard/screen-reader/zoom and English/Bangla review |
| Backend/data | Fixed operation contracts, encryption alignment, booking constraints, outbox/idempotency | Fresh/upgrade schema tests and denied cross-tenant access |
| Security | ASVS mapping, staff MFA, audit integrity, keys and dependency lifecycle | Independent security review and exercised incident controls |
| Legal | US, EU and Bangladesh applicability and current national/state requirements | Named operator, current sources, approved notices and contracts |
| Reliability | Independent probes, service indicators, error-budget policy and recovery drills | Measured rolling windows and owner-approved objectives |
| Capacity | Instrument, model, test and size public and clinical workloads separately | [Capacity plan](docs/CAPACITY-PLAN.md) acceptance report |
| Commercial | Ownership/license, vendor terms, support hours, paid infrastructure estimates | Explicit owner decisions; no automatic paid upgrades |

## Release gate for real patient data

No pilot opens until the [clinical blocker register](docs/CLINICAL-RELEASE.md), [governance checklist](docs/GOVERNANCE.md) and tested recovery plan pass. A failed security/correctness gate blocks clinical expansion even if latency is excellent. A breached availability budget prioritizes reliability work before feature releases.

## Decision log to maintain

Record workload mix, jurisdiction, data location, tenant isolation model, SLO and support hours, backup/RPO/RTO, provider contracts, budget, licensing and responsible owners. Track unresolved decisions explicitly. [Verification](docs/VERIFICATION.md) records measured outcomes; [scalability](docs/SCALABILITY.md) and [reliability](docs/RELIABILITY.md) own the design.
