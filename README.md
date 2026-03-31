<p align="center">
  <img src="public/icons/icon-512.svg" alt="Everyday Dental Surgery Logo" width="120" />
</p>

<h1 align="center">Everyday Dental Surgery & Implant Center</h1>

<p align="center">
  <strong>Modern dental clinic website built with React, Vite & Tailwind CSS</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Framer_Motion-11-FF0055?logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/GSAP-3.14-88CE02?logo=greensock&logoColor=white" alt="GSAP" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Bilingual-English_%7C_Bengali-00BFA6" alt="Bilingual" />
  <img src="https://img.shields.io/badge/PWA-Ready-D4AF37" alt="PWA Ready" />
  <img src="https://img.shields.io/badge/SEO-Optimized-0A1628" alt="SEO" />
</p>

---

## Overview

A fully responsive, bilingual (English/Bengali) single-page application for **Everyday Dental Surgery & Implant Center** — a premium dental clinic in Dhaka, Bangladesh. Features cinematic scroll animations, 3D interactive UI elements, and a complete appointment booking system.

## Features

- **Bilingual Support** — seamless English/Bengali toggle with `localStorage` persistence
- **14 Pages** — Home, About, Services, Service Detail, Pricing, Appointment Booking, Gallery, Blog, Blog Post, Community, Conferences, FAQ, Contact, Patient Registration
- **Three-Tier Animation System**
  - GSAP + ScrollTrigger for scroll-driven reveals & parallax
  - Framer Motion for page transitions & micro-interactions
  - Tailwind keyframes for ambient effects (float, shimmer, glow)
- **Lenis Smooth Scrolling** — buttery-smooth scroll synced with GSAP
- **3D Interactive Components** — TiltCard (perspective follow), MagneticButton (cursor attraction), CursorGlow (radial light trail)
- **PWA Ready** — installable with offline-capable service worker
- **SEO Optimized** — per-page meta tags, Open Graph, Twitter Cards, JSON-LD structured data
- **Form Handling** — React Hook Form with EmailJS integration + localStorage fallback
- **Fully Responsive** — mobile-first design with glass-morphism UI

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | React 18, React Router v6 |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS 3.4, Custom CSS |
| **Animations** | GSAP 3 + ScrollTrigger, Framer Motion 11, Lottie |
| **Smooth Scroll** | Lenis |
| **Forms** | React Hook Form, EmailJS |
| **Icons** | Lucide React |
| **SEO** | React Helmet Async |
| **Notifications** | React Hot Toast |

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Zahidulislam2222/dental-clinic.git
cd dental-clinic

# Install dependencies
npm install

# Start development server
npm run dev
```

The dev server runs at `http://localhost:3000` and auto-opens in your browser.

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
dental-clinic/
├── public/
│   ├── icons/              # PWA icons (SVG)
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service worker
├── src/
│   ├── components/
│   │   ├── layout/         # Navbar, Footer, AnnouncementBar
│   │   └── ui/             # Button, TiltCard, MagneticButton, Modal, etc.
│   ├── context/            # LanguageContext (i18n)
│   ├── data/               # Static content (services, pricing, blog, etc.)
│   ├── hooks/              # GSAP & scroll animation hooks
│   ├── pages/              # All 14 page components
│   └── utils/              # EmailJS service, mock API
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Deployment (Cloudflare Pages)

1. Push this repository to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com) → **Create a project**
3. Connect your GitHub repository
4. Configure build settings:

| Setting | Value |
|---------|-------|
| **Framework preset** | None |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Node.js version** | `18` |

5. Deploy!

> For SPA routing, create a `public/_redirects` file with:
> ```
> /* /index.html 200
> ```

## Configuration

Before going live, update these placeholder values:

| File | What to Update |
|------|----------------|
| `src/utils/emailService.js` | EmailJS public key, service ID, template IDs |
| `index.html` | Google Analytics ID (`G-XXXXXXXXXX`) |
| `index.html` | Facebook Pixel ID (`YOUR_PIXEL_ID`) |
| `index.html` | Real clinic contact info, canonical URL |

## Design System

| Token | Color | Usage |
|-------|-------|-------|
| **Navy** | `#0A1628` | Primary dark background |
| **Teal** | `#00BFA6` | Primary accent |
| **Gold** | `#D4AF37` | Luxury accent |
| **Off-white** | `#F8FAFC` | Light background |

**Fonts:** Plus Jakarta Sans (headings) · Inter (body)

## License

This project is proprietary. All rights reserved.

---

<p align="center">
  Built with care for <strong>Everyday Dental Surgery & Implant Center</strong>, Dhaka, Bangladesh
</p>
