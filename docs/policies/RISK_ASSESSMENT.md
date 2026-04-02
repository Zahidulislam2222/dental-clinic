# Risk Assessment

**Everyday Dental Surgery & Implant Center**
**SOC 2 TSC: CC3 (Risk Assessment)**
**HIPAA: 164.308(a)(1)(ii)(A)**
**Version:** 1.0 | **Effective:** 2026-04-02 | **Review:** Annual

---

## 1. Purpose

Identify, evaluate, and mitigate risks to the confidentiality, integrity, and availability of electronic Protected Health Information (ePHI) and clinic systems.

## 2. Methodology

Risk = Likelihood (1-5) x Impact (1-5). Score 1-8: Low, 9-15: Medium, 16-25: High.

## 3. Threat Model

### 3.1 External Threats

| Threat | Likelihood | Impact | Score | Mitigation |
|--------|-----------|--------|-------|------------|
| Unauthorized access to patient portal | 3 | 5 | 15 | MFA, session timeout, RBAC, rate limiting |
| SQL injection | 2 | 5 | 10 | Supabase parameterized queries, input sanitization |
| XSS attacks | 2 | 4 | 8 | DOMPurify, CSP headers, input sanitization |
| Phishing targeting staff credentials | 3 | 5 | 15 | MFA, security training, password policy |
| DDoS against clinic website | 2 | 3 | 6 | Cloudflare DDoS protection, edge caching |
| Data breach via third-party | 2 | 5 | 10 | BAAs with all vendors, vendor risk assessment |
| Ransomware | 2 | 5 | 10 | Supabase managed backups, PITR, no local PHI storage |

### 3.2 Internal Threats

| Threat | Likelihood | Impact | Score | Mitigation |
|--------|-----------|--------|-------|------------|
| Unauthorized data access by staff | 2 | 4 | 8 | RBAC, audit logging, quarterly access reviews |
| Accidental data disclosure | 2 | 4 | 8 | Minimum necessary access, PHI encryption, no PHI in emails |
| Improper data disposal | 1 | 4 | 4 | Automated retention policies, secure purge |
| Lost/stolen device with access | 2 | 4 | 8 | Session management, no local PHI storage, remote wipe |

### 3.3 Technical/Infrastructure Risks

| Threat | Likelihood | Impact | Score | Mitigation |
|--------|-----------|--------|-------|------------|
| Database failure | 1 | 5 | 5 | Supabase managed HA, PITR backups |
| Encryption key compromise | 1 | 5 | 5 | Supabase Vault, key rotation procedures |
| Certificate expiration | 1 | 3 | 3 | Cloudflare automatic TLS, monitoring |
| Edge Function failures | 2 | 3 | 6 | Error handling, fallback mechanisms, monitoring |

## 4. Risk Register Summary

- **High Risk (16-25):** None currently
- **Medium Risk (9-15):** 3 items — unauthorized access, phishing, SQL injection
- **Low Risk (1-8):** 8 items

## 5. Residual Risk

After mitigations, no residual risk exceeds Medium. All Medium risks have compensating controls (MFA, audit trails, anomaly detection).

## 6. Review Schedule

- Full risk assessment: Annually (April)
- Supplemental assessment: After any security incident
- Threat landscape review: Quarterly
