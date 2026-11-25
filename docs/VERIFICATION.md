# Verification report

This report records the checks run against each release and what they cover. Commands are described in the [development guide](DEVELOPMENT.md).

## Current checks (November 2026)

| Check | Result |
|---|---|
| Unit and regression tests (`npm test`) | 20 of 20 passing |
| Type check, lint, production build | Passing |
| Documentation links | 28 Markdown files, 125 internal links checked by script plus anchors checked in review; none broken |
| Secret scanning (gitleaks, staged changes) | No leaks found |
| Independent review of the documentation rewrite | Ship with fixes; all findings addressed before publication |

## Documentation publication (September 2026)

| Check | Result |
|---|---|
| Unit and regression tests | 15 of 15 passing (the suite has since grown to 20) |
| Type check and lint | Passing for the configured scope |
| Production build | Passing on Node 24.20 |
| Browser tests (Playwright) | 24 of 24 passing against a local production preview |
| Dependency audit | No known vulnerabilities at the time of the check |
| Secret scanning (gitleaks) | No leaks found in Git history, the published tree or the staged diff |
| Static analysis (semgrep) | 23 security rules across 107 files; no findings |
| Documentation links | 173 internal links across 45 files; none broken |
| Independent review | Approved for publication, no blocking issues |

## Release verification (September 2026)

### Browser

The Playwright suite checks 20 static routes, confirms application pages make no third-party requests, confirms intake forms are disabled, and exercises the patient journey: role denial, legal hold, held and completed erasure, reset, export and protected-route redirects. Consent and cancellation are covered by unit tests. It passed 24 of 24 against both the local preview and the public URL. Two axe accessibility scans on the main content of the new pages found no violations; the suite also automates a 390 px mobile layout check and keyboard access to the skip link. A full-site WCAG audit has not been done.

### Backend guard

All 11 deployed Edge Functions returned HTTP 503 with the expected body, and the deployed source matched the repository at that time by SHA-256 (see [Clinical release](CLINICAL-RELEASE.md#current-state) for a later change that was not redeployed). Only function code was deployed: no SQL, migrations or data changes.

### Deployment

- The container was inspected at runtime: user 101:101, read-only root filesystem, all capabilities dropped, `no-new-privileges`, 128 MiB memory, 0.5 CPU and 64 processes, port not reachable externally.
- Each release has 138 allowlisted files; every file's hash matched between local and server, and the off-server archive was extracted and checked against its SHA-256 manifest.
- Five unrelated gateway site files on the shared server kept their original hashes.
- Public HTTP checks passed 21 of 21 conditions (TLS, content, security and cache headers).
- Recreating the container returned it to a healthy state in 37 seconds.

Two issues came up during this release. TLS failed briefly while the new DNS record propagated, and recovered once the certificate was issued. An nginx location rule prevented immutable caching on three entry assets; it was fixed and is recorded in the [defect log](../DEFECT-LOG.md).

### Capacity

A local benchmark against the Vite preview (20 clients, 400 requests) completed with no failures at about 1,735 requests per second and a p95 latency of 21.5 ms. This is a small warm-cache test on one machine. It does not measure production capacity, CDN behavior or clinical throughput, and must not be extrapolated. The larger figures in [Scalability](SCALABILITY.md) are models, and no 30-day availability measurement has been taken.

### Secrets and configuration

No secrets were found in the published source or Git history. Credentials, environment files and private notes are excluded by `.gitignore` and checked by `scripts/security-check.mjs`. Settings for the site, deployment and tests each have a single owner file. The disabled clinical functions still contain scattered provider settings; consolidating them is a [clinical release](CLINICAL-RELEASE.md) blocker.

### Review

The September release's independent code review was deferred by the owner, so no approval verdict exists for it; the later documentation publication was reviewed and approved. Of the release's 14 acceptance criteria, 10 were met, 3 (clinical authorization, schema and configuration) were only partly met because the clinical backend remains disabled, and 1 (independent review) was deferred.

## Not yet verified

- Clinical database behavior: row-level security, encrypted fields, migrations
- Third-party integrations for payments, email and SMS
- Full-site WCAG 2.2 AA conformance
- Capacity beyond the local benchmark
- Measured 30-day availability
- An independent review of the September release and of the clinical backend code
