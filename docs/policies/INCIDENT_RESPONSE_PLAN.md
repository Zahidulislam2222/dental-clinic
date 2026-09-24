# Incident response plan

**Draft for adoption — 2026-09-24.** Assign an incident commander, technical responder, clinical lead, privacy/legal lead and communications owner before operating a clinical service. No staffed response SLA exists for this demo.

1. Detect and triage: record discovery time, affected systems and evidence; distinguish availability failure from suspected disclosure or integrity loss.
2. Contain: restrict compromised identities/paths using reviewed changes; preserve evidence and avoid destructive cleanup. Rotate exposed credentials through the approved process.
3. Assess: determine subjects, categories, jurisdictions, processor duties and clinical impact. Maintain separate notification clocks and a documented decision log.
4. Eradicate and recover: fix locally, review, test, deploy, verify parity, restore integrity and monitor recurrence. Reconcile appointments and jobs after recovery.
5. Communicate: use approved factual messages and verified private channels. Never publish patient details or unverified attribution.
6. Review: record timeline, root cause, escaped control, remediation owner and regression gate in the defect/risk records.

HIPAA notification, GDPR authority/data-subject notification, US state duties and Bangladesh requirements differ. A single generic deadline is unsuitable; use [legal research](../LEGAL-RESEARCH.md) and [Bangladesh launch review](../LEGAL-BANGLADESH.md). Contractual vendor notice deadlines may be shorter than statutory outer limits. Counsel/privacy owners determine actual recipients and deadlines from facts.

Proposed exercises: before clinical launch and twice yearly, including stolen staff identity, patient-data exposure, regional outage and corrupted backup. Keep incident evidence access-controlled with a retention/hold decision.
