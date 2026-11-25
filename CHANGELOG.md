# Changelog

Notable changes to this project. Releases are identified by date.

## 2026-11-26

### Changed

- Rewrote and consolidated the documentation: a new README with screenshots, a development guide replacing the separate configuration and testing pages, operations and reliability merged into one guide, scalability and capacity planning merged, and the ten policy drafts and three BAA files combined into two templates under `docs/templates/`.
- Merged the governance checklist, security plan and compliance progress page into [Clinical release](docs/CLINICAL-RELEASE.md).

## 2026-11-25

### Added

- [Patient messaging](docs/PATIENT-MESSAGING.md) documentation for the HighLevel campaign service: campaigns, safety controls, security, recovery, verification, scaling and pre-launch legal requirements.

### Fixed (messaging service)

- Enrolments now go only into published workflows. HighLevel accepted enrolments into Draft workflows but enrolled nobody.
- Contacts are created or updated by ID, so patients who share a phone number or email are no longer merged.

## 2026-10-05

### Changed

- The canonical link is set in one place (`src/App.jsx`) from `VITE_SITE_URL`. Page-level canonicals pointing at a retired host were removed.
- Supabase CORS helpers no longer fall back to the retired host; without `ALLOWED_ORIGIN` they send no allow-origin header.
- `robots.txt` allows LinkedInBot so shared links show a preview. All other crawlers remain disallowed, and pages stay `noindex`.

### Added

- Regression tests for the canonical origin (`tests/automated/site-origin.test.js`) and crawler rules (`tests/automated/robots.test.js`).

## 2026-09-24

### Added

- Frontend, backend, Edge Function and migration guides.
- Roadmap, capacity plan and availability objectives.
- US, EU and Bangladesh legal research, security policy and contribution guide.

### Changed

- Replaced older compliance claims in policy documents with drafts clearly marked as not yet adopted.

## 2026-09-15

### Added

- Interactive patient journey on sample data, in browser memory.
- Release guard on all 11 Supabase Edge Functions.
- Self-hosted media, automated tests, deployment tooling and release verification.

### Changed

- Disabled the clinical frontend client and all real intake forms.
