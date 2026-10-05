# Defect log

| Escaped defect | Gate that should have caught it | Added or required gate |
|---|---|---|
| Legacy README claimed HIPAA compliance despite unverified clinical flows | Evidence review against actual implementation | Research-based scope and explicit clinical release blockers |
| Plaintext clinical writer diverged from encryption migration | Empty/upgrade database contract tests | Required before clinical release; public clinical path disabled |
| Clinical helper functions had insufficient caller/subject checks | Negative authorization matrix | Unconditional release guard and regression test; real clinical repair remains separate |
| Retired storage mock could persist personal input if reused | Data-flow and storage review | Compatibility export to disabled backend plus storage regression checks |
| Dependency graph contained published advisories | Lockfile audit on each release | Updated dependencies and mandatory audit |
| Smooth-scroll cleanup removed a different callback than the registered one | Lifecycle review and repeated-navigation testing | Exact callback cleanup; browser navigation checks |

| Asset cache policy overridden by nginx extension regex | Public HTTP cache-header check | Removed redundant regex; public checks assert immutable headers on actual build assets |
| Legacy policy/BAA documents asserted enabled backups, completed compliance and vendor arrangements without evidence | Whole-document consistency review before publication | Reconciled policies as proposed templates; added documentation publication review and reusable local link/inventory checks |
| 2026-10-05: `robots.txt` Disallow for every crawler also blocked LinkedIn link previews for the live demo | Public link-preview check (LinkedIn Post Inspector) before sharing the URL | LinkedInBot allow group plus `tests/automated/robots.test.js`; noindex layers still asserted |
| 2026-10-05: page-level canonical tags (retired pages.dev host, placeholder domain) overrode the configured canonical; CORS fell back to the retired host | Config single-owner audit (Rule 12) and a rendered-head check | `tests/automated/site-origin.test.js`; live canonical check on four routes |
