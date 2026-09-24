# Testing and verification

Run from the repository root using the lockfile and Node 24+. [Verification](VERIFICATION.md) records dated results; commands alone are not evidence of a pass.

| Command | Scope |
|---|---|
| npm ci | Install exact lockfile dependencies |
| npm test | Node regression tests: sample policy, capacity and release guard |
| npm run typecheck | Strict runtime/policy/shared-guard scope from tsconfig.json |
| npm run lint | Configured application, scripts and automated-test lint |
| npm run build | Production static bundle |
| npm run check | Tests → types → lint → build |
| npm audit | Current registry dependency advisory check |
| npm run test:browser | Playwright route/flow/privacy/accessibility checks against preview |
| node scripts/security-check.mjs | Tracked private-material regression check |
| node scripts/capacity.mjs | Workload arithmetic, not a load test |
| node scripts/load-local.mjs | Bounded loopback HTTP microbenchmark |

## Browser workflow

```bash
npm run build
npm run preview
# In another terminal:
npx playwright install chromium
npm run test:browser
```

TEST_BASE_URL can select an authorized environment. The suite exercises route rendering, read-only intake, sample cancellation/consent/export/denial/hold/reset, protected-route redirection, request privacy and limited axe accessibility checks. Do not use actual patient records.

## Security publication checks

Scan Git history and the outgoing tree with Gitleaks, then scan the staged diff immediately before committing. Check tracked paths for environment files, private keys, credentials, recovery notes and artifacts. Run the security edit hook and applicable static analysis. Bandit applies to shipped Python; this application has no shipped Python code. A missing or failed tool must be reported explicitly. Do not publish raw findings containing secrets.

Committed automated tests remain committed. Personal test/scratch tooling belongs in ignored tests/manual/ and is preserved between runs. Documentation review checks relative links, endpoint/migration counts, commands, current-versus-proposed claims and sensitive content.

## Coverage limits and future gates

Current tests do not validate the historical database, RLS, encrypted writers, provider integrations, full Deno typing, all-site WCAG conformance, million-user throughput or observed monthly uptime. Clinical work requires fresh/upgrade migration tests, cross-tenant/role denial, real transaction concurrency, provider sandbox tests and restore exercises. [Clinical gates](CLINICAL-RELEASE.md) and [capacity qualification](CAPACITY-PLAN.md) define these requirements.

Manual-only GitHub CI does not run on push. Verify Actions allowance before dispatch; no paid AI review is enabled. Local publication checks and independent review must still be recorded.
