# Vendor Management Policy

**Everyday Dental Surgery & Implant Center**
**SOC 2 TSC: CC9 (Risk Mitigation)**
**HIPAA: 164.308(b), 164.314(a)**
**Version:** 1.0 | **Effective:** 2026-04-02 | **Review:** Annual

---

## 1. Purpose

Assess and manage risks associated with third-party service providers that process, store, or transmit clinic data.

## 2. Vendor Risk Assessment

### 2.1 Supabase (Database, Auth, Edge Functions)

| Attribute | Details |
|-----------|---------|
| **Data Processed** | All PHI, PII, and internal data |
| **BAA Status** | Required — must be signed before production use |
| **SOC 2 Status** | SOC 2 Type II certified |
| **Encryption** | AES-256 at rest, TLS 1.2+ in transit |
| **Data Location** | AWS regions (configurable) |
| **Backup** | PITR, managed HA |
| **Risk Level** | High (processes PHI) |
| **Mitigation** | BAA, column-level encryption, RLS, audit logging |

### 2.2 Cloudflare Pages (Website Hosting/CDN)

| Attribute | Details |
|-----------|---------|
| **Data Processed** | Static files only — no PHI |
| **BAA Status** | Not required (no PHI processing) |
| **SOC 2 Status** | SOC 2 Type II certified |
| **Encryption** | TLS 1.2+ automatic |
| **Data Location** | Global edge network |
| **Risk Level** | Low (serves static assets only) |

### 2.3 Resend (Email Notifications)

| Attribute | Details |
|-----------|---------|
| **Data Processed** | Email addresses only — no PHI in email body |
| **BAA Status** | Required — signed BAA for email delivery |
| **Encryption** | TLS in transit |
| **Risk Level** | Medium (processes email addresses) |
| **Mitigation** | BAA, no PHI in email content, ref numbers only |

### 2.4 Google Fonts (Typography)

| Attribute | Details |
|-----------|---------|
| **Data Processed** | Client IP addresses (font requests) |
| **BAA Status** | Not required |
| **Risk Level** | Low |

## 3. BAA Requirements

All vendors that process, store, or transmit PHI must have a signed Business Associate Agreement (BAA) before production use.

**BAA Checklist:**
- [ ] Supabase BAA signed and filed in `docs/baa/`
- [ ] Resend BAA signed and filed in `docs/baa/`
- [ ] BAAs reviewed annually for adequacy

## 4. Vendor Review Schedule

- **Annually:** Full vendor risk reassessment
- **On Change:** When vendor terms, services, or data handling changes
- **On Incident:** After any vendor security incident

## 5. Vendor Offboarding

When discontinuing a vendor:
1. Verify all clinic data is exported/migrated
2. Confirm vendor data deletion per BAA terms
3. Revoke all API keys and credentials
4. Update privacy policy and CSP headers
5. Document in change management log
