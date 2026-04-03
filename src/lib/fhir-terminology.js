/**
 * FHIR R4 Terminology Bindings
 * SNOMED CT and ICD-10-CM codes for dental clinic use
 */

// ── Medical Condition SNOMED CT Codes ──
export const CONDITION_SNOMED = {
  diabetes:           { code: '73211009',  display: 'Diabetes mellitus' },
  'heart-disease':    { code: '56265001',  display: 'Heart disease' },
  'blood-pressure':   { code: '38341003',  display: 'Hypertensive disorder' },
  thyroid:            { code: '14304000',  display: 'Disorder of thyroid gland' },
  asthma:             { code: '195967001', display: 'Asthma' },
  'bleeding-disorder':{ code: '64779008',  display: 'Blood coagulation disorder' },
  pregnancy:          { code: '77386006',  display: 'Pregnant' },
  hepatitis:          { code: '128241005', display: 'Hepatitis' },
  epilepsy:           { code: '84757009',  display: 'Epilepsy' },
  'kidney-disease':   { code: '90708001',  display: 'Kidney disease' },
};

// ── ICD-10-CM Equivalents ──
export const CONDITION_ICD10 = {
  diabetes:           { code: 'E11',   display: 'Type 2 diabetes mellitus' },
  'heart-disease':    { code: 'I51.9', display: 'Heart disease, unspecified' },
  'blood-pressure':   { code: 'I10',   display: 'Essential (primary) hypertension' },
  thyroid:            { code: 'E07.9', display: 'Disorder of thyroid, unspecified' },
  asthma:             { code: 'J45',   display: 'Asthma' },
  'bleeding-disorder':{ code: 'D68.9', display: 'Coagulation defect, unspecified' },
  pregnancy:          { code: 'Z33.1', display: 'Pregnant state, incidental' },
  hepatitis:          { code: 'B19.9', display: 'Unspecified viral hepatitis' },
  epilepsy:           { code: 'G40.9', display: 'Epilepsy, unspecified' },
  'kidney-disease':   { code: 'N18.9', display: 'Chronic kidney disease, unspecified' },
};

// ── Allergy SNOMED CT Codes ──
export const ALLERGY_SNOMED = {
  penicillin:    { code: '91936005',  display: 'Allergy to penicillin' },
  latex:         { code: '300916003', display: 'Latex allergy' },
  aspirin:       { code: '293586001', display: 'Allergy to aspirin' },
  ibuprofen:     { code: '293625007', display: 'Allergy to ibuprofen' },
  sulfonamide:   { code: '91939003',  display: 'Allergy to sulfonamide' },
  anesthesia:    { code: '294200003', display: 'Allergy to local anesthetic' },
  codeine:       { code: '293841005', display: 'Allergy to codeine' },
  erythromycin:  { code: '91937001',  display: 'Allergy to erythromycin' },
};

// ── Dental Service SNOMED CT Codes ──
export const SERVICE_SNOMED = {
  'general-checkup':     { code: '34043003',  display: 'Dental examination' },
  'teeth-cleaning':      { code: '234723000', display: 'Dental prophylaxis' },
  'teeth-whitening':     { code: '70465009',  display: 'Tooth whitening' },
  'root-canal':          { code: '234617002', display: 'Endodontic treatment' },
  'dental-filling':      { code: '274031008', display: 'Dental restoration' },
  'tooth-extraction':    { code: '173368005', display: 'Extraction of tooth' },
  'dental-crown':        { code: '1237071004',display: 'Fitting of dental crown' },
  'dental-bridge':       { code: '398671007', display: 'Insertion of dental bridge' },
  'dental-implant':      { code: '52765003',  display: 'Dental implantation' },
  'orthodontics':        { code: '122462000', display: 'Orthodontic procedure' },
  'gum-treatment':       { code: '234622006', display: 'Periodontal treatment' },
  'cosmetic-dentistry':  { code: '3950001',   display: 'Cosmetic dental procedure' },
};

