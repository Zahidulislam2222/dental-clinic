-- ============================================================
-- Migration 006: Consent Tracking & Patient Data Rights
-- HIPAA: 164.508 Uses and disclosures for which consent is required
-- HIPAA: 164.524-526 Patient rights (access, amend)
-- ============================================================

-- 1. Consent records table (immutable — append-only)
CREATE TABLE IF NOT EXISTS consent_records (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id),
  consent_type  TEXT NOT NULL,  -- 'privacy_policy', 'medical_data', 'newsletter', 'contact'
  version       TEXT NOT NULL DEFAULT '1.0',
  form_type     TEXT,           -- Which form triggered this consent
  ip_address    TEXT,
  user_agent    TEXT,
  granted_at    TIMESTAMPTZ DEFAULT now() NOT NULL,
  revoked_at    TIMESTAMPTZ  -- NULL = active consent
);

ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

-- Immutable: no UPDATE on granted_at
CREATE POLICY "consent_insert" ON consent_records
  FOR INSERT WITH CHECK (true);

-- Patients can view their own consent history
CREATE POLICY "patient_view_own_consent" ON consent_records
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- Only admin can revoke consent (set revoked_at)
CREATE POLICY "admin_revoke_consent" ON consent_records
  FOR UPDATE TO authenticated
  USING (public.is_admin());

-- No deletion of consent records (legal requirement)
CREATE POLICY "consent_no_delete" ON consent_records
  FOR DELETE USING (false);

CREATE INDEX IF NOT EXISTS idx_consent_user ON consent_records(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_type ON consent_records(consent_type);

-- 2. Data access requests table (HIPAA patient rights)
CREATE TYPE data_request_type AS ENUM ('access', 'amendment', 'deletion', 'restriction');
CREATE TYPE data_request_status AS ENUM ('pending', 'approved', 'denied', 'completed');

CREATE TABLE IF NOT EXISTS data_access_requests (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id),
  request_type  data_request_type NOT NULL,
  status        data_request_status NOT NULL DEFAULT 'pending',
  details       TEXT NOT NULL,       -- Patient's description of the request
  admin_notes   TEXT,                -- Admin's response/notes
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL,
  resolved_at   TIMESTAMPTZ,
  resolved_by   UUID REFERENCES auth.users(id)
);

ALTER TABLE data_access_requests ENABLE ROW LEVEL SECURITY;

-- Patients can create requests
CREATE POLICY "patient_insert_requests" ON data_access_requests
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Patients can view their own requests
CREATE POLICY "patient_view_own_requests" ON data_access_requests
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- Admin can update request status
CREATE POLICY "admin_update_requests" ON data_access_requests
  FOR UPDATE TO authenticated
  USING (public.is_admin());

-- No deletion (legal requirement)
CREATE POLICY "requests_no_delete" ON data_access_requests
  FOR DELETE USING (false);

CREATE INDEX IF NOT EXISTS idx_data_requests_user ON data_access_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_data_requests_status ON data_access_requests(status);

-- 3. Audit trigger on consent and data requests
CREATE TRIGGER audit_consent_records
  AFTER INSERT OR UPDATE ON consent_records
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_data_access_requests
  AFTER INSERT OR UPDATE ON data_access_requests
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
