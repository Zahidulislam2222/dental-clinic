-- ═══════════════════════════════════════════════════════════════
-- Everyday Dental Surgery — Supabase Schema Migration
-- ═══════════════════════════════════════════════════════════════
--
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- Then click "Run" to execute.
--
-- This creates 4 tables with Row Level Security:
--   - contacts             (contact form submissions)
--   - appointments          (appointment bookings)
--   - registrations         (patient registrations)
--   - newsletter_subscribers (newsletter signups)
--
-- ═══════════════════════════════════════════════════════════════


-- ────────────────────────────────────
-- 1. CONTACTS
-- ────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  from_name   TEXT        NOT NULL,
  from_phone  TEXT        NOT NULL,
  from_email  TEXT        DEFAULT 'N/A',
  service     TEXT        DEFAULT 'N/A',
  message     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);


-- ────────────────────────────────────
-- 2. APPOINTMENTS
-- ────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ref_number     TEXT        NOT NULL UNIQUE,
  patient_name   TEXT        NOT NULL,
  patient_phone  TEXT        NOT NULL,
  patient_email  TEXT        DEFAULT 'N/A',
  service        TEXT        NOT NULL,
  date           TEXT        NOT NULL,
  time           TEXT        NOT NULL,
  booking_mode   TEXT        NOT NULL,
  medical_notes  TEXT        DEFAULT 'None',
  created_at     TIMESTAMPTZ DEFAULT now() NOT NULL
);


-- ────────────────────────────────────
-- 3. REGISTRATIONS
-- ────────────────────────────────────
CREATE TABLE IF NOT EXISTS registrations (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ref_number       TEXT        NOT NULL UNIQUE,
  patient_name     TEXT        NOT NULL,
  patient_phone    TEXT        NOT NULL,
  patient_email    TEXT        DEFAULT 'N/A',
  date_of_birth    TEXT        DEFAULT 'N/A',
  gender           TEXT        DEFAULT 'N/A',
  blood_group      TEXT        DEFAULT 'N/A',
  medical_history  TEXT        DEFAULT 'None',
  allergies        TEXT        DEFAULT 'None',
  preferred_date   TEXT        DEFAULT 'N/A',
  preferred_time   TEXT        DEFAULT 'N/A',
  created_at       TIMESTAMPTZ DEFAULT now() NOT NULL
);


-- ────────────────────────────────────
-- 4. NEWSLETTER SUBSCRIBERS
-- ────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subscriber_email  TEXT        NOT NULL UNIQUE,
  created_at        TIMESTAMPTZ DEFAULT now() NOT NULL
);


-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE contacts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations         ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anonymous users (website visitors) can only INSERT
CREATE POLICY "anon_insert_contacts" ON contacts
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_appointments" ON appointments
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_registrations" ON registrations
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_newsletter" ON newsletter_subscribers
  FOR INSERT TO anon WITH CHECK (true);

-- Authenticated users (future admin dashboard) can SELECT
CREATE POLICY "auth_select_contacts" ON contacts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_select_appointments" ON appointments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_select_registrations" ON registrations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_select_newsletter" ON newsletter_subscribers
  FOR SELECT TO authenticated USING (true);


-- ═══════════════════════════════════════════════════════════════
-- INDEXES (for admin queries and future rate limiting)
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX idx_contacts_created_at      ON contacts (created_at DESC);
CREATE INDEX idx_appointments_created_at  ON appointments (created_at DESC);
CREATE INDEX idx_appointments_ref         ON appointments (ref_number);
CREATE INDEX idx_registrations_created_at ON registrations (created_at DESC);
CREATE INDEX idx_registrations_ref        ON registrations (ref_number);
CREATE INDEX idx_newsletter_email         ON newsletter_subscribers (subscriber_email);
CREATE INDEX idx_newsletter_created_at    ON newsletter_subscribers (created_at DESC);