// ── Dental ICD-10-CM Codes (K02-K05) — FHIR-TERM-001 ──
export const DENTAL_ICD10 = {
  // K02 — Dental caries
  'K02':    { code: 'K02',   display: 'Dental caries' },
  'K02.0':  { code: 'K02.0', display: 'Caries limited to enamel' },
  'K02.1':  { code: 'K02.1', display: 'Caries of dentine' },
  'K02.2':  { code: 'K02.2', display: 'Caries of cementum' },
  'K02.3':  { code: 'K02.3', display: 'Arrested dental caries' },
  'K02.5':  { code: 'K02.5', display: 'Dental caries on pit and fissure surface' },
  'K02.51': { code: 'K02.51', display: 'Dental caries on pit and fissure surface limited to enamel' },
  'K02.52': { code: 'K02.52', display: 'Dental caries on pit and fissure surface penetrating into dentin' },
  'K02.53': { code: 'K02.53', display: 'Dental caries on pit and fissure surface penetrating into pulp' },
  'K02.6':  { code: 'K02.6', display: 'Dental caries on smooth surface' },
  'K02.61': { code: 'K02.61', display: 'Dental caries on smooth surface limited to enamel' },
  'K02.62': { code: 'K02.62', display: 'Dental caries on smooth surface penetrating into dentin' },
  'K02.63': { code: 'K02.63', display: 'Dental caries on smooth surface penetrating into pulp' },
  'K02.7':  { code: 'K02.7', display: 'Dental root caries' },
  'K02.9':  { code: 'K02.9', display: 'Dental caries, unspecified' },
  // K03 — Other diseases of hard tissues of teeth
  'K03':    { code: 'K03',   display: 'Other diseases of hard tissues of teeth' },
  'K03.0':  { code: 'K03.0', display: 'Excessive attrition of teeth' },
  'K03.1':  { code: 'K03.1', display: 'Abrasion of teeth' },
  'K03.2':  { code: 'K03.2', display: 'Erosion of teeth' },
  'K03.8':  { code: 'K03.8', display: 'Other specified diseases of hard tissues of teeth' },
  'K03.9':  { code: 'K03.9', display: 'Disease of hard tissues of teeth, unspecified' },
  // K04 — Diseases of pulp and periapical tissues
  'K04':    { code: 'K04',   display: 'Diseases of pulp and periapical tissues' },
  'K04.0':  { code: 'K04.0', display: 'Pulpitis' },
  'K04.01': { code: 'K04.01', display: 'Reversible pulpitis' },
  'K04.02': { code: 'K04.02', display: 'Irreversible pulpitis' },
  'K04.1':  { code: 'K04.1', display: 'Necrosis of pulp' },
  'K04.2':  { code: 'K04.2', display: 'Pulp degeneration' },
  'K04.3':  { code: 'K04.3', display: 'Abnormal hard tissue formation in pulp' },
  'K04.4':  { code: 'K04.4', display: 'Acute apical periodontitis of pulpal origin' },
  'K04.5':  { code: 'K04.5', display: 'Chronic apical periodontitis' },
  'K04.6':  { code: 'K04.6', display: 'Periapical abscess with sinus' },
  'K04.7':  { code: 'K04.7', display: 'Periapical abscess without sinus' },
  'K04.8':  { code: 'K04.8', display: 'Radicular cyst' },
  'K04.9':  { code: 'K04.9', display: 'Other and unspecified diseases of pulp and periapical tissues' },
  // K05 — Gingivitis and periodontal diseases
  'K05':    { code: 'K05',   display: 'Gingivitis and periodontal diseases' },
  'K05.0':  { code: 'K05.0', display: 'Acute gingivitis' },
  'K05.00': { code: 'K05.00', display: 'Acute gingivitis, plaque induced' },
  'K05.01': { code: 'K05.01', display: 'Acute gingivitis, non-plaque induced' },
  'K05.1':  { code: 'K05.1', display: 'Chronic gingivitis' },
  'K05.10': { code: 'K05.10', display: 'Chronic gingivitis, plaque induced' },
  'K05.11': { code: 'K05.11', display: 'Chronic gingivitis, non-plaque induced' },
  'K05.2':  { code: 'K05.2', display: 'Aggressive periodontitis' },
  'K05.20': { code: 'K05.20', display: 'Aggressive periodontitis, unspecified' },
  'K05.21': { code: 'K05.21', display: 'Aggressive periodontitis, localized' },
  'K05.22': { code: 'K05.22', display: 'Aggressive periodontitis, generalized' },
  'K05.3':  { code: 'K05.3', display: 'Chronic periodontitis' },
  'K05.30': { code: 'K05.30', display: 'Chronic periodontitis, unspecified' },
  'K05.31': { code: 'K05.31', display: 'Chronic periodontitis, localized' },
  'K05.32': { code: 'K05.32', display: 'Chronic periodontitis, generalized' },
  'K05.4':  { code: 'K05.4', display: 'Periodontosis' },
  'K05.5':  { code: 'K05.5', display: 'Other periodontal diseases' },
  'K05.6':  { code: 'K05.6', display: 'Periodontal disease, unspecified' },
};

