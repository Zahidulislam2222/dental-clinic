# Operations and reliability

## Release contents

After `npm run build`, `node scripts/build-deploy.mjs` generates the Compose file, nginx configuration, security-header include and gateway site file from `deploy/settings.json` and `public/_headers`. A release contains only:

- `dist/` (the built site)
- `compose.yaml`, `nginx.conf`, `security-headers.conf`
- the gateway site file for this project

Source code, environment files, source maps, SQL and private notes never go to the server.

The container runs a pinned nginx image as a non-root user, with a read-only filesystem, all Linux capabilities dropped, `no-new-privileges`, CPU, memory and process limits, and a port bound to loopback only.

## Deployment

1. **Check for drift.** Snapshot the files on the server and compare them with the local source. If the server has newer changes, reconcile them locally first.
2. **Build a versioned release** locally, with a SHA-256 manifest and an off-server archive.
3. **Upload** only the allowlisted files to a new release directory.
4. **Validate** the Compose and nginx configuration, start the container and check its health endpoint over loopback.
5. **Update the gateway** for this project only, validate the full gateway configuration, then reload.
6. **Update DNS** for this project's record only if needed, verify the origin certificate directly using the hostname (SNI), then check public TLS, page content, and security and cache headers.
7. **Confirm parity**: every deployed file's hash must match the local manifest.

`npm run predeploy` runs the full check suite and must pass before any deployment.

## Rollback

The previous release and its manifest are kept on the server. To roll back, start the previous release with its own Compose file and repeat the verification steps. Restore the gateway or DNS settings only if they changed. Never remove other projects' containers or volumes, and never use a global prune or `down -v` as part of a rollback.

The site has no persistent user data, so restoring the previous release restores the whole service. A future clinical release will also need database, upload, key and audit-log recovery (see [Recovery objectives](#recovery-objectives)).

## Monitoring

`scripts/probe.mjs` checks a URL for a valid TLS certificate, the expected response body and response time, and prints a JSON result:

```bash
node scripts/probe.mjs https://dental.zahidul-islam.com/healthz
```

It exits non-zero on failure and never prints credentials. It is a one-shot tool: scheduled runs from independent locations, result storage, dashboards, alerting and an on-call owner do not exist yet, and are needed before any availability figure can be reported. A probe running on the same server, or on a laptop, does not count.

## Availability objectives

**Objective for the public site: 99% availability over a rolling 30-day window.** This is an internal target (SLO), not a contractual guarantee (SLA), and no 30-day measurement has been recorded yet.

| Target | Allowed downtime per 30 days | Intended use |
|---|---|---|
| 99% | 7 h 12 min | Current public site |
| 99.9% | 43 min | A staffed service with redundancy |
| 99.95% | 22 min | After measured multi-region resilience |

**Proposed measurement.** One observation per minute from at least two regions. A minute counts as good only if every required probe passes: valid TLS, expected body and response within the latency budget. Missing data counts as unavailable. Planned maintenance counts against the budget. Time-based and request-based indicators are reported separately, never mixed.

**Clinical indicators** will be tracked separately for login, reading a permitted record and committing an appointment, because a healthy static page says nothing about the database.

**Proposed messaging service indicators:** share of accepted events processed within 5 minutes, share of opt-outs applied in HighLevel within 15 minutes, and age of the oldest pending outbox operation. Its metrics endpoint already exports backlog age and failed, waiting and parked counts.

### Alerting and error budget (proposed)

No paging or on-call rotation exists today, and no support SLA is offered.

- Page the on-call owner when a critical journey fails repeatedly from independent probes, or when security or data integrity is at risk.
- Use multi-window burn-rate alerts so short blips do not page and sustained failures are not missed.
- At 50% of the error budget, review risks and capacity. When the budget is exhausted, pause feature releases until reliability work is done.

The approach follows the [Google SRE workbook](https://sre.google/workbook/implementing-slos/) and its [error-budget policy](https://sre.google/workbook/error-budget-policy/).

## Recovery objectives

| Service | Recovery time (RTO) | Data loss limit (RPO) | Proof required |
|---|---|---|---|
| Public site | 1 hour | Last released build | Restore the archived release; verify content, TLS and hashes |
| Clinical records | 1 hour | 15 minutes | Backups or replication, isolated restore, integrity and access tests |
| Jobs and notifications | 4 hours | Replay from the committed outbox | Duplicate suppression and backlog recovery |
| Identity, keys and audit | Set by clinical risk assessment | Set by legal and security needs | Key recovery, revoked-access and audit continuity tests |

The clinical figures are targets for a future release. Backups must cover the database, uploads, identity configuration, audit records and decryption keys, with an independent encrypted copy. A restore must re-apply deletions, consent withdrawals and legal holds before the data is served again. Restores should be rehearsed before launch, then quarterly and after major storage changes.

## Publishing to GitHub

Stage an explicit list of public files, scan the history, tree and staged diff with gitleaks, and push normally (never force-push). After pushing, confirm the remote commit matches the reviewed local commit. Pushing does not deploy the site or run the manual CI workflow.

## Load testing

`scripts/load-local.mjs` refuses any target other than loopback. Larger tests belong in an isolated environment with agreed limits; never load-test the shared production server. See [Scalability](SCALABILITY.md).
