# Security policy

## Scope

This policy covers the public website, its deployment configuration and the clinical backend (early build) in `supabase/`. The clinical backend is disabled and has not been approved for real patient data; its known issues are listed in [Clinical release](docs/CLINICAL-RELEASE.md#engineering-blockers).

## Reporting a vulnerability

Please report vulnerabilities privately, not in a public issue.

1. If the repository shows **Security → Report a vulnerability**, use it.
2. Otherwise, open an issue asking for a private contact, without any technical details, and wait for a maintainer to reply.

Include the affected commit or URL, the component, the impact and minimal reproduction steps. Never include real personal data, tokens or credentials. Test only against your own local copy.

This is a portfolio project maintained by one person: there is no bug bounty and no guaranteed response time, but every report is read.

## In place today

- Strict Content Security Policy and hardened HTTP headers (`public/_headers`).
- No service credentials in the browser; secrets kept out of Git.
- Secret scanning (gitleaks), static analysis (semgrep) and dependency audits before every publication.
- A hardened, non-root, read-only container for the public site.
- A release guard that keeps every clinical endpoint disabled.

## Required before any clinical release

- Server-side identity, MFA and authorization on every request, with tenant and patient scope.
- Validated input, bounded requests and atomic rate limits.
- Durable, protected audit logging.

Clinical controls will be mapped to the [OWASP Application Security Verification Standard](https://github.com/OWASP/ASVS). See the [threat model](docs/THREAT-MODEL.md) for trust boundaries and controls, and the [incident response template](docs/templates/OPERATING-POLICIES.md#6-incident-response).
