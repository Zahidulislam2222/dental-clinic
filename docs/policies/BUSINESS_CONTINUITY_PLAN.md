# Business continuity plan

**Draft for adoption — 2026-09-24.** [Reliability](../RELIABILITY.md) owns proposed SLO/RTO/RPO values. No paid backup plan, automatic failover or achieved recovery guarantee is asserted.

Current demo recovery uses a reviewed static release and configuration. Future clinical recovery must include database, uploads, identity configuration, audit records and usable decryption keys. Protect an independent encrypted copy, restrict deletion authority and test restoration. Source control alone is not a patient-data backup.

## Recovery sequence

1. Determine affected failure domain and appoint incident/clinical owners.
2. Protect evidence and latest recoverable state; select a verified compatible recovery point.
3. Restore in isolation, validate integrity, access scope, keys, holds and withdrawals.
4. Reconcile acknowledged bookings/payments and queued jobs; prevent duplicate notifications.
5. Cut over through a reviewed local-first deployment, verify user flows and file parity, then monitor.

During downtime, use an approved secure manual scheduling/care workflow; never improvise public spreadsheets with patient records. Record communications and reconcile manual actions on return. DNS timing and provider restoration are measured dependencies, not fixed promises.

Proposed drills: before launch, quarterly restoration and after material storage changes; annual broader failure-domain exercise. Store measured RTO/RPO, failures and remediation privately, with scrubbed results in [verification](../VERIFICATION.md).
