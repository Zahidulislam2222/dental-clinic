# Business Continuity Plan

**Everyday Dental Surgery & Implant Center**
**SOC 2 TSC: A1 (Availability)**
**HIPAA: 164.308(a)(7)**
**Version:** 1.0 | **Effective:** 2026-04-02 | **Review:** Annual

---

## 1. Purpose

Ensure critical clinic systems can be restored within acceptable timeframes following a disruption.

## 2. Recovery Objectives

| System | RTO (Recovery Time) | RPO (Recovery Point) | Priority |
|--------|----|----|---------|
| Patient Portal & Website | 4 hours | N/A (static SPA) | High |
| Database (Supabase) | 1 hour | 24 hours (PITR) | Critical |
| Authentication System | 1 hour | Real-time | Critical |
| Edge Functions | 2 hours | N/A (code in git) | High |
| Email Notifications | 8 hours | N/A | Medium |

## 3. Backup Strategy

### 3.1 Database
- **Provider:** Supabase Pro plan
- **Method:** Point-in-time Recovery (PITR)
- **Frequency:** Continuous WAL archiving
- **Retention:** 7 days of PITR
- **Testing:** Quarterly restore test

### 3.2 Application Code
- **Provider:** GitHub
- **Method:** Git repository with full history
- **Branches:** `master` (production), feature branches
- **Recovery:** Re-deploy from any commit

### 3.3 Configuration
- **Environment Variables:** Supabase Vault (encrypted)
- **Edge Functions:** Git repository
- **DNS/CDN:** Cloudflare (globally distributed)

## 4. Disaster Recovery Procedures

### 4.1 Database Failure
1. Supabase automatically handles PostgreSQL failover (managed HA)
2. If Supabase region outage: contact Supabase support for region migration
3. PITR restore: `supabase db restore --time <timestamp>`

### 4.2 Website/CDN Failure
1. Cloudflare Pages has global edge redundancy
2. Failover: deploy to alternative static host (Vercel, Netlify)
3. DNS update via Cloudflare dashboard (< 5 minute propagation)

### 4.3 Authentication Failure
1. Supabase Auth is part of the managed database cluster
2. Recovery tied to database recovery procedure
3. Emergency: enable maintenance mode on website

### 4.4 Complete Supabase Outage
1. Website continues serving (static SPA on Cloudflare)
2. Forms show "temporarily unavailable" message
3. Follow Supabase status page for restoration ETA
4. If extended: spin up new Supabase project from latest backup

## 5. Communication Plan

| Audience | Method | Who |
|----------|--------|-----|
| Patients | Website banner, email | Clinic Administrator |
| Staff | Phone/WhatsApp group | Office Manager |
| Vendors | Email/phone | IT Administrator |

## 6. Testing Schedule

- **Quarterly:** Database backup restore test
- **Semi-annually:** Full DR tabletop exercise
- **Annually:** Full DR simulation including failover
