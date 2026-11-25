# Frontend

A React 18 single-page app built with Vite, Tailwind CSS, React Router, GSAP and Framer Motion. Run all commands from the repository root; see the [development guide](../docs/DEVELOPMENT.md).

## Layout

| Path | Contents |
|---|---|
| `main.jsx`, `App.jsx` | Providers, lazy-loaded routes, layout, canonical link and scroll animation setup |
| `pages/` | One component per route |
| `components/` | Layout, UI kit (`ui/`), patient and admin portal views, auth and security components |
| `context/` | Language provider; authentication context (inactive in this release) |
| `config/runtime.js` | Release mode, site origin and session settings, validated at startup |
| `config/contact.js` | Clinic contact details |
| `data/` | Services, pricing, blog, FAQ, testimonials, media map and the sample patient record |
| `lib/demo-policy.js` | Access rules and state transitions for the patient journey |
| `lib/supabase.js` | Clinical client, intentionally disabled |
| `hooks/`, `utils/` | Shared animation hooks and helpers |
| `index.css` | Global styles, focus styles and reduced-motion rules |

## Routes

| Routes | Purpose |
|---|---|
| `/`, `/about`, `/services`, `/services/:slug`, `/pricing` | Clinic pages |
| `/blog`, `/blog/:slug`, `/faq`, `/gallery`, `/community`, `/conferences` | Content pages |
| `/experience` | Interactive patient journey on a sample record |
| `/trust`, `/accessibility`, `/privacy-policy`, `/terms` | Privacy, engineering and legal pages |
| `/contact`, `/register`, `/appointment` | Form previews (submission disabled) |
| `/login`, `/signup`, `/forgot-password`, `/reset-password` | Sign-in pages (unavailable in this release) |
| `/dashboard/*`, `/admin/*` | Patient and admin portal views, behind a protected route (always redirects to `/login` in this release) |
| `/unauthorized`, `*` | Access-denied and not-found pages |

## Conventions

- **Bilingual text.** Every string is an `{ en, bn }` object rendered with `useLanguage().t()`. Leave room for longer Bangla text.
- **New pages** go in `pages/`, are lazy-loaded in `App.jsx`, set a `<Helmet>` title and description, and wrap content in `PageTransition`. The canonical link is set only in `App.jsx`.
- **Content** lives in `data/` and `config/`, not in components.
- **Media** is stored under `public/`; no hotlinked images.
- **Accessibility.** Keep visible keyboard focus, labelled controls and `prefers-reduced-motion` support. Check new color pairs against WCAG 2.2 AA.
- **Patient data.** The sample record lives in memory only. Never put real personal data in fixtures, browser storage, logs or screenshots. The role selector is a simulation; real authorization belongs on the server.

Styling rules and components are described in the [design system](../DESIGN.md).
