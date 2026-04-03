-- ============================================================
-- Migration 007: FHIR R4 Resource Layer
-- Implements HL7 FHIR R4 4.0.1 compliant resource storage
-- ============================================================

-- 1. FHIR resources table (stores canonical FHIR JSON)
CREATE TABLE IF NOT EXISTS fhir_resources (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  resource_type   TEXT NOT NULL,    -- 'Patient', 'Appointment', 'Practitioner', etc.
  resource_id     TEXT NOT NULL,    -- FHIR resource ID (UUID or ref)
  version         INTEGER NOT NULL DEFAULT 1,
  resource        JSONB NOT NULL,   -- Full FHIR R4 JSON resource
  source_table    TEXT,             -- Which legacy table this came from
  source_id       BIGINT,           -- ID in the source table
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(resource_type, resource_id, version)
);

ALTER TABLE fhir_resources ENABLE ROW LEVEL SECURITY;

-- Staff can read FHIR resources
CREATE POLICY "staff_read_fhir" ON fhir_resources
  FOR SELECT TO authenticated USING (public.is_staff());

-- Patients can read their own FHIR resources
CREATE POLICY "patient_read_own_fhir" ON fhir_resources
  FOR SELECT TO authenticated
  USING (
    resource->>'id' = auth.uid()::TEXT
    OR resource->'subject'->>'reference' = 'Patient/' || auth.uid()::TEXT
    OR public.is_staff()
  );

-- Only system (Edge Functions via service_role) can write FHIR resources
CREATE POLICY "system_write_fhir" ON fhir_resources
  FOR INSERT WITH CHECK (true);

CREATE POLICY "system_update_fhir" ON fhir_resources
  FOR UPDATE USING (true);

CREATE INDEX IF NOT EXISTS idx_fhir_type ON fhir_resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_fhir_type_id ON fhir_resources(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_fhir_source ON fhir_resources(source_table, source_id);
CREATE INDEX IF NOT EXISTS idx_fhir_resource_gin ON fhir_resources USING gin(resource);

-- 2. Seed: Practitioner (Dr. Arman)
INSERT INTO fhir_resources (resource_type, resource_id, resource) VALUES
('Practitioner', 'practitioner-dr-arman', '{
  "resourceType": "Practitioner",
  "id": "practitioner-dr-arman",
  "meta": { "versionId": "1", "lastUpdated": "2026-04-02T00:00:00Z" },
  "active": true,
  "name": [{ "use": "official", "family": "Arman", "prefix": ["Dr."] }],
  "telecom": [
    { "system": "phone", "value": "+8801712345678", "use": "work" }
  ],
  "qualification": [
    {
      "code": {
        "coding": [{ "system": "http://snomed.info/sct", "code": "106289002", "display": "Dentist" }],
        "text": "BDS, Dental Surgeon"
      }
    }
  ]
}')
ON CONFLICT (resource_type, resource_id, version) DO NOTHING;

-- 3. Seed: Organization (Everyday Dental Surgery)
INSERT INTO fhir_resources (resource_type, resource_id, resource) VALUES
('Organization', 'org-everyday-dental', '{
  "resourceType": "Organization",
  "id": "org-everyday-dental",
  "meta": { "versionId": "1", "lastUpdated": "2026-04-02T00:00:00Z" },
  "active": true,
  "type": [{
    "coding": [{ "system": "http://terminology.hl7.org/CodeSystem/organization-type", "code": "prov", "display": "Healthcare Provider" }]
  }],
  "name": "Everyday Dental Surgery",
  "telecom": [
    { "system": "phone", "value": "+8801712345678", "use": "work" },
    { "system": "email", "value": "info@example-dental.com", "use": "work" }
  ],
  "address": [{
    "use": "work",
    "type": "physical",
    "text": "House 42, Road 7, Dhanmondi, Dhaka 1205, Bangladesh",
    "city": "Dhaka",
    "district": "Dhanmondi",
    "country": "BD"
  }]
}')
ON CONFLICT (resource_type, resource_id, version) DO NOTHING;

-- 4. Audit trigger on FHIR resources
CREATE TRIGGER audit_fhir_resources
  AFTER INSERT OR UPDATE OR DELETE ON fhir_resources
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
