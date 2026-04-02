# Access Control Policy

**Everyday Dental Surgery & Implant Center**
**SOC 2 TSC: CC6 (Logical and Physical Access Controls)**
**HIPAA: 164.312(a)(1), 164.308(a)(3-4)**
**Version:** 1.0 | **Effective:** 2026-04-02 | **Review:** Annual

---

## 1. Purpose

Define who can access what data and under what conditions, enforcing the HIPAA Minimum Necessary Standard.

## 2. Role Definitions

### 2.1 Patient

- **Can:** View own profile, appointments, medical data, consent history
- **Can:** Download own data in FHIR R4 format
- **Can:** Submit data access/amendment/deletion requests
- **Cannot:** Access other patients' data
- **Cannot:** Access admin panel or audit logs

### 2.2 Receptionist

- **Can:** View all appointments (non-PHI: name, phone, date, time, service)
- **Can:** View registrations (non-PHI view: no medical history, allergies, DOB, blood group)
- **Can:** View contacts and newsletter subscribers
- **Cannot:** View decrypted PHI columns (medical_history, allergies, date_of_birth, blood_group, medical_notes)
- **Cannot:** Modify user roles or view audit logs

### 2.3 Doctor

- **Can:** View all patient data including decrypted PHI
- **Can:** View FHIR resources
- **Can:** Access admin panel (appointments, registrations)
- **Cannot:** Modify user roles, manage retention policies, or resolve data requests

### 2.4 Admin

- **Can:** Full access to all data, audit logs, user management
- **Can:** Resolve patient data requests (approve/deny)
- **Can:** Configure retention policies and anomaly detection rules
- **Can:** Manage security incidents
- **Can:** Change user roles (except their own)

## 3. Access Provisioning

1. New accounts default to `patient` role
2. Role elevation requires admin approval and is audit-logged
3. Staff accounts require email verification + MFA enrollment
4. Service accounts (Edge Functions) use `service_role` key

## 4. Access Deprovisioning

1. Departing staff: admin deactivates account within 24 hours
2. Account deactivation revokes all sessions immediately
3. Departing staff access is logged as a security event

## 5. Access Reviews

- **Quarterly:** Admin reviews all user roles and access levels
- **Annually:** Full access rights audit with documentation
- **On-demand:** After any security incident

## 6. Technical Controls

| Control | Implementation |
|---------|---------------|
| Authentication | Supabase Auth (JWT, email/password, phone OTP) |
| Session Management | 15-min inactivity timeout, auto-refresh tokens |
| Row Level Security | PostgreSQL RLS policies per role |
| Column Encryption | pgcrypto AES-256 on all PHI columns |
| API Authorization | Edge Functions verify JWT + role before data access |
| Audit Trail | Every data access logged (including SELECT via Edge Functions) |
