# Change Management Policy

**Everyday Dental Surgery & Implant Center**
**SOC 2 TSC: CC8 (Change Management)**
**Version:** 1.0 | **Effective:** 2026-04-02 | **Review:** Annual

---

## 1. Purpose

Ensure all changes to production systems are authorized, tested, and documented to prevent unintended disruptions or security vulnerabilities.

## 2. Change Categories

| Category | Examples | Approval |
|----------|---------|----------|
| **Standard** | Content updates, bug fixes, dependency patches | Developer self-approve |
| **Normal** | New features, database migrations, config changes | Security Officer approval |
| **Emergency** | Critical security patches, data breach response | Post-implementation review |

## 3. Change Request Process

1. **Request:** Developer creates PR with description, test plan, and rollback procedure
2. **Review:** Code review by at least one other team member
3. **Test:** Build succeeds (`npm run build`), manual QA on staging
4. **Approve:** Merge approval from repository owner
5. **Deploy:** Cloudflare Pages auto-deploys from `master` branch; Supabase migrations applied via CLI
6. **Verify:** Post-deployment smoke test
7. **Document:** PR description serves as change record

## 4. Database Migration Process

1. Migrations are numbered sequentially: `001_*.sql`, `002_*.sql`, etc.
2. Each migration is idempotent (`IF NOT EXISTS`, `ON CONFLICT DO NOTHING`)
3. Migrations are tested in local Supabase before production
4. Production migrations applied via: `supabase db push`
5. Rollback scripts maintained for each migration

## 5. Rollback Procedures

| Component | Rollback Method |
|-----------|----------------|
| Frontend (React SPA) | Revert commit + redeploy via Cloudflare |
| Edge Functions | `supabase functions deploy` with previous version |
| Database Schema | Execute rollback SQL migration |
| Environment Variables | Restore from Supabase Vault backup |

## 6. Emergency Changes

- Security patches may bypass standard review if P1/Critical
- Must be documented within 24 hours post-implementation
- Reviewed in next change advisory board meeting

## 7. Prohibited Changes

- Direct production database modifications without migration files
- Deployment without successful build
- Removing audit triggers or RLS policies without Security Officer approval
