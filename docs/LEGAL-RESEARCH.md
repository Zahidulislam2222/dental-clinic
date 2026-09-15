# US and EU privacy, health-data and accessibility readiness

## Executive assessment

Everyday Dental is a fictional portfolio demonstration. Its useful professional claim is that it demonstrates selected privacy and security decisions, documents their limits, and provides a reviewable route to a production system. It is not a certified clinical platform. The sample patient journey uses fixed synthetic records in browser memory. Public intake is disabled, and the shipped frontend cannot connect to the historical clinical backend through environment variables.

This distinction is important commercially. A client can examine the design, tests and release evidence without trusting invented compliance badges. The architecture supports a future separated clinical service, but deploying that service is a new engineering and governance milestone. It is not a configuration toggle. Findings below distinguish legal requirements, applicability questions and project recommendations. Research was checked against primary sources in September 2026; jurisdiction and product changes require reassessment.

## Scope and applicability

The baseline covers US federal health/privacy law, California and Washington examples, EU GDPR and ePrivacy, accessibility, and future European health-data interoperability. It does not purport to cover every US state or every EU member state. A real launch needs a named operating entity, patient locations, service locations, data flows, vendors and purposes before counsel can complete the applicability analysis.

| Deployment | Recommended boundary | Additional review before launch |
|---|---|---|
| Public portfolio | Fictional content, no real patient intake, no payment or messaging | Truthful claims, accessibility, hosting metadata and asset rights |
| Clinic brochure/contact site | Minimum administrative contact data | Advertising, privacy notice, retention, tracking, patient expectations |
| Patient portal | Verified identity and server-side access controls | Health confidentiality, contracts, consent/legal basis, rights and incident handling |
| Multi-clinic SaaS | Tenant-scoped clinical service | Processor/business-associate obligations, regional hosting, auditability, vendor chain |
| Clinical AI or diagnostic software | Separate product classification | Medical-device and AI-specific assessment; no inference from this demo |

Synthetic records do not eliminate all privacy considerations: hosting providers still handle network traffic. The release avoids application analytics and automatic third-party media loads. An operator must still understand provider security logs, contractual roles, retention and cross-border processing. “No patient database” is narrower and more defensible than “we process no personal data.”

## United States

### HIPAA applicability and contracts

HIPAA applies to covered entities and business associates, not automatically to every health-themed website. A healthcare provider conducting covered electronic transactions may be a covered entity. A vendor handling protected health information on its behalf may be a business associate. Cloud storage can create business-associate responsibilities even when a provider does not hold the decryption key. Appropriate BAAs and a shared responsibility allocation are essential before a relevant cloud service handles ePHI.[1]

**Project decision:** do not accept real patient records on the demo. Do not describe HTTPS, encryption libraries or a policy folder as proof of HIPAA compliance. A real engagement should maintain a vendor matrix recording service, purpose, data classes, BAA status, subcontractors, access roles and termination/export process.

Supabase’s documented HIPAA configuration requires a signed BAA and its HIPAA add-on for PHI, with designated high-compliance projects. Its shared-responsibility documentation identifies the required plan level. The old repository instruction that an ordinary Pro subscription alone enables HIPAA use was therefore unsuitable. No paid plan or add-on is activated by this work.[2]

### Security Rule and evidence

HHS describes administrative, physical and technical safeguards, risk analysis, access management, contingency planning and evaluation. The Security Rule’s documentation retention requirement is distinct from a clinic’s medical-record retention schedule. A universal “delete all health records after six years” rule would be an unsafe interpretation.[3]

**Recommended clinical evidence:** maintain an asset inventory and risk register; require staff MFA; verify role and patient/tenant scope on every request; rotate and recover encryption keys; review audit access; rehearse restoration; train workforce members; review vendors; and record incident decisions. Access-control code needs negative tests, including another patient, another tenant, expired sessions, revoked roles and failed audit persistence. Browser role selectors and inactivity timers are not server enforcement.

