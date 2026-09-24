# Capacity qualification: 10k to 1M+ simultaneous users

This is a proposed engineering qualification plan. No large-scale load run is represented as completed. The existing [calculator](../scripts/capacity.mjs) and [scalability design](SCALABILITY.md) explain the current public-reader model.

## Define the workload before sizing

Open tabs, active sessions, in-flight requests and database transactions are different quantities. For the public planning model, each active reader performs one action every 30 seconds and each action generates three HTTP requests:

- Edge requests/second = active readers × requests per action ÷ seconds between actions.
- Origin requests/second = edge requests/second × (1 − measured cache-hit ratio).
- Transfer bytes/second = requests/second × measured mean response bytes.
- Average requests in flight ≈ throughput × mean response time, only under a stable measured workload.

| Active readers | Edge requests/s | Origin at 95% hits | Origin with no cache |
|---:|---:|---:|---:|
| 10,000 | 1,000 | 50 | 1,000 |
| 100,000 | 10,000 | 500 | 10,000 |
| 1,000,000 | 100,000 | 5,000 | 100,000 |
| 1,250,000 | 125,000 | 6,250 | 125,000 |

The first three rows are reproduced by `node scripts/capacity.mjs`; the fourth applies the same assumptions as a **proposed 25% headroom target**. A 95% hit ratio must be measured by route/content type. At 100 KB average response size, 100k requests/s means approximately 10 GB/s before overhead. Assets and navigation mixes therefore materially affect cost.

## Clinical capacity is a separate model

Do not put personalized responses in a shared cache. Define active clinical users, actions/user/minute, API calls/action, read/write ratio, rows/query, transactions/write, authentication refreshes, attachment sizes and export frequency. Budget separate auth, database, object-storage, queue and vendor limits.

Illustrative assumption: 1M active clinical users making one API call every 30 seconds produce about 33,333 API requests/s. An 80/20 read/write mix would yield about 26,667 reads/s and 6,667 writes/s **before** internal queries, audit writes and retries. This arithmetic is not a selected production workload or proof that the existing backend can support it. Agree on real workflows before sizing.

Measure transaction latency, connection wait, locks/deadlocks, replica lag, hot tenants and audit volume. Bound pool size from measured database capacity; one user must not imply one database connection. Use indexes and keyset pagination, enforce transaction constraints, and partition only after queries and tenant boundaries justify it.

## Proposed test profile

At each stage, use isolated infrastructure, synthetic records and approved spending/traffic limits. Define regions, devices, network conditions and route weights before the run. Suggested starting profile: 10-minute ramp, 60-minute steady load, a 10-minute 2× arrival-rate burst, then a 4-hour soak at the target. These durations are acceptance proposals, not implemented load-script defaults.

| Dimension | Proposed pass gate |
|---|---|
| Public HTTP | p95 ≤ 500 ms and p99 ≤ 1.5 s in each agreed test region |
| Clinical reads | p95 ≤ 500 ms and p99 ≤ 1.5 s, measured by operation |
| Clinical writes | p95 ≤ 1 s and p99 ≤ 2 s through committed result |
| Unexpected errors | < 0.1% of valid in-scope requests; count overload rejections against admitted capacity |
| Correctness | Zero cross-tenant disclosures, duplicate committed bookings or lost acknowledged writes |
| Resources | No unbounded memory/queue growth; proposed 30% steady-state resource headroom |
| Recovery | Queue drains and latency returns to baseline within the agreed recovery window |
| Generator validity | Offered/achieved load, dropped iterations, generator CPU/network and clock sync recorded |

These latency/error thresholds must be approved for actual workflows and recorded before testing. Intentional authorization failures are separate negative tests; do not remove legitimate-user failures from the success denominator. Read/write counts alone do not establish user-visible performance.

## Failure and overload tests

Exercise cold caches, cache purge, hot content/tenant, retry storms, rolling release, expired token bursts, database pool saturation, queue backlog, failed workers, region loss, DNS/TLS failure and restore. Prove backpressure, idempotency, bounded retries with jitter and recovery of queued work. Verify privacy after cache changes and permission withdrawal during replica lag.

Use public immutable caching, healthy independent origins and regional routing for public growth. For clinical growth, keep authoritative writes in an approved data region, use stateless APIs and bounded jobs, and define consistency/replication choices explicitly. Kubernetes and multi-region writes are optional architecture decisions, not prerequisites by name.

## Cost model and decision record

Estimate monthly/request-based cost for CDN requests and egress, origins, database compute/IO/storage, replicas/pooling, backups, object storage, queue jobs, monitoring/log retention, security support, load generators and on-call staffing. Price from current provider quotes; record currency, tax, region, included quota, overage and recurrence. This plan does not provision resources or authorize purchases.

A stage report must contain commit/configuration, workload assumptions, test environment, offered/achieved traffic, per-region latency/errors, correctness results, bottleneck traces, failure recovery, cost estimate and approval. Store raw sensitive traces privately; publish scrubbed aggregates. Advance only after a reviewed pass. See [Supabase production guidance](https://supabase.com/docs/guides/deployment/going-into-prod) for staging load testing and [PostgreSQL connection settings](https://www.postgresql.org/docs/current/runtime-config-connection.html) for connection resource considerations.
