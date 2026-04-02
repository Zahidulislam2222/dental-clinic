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
