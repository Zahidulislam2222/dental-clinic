# Capacity and availability design

Related plans: [1M+ capacity qualification](CAPACITY-PLAN.md), [reliability objectives](RELIABILITY.md) and [roadmap](../ROADMAP.md). They define proposed test thresholds, clinical workload arithmetic, headroom, failure drills, ownership and cost review. This document retains the foundational architecture and calculator assumptions.

## Current release

The public release serves static HTML, JavaScript, CSS and images. The sample patient journey executes in browser memory and causes no clinical database requests. This keeps a demo independent of a paused database and avoids maintaining patient data merely to demonstrate design. It does not prove the original clinical prototype is scalable.

The initial Supabase CLI inventory found the linked dental project inactive. The owner subsequently restored it through the dashboard. It has not been deleted or replaced. The public demo deliberately does not depend on that service. A free service that can pause on inactivity cannot be assumed to deliver a sustained availability commitment. See [Supabase project pausing](https://supabase.com/docs/guides/platform/free-project-pausing).

## Workload definitions

“Simultaneous users” is ambiguous. Open tabs, actively browsing readers, authenticated sessions, concurrent HTTP requests and database transactions have different resource requirements. Agree on the workload before capacity acceptance.

The following is planning arithmetic: each active user performs one action every 30 seconds, with three HTTP requests per action. At a 95% cache hit rate, five percent of those requests reach the origin. A clinical API cannot apply that public-cache assumption to personalized responses.

| Active readers | Edge requests/second | Origin requests/second at 95% hit |
|---:|---:|---:|
| 10,000 | 1,000 | 50 |
| 100,000 | 10,000 | 500 |
| 1,000,000 | 100,000 | 5,000 |

`node scripts/capacity.mjs` reproduces the table from `config/tooling.json`. The numbers are a workload model, not tested capacity. At zero cache hits, the million-reader scenario reaches 100,000 origin requests/second. If each response is 100 KB, that is approximately 10 GB/second before protocol overhead. Cold caches, launches and cache purges are meaningful failure scenarios.

Cloudflare does not cache HTML or JSON by default; eligible assets and origin directives must be checked separately. An origin `public` header alone does not prove edge HTML caching. Personalized records, authentication, exports and error responses must not enter a shared public cache. Verify cache behavior with response headers and separate cold/warm measurements. [Cloudflare cache behavior](https://developers.cloudflare.com/cache/concepts/default-cache-behavior/).

## Staged architecture

### Stage A: current demonstration

Use a CDN for eligible immutable assets and a bounded static origin. Keep hashed asset filenames, compression, explicit routes, a small health endpoint, no public write API and no database dependency. Limit the origin container’s CPU, memory and process count and bind it to loopback behind HTTPS. Retain versioned releases and an off-server archive.

Admission gate: browser flows, read-only form boundary, headers, isolated deployment, health checks and restore/parity evidence. Run a small loopback HTTP test; do not stress a shared production server. Current measurements belong in VERIFICATION.md, not in this planning table.

### Stage B: measured 10,000-reader target

Create an isolated test environment. Generate the agreed traffic mix including images, page transitions, cold requests and slow connections. Measure p50/p95/p99 latency, errors, origin CPU/memory, egress and cache hit rate. Repeat with a deployment in progress. Define pass thresholds before the test and retain generator saturation evidence; an overloaded load generator cannot establish server capacity.

If introducing real clinical workflows, split public delivery from the authenticated service immediately. Use a separately tested identity provider, staff MFA, short-lived sessions, server-side role/patient/tenant scope, bounded payloads, timeouts, idempotency and audit persistence. Cache public service descriptions; never use those caches for patient responses.

### Stage C: 100,000-reader and transactional growth

Introduce multiple origins across failure domains when measurements or availability requirements justify them. Regional ingress directs public requests to healthy origins. Clinical services remain stateless where practical; authoritative patient data stays in its approved region. Use a bounded connection pool, indexed tenant/subject queries, keyset pagination, query deadlines and per-operation concurrency limits.

Do not map one user to one database connection. PostgreSQL allocates resources based on connection limits, so indiscriminately increasing max_connections is not scaling. Benchmark the pool against actual query latency and database capacity. Replica lag must not make permissions, consent withdrawal or appointment confirmation stale. [PostgreSQL connection settings](https://www.postgresql.org/docs/current/runtime-config-connection.html).

Move notifications, large exports and noninteractive work into queues with idempotent consumers, retry budgets, backoff and a dead-letter path. A booking confirmation must be based on a committed authoritative record, not optimistic email delivery. Apply backpressure and return a controlled failure when a queue or downstream service is saturated.

### Stage D: million-reader design target

At this scale, architecture and operations need separately funded capacity testing, regional delivery, traffic engineering and a staffed response model. Test hot keys, cold cache storms, failed regions, certificate/DNS incidents, database failover, queue backlog and restoration. Partition clinical data only after tenant boundaries, access patterns, regional law and recovery behavior are understood.

A million open static tabs is not a million simultaneous clinical transactions. The latter demands a different budget, workload model and data architecture. This repository offers a migration path and reproducible small-scale tools; it does not make either workload “easy” by assertion. Kubernetes is optional and is not installed merely to make the repository look sophisticated.

## Availability objectives

A service-level indicator measures behavior; an objective defines its target; an SLA is a contractual commitment. Keep these separate. [Google SRE: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/).

Proposed public availability objective: 99% of one-minute observation intervals over a rolling 30-day window have a valid TLS response and expected health body within the agreed latency limit. Count planned maintenance as unavailable unless a contract explicitly says otherwise. A 30-day window contains 43,200 minutes; one percent is 432 minutes, or 7 hours 12 minutes. Do not mix this time-based budget with a request-success denominator.

Clinical availability needs separate indicators for login, reading a permitted record, submitting an appointment and performing an authorized write. A static health page says nothing about database correctness. Measure from at least two independent locations and investigate disagreements; do not mask a regional outage by averaging it away.

The release includes `scripts/probe.mjs`, which emits a timestamp, success and latency without credentials or a patient identifier. Scheduling it on an independent always-on monitor is an operator task. A laptop that loses power is not an availability monitor. No 30-day observation period or external monitoring SLA is claimed by this deployment.

## Recovery design

| Recovery concern | Public demo | Future clinical service |
|---|---|---|
| State | Static release + configuration | Database, uploads, keys, identity and audit state |
| Backup | Off-server release archive with SHA256 manifest | Application-consistent encrypted backups and protected key recovery |
| Restore test | Extract archive and compare all release files | Restore to isolated region-approved environment; test application reads/writes |
| RPO | No user-generated clinical state in this release | Proposed target set by client; validate against backup/replication cadence |
| RTO | Measure actual release rollback/restore | Proposed target set by clinical impact; include DNS, keys, identity and staffing |
| Failure domain | One shared origin | Multiple independently recoverable domains if funded |

Do not advertise an unmeasured recovery time. Keep the previous release available. When restoring a clinical backup, reapply deletion/consent restrictions and legal holds where required; restoring a database must not silently resurrect permissions or erased data.

## Cost and acceptance boundary

The demo reuses existing hosting and free tools. Existing hosting still has the owner’s pre-existing cost; no new paid service is necessary for this static release. Free tiers do not promise unlimited capacity, contractual uptime or health-data processing approval. Before any paid upgrade, obtain explicit approval for price, scope and recurrence.

A production proposal should budget regional hosts, database capacity, backup storage, monitoring, security support, contractual vendor options, test infrastructure and operations. Provider price changes belong in configuration/procurement records, not hardcoded business logic. Progress from one stage only when measurements show why the next investment is necessary.
