-- ============================================================
-- Migration 009: Breach Detection & Security Incident Management
-- HIPAA 164.404-410: Breach Notification Requirements
-- SOC 2 CC7: System Operations — Anomaly Detection
-- ============================================================

-- 1. Security incident severity levels
CREATE TYPE incident_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE incident_status AS ENUM ('detected', 'investigating', 'contained', 'notified', 'resolved');

-- 2. Security incidents table
CREATE TABLE IF NOT EXISTS security_incidents (
  id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  severity              incident_severity NOT NULL DEFAULT 'medium',
  status                incident_status NOT NULL DEFAULT 'detected',
  title                 TEXT NOT NULL,
  description           TEXT NOT NULL,
  detection_method      TEXT,             -- 'automated', 'manual', 'user_report'
  affected_records      INTEGER DEFAULT 0,
  affected_users        TEXT[],           -- Array of affected user IDs
  containment_actions   TEXT,
  root_cause            TEXT,
  remediation_steps     TEXT,
  detected_at           TIMESTAMPTZ DEFAULT now() NOT NULL,
  contained_at          TIMESTAMPTZ,
  notification_sent_at  TIMESTAMPTZ,
  resolved_at           TIMESTAMPTZ,
  resolved_by           UUID REFERENCES auth.users(id),
  notification_deadline TIMESTAMPTZ,      -- 60 days from detection (HIPAA)
  created_at            TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at            TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE security_incidents ENABLE ROW LEVEL SECURITY;

-- Only admin can manage security incidents
CREATE POLICY "admin_manage_incidents" ON security_incidents
  FOR ALL TO authenticated
  USING (auth.is_admin());

-- System can insert incidents (from breach-check function)
CREATE POLICY "system_insert_incidents" ON security_incidents
  FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_incidents_severity ON security_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON security_incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_detected ON security_incidents(detected_at);

-- 3. Anomaly detection rules configuration
CREATE TABLE IF NOT EXISTS anomaly_rules (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  rule_name       TEXT NOT NULL UNIQUE,
  description     TEXT,
  severity        incident_severity NOT NULL DEFAULT 'high',
  threshold       INTEGER NOT NULL,        -- e.g., 100 events
  window_minutes  INTEGER NOT NULL,        -- time window
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE anomaly_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_manage_rules" ON anomaly_rules
  FOR ALL TO authenticated
  USING (auth.is_admin());

-- Seed default anomaly rules
INSERT INTO anomaly_rules (rule_name, description, severity, threshold, window_minutes) VALUES
  ('excessive_phi_access',  'More than 100 PHI reads from same user in 1 hour',  'critical', 100, 60),
  ('non_staff_phi_access',  'PHI access attempt from non-staff role',             'high',     1,   1),
  ('after_hours_access',    'PHI access outside business hours (5PM-9PM Sat-Thu)', 'medium',  5,   60),
  ('bulk_export',           'More than 10 FHIR exports in 1 hour',                'high',    10,  60),
  ('failed_auth_spike',     'More than 20 failed login attempts in 15 minutes',   'critical', 20,  15),
  ('role_escalation',       'Role change to admin',                                'high',     1,   1)
ON CONFLICT (rule_name) DO NOTHING;

-- 4. Auto-set notification deadline (60 days from detection per HIPAA 164.404)
CREATE OR REPLACE FUNCTION set_notification_deadline()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.notification_deadline IS NULL THEN
    NEW.notification_deadline := NEW.detected_at + INTERVAL '60 days';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_incident_deadline
  BEFORE INSERT OR UPDATE ON security_incidents
  FOR EACH ROW EXECUTE FUNCTION set_notification_deadline();

-- 5. Audit trigger on security incidents
CREATE TRIGGER audit_security_incidents
  AFTER INSERT OR UPDATE ON security_incidents
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
