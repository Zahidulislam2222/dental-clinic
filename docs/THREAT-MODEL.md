# Threat model and release boundaries

## Assets and trust boundaries

The public release contains fictional clinic content, stock media, a synthetic Patient fixture, deployment configuration and source code. It holds no clinical account session, payment key or patient database connection. A visitor controls their browser, URL and role selector. Browser state must therefore never be trusted as production identity or permission.

Trust boundaries are: visitor → CDN; CDN/direct-origin visitor → TLS gateway; gateway → loopback static container; static files → browser; operator workstation → pinned SSH deployment; and maintainer → Git/CI. The preserved Supabase prototype is a separate, unapproved clinical surface. Its runtime controls cannot be inferred from the public static demo.

## Threat and control matrix

| Threat | Implemented control | Verification / remaining boundary |
|---|---|---|
| Accidental patient intake | Disabled form previews; no backend client; fixed fixture-only sample | Browser checks find no enabled personal-data inputs; guard regression tests |
| Unauthorized clinical backend activation | Unconditional shared release guard on every historical Edge entrypoint | Local boundary tests; remote deployment must be recorded separately |
| XSS / injected dependencies | No inline scripts/eval permission; React escaping; dependency updates; strict CSP | Header/browser checks and npm audit; style-src permits inline styles for current UI |
| Tracking and third-party disclosures | First-party image variants; no automatic fonts/maps/analytics; no-referrer | Browser request inventory; network metadata still reaches hosting/CDN |
| Client patient-data persistence | Retired storage mock; sample memory only; old app cache retirement | Source and browser tests; exported sample file deliberately downloads to user device |
| Clickjacking | frame-ancestors none and X-Frame-Options DENY | HTTP headers |
| Secret/source exposure | Static artifact allowlist, dotfile/source/config exclusions, no source maps | Negative HTTP path tests and staged/history secret scan |
| Origin/container compromise | Non-root, read-only filesystem, dropped capabilities, no-new-privileges, bounded resources, loopback-only publishing | Compose validation and actual runtime inspection |
| Resource exhaustion | Static-only request surface, GET/HEAD, request/body time limits, bounded resource allocation | Does not provide a contractual DDoS guarantee; no large shared-origin load test |
| Supply-chain regression | Lockfile, dependency audit, gitleaks, typed new boundary, policy tests and lint | Review registry updates and independent review before production |
| Unsafe deployment/rollback | Pre-edit drift snapshot, versioned release, exact hashes, off-server archive | Verify restore and record release before advertising completion |
| Misleading compliance claims | Research-based limits, clinical blocker register, measured vs target separation | No certifications, million-user claim or observed monthly uptime without evidence |

## Security assumptions and residual risks

TLS gateway administration is shared with other applications. The VPS remains a single failure domain, and the existing infrastructure permits origin web access. Cloudflare does not replace origin authorization. This demo has no sensitive API to authenticate, but a future clinical service must enforce authorization even when the CDN is bypassed.

The sample audit list is temporary and editable by a browser owner. It is an illustration, not a protected audit trail. The sample staff policy is intentionally simplified and does not model care assignment, tenant membership or emergency access. Those are production release blockers.

Original clinical modules and migrations remain readable for design review, with known defects documented. Their presence is not shipped clinical functionality. A source scanner score from `compliance/` is a historical pattern check; it does not measure legal compliance, attack resistance or runtime correctness.

## Incident and change procedure

For a suspected compromise: preserve evidence privately; disable the affected route/service using a reviewed local change; identify affected assets and versions; compare deployment hashes; rotate exposed credentials through approved stores; assess legal notification obligations; restore a verified release; and add a defect-log entry identifying the missed gate. Do not publish secrets or patient content in issues or commit messages.

Before changes: update the project checkpoint, research the approach, inventory configurable values and write acceptance tests. After changes: run relevant gates, record before/after evidence, update the dossier first, and derive public statements from verified results.

Reference framework: [OWASP Application Security Verification Standard](https://owasp.github.io/www-project-application-security-verification-standard/). The project borrows review concepts; it does not claim full ASVS verification.
