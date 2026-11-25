# Defect log

Defects that reached a release or publication, the check that should have caught them, and the check added in response.

| Date | Defect | Missed check | Check added |
|---|---|---|---|
| 2026-09 | Original README claimed HIPAA compliance without verified clinical flows | Review of claims against the implementation | Research-based scope and a clinical release blocker list |
| 2026-09 | Clinical writers stored plaintext while migration 010 expected encrypted fields | Clean-install and upgrade database tests | Clinical endpoints disabled; database tests required before release |
| 2026-09 | Clinical helper functions did not check the caller or patient properly | Denial test matrix | Release guard on every endpoint, with a regression test |
| 2026-09 | Retired storage mock could have persisted personal input if reused | Data-flow and storage review | Storage regression checks; export routed to the disabled backend |
| 2026-09 | Dependencies had published security advisories | Lockfile audit on every release | Updated dependencies; `npm audit` required before release |
| 2026-09 | Smooth-scroll cleanup removed a different callback than it registered | Lifecycle review and repeated-navigation tests | Exact callback cleanup; browser navigation checks |
| 2026-09 | An nginx regex overrode the immutable cache policy for built assets | Public cache-header check | Regex removed; public checks assert immutable headers on real build assets |
| 2026-09 | Policy and BAA documents claimed backups, compliance and vendor agreements that did not exist | Whole-document consistency review | Policies rewritten as drafts; documentation review and link checks before publication |
| 2026-10-05 | `robots.txt` blocked LinkedIn link previews | Link-preview check before sharing the URL | LinkedInBot allowed; `tests/automated/robots.test.js` |
| 2026-10-05 | Page-level canonical tags pointed at a retired host; CORS fell back to it | Single-owner configuration audit and rendered-head check | `tests/automated/site-origin.test.js`; live canonical check on four routes |
