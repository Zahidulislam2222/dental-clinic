# Scalability

This document defines how the platform is expected to grow from today's static site to a regional clinical service, and how each stage is proven before the next begins. The large-scale figures below are models and targets; the only measured result so far is a small local benchmark (see [Verification](VERIFICATION.md#capacity)).

## Workload model

"Simultaneous users" can mean open tabs, active readers, signed-in sessions, in-flight requests or database transactions, and each needs very different resources. Capacity is therefore always stated against a defined workload.

**Public site model.** Each active reader performs one action every 30 seconds, and each action makes three HTTP requests. Cached responses are served by the CDN; misses reach the origin.

- Edge requests per second = readers × 3 ÷ 30
- Origin requests per second = edge requests × (1 − cache hit ratio)

| Active readers | Edge requests/s | Origin requests/s at 95% cache hits | Origin requests/s with no cache |
|---:|---:|---:|---:|
| 10,000 | 1,000 | 50 | 1,000 |
| 100,000 | 10,000 | 500 | 10,000 |
| 1,000,000 | 100,000 | 5,000 | 100,000 |
| 1,250,000 (25% headroom) | 125,000 | 6,250 | 125,000 |

`node scripts/capacity.mjs` reproduces the first three rows from `config/tooling.json`. At an average response of 100 KB, 100,000 requests per second is about 10 GB/s, so cold caches, launches and cache purges are critical scenarios. The 95% hit ratio must be measured per route; Cloudflare, for example, does not cache HTML by default.

**Clinical model.** Personalized responses are never cached, so clinical capacity is modeled separately. As an illustration, 1 million active clinical users making one API call every 30 seconds generate about 33,000 requests per second; at an 80/20 read/write mix that is roughly 26,700 reads and 6,700 writes per second, before audit writes, internal queries and retries. Real sizing waits for agreed workflows.

## Staged architecture

| Stage | Target | What changes | Entry condition |
|---|---|---|---|
| A. Current | Public site | CDN for hashed assets, bounded static origin, no database, versioned releases | Browser tests, headers, health checks and parity evidence |
| B. 10,000 readers | Measured public capacity | Isolated test environment; clinical service split from public delivery as soon as real workflows start | Agreed traffic mix passes cold, warm, burst and slow-network tests |
| C. 100,000 readers | Multi-origin resilience | Origins in separate failure domains, pooled database connections, indexed tenant queries, background queues with backpressure | Failure-domain drill and database saturation results |
| D. 1M+ readers | Regional delivery | Regional routing, rehearsed failover, staffed operations; clinical data partitioned only once access patterns are known | Distributed load test at 1M plus 25% headroom, regional failure and restore tests |

Design rules that apply at every stage:

- **One user is not one database connection.** Pool sizes come from measured database capacity, not from raising `max_connections`.
- **Replica lag must never make permissions, consent withdrawals or appointment confirmations stale.**
- **Queues need limits.** Notifications and exports run in idempotent workers with retry budgets, backoff and a dead-letter path. When a queue is full, the system returns a controlled error.
- **Kubernetes, microservices and multi-region writes are options, not goals.** They are adopted only when measurements justify them.

## Capacity test plan

Each stage is accepted only after a test in isolated infrastructure with synthetic data and approved spending limits.

**Profile:** 10-minute ramp, 60 minutes at target load, a 10-minute burst at twice the arrival rate, then a 4-hour soak.

| Dimension | Pass criterion |
|---|---|
| Public pages | p95 ≤ 500 ms and p99 ≤ 1.5 s in every test region |
| Clinical reads | p95 ≤ 500 ms and p99 ≤ 1.5 s per operation |
| Clinical writes | p95 ≤ 1 s and p99 ≤ 2 s to a committed result |
| Errors | Under 0.1% of valid requests |
| Correctness | Zero cross-tenant disclosures, duplicate bookings or lost acknowledged writes |
| Resources | No unbounded memory or queue growth; 30% steady-state headroom |
| Recovery | Queues drain and latency returns to baseline within the agreed window |
| Test validity | Offered vs. achieved load, dropped iterations and load-generator saturation recorded |

**Failure scenarios:** cold cache and cache purge, hot content or tenant, retry storms, rolling release under load, expired-token bursts, database pool saturation, queue backlog, failed workers, region loss, DNS or TLS failure, and restore.

**Stage report:** commit and configuration, workload assumptions, environment, offered and achieved traffic, latency and errors per region, correctness results, bottlenecks, recovery behavior, cost estimate and sign-off.

## Cost

The current site runs on existing hosting with no added services, and deliberately does not depend on the Supabase project, which can pause after inactivity on the free plan ([Supabase project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)). A production proposal must price CDN requests and egress, origins, database compute and storage, replicas, backups, monitoring and log retention, security support, load generators and on-call staffing from current provider quotes. Free tiers are not a capacity or uptime commitment, and no paid resource is provisioned without explicit approval.

References: [PostgreSQL connection settings](https://www.postgresql.org/docs/current/runtime-config-connection.html) · [Cloudflare default cache behavior](https://developers.cloudflare.com/cache/concepts/default-cache-behavior/) · [Supabase production checklist](https://supabase.com/docs/guides/deployment/going-into-prod)
