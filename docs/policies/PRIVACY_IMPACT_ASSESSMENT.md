# Privacy impact assessment template

**Draft for adoption — 2026-09-24.** The current sample keeps fictional patient records in memory; hosting still processes network metadata. No clinical DPIA approval is claimed.

For each proposed workflow record data subject/category, purpose, legal basis, collection source, recipient, processor, region, retention, rights mechanism and necessity. Assess children/guardians, sensitive data, profiling, transfers, support access and backups. Determine whether a formal impact assessment or consultation is required under applicable law.

| Risk | Proposed mitigation / evidence |
|---|---|
| Excessive collection | Field-by-field necessity review |
| Cross-patient/tenant access | Server scope, RLS and negative tests |
| Marketing disclosure | Separate optional purpose; no clinical-page tracking |
| Invalid consent/authority | Versioned notices and verified guardian workflow |
| Erasure conflicts | Legal schedule, hold review and documented response |
| Overseas support/backups | Transfer map and approved contracts/regions |
| Restore resurrects access | Reapply withdrawal/deletion restrictions and test |

Approve with product, privacy, clinical and security owners. Record residual risks, alternatives, decisions and review date privately. Reassess before new vendors, AI, telemetry, jurisdictions or materially larger processing. See [governance](../GOVERNANCE.md).