HHS still describes the Security Rule cybersecurity update as a proposed rule and states that the current rule remains in effect during rulemaking. Proposed MFA/encryption requirements should not be represented as enacted solely because they are desirable design choices. Track the rulemaking at release time.[4]

### Health-data breach response

HIPAA breach notification generally requires individual notification without unreasonable delay and no later than 60 days after discovery; reporting obligations differ with breach size and circumstances. This is an outer deadline, not a recommendation to wait. Document assessment, discovery, containment, affected data, recipient decisions and the basis for notification.[5]

The FTC’s Health Breach Notification Rule can cover qualifying personal-health-record vendors and related entities outside HIPAA. The 2024 amendments clarify coverage and unauthorized disclosures. A health app should not assume that exclusion from HIPAA means no health-breach obligations. Applicable organizations need an incident path aligned with the rule, alongside any state duties.[6]

**Recommended implementation:** retain a restricted incident register with discovery time and jurisdiction-specific deadlines, identity of the incident owner, evidence links and approval history. Compute deadlines by jurisdiction; do not hardcode a single “60-day compliance timer” for all incidents. Protect evidence from routine purges and keep notification drafts separate from ordinary product email.

### California

The CCPA applies to covered businesses under its applicability tests; rights and exceptions are contextual. Relevant concepts include disclosure, access, deletion, correction, sale/sharing opt-out, sensitive-information limits and non-discrimination. Medical-information exemptions do not justify assuming every dataset held by a clinic is exempt. Advertising and website activity need their own analysis.[7]

California’s Confidentiality of Medical Information Act separately restricts disclosure of medical information and defines authorization conditions and exceptions. CCPA checklists do not replace medical-confidentiality analysis.[8]

**Project decision:** no application sale/sharing for advertising, analytics pixels or replay. A Global Privacy Control signal cannot trigger tracking because no application tracking path exists. A real clinic must supply verified privacy contacts, request verification and response procedures, authorized-agent handling and a record-category exemption analysis. Do not publish invented contact details as a working rights-request channel.

### Washington

Washington’s My Health My Data Act addresses consumer health data beyond traditional HIPAA coverage. Its text includes consumer-health notices, consent rules, rights, security practices, processor duties, separate authorization for sale and healthcare geofencing restrictions. Scope includes certain residents and health data collected in Washington; exemptions need a data-specific assessment. A broad terms checkbox is not a substitute for the required consent.[9]

**Project decision:** no geolocation/geofencing, no advertising sale, no embedded map and optional sharing off in the sample. A real product should inventory inferred health data and acquisition sources as well as direct clinical fields. Evaluate the exact consent, deletion, backup and appeal workflow under the statute; do not assume a generic GDPR screen is enough.

## European Union

### GDPR legal bases and responsibility

GDPR applicability depends on establishment and relevant offering/monitoring activities, not merely whether a site is reachable in Europe. Health data are a special category. A real clinical service needs an Article 6 basis and a valid Article 9 condition, with national healthcare/secrecy requirements considered. Consent is not the universal basis for all treatment processing. Privacy by design, minimization, transparency, retention, processor contracts and risk-appropriate safeguards must be reflected in the actual data lifecycle.[10]

**Recommended design:** separate treatment records from marketing preferences, retain the purpose and legal basis of each processing activity, and require explicit approval when adding a new use. Record why a field is necessary. An intake form should not demand clinical history when a scheduling request needs only an appointment category and a secure callback channel. Avoid sending clinical text in URLs, analytics labels, emails or support screenshots.

The sample’s optional sharing toggle intentionally does not control the legal basis for all treatment. Its legal hold illustrates why an erasure request may need review. These are educational workflow examples; they do not decide a real person’s legal entitlement.

### Security, incidents and international transfers

