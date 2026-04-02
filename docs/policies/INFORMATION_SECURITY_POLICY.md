# Information Security Policy

**Everyday Dental Surgery & Implant Center**
**SOC 2 TSC: CC1 (Control Environment)**
**Version:** 1.0 | **Effective:** 2026-04-02 | **Review:** Annual

---

## 1. Purpose

This policy establishes the security framework for protecting patient data, business systems, and digital assets at Everyday Dental Surgery. It ensures compliance with HIPAA Security Rule (45 CFR Part 164), FHIR R4 data standards, and SOC 2 Trust Service Criteria.

## 2. Scope

Applies to all employees, contractors, and third-party service providers who access, process, or manage clinic information systems.

## 3. Roles & Responsibilities

| Role | Responsibilities |
|------|-----------------|
| **Security Officer** | Overall security program, risk assessment, incident response, policy maintenance |
| **Clinic Administrator** | User account management, access reviews, BAA management |
| **Doctor / Practitioner** | Patient data access per minimum necessary standard, HIPAA compliance |
| **Receptionist** | Limited data access (no PHI medical details), appointment management |
| **IT Administrator** | System configuration, patch management, backup verification |

## 4. Acceptable Use

- Clinic systems are for authorized business purposes only
- Personal devices must not store PHI unless encrypted and approved
- Sharing credentials is strictly prohibited
- All PHI access must go through authenticated, audited systems
- Screen locks must activate after 2 minutes of inactivity on workstations

## 5. Password Policy

- Minimum 8 characters with uppercase letter and number
- Passwords must not be reused across 12 previous passwords
- Multi-factor authentication (MFA) required for all staff accounts
- Passwords must be changed every 90 days for staff
- Failed login lockout: 5 attempts in 15 minutes = 30-minute lockout

## 6. Remote Access

- All remote access uses HTTPS/TLS 1.2+ encryption
- VPN required for administrative access to Supabase dashboard
- Session auto-logout after 15 minutes of inactivity (HIPAA 164.312(a)(2)(iii))
- No PHI may be accessed on public/shared computers

## 7. Data Classification

See `DATA_CLASSIFICATION.md` for full classification schema.

## 8. Enforcement

Violations may result in disciplinary action up to and including termination. Security incidents must be reported immediately to the Security Officer.

## 9. Review

This policy is reviewed annually or upon significant changes to systems, regulations, or threat landscape.
