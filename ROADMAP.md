# Roadmap

Everyday Dental grows in stages, from today's public site on sample data to a regional clinical platform. Each stage starts only when the previous one's exit criteria are met with evidence. Stages are ordered by dependency; they carry no fixed dates.

## Stages

| Stage | Goal | Exit criteria |
|---|---|---|
| **A. Public foundation** ✅ | Public site, sample patient journey, disabled clinical backend, tests and documentation | Reviewed source, published repository, reproducible verification |
| **B. Clinical correctness** | Fix the clinical backend: typed settings, schema, tenant and patient scope, consent, payments, audit | Every [clinical blocker](docs/CLINICAL-RELEASE.md#engineering-blockers) closed with migration, RLS, integration and denial tests |
| **C. Controlled pilot** | One clinic, one jurisdiction, with support and recovery in place | Legal and vendor approval, staff training, rehearsed restore, limited pilot |
| **D. 10,000 readers** | Measured public capacity with performance budgets and monitoring | Agreed traffic mix passes cold, warm, burst and sustained tests |
| **E. 100,000 readers** | Multiple origins, pooled database, background jobs, tenant limits | Failure-domain drill; queue and database saturation results |
| **F. 1M+ readers** | Regional delivery with rehearsed failover | Distributed load test at 1M plus 25% headroom; regional failure and restore tests |
| **G. Mature clinical service** | Independently qualified clinical workloads and stronger availability | Measured SLOs, reviewed access controls, regular incident exercises |

Clinical readiness and public scale are separate tracks: a clinic pilot does not need a million readers, and serving a million readers proves nothing about clinical safety.

## Workstreams

| Workstream | Next steps |
|---|---|
| Product | Define the real clinic, tenant boundaries, care assignment, scheduling and support scope |
| Frontend | Full TypeScript coverage, localized errors, bundle budgets, accessible form recovery, English and Bangla review |
| Backend and data | Fixed operation contracts, encryption alignment, booking constraints, outbox and idempotency |
| Security | OWASP ASVS mapping, staff MFA, audit integrity, key management, independent review |
| Legal | US, EU and Bangladesh applicability for a named operator; notices and contracts |
| Reliability | Independent probes, service indicators, error-budget policy, recovery drills |
| Capacity | Instrument, model and test public and clinical workloads separately ([plan](docs/SCALABILITY.md)) |
| Patient messaging | Publish decision, real sender identity and postal address, A2P 10DLC registration, CRM BAA, deliverability monitoring, multi-clinic support ([details](docs/PATIENT-MESSAGING.md#before-real-patients)) |
| Commercial | License, vendor terms, support hours and infrastructure budget |

## Release rule for real patient data

No pilot opens until the [clinical release](docs/CLINICAL-RELEASE.md) sign-off is complete and a restore has been rehearsed. A failed security or correctness check blocks clinical expansion regardless of performance. An exhausted availability budget puts reliability work ahead of new features.
