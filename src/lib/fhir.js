/**
 * FHIR R4 4.0.1 Resource Builders
 * Transforms internal dental-clinic data into canonical FHIR resources.
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

export function buildAppointmentResource(appointment) {
  const {
    id, ref_number, patient_name, service, date, time,
    booking_mode, status, user_id,
  } = appointment;

  const appointmentId = `appointment-${id}`;
  const patientRef = user_id ? `Patient/${user_id}` : `Patient/patient-${id}`;
  const serviceSnomed = getServiceSnomed(service);

  const fhirStatus = status === 'confirmed' ? APPOINTMENT_STATUS.booked
    : status === 'cancelled' ? APPOINTMENT_STATUS.cancelled
    : status === 'completed' ? APPOINTMENT_STATUS.fulfilled
    : APPOINTMENT_STATUS.proposed;

  const startDateTime = date && time ? `${date}T${time}:00` : undefined;

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

  if (startDateTime) {
    resource.requestedPeriod = [{ start: startDateTime }];
  }

  if (booking_mode) {
    resource.extension = [{
      url: 'https://everyday-dental-surgery.com/fhir/booking-mode',
      valueString: booking_mode,
    }];
  }

  return resource;
}

// ── AllergyIntolerance Resource ──

export function buildAllergyIntoleranceResource(patientRef, allergyText) {
  if (!allergyText || allergyText === 'None' || allergyText === 'N/A') return null;

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
          code: 'active',
          display: 'Active',
        }],
      },
      verificationStatus: {
        coding: [{
          system: IDENTIFIER_SYSTEMS.allergyVerif,
          code: 'unconfirmed',
          display: 'Unconfirmed',
        }],
      },
      type: 'allergy',
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

export function buildConditionResource(patientRef, conditionKey) {
  const coding = getConditionCoding(conditionKey);
  if (!coding) return null;

  const codings = [coding.snomed];
  if (coding.icd10) codings.push(coding.icd10);

  return {
    resourceType: 'Condition',
    id: `condition-${patientRef.replace('Patient/', '')}-${conditionKey}`,
    meta: meta('Condition'),
    clinicalStatus: {
      coding: [{
        system: IDENTIFIER_SYSTEMS.condClini,
        code: 'active',
        display: 'Active',
      }],
    },
    verificationStatus: {
      coding: [{
        system: IDENTIFIER_SYSTEMS.condVerif,
        code: 'unconfirmed',
        display: 'Unconfirmed',
      }],
    },
    code: {
      coding: codings,
      text: coding.snomed.display,
    },
    subject: { reference: patientRef },
    recordedDate: new Date().toISOString().split('T')[0],
  };
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
          searchParam: [{ name: '_id', type: 'token' }],
        },
        {
          type: 'Appointment',
          interaction: [{ code: 'read' }, { code: 'search-type' }],
          searchParam: [
            { name: 'patient', type: 'reference' },
            { name: 'status', type: 'token' },
          ],
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