// ── LOINC Codes for Observations — FHIR-TERM-002 ──
export const LOINC_CODES = {
  // Vital signs
  'blood-pressure-systolic': { code: '8480-6',  display: 'Systolic blood pressure' },
  'blood-pressure-diastolic':{ code: '8462-4',  display: 'Diastolic blood pressure' },
  'heart-rate':              { code: '8867-4',  display: 'Heart rate' },
  'body-temperature':        { code: '8310-5',  display: 'Body temperature' },
  'respiratory-rate':        { code: '9279-1',  display: 'Respiratory rate' },
  'body-weight':             { code: '29463-7', display: 'Body weight' },
  'body-height':             { code: '8302-2',  display: 'Body height' },
  'bmi':                     { code: '39156-5', display: 'Body mass index' },
  'oxygen-saturation':       { code: '2708-6',  display: 'Oxygen saturation' },
  // Dental-specific observations
  'periodontal-pocket-depth':{ code: '81288-6', display: 'Periodontal pocket depth' },
  'gingival-bleeding-index': { code: '81289-4', display: 'Gingival bleeding index' },
  'plaque-index':            { code: '81290-2', display: 'Plaque index' },
  'tooth-mobility':          { code: '81291-0', display: 'Tooth mobility' },
  'oral-mucosa-exam':        { code: '32890-1', display: 'Oral mucosa examination' },
  // Document types (for DocumentReference)
  'dental-xray':             { code: '38269-7', display: 'Dental X-ray' },
  'panoramic-xray':          { code: '39638-2', display: 'Panoramic dental X-ray' },
  'clinical-photo':          { code: '72170-4', display: 'Clinical photograph' },
  'dental-report':           { code: '34108-1', display: 'Dental report' },
};

// ── Practitioner Qualification SNOMED CT ──
export const PRACTITIONER_QUALIFICATION = {
  dentist:       { code: '106289002', display: 'Dentist' },
  orthodontist:  { code: '37504001',  display: 'Orthodontist' },
  endodontist:   { code: '66476003',  display: 'Endodontist' },
  periodontist:  { code: '49993003',  display: 'Periodontist' },
  surgeon:       { code: '304292004', display: 'Oral surgeon' },
};

// ── FHIR Appointment Status Codes ──
export const APPOINTMENT_STATUS = {
  proposed:     'proposed',
  pending:      'pending',
  booked:       'booked',
  arrived:      'arrived',
  fulfilled:    'fulfilled',
  cancelled:    'cancelled',
  noshow:       'noshow',
};

// ── FHIR Identifier Systems ──
export const IDENTIFIER_SYSTEMS = {
  clinicPatient:  'https://everyday-dental-surgery.com/patient-id',
  clinicRef:      'https://everyday-dental-surgery.com/ref-number',
  snomedCt:       'http://snomed.info/sct',
  icd10:          'http://hl7.org/fhir/sid/icd-10-cm',
  orgType:        'http://terminology.hl7.org/CodeSystem/organization-type',
  appointStatus:  'http://hl7.org/fhir/appointmentstatus',
  participType:   'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
  allergyClini:   'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
  allergyVerif:   'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification',
  condClini:      'http://terminology.hl7.org/CodeSystem/condition-clinical',
  condVerif:      'http://terminology.hl7.org/CodeSystem/condition-ver-status',
  loinc:          'http://loinc.org',
  dentalIcd10:    'http://hl7.org/fhir/sid/icd-10-cm',
};

/**
 * Look up a SNOMED code for a service name.
 * Falls back to general dental examination if not found.
 */
export function getServiceSnomed(serviceName) {
  const key = serviceName?.toLowerCase().replace(/\s+/g, '-');
  return SERVICE_SNOMED[key] || SERVICE_SNOMED['general-checkup'];
}

/**
 * Look up SNOMED + ICD-10 for a medical condition.
 * Returns null if not recognized.
 */
export function getConditionCoding(conditionKey) {
  const snomed = CONDITION_SNOMED[conditionKey];
  const icd10 = CONDITION_ICD10[conditionKey];
  if (!snomed) return null;
  return {
    snomed: { system: IDENTIFIER_SYSTEMS.snomedCt, ...snomed },
    icd10: icd10 ? { system: IDENTIFIER_SYSTEMS.icd10, ...icd10 } : null,
  };
}

/**
 * Look up allergy SNOMED code by substance name.
 */
export function getAllergySnomed(substance) {
  const key = substance?.toLowerCase().replace(/\s+/g, '');
  return ALLERGY_SNOMED[key] || null;
}

/**
 * Look up a dental ICD-10 code by code string (e.g., 'K02.51').
 */
export function getDentalIcd10(code) {
  return DENTAL_ICD10[code] || null;
}

/**
 * Look up a LOINC code by key (e.g., 'blood-pressure-systolic').
 */
export function getLoincCode(key) {
  return LOINC_CODES[key] || null;
}

/**
 * Get LOINC coding object for use in FHIR Observation.code.
 */
export function getLoincCoding(key) {
  const loinc = LOINC_CODES[key];
  if (!loinc) return null;
  return {
    system: IDENTIFIER_SYSTEMS.loinc,
    code: loinc.code,
    display: loinc.display,
  };
}
