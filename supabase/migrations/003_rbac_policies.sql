-- ============================================================
-- Migration 003: Role-Based Access Control (RBAC) Policies
-- HIPAA: 164.308(a)(4) Access management, 164.312(a)(1) Access control
-- ============================================================

-- 1. Helper functions (SECURITY DEFINER to avoid RLS recursion)

CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS user_role AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION auth.is_staff()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'doctor', 'receptionist')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 2. Drop old permissive policies

DROP POLICY IF EXISTS "anon_insert_contacts" ON contacts;
DROP POLICY IF EXISTS "auth_select_contacts" ON contacts;
DROP POLICY IF EXISTS "anon_insert_appointments" ON appointments;
DROP POLICY IF EXISTS "auth_select_appointments" ON appointments;
DROP POLICY IF EXISTS "anon_insert_registrations" ON registrations;
DROP POLICY IF EXISTS "auth_select_registrations" ON registrations;
DROP POLICY IF EXISTS "anon_insert_newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "auth_select_newsletter" ON newsletter_subscribers;

-- 3. Contacts table policies
-- Public: can INSERT (contact form is public)
CREATE POLICY "public_insert_contacts" ON contacts
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Staff: can SELECT all contacts
CREATE POLICY "staff_select_contacts" ON contacts
  FOR SELECT TO authenticated USING (auth.is_staff());

-- Admin: can DELETE contacts
CREATE POLICY "admin_delete_contacts" ON contacts
  FOR DELETE TO authenticated USING (auth.is_admin());

-- 4. Appointments table policies
-- Public: can INSERT (appointment form is public)
CREATE POLICY "public_insert_appointments" ON appointments
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Patient: can SELECT own appointments
CREATE POLICY "patient_select_own_appointments" ON appointments
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR auth.is_staff());

-- Staff: can UPDATE appointments (status changes, etc.)
CREATE POLICY "staff_update_appointments" ON appointments
  FOR UPDATE TO authenticated USING (auth.is_staff());

-- Admin: can DELETE appointments
CREATE POLICY "admin_delete_appointments" ON appointments
  FOR DELETE TO authenticated USING (auth.is_admin());

-- 5. Registrations table policies
-- Public: can INSERT (registration form is public)
CREATE POLICY "public_insert_registrations" ON registrations
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Patient: can SELECT own registrations
CREATE POLICY "patient_select_own_registrations" ON registrations
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR auth.is_staff());

-- Staff: can UPDATE registrations
CREATE POLICY "staff_update_registrations" ON registrations
  FOR UPDATE TO authenticated USING (auth.is_staff());

-- Admin: can DELETE registrations
CREATE POLICY "admin_delete_registrations" ON registrations
  FOR DELETE TO authenticated USING (auth.is_admin());

-- 6. Newsletter subscribers policies
-- Public: can INSERT
CREATE POLICY "public_insert_newsletter" ON newsletter_subscribers
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Admin only: can SELECT/DELETE newsletter subscribers
CREATE POLICY "admin_select_newsletter" ON newsletter_subscribers
  FOR SELECT TO authenticated USING (auth.is_admin());

CREATE POLICY "admin_delete_newsletter" ON newsletter_subscribers
  FOR DELETE TO authenticated USING (auth.is_admin());

-- 7. Receptionist-safe view (excludes PHI columns)
-- Minimum Necessary Standard: receptionist doesn't need medical data
CREATE OR REPLACE VIEW registrations_reception AS
SELECT
  id, ref_number, patient_name, patient_phone, patient_email,
  preferred_date, preferred_time, created_at, user_id
FROM registrations;

CREATE OR REPLACE VIEW appointments_reception AS
SELECT
  id, ref_number, patient_name, patient_phone, patient_email,
  service, date, time, booking_mode, created_at, user_id
FROM appointments;
