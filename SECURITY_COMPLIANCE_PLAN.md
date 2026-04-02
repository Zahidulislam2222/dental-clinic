# Security, Compliance & Data Flow Fix Plan

**Created:** 2026-04-02
**Status:** PHASES 1-4 COMPLETE + SUPABASE BACKEND INTEGRATED (Phase 5 = future HIPAA hardening)
**Context:** Frontend-only React 18 SPA (no backend yet). Fixes what CAN be fixed on the frontend now.

---

## Phase 1: Security Infrastructure (Frontend-fixable NOW)

### 1.1 [x] Add security headers via `public/_headers` (Cloudflare Pages)
- CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS

### 1.2 [x] Add `<meta>` CSP tag in `index.html` as fallback

### 1.3 [x] Install DOMPurify — sanitize ALL user inputs before storage/email
- `npm install dompurify`
- Create `src/utils/sanitize.js` helper
- Apply in emailService.js before sending/storing

### 1.4 [x] Fix weak reference number generation
- Replace `Math.random()` with `crypto.getRandomValues()` in both `emailService.js` and `mockApi.js`

### 1.5 [x] Add client-side rate limiting utility
- Create `src/utils/rateLimit.js`
- Apply to all form submissions (max 3 per 5 minutes)

---

## Phase 2: Data Flow Fixes

### 2.1 [x] Fix EmailJS fallback localStorage keys
- Change from `eds-${templateId}` (literal template ID) to meaningful keys:
  - `eds-contact-messages`, `eds-appointments`, `eds-registrations`, `eds-newsletter`

### 2.2 [x] Strengthen form validation across ALL forms
- **ContactPage**: Tighten email regex, add maxLength to message
- **AppointmentPage**: Consistent email regex, add date validation (future only, not Friday)
- **RegisterPage**: Add validation to step 3, validate DOB (age 1-150), validate blood group enum, require allergies text when toggle on
- **HomePage newsletter**: Show error message text (not just red border)

### 2.3 [x] Add React Error Boundary
- Create `src/components/ui/ErrorBoundary.jsx`
- Wrap app in `main.jsx`

### 2.4 [x] Fix form reset after successful submission
- AppointmentPage and RegisterPage should call `reset()` on success

### 2.5 [x] Centralize contact information
- Create `src/config/contact.js` with phone, address, WhatsApp, email, social links
- Update Footer, Navbar, ContactPage, WhatsAppFloat, AppointmentPage to import from config

---

## Phase 3: Compliance Foundations (Frontend-side)

### 3.1 [x] Create Privacy Policy page
- `src/pages/PrivacyPolicyPage.jsx`
- Add route in App.jsx
- Link from Footer
- Cover: data collection, usage, storage, third-party sharing (EmailJS), rights, contact

### 3.2 [x] Create Terms of Service page
- `src/pages/TermsPage.jsx`
- Add route in App.jsx

### 3.3 [x] Add consent checkboxes to ALL data-collecting forms
- Contact form: "I agree to the privacy policy"
- Registration form: "I consent to collection of my medical information"
- Appointment form: "I agree to the privacy policy"
- Newsletter: link to privacy policy

### 3.4 [x] Add HIPAA disclaimer banner
- Show on Register/Appointment pages: "This system is not yet HIPAA-compliant. Do not submit real medical records."

### 3.5 [x] Add data retention notice
- localStorage data notice in forms: "Data stored locally in your browser only"

---

## Phase 4: Code Quality & Cleanup

### 4.1 [x] Remove unused `mockApi.js` or mark as deprecated
- emailService.js is the actual API — mockApi.js is dead code

### 4.2 [x] Reviewed "Directions (English)" — intentional design (shows both EN/BN side by side)

### 4.3 [x] Fix allergies state management in RegisterPage
- Sync `hasAllergies` with form state properly

---

## Phase 5: Backend Requirements Checklist (FUTURE — documented for reference)

When backend is built, these MUST be implemented:
- [ ] Encrypted database (AES-256 at rest)
- [ ] JWT/OAuth2 authentication
- [ ] Role-based access control (patient/doctor/admin)
- [ ] Audit logging for all PHI access
- [ ] HIPAA-compliant email service (replace EmailJS, sign BAA)
- [ ] FHIR R4 resource schemas (Patient, Appointment, Practitioner)
- [ ] CSRF tokens on all forms
- [ ] Server-side input validation (mirror client-side)
- [ ] Rate limiting at API level
- [ ] Breach detection & notification system
- [ ] Data retention policy enforcement (auto-delete)
- [ ] Patient portal (data access, amendment, deletion)
- [ ] Business Associate Agreements with all vendors
- [ ] Backup & disaster recovery procedures
- [ ] Security penetration testing

---

## Files Modified Tracker

| File | Changes |
|------|---------|
| `public/_headers` | NEW — security headers |
| `index.html` | CSP meta tag |
| `package.json` | Added dompurify |
| `src/utils/sanitize.js` | NEW — input sanitization |
| `src/utils/rateLimit.js` | NEW — client rate limiting |
| `src/utils/emailService.js` | Fixed keys, sanitization, crypto ref numbers |
| `src/utils/mockApi.js` | Deprecated or removed |
| `src/config/contact.js` | NEW — centralized contact info |
| `src/components/ui/ErrorBoundary.jsx` | NEW — error boundary |
| `src/pages/ContactPage.jsx` | Validation, consent, contact config |
| `src/pages/AppointmentPage.jsx` | Validation, consent, reset, date validation |
| `src/pages/RegisterPage.jsx` | Validation, consent, allergies fix, reset |
| `src/pages/HomePage.jsx` | Newsletter error messages |
| `src/pages/PrivacyPolicyPage.jsx` | NEW — privacy policy |
| `src/pages/TermsPage.jsx` | NEW — terms of service |
| `src/App.jsx` | Error boundary, new routes |
| `src/main.jsx` | Error boundary wrapper |
| `src/components/layout/Footer.jsx` | Privacy/Terms links, contact config |
| `src/components/ui/WhatsAppFloat.jsx` | Contact config |
