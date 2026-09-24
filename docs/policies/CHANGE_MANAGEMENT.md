# Change management policy

**Draft for adoption — 2026-09-24.** Production is a deployment target; local reviewed source is authoritative.

Define acceptance criteria, inventory configuration, inspect drift for files/schema to change, reconcile newer live state locally, implement the smallest change and run tests/types/lint/security/build plus real-flow verification. Obtain fresh-context review and record scope/limitations before publication.

Stage an explicit allowlist, scan history/tree/staged changes, keep private artifacts excluded and use normal Git pushes. GitHub publication is distinct from a live release. Deploy versioned artifacts after required approvals, compare local/live hashes and retain tested rollback evidence.

Database changes need fresh/upgrade tests, preservation assertions, lock/backfill limits and a reversible or roll-forward plan. Never apply historical SQL to an unknown live database. Emergency changes retain review/evidence and receive prompt follow-up; urgency does not permit disabling security scans or exposing secrets.

Update contracts, READMEs and dated verification with behavior changes. Record escaped defects and add the gate that should have caught them. See [operations](../OPERATIONS.md).
