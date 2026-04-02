# Incident Response Plan

**Everyday Dental Surgery & Implant Center**
**SOC 2 TSC: CC7 (System Operations)**
**HIPAA: 164.308(a)(6), 164.404-410**
**Version:** 1.0 | **Effective:** 2026-04-02 | **Review:** Annual

---

## 1. Purpose

Define procedures for detecting, responding to, and recovering from security incidents, with specific focus on HIPAA breach notification requirements.

## 2. Severity Levels

| Level | Definition | Response Time | Example |
|-------|-----------|---------------|---------|
| **P1 — Critical** | Active data breach, PHI exposed | Immediate (< 1 hour) | Database compromise, credential leak |
| **P2 — High** | Potential breach, anomalous activity | < 4 hours | Excessive PHI access, role escalation |
| **P3 — Medium** | Security concern, no confirmed breach | < 24 hours | After-hours access, failed login spikes |
| **P4 — Low** | Minor issue, informational | < 72 hours | Configuration drift, policy violation |

## 3. Response Team

| Role | Primary | Backup |
|------|---------|--------|
| Incident Commander | Clinic Administrator | Security Officer |
| Technical Lead | IT Administrator | Developer |
| Communications | Clinic Administrator | Office Manager |

## 4. Incident Response Phases

### Phase 1: Detection
- Automated: `breach-check` Edge Function runs hourly
- Manual: Staff reports via admin panel or Security Officer
- External: Patient reports, vendor notifications

### Phase 2: Containment
- Disable compromised accounts immediately
- Revoke suspicious sessions
- Isolate affected systems if needed
- Preserve evidence (audit logs are immutable)

### Phase 3: Eradication
- Identify root cause
- Apply patches or configuration changes
- Rotate compromised credentials/keys

### Phase 4: Recovery
- Restore systems to normal operation
- Verify integrity of data
- Monitor for recurrence

### Phase 5: Notification (HIPAA 164.404-410)
- **Individual Notification:** Within 60 days of discovery
  - Written notification to each affected individual
  - Include: description of breach, types of information involved, steps to protect, what entity is doing, contact information
- **HHS Notification:**
  - < 500 affected: Annual log submission
  - ≥ 500 affected: Within 60 days to HHS and prominent media
- **State Notifications:** Per applicable state breach notification laws

### Phase 6: Post-Incident Review
- Document lessons learned
- Update policies and controls
- Brief staff on changes
- Update risk assessment if needed

## 5. Breach Assessment Criteria

A breach is presumed unless the entity demonstrates low probability that PHI was compromised, based on:
1. Nature and extent of PHI involved
2. Unauthorized person who accessed the PHI
3. Whether PHI was actually acquired or viewed
4. Extent to which risk has been mitigated

## 6. Documentation

All incidents are tracked in the `security_incidents` table with full lifecycle:
`detected → investigating → contained → notified → resolved`

## 7. Testing

- Tabletop exercise: Annually
- Notification process test: Annually
- Automated detection rules review: Quarterly