The EDPB’s small-business guidance connects security to organizational and technical measures, including access control, backups and incident response. Under GDPR, an applicable controller generally notifies the authority within 72 hours after becoming aware of a qualifying personal-data breach, unless the risk exception applies; high-risk individual communication is a separate assessment. Keep the reasoning and evidence, including decisions not to notify.[11]

Hosting in an EU region alone does not settle international transfers. Review support access, subprocessors and onward transfers, then identify a valid transfer mechanism where required. The EDPB describes mechanisms and safeguards for transfers outside the EEA; assess the actual vendor arrangement and supplementary measures rather than treating geography as certification.[12]

**Recommended clinical implementation:** region-specific storage boundaries, least-privilege support access, encryption with documented key ownership, restricted exports, auditable access requests and a vendor exit plan. Test restoration into the authorized region. Do not put genuine patient records into a public object cache or an unapproved observability provider.

### ePrivacy and browser storage

CNIL guidance explains prior consent for non-essential trackers, with exceptions for necessary functions, and requires a meaningful ability to refuse and withdraw. Broad acceptance of terms does not establish valid tracker consent. Language preferences may be an expected interface function, but that is not permission for analytics or fingerprinting.[13]

**Implemented design:** first-party stock images, no automatic external map, no advertising/analytics scripts, no patient information in persistent browser storage, and a language-preference clearing control. The sample resets when the tab reloads. Because there are no optional tracking technologies, adding a decorative “accept all cookies” banner would misdescribe this product. If tracking is added later, inventory it first, gate it before consent where required, and test refusal and withdrawal equally carefully.

### Accessibility and member-state variation

US DOJ guidance identifies accessibility obligations for covered public accommodations and discusses barriers such as missing alternatives, poor contrast and inaccessible forms. A private clinic’s duties should not be confused with the separate Title II rules for state/local government services.[14]

The European Accessibility Act applies to specified products and services, including relevant e-commerce services; it is not an automatic blanket rule for every brochure website. Its scope, microenterprise service exemptions and national implementation need assessment. National disability and healthcare duties may still apply independently.[15]

WCAG 2.2 provides a technical standard for evaluating accessibility. Keyboard operability, visible focus, labels, status announcements, text alternatives, contrast, reflow and motion preferences are practical test targets. Automated checks only cover part of accessibility; manual keyboard and assistive-technology evaluation remain necessary.[16]

**Implemented/recommended boundary:** the new review pages include semantic headings, keyboard controls, visible focus, a skip link and announced workflow results. Reduced motion is supported. Legacy cinematic pages need broader manual evaluation, including zoom, screen readers, vestibular comfort and accessible error recovery. Do not display a conformance badge based only on an automated scan.

Before onboarding a clinic in a named member state, confirm professional registration/advertising requirements, minor-consent rules, record-retention periods, secrecy obligations, accessibility rules, required site legal notices, supervisory authority and relevant national health-hosting requirements. These remain a launch checklist because no target country or actual clinic was specified.

### EHDS and future product expansion

The European Commission describes phased application of the European Health Data Space, including major primary-use milestones in 2029 and 2031. A FHIR-shaped JSON export does not prove EHDS interoperability, conformity assessment, national integration or patient identity matching.[17]

The demonstration makes no clinical AI decision, diagnosis, prescription or medical-device claim. Adding AI or clinical decision support requires a separate intended-purpose and regulatory-classification review. The project should not invent an AI Act or medical-device certification for functionality it does not implement.

## Implementation matrix

