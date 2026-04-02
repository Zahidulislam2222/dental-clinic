# Privacy Impact Assessment

**Everyday Dental Surgery & Implant Center**
**SOC 2 TSC: P1 (Privacy)**
**HIPAA: 164.308(a)(1)**
**Version:** 1.0 | **Effective:** 2026-04-02 | **Review:** Annual

---

## 1. System Description

Everyday Dental Surgery operates a React-based patient portal and clinic management system backed by Supabase (PostgreSQL, Auth, Edge Functions) hosted on Cloudflare Pages. The system processes PHI for dental appointments, patient registrations, and medical records.

## 2. Data Flow Mapping

```
1. Patient visits website (Cloudflare Pages — static, no PHI)
2. Patient submits form (React → Supabase Edge Function)
3. Edge Function validates, sanitizes, encrypts PHI
4. Data stored in PostgreSQL with RLS + pgcrypto encryption
5. Audit log created (no PHI in log)
6. Notification sent via Resend (no PHI in email)
7. Staff views data via admin portal (authenticated, role-checked, audit-logged)
8. Patient views own data via patient portal (authenticated, audit-logged)
```

## 3. Privacy Risk Identification

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| PHI exposed in email | Low | High | Email body never contains PHI — ref numbers only |
| PHI in browser localStorage | Low | Medium | Supabase stores data server-side; localStorage fallback for dev only |
| PHI in audit logs | Low | High | Audit trigger strips all PHI/encrypted columns |
| PHI in error messages | Low | Medium | Generic error messages; server logs do not expose PHI |
| Unauthorized PHI access | Low | High | RBAC, RLS, encryption, audit logging, anomaly detection |
| PHI in FHIR export | Medium | Medium | Export requires authentication; data is patient's own right |
| PHI retention beyond need | Low | Medium | Automated retention purge per configurable policy |

## 4. Data Minimization

- Registration forms collect only clinically necessary information
- Receptionist view excludes PHI columns (medical_history, allergies, DOB, blood_group)
- Contact form does not collect any PHI
- Newsletter subscription collects email only
- All data access follows HIPAA Minimum Necessary Standard

## 5. Patient Rights Implementation

| Right | HIPAA Section | Implementation |
|-------|--------------|----------------|
| Access | 164.524 | Patient portal + FHIR Bundle export |
| Amendment | 164.526 | Data request form (type: amendment) |
| Restriction | 164.522 | Data request form (type: restriction) |
| Accounting of Disclosures | 164.528 | Audit logs track all PHI access |
| Breach Notification | 164.404 | Automated detection + 60-day notification deadline |
| Consent | 164.508 | Consent records table (immutable) |

## 6. Third-Party Data Sharing

| Recipient | Data Shared | Purpose | Safeguard |
|-----------|-------------|---------|-----------|
| Supabase | All data (encrypted) | Database hosting | BAA, SOC 2 certified |
| Cloudflare | Static files (no PHI) | CDN/hosting | No PHI processed |
| Resend | Email addresses only | Notifications | BAA, no PHI in email body |

## 7. Recommendations

1. Maintain all BAAs current and review annually
2. Conduct annual PIA review
3. Monitor for regulatory changes affecting data privacy
4. Consider implementing data anonymization for analytics use
