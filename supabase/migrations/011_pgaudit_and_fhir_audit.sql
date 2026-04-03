-- ============================================================================
-- Migration 011: pgAudit Extension + FHIR Audit Fallback
-- HIPAA-AUDIT-001: SELECT query logging via pgAudit
-- HIPAA-AUDIT-003: FHIR audit fallback mechanism
-- ============================================================================
-- NOTE: pgAudit requires superuser privileges and must be enabled by the
-- Supabase platform admin. The extension is available on Supabase Pro plans.
-- Uncomment the line below after enabling pgAudit in your Supabase dashboard:
--
-- CREATE EXTENSION IF NOT EXISTS pgaudit;
--
-- Once enabled, configure with:
-- ALTER SYSTEM SET pgaudit.log = 'read,write';
-- ALTER SYSTEM SET pgaudit.log_catalog = off;
-- ALTER SYSTEM SET pgaudit.log_relation = on;
-- SELECT pg_reload_conf();
--
-- This logs all SELECT and DML queries to the PostgreSQL log, satisfying
-- HIPAA 164.312(b) audit controls for data access tracking.
-- ============================================================================

-- ── FHIR Audit Fallback (HIPAA-AUDIT-003) ──
-- If the main audit_logs insert fails, this function captures the event
-- in a separate fhir_audit_fallback table so no FHIR access goes unlogged.

CREATE TABLE IF NOT EXISTS public.fhir_audit_fallback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  action text NOT NULL,
  resource_type text,
  resource_id text,
  details text,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- RLS: only admin can read fallback audit
ALTER TABLE public.fhir_audit_fallback ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'admin_read_fhir_fallback'
  ) THEN
    CREATE POLICY admin_read_fhir_fallback ON public.fhir_audit_fallback
      FOR SELECT TO authenticated
      USING (auth.is_admin());
  END IF;
END $$;

-- Service role can always insert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'service_insert_fhir_fallback'
  ) THEN
    CREATE POLICY service_insert_fhir_fallback ON public.fhir_audit_fallback
      FOR INSERT TO service_role
      WITH CHECK (true);
  END IF;
END $$;

-- Function that attempts main audit_logs insert, falls back to fhir_audit_fallback
CREATE OR REPLACE FUNCTION public.log_fhir_access(
  p_user_id uuid,
  p_user_email text,
  p_user_role text,
  p_action text,
  p_resource_type text DEFAULT NULL,
  p_resource_id text DEFAULT NULL,
  p_details text DEFAULT NULL,
  p_ip_address text DEFAULT 'unknown'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Try main audit_logs first
  BEGIN
    INSERT INTO public.audit_logs (
      user_id, user_email, user_role, action, table_name, details, ip_address
    ) VALUES (
      p_user_id, p_user_email, p_user_role, p_action,
      'fhir_resources', p_details, p_ip_address
    );
  EXCEPTION WHEN OTHERS THEN
    -- Fallback: write to fhir_audit_fallback
    INSERT INTO public.fhir_audit_fallback (
      user_id, action, resource_type, resource_id, details, ip_address
    ) VALUES (
      p_user_id, p_action, p_resource_type, p_resource_id, p_details, p_ip_address
    );
    RAISE WARNING 'FHIR audit fallback triggered: main audit_logs insert failed';
  END;
END;
$$;

-- Grant execute to authenticated users (called from Edge Functions via RPC)
GRANT EXECUTE ON FUNCTION public.log_fhir_access TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_fhir_access TO service_role;

COMMENT ON TABLE public.fhir_audit_fallback IS 'HIPAA-AUDIT-003: Fallback audit table when main audit_logs is unavailable';
COMMENT ON FUNCTION public.log_fhir_access IS 'HIPAA-AUDIT-003: FHIR access logger with automatic fallback';
