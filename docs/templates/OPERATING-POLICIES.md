# Operating policy templates

Draft policies for the organization that will eventually operate Everyday Dental as a real clinic. They define responsibilities and the evidence each policy needs. They take effect only when an operator adopts them, names the owners, and reviews them against its jurisdiction and vendors.

**Contents:** [Information security](#1-information-security) · [Access control](#2-access-control) · [Data classification](#3-data-classification) · [Privacy impact assessment](#4-privacy-impact-assessment) · [Risk assessment](#5-risk-assessment) · [Incident response](#6-incident-response) · [Business continuity](#7-business-continuity) · [Change management](#8-change-management) · [Vendor management](#9-vendor-management) · [Security training](#10-security-training)

---

## 1. Information security

**Scope:** clinic staff, operators, vendors and systems that handle clinic information.

| Responsibility | Owner |
|---|---|
| Risk acceptance and funding | Operator leadership |
| Control design, incidents and evidence | Security lead |
| Lawful use, notices and rights | Privacy or legal lead |
| Clinical safety and record integrity | Clinical lead |
| Identity, backups, monitoring and releases | Platform operator |

**Requirements:** least privilege, staff MFA, approved and supported devices, encryption in transit and at rest, restricted backups, a secret store, and traceable changes. Staff never share accounts or put patient information in public issues, consumer AI tools or unapproved messaging apps.

**Exceptions** are recorded with an owner, reason, expiry date and compensating controls. **Review** at least annually and after incidents or major legal or system changes. Controls are mapped to [OWASP ASVS](https://github.com/OWASP/ASVS) and applicable law.

## 2. Access control

| Role | Access |
|---|---|
| Patient | Their own verified records and permitted self-service actions |
| Reception | Scheduling and administrative fields for their clinic; no default clinical access |
| Clinician | Records for patients under their care |
| Administrator | Named administration duties; no automatic access to clinical records |
| Service account | Only the operations it performs, with protected credentials |

- Access scope is derived on the server and enforced with row- and column-level policies.
- Deny by default, including tenant mismatch, revoked role, expired token, missing care relationship and unauthorized export.
- Privileged changes require MFA and a logged approval.
- Emergency ("break-glass") access is time-limited, justified, notified and reviewed.
- Access is granted through a verified approval and revoked on termination or role change, including active sessions and caches.
- Access reviews run quarterly and after staffing or security changes.
- Grants, denials and changes are logged without unnecessary health details.

## 3. Data classification

| Class | Examples | Handling |
|---|---|---|
| Public | Approved clinic content, sample data, public docs | Reviewed before publishing; media rights confirmed |
| Internal | Plans and operating notes | Staff access only; never in a public repository |
| Personal | Contact, account and support information | Purpose-limited, access-controlled, retained per schedule |
| Clinical (restricted) | Symptoms, records, appointment details, exports | Strong identity, patient and tenant scope, encryption, audit, approved regions |
| Secret | Keys, passwords, recovery codes, signing material | Secret store, least privilege, rotation, protected recovery |

Metadata can reveal health information: an email address next to an appointment type is clinical in context. Clinical data stays out of URLs, shared caches, telemetry and screenshots. Exports are stored privately with limited access. Backups are encrypted with separately managed keys. Fixtures and public tests use sample data only. Legal definitions differ by jurisdiction and must be mapped separately.

## 4. Privacy impact assessment

For each workflow, record: data subjects and categories, purpose, legal basis, source, recipients, processors, regions, retention, how rights are exercised, and why each field is necessary. Assess children and guardians, sensitive data, profiling, transfers, support access and backups, and decide whether a formal assessment (such as a GDPR DPIA) is legally required.

| Risk | Mitigation |
|---|---|
| Collecting too much | Field-by-field necessity review |
| Cross-patient or cross-tenant access | Server-side scope, row-level security, denial tests |
| Marketing disclosure | Marketing as a separate optional purpose; no tracking on clinical pages |
| Invalid consent or authority | Versioned notices; verified guardian workflow |
| Erasure conflicts | Retention schedule, hold review, documented response |
| Overseas support or backups | Transfer map, approved contracts and regions |
| A restore brings back revoked access | Re-apply withdrawals and deletions after restore; test it |

Approved by product, privacy, clinical and security owners. Reassess before adding vendors, AI, telemetry, jurisdictions or significantly more processing.

## 5. Risk assessment

Each risk records: asset, threat, vulnerability, likelihood, impact, existing controls with evidence, treatment, owner, deadline and residual risk. Clinical harm, privacy, integrity, availability and continuity are weighed together on a documented likelihood and impact scale.

**Initial risks:** the [clinical release blockers](../CLINICAL-RELEASE.md), key recovery, vendor failure, public claims, media rights, dependency compromise, privileged access, backup loss, single failure domain and overload. The [threat model](../THREAT-MODEL.md) is the starting point.

**Review** before launch, quarterly, after incidents and before major architecture, vendor or jurisdiction changes. Risk acceptance needs accountable leadership and an expiry date, and never waives legal or patient-safety duties.

## 6. Incident response

**Roles assigned before launch:** incident commander, technical responder, clinical lead, privacy or legal lead, communications owner.

1. **Detect and triage.** Record discovery time, affected systems and evidence. Separate outages from suspected disclosure or data corruption.
2. **Contain.** Restrict compromised accounts and paths with reviewed changes. Preserve evidence. Rotate exposed credentials.
3. **Assess.** Identify affected people, data categories, jurisdictions, vendor duties and clinical impact. Track each notification deadline separately with a decision log.
4. **Recover.** Fix locally, review, test, deploy and verify. Restore integrity, reconcile appointments and jobs, monitor for recurrence.
5. **Communicate.** Approved, factual messages through verified channels. Never publish patient details or unconfirmed attribution.
6. **Review.** Timeline, root cause, missed control, remediation owner and new regression check.

Notification rules differ: HIPAA, GDPR, US state law and Bangladesh law each set their own recipients and deadlines, and vendor contracts may be stricter. See the [US and EU](../LEGAL-RESEARCH.md) and [Bangladesh](../LEGAL-BANGLADESH.md) research. **Exercises** before launch and twice a year: stolen staff account, patient-data exposure, regional outage and corrupted backup.

## 7. Business continuity

Recovery covers the database, uploads, identity configuration, audit records and usable decryption keys, with an independent encrypted copy and restricted deletion rights. Source control is not a patient-data backup. Target recovery times are set in [Operations](../OPERATIONS.md#recovery-objectives).

**Recovery sequence:**

1. Identify the failed component and appoint incident and clinical owners.
2. Protect evidence and the latest recoverable state; choose a verified recovery point.
3. Restore in isolation and validate integrity, access scope, keys, holds and withdrawals.
4. Reconcile confirmed bookings, payments and queued jobs without duplicate notifications.
5. Cut over through a normal reviewed deployment, verify user flows, then monitor.

During downtime, use an approved secure manual scheduling process, never an improvised shared spreadsheet, and reconcile manual actions afterwards. **Drills** before launch, quarterly restores, and an annual full failure exercise.

## 8. Change management

The reviewed source in Git is authoritative; production is a deployment target.

1. Write acceptance criteria and check for drift between the server and source.
2. Make the smallest change; run tests, type checks, lint, security scans and the build; verify the real user flow.
3. Get an independent review.
4. Deploy a versioned artifact, compare file hashes and keep a tested rollback.
5. Update documentation and the changelog, and log any escaped defect with the check that would have caught it.

Database changes also need clean-install and upgrade tests, data preservation checks, lock and backfill limits, and a rollback or roll-forward plan. Emergency changes follow the same review, just faster; urgency never justifies disabling security scans. See [Operations](../OPERATIONS.md).

## 9. Vendor management

| Vendor type | Review before use |
|---|---|
| Hosting and CDN | Network metadata, caching, logs, regions, TLS and support access |
| Database and identity | Health-data eligibility, contracts, MFA, row-level security, backups |
| Notifications | Health information in message content, approved recipients and templates, delivery logs |
| Payments | Country eligibility, hosted payment scope, settlement, refunds, webhooks |
| Monitoring and support | Redaction, retention, access, subprocessors |
| Media, fonts and maps | Licenses and visitor data exposure; prefer self-hosted assets |

For each vendor record: purpose, data categories, processing locations, role (processor or business associate), security evidence, contract status, subprocessors, incident contacts, retention and deletion, cost and exit plan. Request current assurance reports where relevant; a SOC 2 report is an attestation, not a product certification. Whether a BAA is needed depends on actual data handling (see [BAA templates](BAA.md)). Review at onboarding, renewal and after major changes.

## 10. Security training

Training is completed before anyone gets access to clinical systems, refreshed annually and updated after incidents or major changes. Topics: phishing, MFA, approved devices, minimum necessary access, patient and guardian identity checks, confidentiality, secure messaging, rights requests, incident reporting and downtime procedures.

| Role | Additional exercise |
|---|---|
| Reception | Limited-scope scheduling and identity checks |
| Clinician | Care assignment, record corrections, emergency-access justification |
| Administrator | Role changes, revocation and audit review |
| Engineer or operator | Secrets, safe changes, restores and incident evidence |

Exercises use sample scenarios only. Results are recorded, and gaps are closed before privileged access is granted.
