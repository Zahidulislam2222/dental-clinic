# Release verification and limitations

## Evidence scope

This is a synthetic portfolio release, not a clinical production approval. Verification was performed in September 2026. Independent fresh-context review is deferred to a separate session at the owner's request.

| Gate | Result |
|---|---|
| Automated regression tests | 15/15 pass: access decisions, consent, hold/erasure, sample export, runtime boundary and source regressions |
| Type check | Pass; strict scope covers new runtime/policy/guard modules, not all historical JSX or Deno functions |
| Lint | Pass, zero errors/warnings in configured application/tooling scope |
| Build | Pass with locked Node/Vite toolchain; removed obsolete eval-producing animation dependency |
| Dependency audit | Zero reported npm vulnerabilities in the final lockfile audit; point-in-time evidence |
| Gitleaks | Zero findings in baseline history and scanned working source; final staged scan also passed with zero findings |
| Security edit hook | Exit 0 for application, tooling, automated tests and function sources |
| Semgrep | 23 security-audit rules, 106 scanned targets, zero findings; not a penetration test |
| Bandit | Not applicable to shipped code: no Python application source; private operator tooling is outside the shipped application |
| Browser | 24/24 local checks and 24/24 explicit-public-URL checks pass |
| Accessibility | Two axe checks on new main-content surfaces pass; mobile width/keyboard behavior exercised; full site conformance unverified |
| Backend containment | 11/11 deployed endpoints return HTTP 503 with expected guard response; all 16 downloaded source files match local SHA256 |
| Database preservation | Only Edge Function code was deployed; no SQL, migration, record deletion or database mutation command was executed |
| Independent review | Deferred by owner; no approval verdict exists |

The public browser suite checks 20 routes, no automatic third-party requests from application pages, disabled intake inputs, the synthetic patient workflow, sample export, denied operations, held erasure, reset and protected-route redirection. Cloudflare/network operational metadata remains outside the application's no-tracking claim.

## Deployment and recovery

The origin runs a pinned nginx image as a non-root user with a read-only filesystem, dropped capabilities, no-new-privileges, loopback binding and explicit CPU/memory/process limits. DNS and gateway publication reused existing resources. No new paid plan, server or domain was purchased.

Before changes, legacy HTML and six entry assets matched the local baseline, and 15 recovered backend files matched Git. Versioned static archives are kept off-server and extraction is checked against SHA256 manifests. Each staged release has 138 allowlisted files, with local/remote hashes checked. Five unrelated gateway site files were preserved.

Public TLS initially failed while the new DNS record propagated; certificate issuance retried and public HTTPS recovered. HTTP checks found an nginx location-precedence error that prevented immutable caching on three entry assets. The redundant extension regex was removed locally and a new versioned release prepared. The corrected release passed all 138 file hashes. Direct-origin and public TLS were verified. Container recreation reached healthy status and the expected response in 37.15 seconds; this measures that command sequence, not a disaster-recovery guarantee. Actual runtime inspection verified user 101:101, read-only root, all capabilities dropped, no-new-privileges, 128 MiB RAM, 0.5 CPU and 64 processes. The container port was unreachable externally and five unrelated gateway files retained their hashes. Final public HTTP checks passed 21/21 conditions; see the retained release evidence.

## Capacity evidence

A bounded localhost Vite HTTP microbenchmark used 20 clients and 400 requests: zero failures, about 1,735 requests/second, p95 21.51 ms over about 0.231 seconds. This tiny warm local sample does not establish production capacity, endurance, CDN behavior or clinical transaction throughput. It must not be extrapolated to 10,000 or one million simultaneous users.

The workload calculator models 10,000 / 100,000 / 1,000,000 active readers, giving 1,000 / 10,000 / 100,000 edge requests per second under its stated assumptions. These are calculations only. No large-scale production load test or 30-day availability measurement was performed. The 99% target permits 432 unavailable minutes per 30-day window; there is no contractual SLA.

## Configuration and secret audit

Real secrets were present in private local configuration and recovery sources; they were kept outside the public artifact. No real secret was detected in scanned shipped source or Git history. The private credentials, dossier, environment files and memory directory are ignored. Credential recovery and any required rotations remain private operator responsibilities.

New runtime origin/mode and inactivity settings, sample workflow data, privacy disclosures, image mapping, deployment image/ports/limits and test/load assumptions have central owners. Provider clients cannot be enabled through environment flags in the public release. Protocol syntax, HTTP status codes and static routing syntax remain fixed intentionally.

This is not a complete refactor of every historical module: dormant clinical Deno environment reads, provider URLs, timeouts, encryption/role contracts and older presentation copy still require consolidation before clinical activation. The scoped type check does not prove these modules correct. See CLINICAL-RELEASE.md for the mandatory repair gates.

## Acceptance accounting

Of the original 14 draft criteria, 10 are addressed by this synthetic release (1, 2, 6–11, 13, 14); document synchronization is recorded in the final handoff. Criteria 3–5 are only partially satisfied: the demo is isolated, but full clinical authorization/schema/configuration remediation remains blocked from production use. Criterion 12 is explicitly deferred to a separate review session. A future reviewer must assess the final diff against these limitations; do not report 14/14 or production readiness.
