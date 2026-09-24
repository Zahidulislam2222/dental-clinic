# Availability, monitoring and recovery objectives

## Baseline objective

**Proposed public SLO: 99% availability over a rolling 30-day window.** This is a target, not a contractual SLA or a measured history. Record objectives separately for public content, clinical authentication, permitted record reads and committed appointment writes. A static health check cannot prove a database transaction worked.

| Time-based target | Unavailable time per 30 days | Intended use |
|---|---|---|
| 99% | 432 minutes = 7 h 12 min | Initial public objective |
| 99.9% | 43.2 minutes | Future staffed/redundant service candidate |
| 99.95% | 21.6 minutes | Stronger candidate after measured resilience |

99% can permit substantial downtime for a clinic; a real clinical service must select a target from patient impact and support commitments. Stronger targets are roadmap decisions, not automatic guarantees. Definitions follow [Google SRE](https://sre.google/workbook/implementing-slos/).

## Measurement contract

Proposed time-based SLI: one observation each minute from at least two independent regions; TLS, expected body and response within the configured latency budget must pass. Maintain regional results. Count a minute good only when all designated required probes pass; treat missing observations as unavailable/unknown conservatively and report coverage separately. Count planned maintenance in the budget. Changes to scope or probe locations require a recorded review, not retroactive removal of outages.

Availability = good observed intervals ÷ all scheduled intervals. Keep request-based indicators separate: successful valid operations ÷ all eligible operations, with per-operation latency and correctness checks. Do not mix interval and request denominators. Record failures at the user boundary as well as origin/database signals.

The repository's probe is a one-shot tool. Scheduling, multiple locations, durable storage, dashboards and paging are future operating work. A local laptop or a server probing itself is not independent evidence.

## Alerting and error-budget policy

Proposed policy: page the on-call owner when a critical user journey fails repeatedly from independent probes or security/correctness is compromised. Use multi-window burn-rate alerts so brief noise does not hide sustained failures. At 50% budget consumption, review risks and capacity; at exhaustion, pause discretionary releases until recovery work and review justify resuming. Tune thresholds against actual traffic before adopting them. [Google's error-budget policy](https://sre.google/workbook/error-budget-policy/) provides the operating pattern.

A production contract must name service scope, support hours, exclusions, reporting, escalation and any credits. No response-time or support SLA is currently offered by this repository.

## Recovery proposals

| Service | Proposed RTO | Proposed RPO | Required evidence |
|---|---|---|---|
| Public static release | 1 hour | Last reviewed artifact | Restore immutable artifact; verify content, TLS and hashes |
| Clinical transactional records | 1 hour | 15 minutes | Funded backup/replication, isolated restore, integrity and access tests |
| Jobs and notifications | 4 hours | Replay from committed outbox | Deduplication, backlog recovery and delivery reconciliation |
| Identity, keys and audits | Set from clinical risk assessment | Set from legal/security needs | Key recovery, revoked access and audit continuity |

These are planning candidates requiring owner approval and demonstrated tooling. No provider backup/PITR plan is assumed to be enabled. RPO does not authorize silently losing an acknowledged appointment: reconcile from durable records and follow an approved incident/manual workflow if a recovery gap occurs.

Backups must cover database, uploads, identity configuration, audit state and decryption-key recovery. Keep an independent protected copy, test restoration, and reapply holds/deletion/withdrawal restrictions. Run a restore before clinical launch, then proposed quarterly drills and after material storage changes. Record actual RTO/RPO and failure-domain results. See [operations](OPERATIONS.md) and [continuity](policies/BUSINESS_CONTINUITY_PLAN.md).
