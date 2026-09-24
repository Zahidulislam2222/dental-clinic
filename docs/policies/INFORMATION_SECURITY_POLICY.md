# Information security policy

**Draft for adoption — 2026-09-24.** Scope: future clinic staff, operators, vendors and systems handling clinic information. The current application is synthetic.

| Responsibility | Proposed owner |
|---|---|
| Risk acceptance and funding | Operating entity leadership |
| Control design, incidents and evidence | Security lead |
| Lawful use, notices and rights | Privacy/legal lead |
| Clinical safety and record integrity | Clinical lead |
| Identity, backups, monitoring and releases | Platform operator |

Require least privilege, staff MFA, approved devices, supported software, encrypted transport/storage, restricted backups, secure secret storage and traceable changes. Never share staff identities or put patient information in public issues, consumer AI tools or unapproved messaging services.

Apply [classification](DATA_CLASSIFICATION.md), [access](ACCESS_CONTROL_POLICY.md), [vendor](VENDOR_MANAGEMENT.md) and [incident](INCIDENT_RESPONSE_PLAN.md) policies. Review exceptions with owner, reason, expiry and compensating controls. Review policy at least annually and after incidents or material legal/system changes. Store approvals and workforce acknowledgements privately. Map controls to [OWASP ASVS](https://github.com/OWASP/ASVS) and applicable law; no certification is implied.
