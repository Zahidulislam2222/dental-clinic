/**
 * FHIR R4 4.0.1 Resource Builders
 * Transforms internal dental-clinic data into canonical FHIR resources.
 *
 * Resources: Patient, Appointment, Procedure, Observation, Encounter,
 *            DocumentReference, AllergyIntolerance, Condition, Bundle,
 *            CapabilityStatement
 */

import {
  IDENTIFIER_SYSTEMS,
  APPOINTMENT_STATUS,
  getServiceSnomed,
  getConditionCoding,
  getAllergySnomed,
  PRACTITIONER_QUALIFICATION,
} from './fhir-terminology.js';

const FHIR_VERSION = '4.0.1';
const ORG_REF = 'Organization/org-everyday-dental';
const PRACTITIONER_REF = 'Practitioner/practitioner-dr-arman';

function meta(resourceType) {
  return {
    versionId: '1',
    lastUpdated: new Date().toISOString(),
    profile: [`http://hl7.org/fhir/StructureDefinition/${resourceType}`],
  };
}

// ── Patient Resource ──

export function buildPatientResource(registration) {
  const {
    id, ref_number, patient_name, patient_phone, patient_email,
    date_of_birth, gender, blood_group, user_id,
  } = registration;

  const patientId = user_id || `patient-${id}`;
  const nameParts = (patient_name || '').trim().split(/\s+/);
  const family = nameParts.pop() || '';
  const given = nameParts.length > 0 ? nameParts : undefined;

  const resource = {
    resourceType: 'Patient',
    id: patientId,
    meta: meta('Patient'),
    identifier: [
      {
        system: IDENTIFIER_SYSTEMS.clinicPatient,
        value: String(id),
      },
    ],
    active: true,
    name: [{
      use: 'official',
      family,
      ...(given && { given }),
      text: patient_name,
    }],
    telecom: [
      { system: 'phone', value: patient_phone, use: 'mobile' },
    ],
    managingOrganization: { reference: ORG_REF },
  };

  if (ref_number) {
    resource.identifier.push({
      system: IDENTIFIER_SYSTEMS.clinicRef,
      value: ref_number,
    });
  }

  if (patient_email && patient_email !== 'N/A') {
    resource.telecom.push({ system: 'email', value: patient_email, use: 'home' });
  }

  if (date_of_birth && date_of_birth !== 'N/A') {
    resource.birthDate = date_of_birth;
  }

  if (gender && gender !== 'N/A') {
    const genderMap = { male: 'male', female: 'female', other: 'other' };
    resource.gender = genderMap[gender.toLowerCase()] || 'unknown';
  }

  if (blood_group && blood_group !== 'N/A') {
    resource.extension = [{
      url: 'http://hl7.org/fhir/StructureDefinition/patient-bloodGroup',
      valueString: blood_group,
    }];
  }

  return resource;
}

// ── Appointment Resource ──
// Fix: FHIR-APPT-001 (start/end), FHIR-APPT-002 (duration), FHIR-APPT-003 (reasonCode/cancelationReason)

