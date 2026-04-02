# Data Classification Policy

**Everyday Dental Surgery & Implant Center**
**SOC 2 TSC: CC6 (Logical and Physical Access Controls)**
**HIPAA: 164.312(a)(2)(iv)**
**Version:** 1.0 | **Effective:** 2026-04-02 | **Review:** Annual

---

## 1. Classification Levels

### Level 1: PHI (Protected Health Information)
- **Definition:** Any individually identifiable health information
- **Storage:** Encrypted at rest (pgcrypto AES-256), encrypted in transit (TLS 1.2+)
- **Access:** Doctor, Admin only (via decrypted views). Receptionist sees masked views.
- **Retention:** 7 years minimum (HIPAA)
- **Disposal:** Automated purge per retention policy, logged

**PHI Data Elements:**
| Table | Column | Encrypted |
|-------|--------|-----------|
| registrations | medical_history | Yes (BYTEA) |
| registrations | allergies | Yes (BYTEA) |
| registrations | date_of_birth | Yes (BYTEA) |
| registrations | blood_group | Yes (BYTEA) |
| appointments | medical_notes | Yes (BYTEA) |

### Level 2: PII (Personally Identifiable Information)
- **Definition:** Information that can identify an individual but is not health-related
- **Storage:** Database with RLS, not encrypted at column level
- **Access:** Staff roles per RBAC policy
- **Retention:** Per retention policy (1-7 years depending on table)

**PII Data Elements:**
| Table | Column |
|-------|--------|
| registrations / appointments | patient_name, patient_phone, patient_email |
| contacts | from_name, from_phone, from_email |
| user_profiles | full_name, phone |
| audit_logs | user_email, ip_address |

### Level 3: Internal
- **Definition:** Business data not containing PHI or PII
- **Storage:** Database with RLS
- **Access:** Staff roles
- **Examples:** Service types, appointment dates/times, ref numbers, newsletter emails

### Level 4: Public
- **Definition:** Information intended for public access
- **Storage:** Static files, website content
- **Access:** Anyone
- **Examples:** Service descriptions, pricing, clinic hours, blog posts

## 2. Handling Rules

| Action | PHI | PII | Internal | Public |
|--------|-----|-----|----------|--------|
| Email | Never in body | Ref # only | OK | OK |
| Logging | Stripped from audit | IP logged | OK | N/A |
| Export | FHIR Bundle (authenticated) | Included in FHIR | N/A | N/A |
| Screen Display | Authenticated + role check | Authenticated | Authenticated | Anyone |
| Backup | Encrypted (Supabase PITR) | Encrypted | Standard | N/A |

## 3. Data Flow

```
Patient Browser → HTTPS → Cloudflare CDN → Supabase Edge Functions → PostgreSQL (RLS + pgcrypto)
                                                                   ↓
                                                            Audit Log (no PHI)
```
