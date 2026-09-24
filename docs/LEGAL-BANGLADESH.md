# Bangladesh legal and clinical launch planning

Research date: 2026-09-24. This is a source-backed engineering launch checklist, not a legal opinion or a statement that the demo operates a licensed clinic. Review Bengali statutory text, current regulations, gazettes and the actual service model with qualified local counsel before patient intake.

## Current legal baseline

The official database lists the **Personal Data Protection Act, 2026 (Act 63)**, replacing the 2025 ordinance. Section 1 treats most provisions as effective from 6 November 2025, while sections 23 and 31–35 require later commencement by gazette after the specified 18-month period. Health data is sensitive personal data. The Act addresses consent, children, rights, security, retention and processors. Section 29 regulates cross-border transfers and specified large transfers requiring notification. It does not justify copying the superseded ordinance's cloud-localization wording into a current plan. Exact classification, regulations and commencement must be checked at launch. [Official Act](https://bdlaws.minlaw.gov.bd/act-print-1692.html).

The **Cyber Protection Act, 2026 (Act 81)** replaced the 2025 cyber ordinances. The official text also records a **2026 amendment (Act 99)**. Review the consolidated law, not an old Cyber Security Act 2023 checklist. [Current opening provisions](https://bdlaws.minlaw.gov.bd/act-1710/act-chapter-print-2767.html), [amended offence provisions](https://bdlaws.minlaw.gov.bd/act-1710/act-chapter-print-2772.html), [repeal provisions](https://bdlaws.minlaw.gov.bd/act-1710/act-chapter-print-2775.html).

## Proposed data-protection implementation

The following are project engineering requirements to validate against the Act and implementing rules, not quotations of universal legal deadlines:

| Workflow | Proposed project control | Launch evidence |
|---|---|---|
| Intake | Collect minimum contact/clinical fields; show reviewed Bangla/English notice before submission | Approved field/purpose inventory and notice versions |
| Consent | Separate purposes; record notice version and positive action; allow withdrawal | Consent/withdrawal tests and legal basis review |
| Children/guardians | Verify authority through a designed workflow; avoid excessive identity collection | Clinical/legal guardian policy and denial tests |
| Rights | Verified access/correction/export/deletion request queue with jurisdiction-specific deadlines | Request simulation, exceptions and escalation records |
| Confidentiality | Staff MFA, care assignment, tenant/subject scope and minimized audit payloads | Negative authorization and privileged-access review |
| Retention | Approved category-specific schedule and legal holds; no blanket automatic record deletion | Retention decision record and dry-run/restore tests |
| Transfers | Inventory primary/backup/log/support locations and each processor | Approved transfer analysis and contractual protections |
| Incident | Record discovery and preserve evidence; assess current local notification requirements | Named local response owner and exercised contact procedure |

Do not import GDPR's 72-hour notification timer as Bangladesh law. Do not treat consent as a blanket permission for any overseas service. Authority notifications, registration/officer obligations and implementing procedures need current local review, including any delayed commencement.

## Professional duties and content

BMDC publishes a professional ethics code with medical-record confidentiality and professional-information/promotion sections. Use it to review actual clinician identity, qualifications, clinical claims, patient images, testimonials and disclosure workflows. The official site also publishes telemedicine guidelines; adding video/chat diagnosis or prescribing requires a separate clinical and professional-scope assessment. A booking website does not establish permission for telemedicine. [BMDC](https://www.bmdc.org.bd/), [ethics code](https://www.bmdc.org.bd/docs/EthicsBookMakeupfinal.pdf), [telemedicine guidelines](https://www.bmdc.org.bd/docs/BMDC_Telemedicine_Guidelines_July2020.pdf).

Proposed project gates: verify practitioners against the relevant register; replace fictional profiles with approved facts; obtain specific permissions for patient media; review advertising and outcome statements; define record access, amendment and emergency referral; and confirm whether any proposed remote dental service is within professional scope. No production medical advice or prescribing is enabled by this repository.

## Facility and business operation

The 1982 Medical Practice and Private Clinics and Laboratories Ordinance regulates medical practice and private clinics/laboratories. Its definition of private clinic concerns facilities where patients are admitted and kept for treatment; do not automatically classify every outpatient dental chamber identically. DGHS publishes private-facility registration guidance. Confirm the actual facility category and applicable licensing route. [Official ordinance](https://bdlaws.minlaw.gov.bd/act-print-620.html), [DGHS registration guidance](https://git.dghs.gov.bd/mahfuj/chatbot-knowledge/src/commit/28ad646bdd0e6a57b5277e95395ce8a198dc7f5d/PrivateHospitalRegistration.md).

Local launch decisions still required: operating entity and trade permissions, tax/VAT applicability, clinic registration/renewal, equipment/radiology and waste permissions where relevant, clinician supervision, records/cash receipts, advertised charges, cancellation/refunds and complaint contacts. These are a review inventory, not a finding that each permit applies to every deployment.

## Hosting, payments and million-user expansion

Proposed architecture keeps clinical data segregated from public CDN delivery and records all transfer/backup paths. Select regions only after the legal data-classification decision. Assess whether scale changes regulatory classification, audit/officer requirements or risk-assessment scope. A million-user target cannot be used to justify collecting extra identity data.

Verify payment-provider country availability, merchant eligibility, currency/settlement, refund rules and contracts before implementation. The preserved Stripe prototype is not evidence that a Bangladesh operator can onboard to Stripe. Use provider sandbox tests only until the commercial and clinical release gates are approved.

## Open decisions before launch

A named operator must approve the final statutory version/commencement register, implementing-rule review, data classification/transfer position, professional/facility licensing, rights/incident deadlines, notices, retention, vendor terms and clinical escalation. This task does not establish those operator-specific approvals. Recheck the official legal database at each launch and material scope change; the 2025-to-2026 replacement demonstrates why old checklists can become unsafe.
