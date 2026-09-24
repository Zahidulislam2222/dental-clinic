# Public launch and governance checklist

This document defines proposed operating responsibilities for a future real clinic. The demo's fictional content and synthetic workflows are not a deployed governance program. Assign named owners privately before launch.

## Jurisdiction and accountability

| Area | Decision/evidence required | Owner role |
|---|---|---|
| US | Covered entity/business-associate analysis; applicable state health/privacy, dental licensing and advertising rules | Legal/privacy lead |
| EU | Article 3 scope, controller/processor roles, Articles 6/9 basis, country health/confidentiality rules, transfers and supervisory authority | Legal/privacy lead |
| Bangladesh | Current data/cyber laws, BMDC professional duties, facility category, permits and local operating obligations | Local legal/clinical lead |
| Multi-region | Actual patients, operator locations, data regions, processors and transfer routes | Product/privacy/platform leads |
| Clinical safety | Intended purpose, care responsibility, escalation and downtime procedures | Clinical lead |

Read [US/EU research](LEGAL-RESEARCH.md) and [Bangladesh research](LEGAL-BANGLADESH.md). Launch review must cover the actual US state and EU member state; a regional overview cannot settle every local rule. Keep signed agreements and legal opinions outside public Git.

## Required public surfaces

Publish the actual operator identity, verified contact channel, service scope, accurate clinician qualifications, current pricing/cancellation/refund terms, privacy notice, terms and accessibility/help contact. Explain data categories, purposes, applicable legal bases, vendors/transfers, retention, rights and complaints. Use reviewed translations; do not reuse fictional demo identities or assume a translated privacy notice resolves legal differences.

Keep optional marketing consent separate from treatment/administration and terms acceptance. Do not embed advertising pixels or session replay on clinical pages. Explain cookies/storage according to actual runtime behavior. An emergency disclaimer must point users toward appropriate local care and must not replace a clinical escalation process.

## Data and patient rights

Maintain a record-by-record retention schedule with jurisdiction, legal basis, period, trigger, hold exception and deletion owner. Verify the requester proportionately, scope exports, support corrections and complaints, document refusals/exceptions, propagate consent withdrawal and review backup restoration. Avoid blanket immediate deletion of medical records that must be retained. Keep staff access and purpose histories reviewable.

Children, guardians, deceased patients, emergency access and disputed authority require explicit product/legal workflows. Do not infer guardian rights from a shared email address or a browser checkbox. Define care assignment and tenant boundaries before clinical API implementation.

## Accessibility and language

Proposed target: WCAG 2.2 AA, using [W3C criteria](https://www.w3.org/TR/WCAG22/). Test keyboard-only operation, focus, screen-reader names/status, error recovery, contrast, zoom/reflow, motion preferences and touch targets across public and clinical journeys. Check English/Bangla language tags, date/number meaning and translations. Automated axe results are one part of evidence, not a conformance certificate. Publish known barriers and a real assistance channel when operated.

## Vendor and operational readiness

Approve data flow, processor terms/BAA where applicable, security evidence, permitted regions, sub-processors, support, retention, deletion/export and exit strategy for every vendor. Verify actual purchased features instead of assuming a plan includes backups or health-data processing eligibility. Review payment-provider availability for the operator's country before committing to a vendor.

Before launch, rehearse backup restoration, incident notification, offboarding, role revocation, downtime/manual scheduling and recovery reconciliation. Define support hours, on-call coverage, clinical escalation and contractual commitments. The [policy catalog](policies/README.md), [reliability plan](RELIABILITY.md) and [roadmap](../ROADMAP.md) provide the proposed structure.

## Sign-off package

Require product acceptance, completed clinical blockers, security and accessibility findings disposition, applicable legal/contract approval, cost authorization, measured capacity and recovery, named responders and fresh-context review. Preserve dated evidence and exceptions privately; publish only scrubbed status. Reassess after jurisdiction, vendor, clinical purpose or data-flow changes.
