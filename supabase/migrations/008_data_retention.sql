-- ============================================================
-- Migration 008: Data Retention & Automated Purge
-- HIPAA: Records must be retained for 6-7 years
-- SOC 2 A1: Availability through managed lifecycle
-- ============================================================

-- 1. Retention policies configuration table
CREATE TABLE IF NOT EXISTS retention_policies (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  table_name      TEXT NOT NULL UNIQUE,
  retention_days  INTEGER NOT NULL,
  description     TEXT,
  last_purge_at   TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE retention_policies ENABLE ROW LEVEL SECURITY;

-- Only admin can view/modify retention policies
CREATE POLICY "admin_manage_retention" ON retention_policies
  FOR ALL TO authenticated
  USING (auth.is_admin());

-- Insert default retention policies (HIPAA minimum: 6 years = 2190 days)
INSERT INTO retention_policies (table_name, retention_days, description) VALUES
  ('appointments',           2555, 'Patient appointments — 7 years (HIPAA)'),
  ('registrations',          2555, 'Patient registrations — 7 years (HIPAA)'),
  ('audit_logs',             2555, 'Audit trail — 7 years (HIPAA 164.312(b))'),
  ('consent_records',        2555, 'Consent records — 7 years (legal requirement)'),
  ('data_access_requests',   2555, 'Data requests — 7 years (HIPAA)'),
  ('contacts',               365,  'Contact form messages — 1 year'),
  ('newsletter_subscribers', 1825, 'Newsletter subscribers — 5 years'),
  ('fhir_resources',         2555, 'FHIR resources — 7 years (HIPAA)')
ON CONFLICT (table_name) DO NOTHING;

-- 2. Purge log table (tracks all automated deletions)
CREATE TABLE IF NOT EXISTS purge_logs (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  table_name      TEXT NOT NULL,
  records_deleted INTEGER NOT NULL DEFAULT 0,
  retention_days  INTEGER NOT NULL,
  cutoff_date     TIMESTAMPTZ NOT NULL,
  executed_at     TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE purge_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_view_purge_logs" ON purge_logs
  FOR SELECT TO authenticated
  USING (auth.is_admin());

-- Immutable purge logs
CREATE POLICY "system_insert_purge_logs" ON purge_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "purge_logs_no_update" ON purge_logs
  FOR UPDATE USING (false);

CREATE POLICY "purge_logs_no_delete" ON purge_logs
  FOR DELETE USING (false);

-- 3. Purge function — called by pg_cron
CREATE OR REPLACE FUNCTION purge_expired_records()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  policy RECORD;
  cutoff TIMESTAMPTZ;
  deleted_count INTEGER;
BEGIN
  FOR policy IN
    SELECT table_name, retention_days
    FROM retention_policies
    WHERE is_active = true
  LOOP
    cutoff := now() - (policy.retention_days || ' days')::INTERVAL;

    -- Dynamic SQL to delete expired records
    EXECUTE format(
      'WITH deleted AS (
        DELETE FROM %I WHERE created_at < $1 RETURNING 1
      ) SELECT count(*) FROM deleted',
      policy.table_name
    ) INTO deleted_count USING cutoff;

    -- Log the purge operation
    IF deleted_count > 0 THEN
      INSERT INTO purge_logs (table_name, records_deleted, retention_days, cutoff_date)
      VALUES (policy.table_name, deleted_count, policy.retention_days, cutoff);
    END IF;

    -- Update last purge timestamp
    UPDATE retention_policies
    SET last_purge_at = now(), updated_at = now()
    WHERE table_name = policy.table_name;
  END LOOP;
END;
$$;

-- 4. Schedule nightly purge (requires pg_cron extension)
-- Run at 2:00 AM daily
-- NOTE: pg_cron must be enabled in Supabase dashboard first
-- SELECT cron.schedule('nightly-data-purge', '0 2 * * *', 'SELECT purge_expired_records()');

-- 5. Audit trigger on retention policies
CREATE TRIGGER audit_retention_policies
  AFTER INSERT OR UPDATE ON retention_policies
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
