# Development guide

## Requirements

- Node.js 24 or later (`engines` in `package.json`)
- npm, using the committed `package-lock.json`
- Chromium for browser tests: `npx playwright install chromium`

No cloud account, database or API key is needed to run or test the site.

## Run locally

```bash
npm ci
npm run dev       # development server, http://localhost:3000
npm run build     # production build in dist/
npm run preview   # serve the build, http://localhost:4173
```

## Configuration

The site reads two public build-time variables. Copy [.env.example](../.env.example) to `.env` to override them.

| Variable | Default | Purpose |
|---|---|---|
| `VITE_APP_MODE` | `synthetic` | Release mode. Only `synthetic` is accepted; any other value fails validation. |
| `VITE_SITE_URL` | `https://dental.zahidul-islam.com` | Public origin used for the canonical link. Must be a bare HTTPS origin. |
| `TEST_BASE_URL` | local preview | Optional target for the Playwright suite. Not read by the application. |

Any variable prefixed with `VITE_` is compiled into public JavaScript, so it must never hold a secret.

Every other setting has one owner file:

| Setting | Owner |
|---|---|
| Runtime validation and session settings | `src/config/runtime.js` |
| Clinic contact details | `src/config/contact.js` |
| Page content (services, pricing, blog, FAQ, sample records) | `src/data/` |
| Ports, timeouts, load-test and capacity assumptions | `config/tooling.json` |
| Container image, hostname, ports and resource limits | `deploy/settings.json` |
| HTTP security headers | `public/_headers` |
| Design tokens | `tailwind.config.js`, `src/index.css` |

## Testing

| Command | Scope |
|---|---|
| `npm test` | Unit and regression tests: access policy, capacity model, backend release guard, robots rules, canonical origin |
| `npm run typecheck` | Strict TypeScript check of the runtime, policy and backend guard modules |
| `npm run lint` | ESLint across the application, scripts and tests |
| `npm run build` | Production bundle |
| `npm run check` | All four of the above, in order; run before every commit |
| `npm run test:browser` | Playwright: 20 static routes, the patient journey, disabled forms, network privacy and axe accessibility checks |
| `npm audit` | Dependency vulnerability check |
| `node scripts/security-check.mjs` | Fails if credentials, private notes or key files are tracked |
| `node scripts/capacity.mjs` | Prints the capacity model (arithmetic only, not a load test) |
| `node scripts/load-local.mjs` | Small HTTP benchmark against the local preview (loopback only) |

Run the browser suite against a running preview:

```bash
npm run build
npm run preview
# in a second terminal
npm run test:browser
```

### Security scanning

The maintainer's local pre-commit hooks run gitleaks, bandit and semgrep on every commit. Before publishing, scan the full Git history with gitleaks as well. The GitHub Actions workflow in `.github/workflows/security.yml` runs `npm run check`, `npm audit`, gitleaks and semgrep; it is triggered manually (`workflow_dispatch`).

### What the tests do not cover

The suite tests the public site and the backend release guard. It does not yet cover the clinical database, row-level security, encrypted fields or third-party integrations; those tests are part of the [clinical release](CLINICAL-RELEASE.md) work.

## Conventions

- All user-facing text is bilingual: `{ en, bn }` objects rendered through `useLanguage().t()`.
- New pages go in `src/pages/`, are lazy-loaded in `App.jsx`, set a `<Helmet>` title and description, and use `PageTransition`.
- The canonical link is set once in `App.jsx`; pages do not set their own.
- Media is stored locally under `public/`. Do not add hotlinked images.
- Use only sample data in fixtures, tests, screenshots and issues.
- Add a dependency only when no existing one covers the need.
- Never edit `deploy/generated/`; it is produced by `scripts/build-deploy.mjs`.

See [Contributing](../CONTRIBUTING.md) for the pull request process.
