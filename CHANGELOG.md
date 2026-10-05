# Changelog

## 2026-10-05 — Canonical links and retired host

- Each page's canonical link now comes from `VITE_SITE_URL` in one place (`src/App.jsx`); page-level canonicals pointing at the retired pages.dev site or a placeholder domain were removed.
- Supabase CORS helpers no longer fall back to the retired pages.dev origin; without `ALLOWED_ORIGIN` they send no allow-origin header.
- Added `tests/automated/site-origin.test.js`. Deployed as release 20261005-canonical-origin. Supabase functions not redeployed (all still return the 503 release boundary before CORS runs).

## 2026-10-05 — LinkedIn link preview

- `robots.txt` now allows LinkedInBot so the live demo can show a link preview; every other crawler is still disallowed and the page keeps its noindex meta tag and header.
- Added `tests/automated/robots.test.js` to pin the crawler rules and both noindex layers.
- Deployed as release 20261005-linkedin-robots on the existing server container; only `robots.txt` changed.

## 2026-09-24 — GitHub documentation publication

- Added frontend, backend, function, migration and documentation guides.
- Defined an engineering roadmap for 1M+ concurrent users, capacity qualification, 99% availability and future reliability targets.
- Expanded US/EU/Bangladesh legal launch planning, governance, security disclosure, configuration and contribution guidance.
- Reconciled legacy policy/compliance wording with current synthetic behavior and future clinical gates.
- Published the existing frontend hardening and guarded backend source to the default branch with the documentation refresh; see verification evidence for publication status.

This documentation change does not activate clinical services, run migrations or deploy the live website.

## 2026-09-15 — Synthetic release foundation

Commit 1e0d773 introduced the in-memory patient journey, disabled clinical frontend client, eleven backend guards, local media, tests and release/scaling evidence. Earlier clinical modules remain preserved behind release gates. Historical measurements are recorded in [verification](docs/VERIFICATION.md).
