-- ============================================================
-- Migration 004: PHI Encryption at Rest
-- HIPAA: 164.312(a)(2)(iv) Encryption and decryption
-- ============================================================

-- 1. Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Store encryption key in Vault (run separately in Supabase Dashboard if Vault not available)
-- SELECT vault.create_secret('phi_encryption_key', 'your-256-bit-key-here');
-- If Vault is not available, the key is stored as a Supabase secret
-- and accessed via Edge Functions instead.

-- 3. Encryption helper functions
-- These use a server-side key. If Vault is available, they read from Vault.
-- If not, they use a function parameter (called by Edge Functions with the secret).

CREATE OR REPLACE FUNCTION encrypt_phi(plaintext TEXT, encryption_key TEXT DEFAULT NULL)
RETURNS BYTEA AS $$
DECLARE
  key TEXT;
BEGIN
  -- Try Vault first, fall back to parameter
  IF encryption_key IS NOT NULL THEN
    key := encryption_key;
  ELSE
    BEGIN
      SELECT decrypted_secret INTO key
      FROM vault.decrypted_secrets
      WHERE name = 'phi_encryption_key' LIMIT 1;
    EXCEPTION WHEN OTHERS THEN
      -- Vault not available, return NULL (Edge Function should handle encryption)
      RETURN NULL;
    END;
  END IF;

  IF key IS NULL OR plaintext IS NULL OR plaintext = '' THEN
    RETURN NULL;
  END IF;

  RETURN pgp_sym_encrypt(plaintext, key);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrypt_phi(ciphertext BYTEA, encryption_key TEXT DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  key TEXT;
BEGIN
  IF ciphertext IS NULL THEN
    RETURN NULL;
  END IF;

  IF encryption_key IS NOT NULL THEN
    key := encryption_key;
  ELSE
    BEGIN
      SELECT decrypted_secret INTO key
      FROM vault.decrypted_secrets
      WHERE name = 'phi_encryption_key' LIMIT 1;
    EXCEPTION WHEN OTHERS THEN
      RETURN '[ENCRYPTED]';
    END;
  END IF;

  IF key IS NULL THEN
    RETURN '[ENCRYPTED]';
  END IF;

  RETURN pgp_sym_decrypt(ciphertext, key);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Add encrypted columns to registrations
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS medical_history_enc BYTEA,
  ADD COLUMN IF NOT EXISTS allergies_enc BYTEA,
  ADD COLUMN IF NOT EXISTS date_of_birth_enc BYTEA,
  ADD COLUMN IF NOT EXISTS blood_group_enc BYTEA;

-- 5. Add encrypted column to appointments
ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS medical_notes_enc BYTEA;

-- 6. Migrate existing plaintext data to encrypted columns
-- (Only runs if Vault key is configured. Otherwise Edge Functions handle encryption.)
DO $$
BEGIN
  -- Migrate registrations
  UPDATE registrations SET
    medical_history_enc = encrypt_phi(medical_history),
    allergies_enc = encrypt_phi(allergies),
    date_of_birth_enc = encrypt_phi(date_of_birth),
    blood_group_enc = encrypt_phi(blood_group)
  WHERE medical_history_enc IS NULL
    AND (medical_history IS NOT NULL AND medical_history != 'None');

  -- Migrate appointments
  UPDATE appointments SET
    medical_notes_enc = encrypt_phi(medical_notes)
  WHERE medical_notes_enc IS NULL
    AND (medical_notes IS NOT NULL AND medical_notes != 'None');
END $$;

-- 7. Create decrypted views for authorized access
CREATE OR REPLACE VIEW registrations_decrypted AS
SELECT
  id, ref_number, user_id, patient_name, patient_phone, patient_email,
  COALESCE(decrypt_phi(date_of_birth_enc), date_of_birth, 'N/A') AS date_of_birth,
  gender,
  COALESCE(decrypt_phi(blood_group_enc), blood_group, 'N/A') AS blood_group,
  COALESCE(decrypt_phi(medical_history_enc), medical_history, 'None') AS medical_history,
  COALESCE(decrypt_phi(allergies_enc), allergies, 'None') AS allergies,
  preferred_date, preferred_time, created_at
FROM registrations;

CREATE OR REPLACE VIEW appointments_decrypted AS
SELECT
  id, ref_number, user_id, patient_name, patient_phone, patient_email,
  service, date, time, booking_mode,
  COALESCE(decrypt_phi(medical_notes_enc), medical_notes, 'None') AS medical_notes,
  created_at
FROM appointments;

-- 8. Database-level CHECK constraints (server-side validation)
-- These enforce data integrity even if client-side validation is bypassed

DO $$ BEGIN
  ALTER TABLE contacts ADD CONSTRAINT chk_contacts_name CHECK (length(from_name) BETWEEN 1 AND 200);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE contacts ADD CONSTRAINT chk_contacts_message CHECK (length(message) BETWEEN 1 AND 5000);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE appointments ADD CONSTRAINT chk_appt_name CHECK (length(patient_name) BETWEEN 1 AND 200);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE appointments ADD CONSTRAINT chk_appt_service CHECK (length(service) BETWEEN 1 AND 200);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE registrations ADD CONSTRAINT chk_reg_name CHECK (length(patient_name) BETWEEN 1 AND 200);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE newsletter_subscribers ADD CONSTRAINT chk_newsletter_email CHECK (subscriber_email ~ '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
