# Design

How the Everyday Dental interface is styled. Values live once in the token files below; this
page explains how to use them and does not repeat them.

## Where the tokens are

| Token group | Owner |
|---|---|
| Colour scales `navy`, `teal`, `gold`, plus `slate`, `gray`, `offwhite` | `tailwind.config.js` → `theme.extend.colors` |
| Font families `heading`, `body` | `tailwind.config.js` → `theme.extend.fontFamily` |
| Keyframes (marquee, float, shimmer, pulse-teal, glow-pulse) | `tailwind.config.js` → `theme.extend.keyframes` / `animation` |
| Glass-morphism utilities and base layers | `src/index.css` |

## Usage

- **Navy** is the base: page backgrounds in dark sections, headings on light sections.
- **Teal** is the action colour: primary buttons, links, focus rings, active states.
- **Gold** is an accent only (badges, highlights). Never body text — contrast is too low on white.
- **Offwhite** is the light-section background; avoid pure white blocks next to it.
- Headings use `font-heading`; body copy uses `font-body`.
- Check WCAG 2.2 AA contrast for any new text/background pair before shipping.

## Components

Reuse before adding (`src/components/ui/`): `Button` (6 variants, 3 sizes, icon + loading),
`TiltCard`, `MagneticButton`, `CursorGlow`. Motion follows three tiers: GSAP/ScrollTrigger for
scroll reveals (`src/hooks/useGsapAnimations.js`), Framer Motion for page transitions and
micro-interactions, Tailwind keyframes for ambient loops. Respect `prefers-reduced-motion`.

## States

Every interactive component needs visible hover, focus-visible, disabled and loading states;
forms need inline validation, error and empty states. Text is bilingual (`{ en, bn }`), so leave
room for longer Bangla strings.

## Changing the design

Add or change a token in its owner file first, then use it. Do not hardcode hex values or font
names in components.
