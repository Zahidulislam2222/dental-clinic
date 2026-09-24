# Access control policy

**Draft for adoption — 2026-09-24.** Browser role selection in the demo is not authentication. The following is the proposed clinical model.

| Role | Allowed scope |
|---|---|
| Patient | Verified own records and permitted self-service actions |
| Reception | Assigned tenant's scheduling/administrative fields; no default full clinical access |
| Clinician | Authorized care assignment and necessary clinical records |
| Administrator | Explicit administration duties; no automatic unrestricted clinical access |
| Worker/service | Narrow operation-specific permissions and protected credentials |

Derive scope server-side and enforce row/column policies. Deny by default, including tenant mismatch, revoked role, expired token, missing care relationship and unauthorized export. Require staff MFA and logged approval for privileged changes. Design emergency access separately with justification, time bounds, notification and review.

Provision through verified approval; revoke on termination/role change and test session/cache invalidation. Proposed cadence: quarterly access reviews and immediate review after staffing/security changes. Log grants, denials and changes without unnecessary health details. Validate RLS and service-role paths with negative tests before clinical launch; current prototypes remain gated.
