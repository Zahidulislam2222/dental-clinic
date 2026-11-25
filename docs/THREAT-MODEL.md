# Threat model

## Assets and trust boundaries

The public release contains clinic content, stock photography, one sample patient record, deployment configuration and source code. It holds no user sessions, payment keys or database connections. Everything in the browser, including the role selector on `/experience`, is controlled by the visitor and is never treated as identity or permission.

Trust boundaries:

1. Visitor → CDN
2. CDN (or a direct visitor) → TLS gateway
3. Gateway → static container on loopback
4. Static files → visitor's browser
5. Maintainer workstation → server (pinned SSH)
6. Maintainer → GitHub

The Supabase clinical backend is a separate surface, disabled at every entry point.

## Threats and controls

| Threat | Control | How it is verified |
|---|---|---|
| Real patient data entered on the site | Intake forms are read-only previews; no backend client exists; the journey uses one fixed sample record | Browser tests confirm no enabled personal-data inputs |
| Clinical backend switched on by accident | Every Edge Function returns 503 before any logic; no environment flag can bypass it | Unit tests on the guard; live check of all 11 endpoints |
| Cross-site scripting and injected scripts | Strict Content Security Policy with no inline scripts or `eval`; React output escaping; dependency audits | Header and browser tests; `npm audit`. Inline styles are still permitted for the current UI |
| Tracking and third-party data leaks | No analytics, external fonts, maps or hotlinked media; `no-referrer` policy | Browser test records every network request. Network metadata still reaches the host and CDN |
| Patient data persisted in the browser | Sample data lives in memory only; old storage code and service-worker caches retired | Source and browser tests. The sample export downloads to the visitor's device by design |
| Clickjacking | `frame-ancestors 'none'` and `X-Frame-Options: DENY` | HTTP header checks |
| Source or secret exposure | Release allowlist; no source maps, dotfiles or config in the web root | Negative HTTP path tests; gitleaks on history, tree and staged changes |
| Container compromise | Non-root user, read-only filesystem, dropped capabilities, `no-new-privileges`, resource limits, loopback binding | Runtime inspection of the running container |
| Resource exhaustion | Static GET/HEAD-only surface, request and body time limits, bounded resources | No DDoS guarantee; no large load test on the shared server |
| Supply-chain regression | Lockfile, dependency audit, secret scanning, typed guard, policy tests, lint | Independent review before production |
| Unsafe deployment or rollback | Drift snapshot, versioned releases, file hashes, off-server archive | Restore and parity checks recorded per release |
| Misleading compliance claims | No certification badges; current and planned capabilities kept separate | Documentation review before each publication |

## Assumptions and residual risks

- **Shared infrastructure.** The TLS gateway and server host other applications, and the server is a single failure domain. The origin is reachable directly, so a future clinical service must enforce authorization even if the CDN is bypassed.
- **Sample audit log.** The activity list on `/experience` is a temporary, editable illustration, not a protected audit trail.
- **Simplified access model.** The sample policy does not model care assignment, tenant membership or emergency access. These are required before a clinical release.
- **Prototype code.** The clinical modules and migrations remain in the repository for design review, with their known defects listed in [Clinical release](CLINICAL-RELEASE.md). They are not running functionality.
- **Pattern scanner.** The score from `compliance/` counts source patterns. It does not measure legal compliance, attack resistance or runtime behavior.

## Incident procedure

For a suspected compromise:

1. Preserve evidence privately.
2. Disable the affected route or service with a reviewed change.
3. Identify affected assets and versions; compare deployed file hashes.
4. Rotate any exposed credentials.
5. Assess legal notification duties (see [legal research](LEGAL-RESEARCH.md)).
6. Restore a verified release.
7. Add an entry to the [defect log](../DEFECT-LOG.md) naming the check that should have caught it.

Never put secrets or patient details in issues or commit messages.

The review approach borrows from the [OWASP Application Security Verification Standard](https://owasp.github.io/www-project-application-security-verification-standard/); the project does not claim full ASVS verification.
