# Frontend guide

React 18 SPA using Vite, Tailwind CSS, React Router, GSAP and Framer Motion. Run commands from the repository root; [package.json](../package.json) and its lockfile define the toolchain.

```bash
npm ci
npm run dev
npm run check
npm run preview
```

Development defaults to port 3000 and preview to 4173, owned by [tooling settings](../config/tooling.json). No Supabase account is needed. See [configuration](../docs/CONFIGURATION.md).

## Modules

| Path | Responsibility |
|---|---|
| main.jsx / App.jsx | Providers, lazy routes, layout and animation lifecycle |
| pages/ / components/ | Clinic presentation, synthetic workflow and preserved portal views |
| context/ | Language and inactive clinical authentication presentation |
| config/runtime.js | Synthetic boundary, public origin and session presentation settings |
| config/contact.js / data/ | Maintained contact, product, privacy, media and demo content |
| lib/demo-policy.js | Pure policy illustrations and sample transitions |
| lib/supabase.js | Explicitly disabled clinical client |
| index.css | Shared styling, keyboard focus and reduced motion |

## Routes

| Family | Behavior |
|---|---|
| /, /about, /services, /services/:slug, /pricing | Fictional clinic presentation |
| /blog, /blog/:slug, /faq, /gallery, /community, /conferences | Sample content |
| /experience | Synthetic workflow and export |
| /trust, /accessibility, /privacy-policy, /terms | Disclosure surfaces |
| /contact, /register, /appointment | Read-only intake previews |
| /login, /signup, /forgot-password, /reset-password | Clinical access unavailable |
| /dashboard/*, /admin/* | Protected legacy views; no clinical session |
| /unauthorized, unmatched paths | Denial and not-found presentation |

Sample patient state stays in browser memory. Language preference is separate from patient state. Never place actual patient data in fixtures, browser storage, logs or issue screenshots. Browser-selected roles illustrate policy only; future authorization belongs on the server and in database policies.

Preserve first-party media, [security headers](../public/_headers), disabled intake, keyboard focus and reduced motion. Keep content in maintained data files and environment settings in central configuration. See [testing](../docs/TESTING.md); the strict type check covers selected modules, not all JSX. Broader accessibility, localization, bundle budgets and full typing are [roadmap](../ROADMAP.md) work.
