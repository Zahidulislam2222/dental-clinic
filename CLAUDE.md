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

React 18 SPA with Vite, React Router v6, Tailwind CSS, and Supabase backend (PostgreSQL, Auth, Edge Functions). HIPAA-compliant with FHIR R4 interoperability.

### Backend (Supabase)

- **Auth:** Email/password + phone OTP, JWT sessions, auto-refresh
- **Database:** PostgreSQL with RLS, pgcrypto PHI encryption, Vault key storage
- **Edge Functions:** Deno runtime — server-side validation, FHIR API, notifications, admin queries, breach detection
- **Roles:** patient / doctor / receptionist / admin — enforced via RLS + SECURITY DEFINER helper functions (`auth.user_role()`, `auth.is_admin()`, `auth.is_staff()`)

### Key Contexts

- `src/context/AuthContext.jsx` — Auth state (user, profile, role), signUp/signIn/signOut, 15-min auto-logout (HIPAA), role helpers
- `src/context/LanguageContext.jsx` — Bilingual i18n with `t()` function

### Layout Structure

`App.jsx` renders: `AnnouncementBar` → `Navbar` → `<main>` (route content) → `Footer`, plus `BackToTop` and `WhatsAppFloat`. Main content has `pt-[100px] md:pt-[116px]` for fixed header clearance.

### Routing

All pages lazy-loaded via `React.lazy()` in `App.jsx`. Protected routes use `<ProtectedRoute>` with `requiredRoles` prop. Admin routes nested under `/admin/*`. Patient dashboard at `/dashboard/*`.

### Three-Tier Animation System

1. **GSAP + ScrollTrigger** — scroll reveals, parallax, stagger. Hooks in `src/hooks/useGsapAnimations.js`
2. **Framer Motion** — page transitions, hover/tap micro-interactions
3. **Tailwind keyframes** — marquee, float, shimmer, pulse-teal, glow-pulse

**Lenis smooth scrolling** synced to GSAP ticker in `App.jsx`.

### Bilingual (i18n)

All strings use `{ en: "...", bn: "..." }` objects with `useLanguage().t()`. No separate translation files.

### Forms & Data Flow

Forms use React Hook Form. Submissions route through `src/utils/emailService.js` → Supabase Edge Function (`submit-form`) → PostgreSQL (encrypted insert) → audit log. Fallback to localStorage when Supabase is not configured. Notifications via `send-notification` Edge Function (Resend — no PHI in email body).

### FHIR R4

- `src/lib/fhir.js` — Resource builders (Patient, Appointment, AllergyIntolerance, Condition, Bundle, CapabilityStatement)
- `src/lib/fhir-terminology.js` — SNOMED CT + ICD-10 code mappings
- `src/lib/fhir-validator.js` — Client-side resource validation
- `supabase/functions/fhir-api/` — FHIR REST endpoints
- `supabase/functions/fhir-export/` — Patient FHIR Bundle export

### Database Migrations

9 sequential migrations in `supabase/migrations/` (001-009). Run in order. Each is idempotent.

### Security Headers

`public/_headers` — CSP, HSTS, X-Frame-Options, COEP, COOP, CORP, Permissions-Policy. Served by Cloudflare Pages.

### SOC 2 Documentation

11 policy documents in `docs/policies/` covering all TSC criteria. BAA checklist in `docs/baa/`.

### Styling

Tailwind with custom palette: navy `#0A1628`, teal `#00BFA6`, gold `#D4AF37`, offwhite `#F8FAFC`. Glass-morphism utilities in `src/index.css`. Fonts: Plus Jakarta Sans (headings), Inter (body).

### Key UI Components (`src/components/ui/`)

- **TiltCard** — 3D perspective tilt, `intensity` prop (default 15)
- **MagneticButton** — cursor-following offset, `strength` prop (default 0.3)
- **CursorGlow** — 400px teal radial gradient following cursor
- **Button** — 6 variants, 3 sizes, icon + loading support

### Stock Photos

Unsplash URLs: `https://images.unsplash.com/photo-{id}?w=800&q=85&fit=crop`. Use only male/equipment/clinic dental photos — no women (owner preference based on Islamic values).

## Adding a New Page

1. Create `src/pages/NewPage.jsx` wrapping content in `<PageTransition>`
2. Add lazy import and `<Route>` in `App.jsx`
3. Add `<Helmet>` with title and meta description
4. Use GSAP hooks for scroll animations
5. All text must use `{ en: "...", bn: "..." }` with `t()`

## Build Notes

- No source maps in production (`sourcemap: false`)
- Known warning: lottie-web chunk exceeds 500KB — expected
- PWA manifest at `public/manifest.json`
- Static SPA deployed to Cloudflare Pages (`dental-clinic-anq.pages.dev`)
