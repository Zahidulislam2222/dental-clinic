# Configuration ownership

The synthetic release requires no credentials. [.env.example](../.env.example) contains safe public settings.

| Variable | Owner | Meaning |
|---|---|---|
| VITE_APP_MODE | src/config/runtime.js | synthetic only; other modes fail validation |
| VITE_SITE_URL | src/config/runtime.js | HTTPS origin without credentials/query/fragment/additional path |
| TEST_BASE_URL | playwright.config.js | Optional authorized browser-test target; local preview by default |

VITE_ values are public browser code. TEST_BASE_URL is test tooling, not application runtime.

| File owner | Values |
|---|---|
| src/config/runtime.js | Runtime validation and session presentation defaults |
| src/config/contact.js / src/data/ | Maintained business, demo, privacy and media content |
| config/tooling.json | Ports, test/probe timeouts, local load and capacity assumptions |
| deploy/settings.json | Image, hostname, ports and resource limits |
| public/_headers | Browser security policy |
| scripts/build-deploy.mjs | Deployment generation from central inputs |
| package.json / package-lock.json | Commands, engine and dependency resolution |

## Clinical configuration debt

Dormant Deno functions still read provider/service variables and contain provider URLs, limits and templates. These are not an approved production interface. Inventory them before implementation, consolidate into one validated typed server settings module, inject settings into business code, add safe examples and privately record actual credentials. Older frontend copy/settings also need consolidation before broader reuse.

This documentation publication adds no runtime values or dependencies. HTTP codes, header names and SQL grammar remain fixed protocol syntax. A configuration refactor must include regression tests and complete backend/frontend gates.