| Concern | This public release | Production evidence still required |
|---|---|---|
| Patient data collection | Disabled; fixed synthetic workflow | Final schema, lawful purpose, data minimization and negative authorization tests |
| Identity and access | Sample role-policy model | Verified identity, MFA, tenant/patient scope, session revocation, care-assignment policy |
| Consent | Optional sharing off; reversible sample toggle | Versioned notices, proof, purpose separation and downstream withdrawal propagation |
| Erasure/retention | Sample hold and erasure transition | Legal schedule, restricted review, backup strategy and verified deletion/exception response |
| Export | Synthetic Patient bundle | Partner implementation guide, authorized scope, terminology, validation and secure delivery |
| Audit | Temporary sample outcomes | Restricted durable server events, tamper evidence, monitoring and retention |
| Tracking | No application analytics or advertising | Provider inventory and approval before adding new processors |
| Encryption | HTTPS and no clinical database in demo | Key management, encrypted storage/backups, recovery and rotation tests |
| Incidents | Documented response design | Named responders, tested deadlines, evidence handling and exercises |
| Availability | Stated target and repeatable probes | Sustained measurements and funded redundancy for stronger guarantees |

## Operating model and client acceptance

The operator should own legal applicability, approved vendors, retention decisions and notices. Engineering owns the implemented controls and reproducible evidence. A privacy/security lead owns risk review and incident coordination. These responsibilities need named people in a real engagement; a repository cannot appoint an absent compliance officer.

A client acceptance review should walk through one normal and one denied action per role, one withdrawal, one export, one hold/deletion request and one restore. Review actual network requests and logs. Verify that a changed role takes effect immediately and that failure of a dependency does not open access. Budget and contracts must be approved before sending real data to any new service.

Useful commercial wording is: “Synthetic dental-workflow demonstration with privacy-conscious delivery, tested sample access policies, documented production gates and a staged scaling design.” Avoid “HIPAA certified,” “GDPR compliant worldwide,” “SOC 2 audited,” “one million concurrent users supported,” or “guaranteed uptime” without the corresponding independent and operational evidence.

## Sources

1. HHS. [Guidance on HIPAA and Cloud Computing](https://www.hhs.gov/hipaa/for-professionals/special-topics/health-information-technology/cloud-computing/index.html).
2. Supabase. [HIPAA Projects](https://supabase.com/docs/guides/platform/hipaa-projects) and [Shared Responsibility Model](https://supabase.com/docs/guides/deployment/shared-responsibility-model).
3. HHS. [Summary of the HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html).
4. HHS. [HIPAA Security Rule NPRM](https://www.hhs.gov/hipaa/for-professionals/security/hipaa-security-rule-nprm/index.html). Proposed rule; current rule remains applicable during rulemaking.
5. HHS. [Breach Notification Rule](https://www.hhs.gov/hipaa/for-professionals/breach-notification/index.html).
6. FTC. [Complying with the Health Breach Notification Rule](https://www.ftc.gov/business-guidance/resources/complying-ftcs-health-breach-notification-rule-0). Includes amendments effective in 2024.
7. California DOJ. [California Consumer Privacy Act](https://oag.ca.gov/privacy/ccpa).
8. California Legislature. [Civil Code, Confidentiality of Medical Information, Chapter 1](https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?division=1.&chapter=1.&part=2.6.&lawCode=CIV).
9. Washington Legislature. [RCW 19.373, My Health My Data Act](https://app.leg.wa.gov/RCW/default.aspx?cite=19.373&full=true).
10. European Union. [Regulation (EU) 2016/679](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng), especially Articles 3, 5, 6, 9, 17, 25, 28, 32–35 and 44 onward.
11. EDPB. [Secure personal data](https://www.edpb.europa.eu/sme/be-compliant/secure-personal-data_en).
12. EDPB. [International data transfers](https://www.edpb.europa.eu/sme/be-compliant/international-data-transfers_en).
13. CNIL. [Cookies et traceurs : que dit la loi ?](https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi).
14. US DOJ. [Guidance on Web Accessibility and the ADA](https://www.ada.gov/resources/web-guidance/).
15. European Union. [Directive (EU) 2019/882](https://eur-lex.europa.eu/eli/dir/2019/882/oj/eng), European Accessibility Act.
16. W3C. [Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/).
17. European Commission. [European Health Data Space Regulation](https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_en).