export function buildAppointmentResource(appointment) {
  const {
    id, ref_number, patient_name, service, date, time,
    booking_mode, status, user_id, duration_minutes,
    reason, cancellation_reason,
  } = appointment;

  const appointmentId = `appointment-${id}`;
  const patientRef = user_id ? `Patient/${user_id}` : `Patient/patient-${id}`;
  const serviceSnomed = getServiceSnomed(service);

  const fhirStatus = status === 'confirmed' ? APPOINTMENT_STATUS.booked
    : status === 'cancelled' ? APPOINTMENT_STATUS.cancelled
    : status === 'completed' ? APPOINTMENT_STATUS.fulfilled
    : status === 'arrived' ? APPOINTMENT_STATUS.arrived
    : status === 'noshow' ? APPOINTMENT_STATUS.noshow
    : APPOINTMENT_STATUS.proposed;

  const resource = {
    resourceType: 'Appointment',
    id: appointmentId,
    meta: meta('Appointment'),
    identifier: [{
      system: IDENTIFIER_SYSTEMS.clinicRef,
      value: ref_number || `REF-${id}`,
    }],
    status: fhirStatus,
    serviceType: [{
      coding: [{
        system: IDENTIFIER_SYSTEMS.snomedCt,
        code: serviceSnomed.code,
        display: serviceSnomed.display,
      }],
      text: service,
    }],
    participant: [
      {
        actor: { reference: patientRef, display: patient_name },
        status: 'accepted',
        type: [{
          coding: [{
            system: IDENTIFIER_SYSTEMS.participType,
            code: 'SBJ',
            display: 'subject',
          }],
        }],
      },
      {
        actor: { reference: PRACTITIONER_REF, display: 'Dr. Arman' },
        status: 'accepted',
        type: [{
          coding: [{
            system: IDENTIFIER_SYSTEMS.participType,
            code: 'ATND',
            display: 'attender',
          }],
        }],
      },
    ],
  };

  // FHIR-APPT-001: Use start/end for booked+ status, requestedPeriod for proposed
  if (date && time) {
    const startDateTime = `${date}T${time}:00`;
    if (['proposed', 'pending'].includes(fhirStatus)) {
      resource.requestedPeriod = [{ start: startDateTime }];
    } else {
      resource.start = startDateTime;
      const durationMin = duration_minutes || 30;
      const endDate = new Date(new Date(startDateTime).getTime() + durationMin * 60000);
      resource.end = endDate.toISOString();
    }
  }

  // FHIR-APPT-002: Duration
  resource.minutesDuration = duration_minutes || 30;

  // FHIR-APPT-003: reasonCode
  if (reason || service) {
    resource.reasonCode = [{
      coding: [{
        system: IDENTIFIER_SYSTEMS.snomedCt,
        code: serviceSnomed.code,
        display: serviceSnomed.display,
      }],
      text: reason || service,
    }];
  }

  // FHIR-APPT-003: cancelationReason
  if (fhirStatus === 'cancelled' && cancellation_reason) {
    resource.cancelationReason = {
      text: cancellation_reason,
    };
  }

  if (booking_mode) {
    resource.extension = [{
      url: 'https://everyday-dental-surgery.com/fhir/booking-mode',
      valueString: booking_mode,
    }];
  }

  return resource;
}

// ── Procedure Resource ──
// Fix: FHIR-PROC-001 (CRITICAL) — document completed dental treatments

export function buildProcedureResource(procedure) {
  const {
    id, patient_ref, service, performed_date, status,
    notes, practitioner_ref, appointment_ref,
  } = procedure;

  const serviceSnomed = getServiceSnomed(service);
  const fhirStatus = status === 'completed' ? 'completed'
    : status === 'in-progress' ? 'in-progress'
    : status === 'cancelled' ? 'not-done'
    : 'completed';

  const resource = {
    resourceType: 'Procedure',
    id: `procedure-${id}`,
    meta: meta('Procedure'),
    status: fhirStatus,
    code: {
      coding: [{
        system: IDENTIFIER_SYSTEMS.snomedCt,
        code: serviceSnomed.code,
        display: serviceSnomed.display,
      }],
      text: service,
    },
    subject: { reference: patient_ref },
    performedDateTime: performed_date,
    performer: [{
      actor: { reference: practitioner_ref || PRACTITIONER_REF },
    }],
  };

  if (notes) {
    resource.note = [{ text: notes }];
  }

  if (appointment_ref) {
    resource.basedOn = [{ reference: `Appointment/${appointment_ref}` }];
  }

  return resource;
}

// ── Observation Resource ──
// Fix: FHIR-MISSING-001 — vital signs, periodontal measurements

export function buildObservationResource(observation) {
  const {
    id, patient_ref, code_system, code, display,
    value, unit, effective_date, status,
  } = observation;

  return {
    resourceType: 'Observation',
    id: `observation-${id}`,
    meta: meta('Observation'),
    status: status || 'final',
    code: {
      coding: [{
        system: code_system || 'http://loinc.org',
        code,
        display,
      }],
    },
    subject: { reference: patient_ref },
    effectiveDateTime: effective_date || new Date().toISOString(),
    valueQuantity: value !== undefined ? {
      value: parseFloat(value),
      unit: unit || '',
      system: 'http://unitsofmeasure.org',
    } : undefined,
  };
}

// ── Encounter Resource ──
// Fix: FHIR-MISSING-001 — visit linking

