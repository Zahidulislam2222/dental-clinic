/**
 * FHIR R4 Resource Validator
 * Validates resource structure, required fields, and value sets.
 */

const FHIR_RESOURCE_TYPES = [
  'Patient', 'Appointment', 'Practitioner', 'Organization',
  'AllergyIntolerance', 'Condition', 'Bundle', 'CapabilityStatement',
];

const APPOINTMENT_STATUSES = [
  'proposed', 'pending', 'booked', 'arrived', 'fulfilled', 'cancelled', 'noshow',
  'entered-in-error', 'checked-in', 'waitlist',
];

const ALLERGY_TYPES = ['allergy', 'intolerance'];

const GENDER_VALUES = ['male', 'female', 'other', 'unknown'];

const BUNDLE_TYPES = [
  'document', 'message', 'transaction', 'transaction-response',
  'batch', 'batch-response', 'history', 'searchset', 'collection',
];

/**
 * Validate a FHIR resource. Returns { valid: boolean, errors: string[] }.
 */
export function validateResource(resource) {
  const errors = [];

  if (!resource || typeof resource !== 'object') {
    return { valid: false, errors: ['Resource must be a non-null object'] };
  }

  // resourceType is required on all resources
  if (!resource.resourceType) {
    errors.push('Missing required field: resourceType');
    return { valid: false, errors };
  }

  if (!FHIR_RESOURCE_TYPES.includes(resource.resourceType)) {
    errors.push(`Unsupported resourceType: ${resource.resourceType}`);
  }

  // id is required
  if (!resource.id) {
    errors.push('Missing required field: id');
  }

  // Dispatch to type-specific validation
  switch (resource.resourceType) {
    case 'Patient':        validatePatient(resource, errors); break;
    case 'Appointment':    validateAppointment(resource, errors); break;
    case 'Practitioner':   validatePractitioner(resource, errors); break;
    case 'Organization':   validateOrganization(resource, errors); break;
    case 'AllergyIntolerance': validateAllergyIntolerance(resource, errors); break;
    case 'Condition':      validateCondition(resource, errors); break;
    case 'Bundle':         validateBundle(resource, errors); break;
    default: break;
  }

  return { valid: errors.length === 0, errors };
}

function validatePatient(r, errors) {
  if (!r.name || !Array.isArray(r.name) || r.name.length === 0) {
    errors.push('Patient: at least one name is required');
  }
  if (r.gender && !GENDER_VALUES.includes(r.gender)) {
    errors.push(`Patient: invalid gender value "${r.gender}"`);
  }
  if (r.birthDate && !/^\d{4}(-\d{2}(-\d{2})?)?$/.test(r.birthDate)) {
    errors.push('Patient: birthDate must be YYYY, YYYY-MM, or YYYY-MM-DD');
  }
  if (r.telecom) validateTelecom(r.telecom, 'Patient', errors);
}

function validateAppointment(r, errors) {
  if (!r.status) {
    errors.push('Appointment: status is required');
  } else if (!APPOINTMENT_STATUSES.includes(r.status)) {
    errors.push(`Appointment: invalid status "${r.status}"`);
  }
  if (!r.participant || !Array.isArray(r.participant) || r.participant.length === 0) {
    errors.push('Appointment: at least one participant is required');
  } else {
    r.participant.forEach((p, i) => {
      if (!p.actor) errors.push(`Appointment.participant[${i}]: actor is required`);
      if (!p.status) errors.push(`Appointment.participant[${i}]: status is required`);
    });
  }
}

function validatePractitioner(r, errors) {
  if (!r.name || !Array.isArray(r.name) || r.name.length === 0) {
    errors.push('Practitioner: at least one name is required');
  }
}

function validateOrganization(r, errors) {
  if (!r.name) {
    errors.push('Organization: name is required');
  }
}

function validateAllergyIntolerance(r, errors) {
  if (!r.patient) {
    errors.push('AllergyIntolerance: patient reference is required');
  }
  if (r.type && !ALLERGY_TYPES.includes(r.type)) {
    errors.push(`AllergyIntolerance: invalid type "${r.type}"`);
  }
  if (!r.clinicalStatus) {
    errors.push('AllergyIntolerance: clinicalStatus is required');
  }
}

function validateCondition(r, errors) {
  if (!r.subject) {
    errors.push('Condition: subject reference is required');
  }
  if (!r.code) {
    errors.push('Condition: code is required');
  }
}

function validateBundle(r, errors) {
  if (!r.type) {
    errors.push('Bundle: type is required');
  } else if (!BUNDLE_TYPES.includes(r.type)) {
    errors.push(`Bundle: invalid type "${r.type}"`);
  }
  if (r.entry && !Array.isArray(r.entry)) {
    errors.push('Bundle: entry must be an array');
  }
}

function validateTelecom(telecom, context, errors) {
  if (!Array.isArray(telecom)) {
    errors.push(`${context}: telecom must be an array`);
    return;
  }
  const validSystems = ['phone', 'fax', 'email', 'pager', 'url', 'sms', 'other'];
  telecom.forEach((t, i) => {
    if (t.system && !validSystems.includes(t.system)) {
      errors.push(`${context}.telecom[${i}]: invalid system "${t.system}"`);
    }
  });
}

/**
 * Validate an array of resources (e.g. for bundle creation).
 * Returns { valid: boolean, results: Array<{ id, valid, errors }> }.
 */
export function validateResources(resources) {
  const results = resources.map(r => {
    const result = validateResource(r);
    return { id: r?.id || 'unknown', ...result };
  });
  return {
    valid: results.every(r => r.valid),
    results,
  };
}
