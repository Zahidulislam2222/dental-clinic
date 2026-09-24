# Clinical control progress

Updated 2026-09-24. The earlier “complete / 93% compliance” heading described source-pattern matches in a historical report. It did not establish clinical readiness. The April report remains preserved for provenance; the [scanner guide](README.md) explains its limits.

| Area | Present status |
|---|---|
| Clinical entrypoints | Eleven guarded prototypes; unavailable for real use |
| Payments | Prototype retained; signature, amount and replay gates unresolved |
| Schema/encryption | Historical migrations retained; writer/read compatibility requires tests |
| Authorization/FHIR | Table, subject, tenant and export boundaries need clinical verification |
| Consent/retention | Sample illustration; real legal/operational workflow remains gated |
| MFA/session/audit | Component/helper presence is not proof of end-to-end enforcement |
| Notifications/incidents | Caller/scheduler authority and recipient/rule coverage need repair |
| Public demo | Separate synthetic policy/browser tests and release evidence |
| Governance | Proposed templates; no signed BAA or certification asserted |

Track implementation completion against [clinical gates](../docs/CLINICAL-RELEASE.md), [roadmap](../ROADMAP.md) and dated [verification](../docs/VERIFICATION.md). Historical code can inform design but must not be described as deployed working clinical functionality.
