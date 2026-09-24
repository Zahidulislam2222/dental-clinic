# Security policy

## Supported scope

The maintained release is a synthetic portfolio application. The Supabase clinical prototypes are guarded and not approved for real patient use. See [threat model](docs/THREAT-MODEL.md), [clinical blockers](docs/CLINICAL-RELEASE.md) and [verification](docs/VERIFICATION.md).

## Reporting a vulnerability

Do not put tokens, patient data, exploit payloads containing personal information, or private infrastructure details in public issues. If GitHub shows **Security → Report a vulnerability**, use that private channel. Its availability must be verified in the repository; this document does not claim it is enabled. Otherwise open a minimal issue requesting a private contact route without disclosing exploit details, and wait for a maintainer to supply one.

Provide affected commit, component, impact and a minimal synthetic reproduction privately. Test only your own local copy or an explicitly authorized environment. There is no bug bounty or guaranteed response SLA.

## Engineering requirements

Use least privilege, verified server identity, subject/tenant authorization, input schemas, bounded requests and protected audit trails. Never expose service credentials to the browser. Keep secrets in approved stores and excluded recovery files. Review dependency changes and run history/tree/staged secret scans before publication. Never bypass scanner findings or the clinical release guard.

Future clinical controls should be mapped to [OWASP ASVS](https://github.com/OWASP/ASVS), with implementation evidence and negative tests. A framework checklist is not a certification. Incident ownership, notification and recovery are described in [governance](docs/GOVERNANCE.md) and [incident response](docs/policies/INCIDENT_RESPONSE_PLAN.md).