export function buildEncounterResource(encounter) {
  const {
    id, patient_ref, appointment_ref, status,
    period_start, period_end, reason_display,
  } = encounter;

  const resource = {
    resourceType: 'Encounter',
    id: `encounter-${id}`,
    meta: meta('Encounter'),
    status: status || 'finished',
    class: {
      system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      code: 'AMB',
      display: 'ambulatory',
    },
    subject: { reference: patient_ref },
    period: {
      start: period_start,
      ...(period_end && { end: period_end }),
    },
    serviceProvider: { reference: ORG_REF },
  };

  if (appointment_ref) {
    resource.appointment = [{ reference: `Appointment/${appointment_ref}` }];
  }

  if (reason_display) {
    resource.reasonCode = [{ text: reason_display }];
  }

  return resource;
}

// ── DocumentReference Resource ──
// Fix: FHIR-MISSING-001 — X-rays, clinical photos

export function buildDocumentReferenceResource(doc) {
  const {
    id, patient_ref, type_code, type_display,
    content_type, url, title, date,
  } = doc;

  return {
    resourceType: 'DocumentReference',
    id: `document-${id}`,
    meta: meta('DocumentReference'),
    status: 'current',
    type: {
      coding: [{
        system: 'http://loinc.org',
        code: type_code || '18748-4',
        display: type_display || 'Diagnostic imaging study',
      }],
    },
    subject: { reference: patient_ref },
    date: date || new Date().toISOString(),
    content: [{
      attachment: {
        contentType: content_type || 'image/jpeg',
        url,
        title: title || 'Clinical document',
      },
    }],
  };
}

// ── AllergyIntolerance Resource ──
// Fix: FHIR-ALLERGY-001 (severity/criticality), FHIR-COND-001 (parameterize status)

export function buildAllergyIntoleranceResource(patientRef, allergyText, options = {}) {
  if (!allergyText || allergyText === 'None' || allergyText === 'N/A') return null;

  const {
    clinicalStatus = 'active',
    verificationStatus = 'unconfirmed',
    criticality = 'unable-to-assess',
  } = options;

  const allergies = allergyText.split(',').map(a => a.trim()).filter(Boolean);
  if (allergies.length === 0) return null;

  return allergies.map((allergy, idx) => {
    const snomed = getAllergySnomed(allergy);
    const resource = {
      resourceType: 'AllergyIntolerance',
      id: `allergy-${patientRef.replace('Patient/', '')}-${idx + 1}`,
      meta: meta('AllergyIntolerance'),
      clinicalStatus: {
        coding: [{
          system: IDENTIFIER_SYSTEMS.allergyClini,
          code: clinicalStatus,
          display: clinicalStatus.charAt(0).toUpperCase() + clinicalStatus.slice(1),
        }],
      },
      verificationStatus: {
        coding: [{
          system: IDENTIFIER_SYSTEMS.allergyVerif,
          code: verificationStatus,
          display: verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1),
        }],
      },
      type: 'allergy',
      criticality,
      patient: { reference: patientRef },
      recordedDate: new Date().toISOString().split('T')[0],
    };

    if (snomed) {
      resource.code = {
        coding: [{
          system: IDENTIFIER_SYSTEMS.snomedCt,
          code: snomed.code,
          display: snomed.display,
        }],
        text: allergy,
      };
    } else {
      resource.code = { text: allergy };
    }

    return resource;
  });
}

// ── Condition Resource ──
// Fix: FHIR-ALLERGY-001 (severity), FHIR-COND-001 (parameterize status)

