# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server on localhost:3000 (auto-opens browser)
npm run build     # Production build to /dist
npm run preview   # Preview production build locally
```

No test runner, linter, or pre-commit hooks are configured.

## Architecture

React 18 SPA with Vite, React Router v6, and Tailwind CSS. No backend — forms use a localStorage-based mock API (`src/utils/mockApi.js`).

### Layout Structure

`App.jsx` renders a persistent layout shell: `AnnouncementBar` → `Navbar` → `<main>` (route content) → `Footer`, plus floating `BackToTop` and `WhatsAppFloat` widgets. The main content area has top padding (`pt-[100px] md:pt-[116px]`) to clear the fixed announcement bar + navbar. Layout components are in `src/components/layout/`.

### Routing & Page Loading

All pages are lazy-loaded via `React.lazy()` in `App.jsx` with `<Suspense>` fallback. Routes are defined in `App.jsx`. Every page wraps its content in `<PageTransition>` for Framer Motion enter/exit animations via `<AnimatePresence>`.

### Three-Tier Animation System

1. **GSAP + ScrollTrigger** — scroll-triggered reveals, text splitting, parallax, staggered children. Custom hooks in `src/hooks/useGsapAnimations.js`: `useTextReveal()`, `useScrollReveal()`, `useParallax()`, `useStaggerReveal()`, `useCounterFlip()`. These return refs to attach to DOM elements.
2. **Framer Motion** — page transitions, `whileHover`/`whileTap` micro-interactions, `AnimatePresence` for route changes. Predefined variants in `src/hooks/useScrollAnimation.js`.
3. **Tailwind keyframes** — marquee, float, shimmer, pulse-teal, glow-pulse, dental-float particles. Defined in `tailwind.config.js` and consumed via `animate-*` classes.

**Lenis smooth scrolling** is initialized in `App.jsx` and synced to GSAP's ticker for frame-perfect scroll animations.

### Bilingual (i18n)

All user-facing strings use `{ en: "...", bn: "..." }` objects. The `useLanguage()` hook from `src/context/LanguageContext.jsx` provides a `t()` function that extracts the active language. Language preference persists in localStorage under key `eds-language`. Translations are inline in components and data files — there are no separate translation files.

### SEO

Every page uses `react-helmet-async` (`<Helmet>`) for per-page `<title>` and `<meta>` tags. The `<HelmetProvider>` wraps the app in `main.jsx`. JSON-LD structured data is embedded inline in pages that need it.

### Styling

Tailwind utilities for nearly everything. Custom color palette in `tailwind.config.js`:
- **navy** `#0A1628` — primary dark background
- **teal** `#00BFA6` — primary accent
- **gold** `#D4AF37` — luxury accent
- **offwhite** `#F8FAFC` — light background

Glass-morphism utilities (`.glass-*`), gradient helpers (`text-gradient`, `gradient-teal`, `gradient-navy`), and complex animation keyframes are in `src/index.css` and `tailwind.config.js`.

Fonts: **Plus Jakarta Sans** (headings), **Inter** (body), loaded via Google Fonts in `index.html`.

### Key UI Components (`src/components/ui/`)

- **TiltCard** — 3D perspective tilt following cursor. `intensity` prop controls tilt degrees (default 15).
- **MagneticButton** — cursor-following offset with configurable `strength` (default 0.3). Accepts `to` (router link), `href` (external), or `onClick`.
- **CursorGlow** — 400px teal radial gradient that follows cursor within a container ref.
- **Button** — 6 variants (primary/outline/navy/gold/ghost/white), 3 sizes, supports icons and loading state.

### Data Files (`src/data/`)

Static content for services, pricing, FAQs, blog posts, testimonials, conferences, and lottie animation configs. Each data file exports bilingual objects consumed by their respective pages.

### Forms & Email

All forms use React Hook Form. Submissions go through `src/utils/emailService.js` (EmailJS integration — requires configuring API keys) with fallback to `src/utils/mockApi.js` which simulates network delays and stores data in localStorage. Toast notifications via React Hot Toast (dark navy theme, top-right position).

### Stock Photos

Pages use Unsplash URLs in the format `https://images.unsplash.com/photo-{id}?w=800&q=85&fit=crop`. When adding or replacing photos, always verify the Unsplash photo ID is valid (returns 200, not 404) before committing. Use only male/equipment/clinic dental photos — no women in photos (owner preference based on Islamic values).

## Adding a New Page

1. Create `src/pages/NewPage.jsx` wrapping content in `<PageTransition>`.
2. Add a lazy import and `<Route>` in `App.jsx`.
3. Add `<Helmet>` with page title and meta description.
4. Use GSAP hooks (`useScrollReveal`, `useStaggerReveal`) for scroll animations.
5. All user-facing text must use `{ en: "...", bn: "..." }` with `t()`.

## Build Notes

- Production build has no source maps (`sourcemap: false` in `vite.config.js`).
- Known warning: main chunk exceeds 500KB due to lottie-web — this is expected.
- PWA manifest at `public/manifest.json` — linked from `index.html`.
- Output is a static SPA suitable for Vercel, Netlify, or any static host.
