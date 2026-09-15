# Everyday Dental — synthetic portfolio demo

A bilingual React dental-practice presentation with a working **synthetic patient journey**, privacy disclosures, explicit security boundaries and a staged capacity plan.

**Public demo:** https://dental.zahidul-islam.com
**Explore:** `/experience` · **Privacy and engineering:** `/trust`

No real patient intake, login, payment, email or SMS is enabled in the public demo. Sample records and changes exist only in browser memory. The role selector illustrates policy; it is not production authentication. Clinic profiles, offers, reviews and outcomes are fictional demonstration content.

## What to review

- Sample cancellation, optional sharing, role denial, cross-patient policy, legal hold/erasure and FHIR-shaped export.
- First-party media, strict CSP, read-only intake previews and no persistent patient storage.
- Non-root static container, read-only filesystem, dropped capabilities, resource limits and loopback binding.
- Automated policy/configuration tests, strict checks on the new policy boundary, lint, dependency audit and browser/accessibility checks.
- [Verification](docs/VERIFICATION.md), [legal research](docs/LEGAL-RESEARCH.md), [threat model](docs/THREAT-MODEL.md), [scaling design](docs/SCALABILITY.md), [operations](docs/OPERATIONS.md) and [clinical release blockers](docs/CLINICAL-RELEASE.md).

## Capacity and compliance claims

10,000–1,000,000 simultaneous users and 99% availability are **planning targets**, not measured capacity or an SLA. The plan separates public readers from clinical transactions, models cache misses and defines staged measurement gates. A single shared origin is not high availability. Free tools and a clean codebase do not eliminate infrastructure or staffing costs at scale.

No HIPAA/GDPR/SOC 2 certification or complete WCAG conformance is claimed. The legal report distinguishes applicable controls from contracts, organizational duties and jurisdiction-specific launch decisions.

## Run locally

Use Node 24+ with the lockfile:

```bash
npm ci
npm run dev
```

Copy `.env.example` only when changing the public origin. The release accepts synthetic mode only; old provider variables cannot activate clinical services.

```bash
npm run check
npm audit
npm run preview
# In another terminal:
npm run test:browser
node scripts/load-local.mjs
node scripts/capacity.mjs
node scripts/build-deploy.mjs
```

Install Playwright Chromium with `npx playwright install chromium` when the browser is absent. Browser checks target localhost by default; `TEST_BASE_URL` can point the same suite at an authorized deployment. The load script refuses non-loopback targets.

## Structure and configuration

| Location | Responsibility |
|---|---|
| `src/config/runtime.js` | Validated public runtime and synthetic-only boundary |
| `src/data/` | Maintained sample/privacy/media data and existing product content |
| `src/lib/demo-policy.js` | Pure sample access and state transitions |
| `src/pages/DemoPage.jsx` | Interactive synthetic patient journey |
| `src/pages/TrustPage.jsx` | One privacy/security disclosure surface |
| `public/_headers` | Canonical browser security header policy |
| `deploy/settings.json` | Pinned image, hostname, ports and resource limits |
| `scripts/build-deploy.mjs` | Generated nginx, Compose and gateway configuration |
| `config/tooling.json` | Local test/load/probe assumptions |
| `tests/automated/`, `tests/browser/` | Committed automated regression suites |
| `supabase/` | Preserved clinical prototypes and release guard; see blocker register |

Original clinical prototypes include 11 migrations and 11 Edge Functions for intake, roles, encrypted fields, FHIR, auditing, retention and incidents. They contain unresolved cross-module defects and are **not approved for clinical use**. The local and deployed function sources block their execution; 11/11 HTTP guard checks and 16/16 source hashes were verified. Existing database records were preserved; no migrations were applied.

The historical `compliance/` scanner detects source patterns. Its percentage is not a security, legal or runtime certification. Use the release evidence instead. Private credentials, dossier and recovery checkpoints are Git-ignored. Independent review was explicitly deferred by the owner to a separate session.

## Release discipline

Build locally, snapshot live state, verify drift, deploy a versioned allowlisted artifact, test the real public flow, and prove local/live hashes. Preserve a tested off-server recovery archive. Do not run migrations, activate billing, send messages or enable real payments as part of a static release. CI is manual-only to avoid automatically consuming an unverified private-repository Actions budget.