export function buildConditionResource(patientRef, conditionKey, options = {}) {
  const coding = getConditionCoding(conditionKey);
  if (!coding) return null;

  const {
    clinicalStatus = 'active',
    verificationStatus = 'unconfirmed',
    severity = null,
  } = options;

  const codings = [coding.snomed];
  if (coding.icd10) codings.push(coding.icd10);

  const resource = {
    resourceType: 'Condition',
    id: `condition-${patientRef.replace('Patient/', '')}-${conditionKey}`,
    meta: meta('Condition'),
    clinicalStatus: {
      coding: [{
        system: IDENTIFIER_SYSTEMS.condClini,
        code: clinicalStatus,
        display: clinicalStatus.charAt(0).toUpperCase() + clinicalStatus.slice(1),
      }],
    },
    verificationStatus: {
      coding: [{
        system: IDENTIFIER_SYSTEMS.condVerif,
        code: verificationStatus,
        display: verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1),
      }],
    },
    code: {
      coding: codings,
      text: coding.snomed.display,
    },
    subject: { reference: patientRef },
    recordedDate: new Date().toISOString().split('T')[0],
  };

  if (severity) {
    const severityMap = {
      mild: { code: '255604002', display: 'Mild' },
      moderate: { code: '6736007', display: 'Moderate' },
      severe: { code: '24484000', display: 'Severe' },
    };
    const sev = severityMap[severity];
    if (sev) {
      resource.severity = {
        coding: [{ system: IDENTIFIER_SYSTEMS.snomedCt, ...sev }],
      };
    }
  }

  return resource;
}

// ── Bundle Builder ──

export function buildFhirBundle(resources, type = 'collection') {
  return {
    resourceType: 'Bundle',
    id: `bundle-${Date.now()}`,
    meta: { lastUpdated: new Date().toISOString() },
    type,
    total: resources.length,
    entry: resources.map(resource => ({
      fullUrl: `urn:uuid:${resource.id}`,
      resource,
    })),
  };
}

// ── CapabilityStatement ──

export function buildCapabilityStatement(baseUrl) {
  return {
    resourceType: 'CapabilityStatement',
    id: 'everyday-dental-surgery',
    meta: meta('CapabilityStatement'),
    status: 'active',
    date: new Date().toISOString(),
    kind: 'instance',
    fhirVersion: FHIR_VERSION,
    format: ['json'],
    implementation: {
      description: 'Everyday Dental Surgery FHIR R4 Server',
      url: baseUrl,
    },
    rest: [{
      mode: 'server',
      security: {
        cors: true,
        service: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/restful-security-service',
            code: 'SMART-on-FHIR',
          }],
        }],
        description: 'OAuth2 via Supabase Auth. All PHI encrypted at rest.',
      },
      resource: [
        {
          type: 'Patient',
          interaction: [{ code: 'read' }, { code: 'search-type' }],
          searchParam: [
            { name: '_id', type: 'token' },
            { name: 'name', type: 'string' },
            { name: 'phone', type: 'token' },
            { name: 'birthdate', type: 'date' },
            { name: 'identifier', type: 'token' },
          ],
        },
        {
          type: 'Appointment',
          interaction: [{ code: 'read' }, { code: 'search-type' }, { code: 'create' }, { code: 'update' }],
          searchParam: [
            { name: 'patient', type: 'reference' },
            { name: 'status', type: 'token' },
            { name: 'date', type: 'date' },
          ],
        },
        {
          type: 'Procedure',
          interaction: [{ code: 'read' }, { code: 'search-type' }, { code: 'create' }],
          searchParam: [
            { name: 'patient', type: 'reference' },
            { name: 'date', type: 'date' },
          ],
        },
        {
          type: 'Observation',
          interaction: [{ code: 'read' }, { code: 'search-type' }, { code: 'create' }],
          searchParam: [
            { name: 'patient', type: 'reference' },
            { name: 'code', type: 'token' },
          ],
        },
        {
          type: 'Encounter',
          interaction: [{ code: 'read' }, { code: 'search-type' }],
          searchParam: [{ name: 'patient', type: 'reference' }],
        },
        {
          type: 'DocumentReference',
          interaction: [{ code: 'read' }, { code: 'search-type' }],
          searchParam: [{ name: 'patient', type: 'reference' }],
        },
        {
          type: 'Practitioner',
          interaction: [{ code: 'read' }],
        },
        {
          type: 'Organization',
          interaction: [{ code: 'read' }],
        },
        {
          type: 'AllergyIntolerance',
          interaction: [{ code: 'read' }, { code: 'search-type' }],
          searchParam: [{ name: 'patient', type: 'reference' }],
        },
        {
          type: 'Condition',
          interaction: [{ code: 'read' }, { code: 'search-type' }],
          searchParam: [{ name: 'patient', type: 'reference' }],
        },
      ],
    }],
  };
}
