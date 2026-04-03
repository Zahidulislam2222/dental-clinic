-- ============================================================
-- Migration 005: Audit Logging
-- HIPAA: 164.312(b) Audit controls
-- SOC 2: CC4 Monitoring Activities, CC7 System Operations
-- ============================================================

-- 1. Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  timestamp   TIMESTAMPTZ DEFAULT now() NOT NULL,
  user_id     UUID,
  user_email  TEXT,
  user_role   TEXT,
  action      TEXT NOT NULL,  -- INSERT, SELECT, UPDATE, DELETE
  table_name  TEXT NOT NULL,
  record_id   BIGINT,
  old_values  JSONB,          -- Previous values (UPDATE/DELETE)
  new_values  JSONB,          -- New values (INSERT/UPDATE)
  ip_address  TEXT,
  user_agent  TEXT,
  details     TEXT             -- Additional context
);

-- 2. Enforce immutability: no UPDATE or DELETE on audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Block all modifications (audit logs are append-only)
CREATE POLICY "audit_no_update" ON audit_logs
  FOR UPDATE TO authenticated
  USING (false);

CREATE POLICY "audit_no_delete" ON audit_logs
  FOR DELETE TO authenticated
  USING (false);

-- Allow INSERT from triggers (SECURITY DEFINER functions bypass RLS)
CREATE POLICY "audit_insert" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- Only admins can read audit logs
CREATE POLICY "admin_read_audit" ON audit_logs
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- 3. Indexes for common audit queries
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_table ON audit_logs (table_name);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs (action);
CREATE INDEX IF NOT EXISTS idx_audit_table_record ON audit_logs (table_name, record_id);

-- 4. Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
DECLARE
  _user_id UUID;
  _email TEXT;
  _role TEXT;
  _old JSONB;
  _new JSONB;
  _record_id BIGINT;
BEGIN
  -- Get current user info
  _user_id := auth.uid();

  BEGIN
    SELECT email INTO _email FROM auth.users WHERE id = _user_id;
    SELECT role::TEXT INTO _role FROM public.user_profiles WHERE id = _user_id;
  EXCEPTION WHEN OTHERS THEN
    _email := 'anonymous';
    _role := 'anon';
  END;

  -- Build old/new JSONB values
  IF TG_OP = 'DELETE' THEN
    _old := to_jsonb(OLD);
    _new := NULL;
    _record_id := OLD.id;
  ELSIF TG_OP = 'UPDATE' THEN
    _old := to_jsonb(OLD);
    _new := to_jsonb(NEW);
    _record_id := NEW.id;
  ELSIF TG_OP = 'INSERT' THEN
    _old := NULL;
    _new := to_jsonb(NEW);
    _record_id := NEW.id;
  END IF;

  -- Strip encrypted BYTEA columns from audit log (never log ciphertext)
  IF _old IS NOT NULL THEN
    _old := _old - ARRAY[
      'medical_history_enc', 'allergies_enc', 'date_of_birth_enc',
      'blood_group_enc', 'medical_notes_enc'
    ];
  END IF;
  IF _new IS NOT NULL THEN
    _new := _new - ARRAY[
      'medical_history_enc', 'allergies_enc', 'date_of_birth_enc',
      'blood_group_enc', 'medical_notes_enc'
    ];
  END IF;

  -- Also strip plaintext PHI from audit log (defense in depth)
  IF _old IS NOT NULL THEN
    _old := _old - ARRAY['medical_history', 'allergies', 'date_of_birth', 'blood_group', 'medical_notes'];
  END IF;
  IF _new IS NOT NULL THEN
    _new := _new - ARRAY['medical_history', 'allergies', 'date_of_birth', 'blood_group', 'medical_notes'];
  END IF;

  INSERT INTO audit_logs (user_id, user_email, user_role, action, table_name, record_id, old_values, new_values)
  VALUES (_user_id, _email, _role, TG_OP, TG_TABLE_NAME, _record_id, _old, _new);

  IF TG_OP = 'DELETE' THEN RETURN OLD;
  ELSE RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Attach audit triggers to all PHI-containing tables

CREATE TRIGGER audit_contacts
  AFTER INSERT OR UPDATE OR DELETE ON contacts
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_appointments
  AFTER INSERT OR UPDATE OR DELETE ON appointments
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_registrations
  AFTER INSERT OR UPDATE OR DELETE ON registrations
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_user_profiles
  AFTER INSERT OR UPDATE OR DELETE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_newsletter
  AFTER INSERT OR UPDATE OR DELETE ON newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
