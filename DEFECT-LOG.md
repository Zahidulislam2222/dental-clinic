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
