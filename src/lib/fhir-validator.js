/**
 * FHIR R4 Resource Validator
 * Validates resource structure, required fields, value sets, cardinality,
 * reference format, and status-dependent required fields.
 *
 * FHIR-VAL-001: Enhanced cardinality, reference, status rules
 * FHIR-VAL-002: Procedure resource validation
 */

const FHIR_RESOURCE_TYPES = [
  'Patient', 'Appointment', 'Practitioner', 'Organization',
  'AllergyIntolerance', 'Condition', 'Bundle', 'CapabilityStatement',
  'Procedure', 'Observation', 'Encounter', 'DocumentReference',
];

const APPOINTMENT_STATUSES = [
  'proposed', 'pending', 'booked', 'arrived', 'fulfilled', 'cancelled', 'noshow',
  'entered-in-error', 'checked-in', 'waitlist',
];

const PROCEDURE_STATUSES = [
  'preparation', 'in-progress', 'not-done', 'on-hold', 'stopped',
  'completed', 'entered-in-error', 'unknown',
];

const OBSERVATION_STATUSES = [
  'registered', 'preliminary', 'final', 'amended', 'corrected',
  'cancelled', 'entered-in-error', 'unknown',
];

const ENCOUNTER_STATUSES = [
  'planned', 'arrived', 'triaged', 'in-progress', 'onleave',
  'finished', 'cancelled', 'entered-in-error', 'unknown',
];

const DOC_REF_STATUSES = ['current', 'superseded', 'entered-in-error'];

const ALLERGY_TYPES = ['allergy', 'intolerance'];
const ALLERGY_CRITICALITIES = ['low', 'high', 'unable-to-assess'];
const ALLERGY_CATEGORIES = ['food', 'medication', 'environment', 'biologic'];

const CONDITION_SEVERITIES = [
  { code: '24484000', display: 'Severe' },
  { code: '6736007', display: 'Moderate' },
  { code: '255604002', display: 'Mild' },
];

const GENDER_VALUES = ['male', 'female', 'other', 'unknown'];

const BUNDLE_TYPES = [
  'document', 'message', 'transaction', 'transaction-response',
  'batch', 'batch-response', 'history', 'searchset', 'collection',
];

const REFERENCE_PATTERN = /^[A-Za-z]+\/[A-Za-z0-9\-\.]+$/;

/**
 * Validate a FHIR reference format (e.g., "Patient/123").
 */
function validateReference(ref, path, errors) {
  if (typeof ref === 'string') {
    if (!REFERENCE_PATTERN.test(ref)) {
      errors.push(`${path}: invalid reference format "${ref}" (expected "ResourceType/id")`);
    }
  } else if (ref && typeof ref === 'object') {
    if (ref.reference && !REFERENCE_PATTERN.test(ref.reference)) {
      errors.push(`${path}.reference: invalid format "${ref.reference}"`);
    }
  }
}

/**
 * Validate that a field is an array with at least minItems items.
 */
function validateCardinality(resource, field, minItems, path, errors) {
  const value = resource[field];
  if (minItems > 0 && (!value || !Array.isArray(value) || value.length < minItems)) {
    errors.push(`${path}.${field}: requires at least ${minItems} item(s)`);
    return false;
  }
  if (value && !Array.isArray(value)) {
    errors.push(`${path}.${field}: must be an array`);
    return false;
  }
  return true;
}

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
    case 'Patient':             validatePatient(resource, errors); break;
    case 'Appointment':         validateAppointment(resource, errors); break;
    case 'Practitioner':        validatePractitioner(resource, errors); break;
    case 'Organization':        validateOrganization(resource, errors); break;
    case 'AllergyIntolerance':  validateAllergyIntolerance(resource, errors); break;
    case 'Condition':           validateCondition(resource, errors); break;
    case 'Bundle':              validateBundle(resource, errors); break;
    case 'Procedure':           validateProcedure(resource, errors); break;
    case 'Observation':         validateObservation(resource, errors); break;
    case 'Encounter':           validateEncounter(resource, errors); break;
    case 'DocumentReference':   validateDocumentReference(resource, errors); break;
    default: break;
  }

  return { valid: errors.length === 0, errors };
}

function validatePatient(r, errors) {
  validateCardinality(r, 'name', 1, 'Patient', errors);
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

  validateCardinality(r, 'participant', 1, 'Appointment', errors);
  if (r.participant && Array.isArray(r.participant)) {
    r.participant.forEach((p, i) => {
      if (!p.actor) errors.push(`Appointment.participant[${i}]: actor is required`);
      if (!p.status) errors.push(`Appointment.participant[${i}]: status is required`);
      if (p.actor?.reference) validateReference(p.actor.reference, `Appointment.participant[${i}].actor`, errors);
    });
  }

  // Status-dependent: booked/arrived/fulfilled require start
  if (['booked', 'arrived', 'fulfilled'].includes(r.status)) {
    if (!r.start) {
      errors.push(`Appointment: start is required when status is "${r.status}"`);
    }
  }

  // If start is present, end should be too (and vice versa for consistency)
  if (r.start && !r.end) {
    errors.push('Appointment: end is recommended when start is provided');
  }

  // minutesDuration should be positive
  if (r.minutesDuration !== undefined && (typeof r.minutesDuration !== 'number' || r.minutesDuration <= 0)) {
    errors.push('Appointment: minutesDuration must be a positive number');
  }
}

function validatePractitioner(r, errors) {
  validateCardinality(r, 'name', 1, 'Practitioner', errors);
}

function validateOrganization(r, errors) {
  if (!r.name) {
    errors.push('Organization: name is required');
  }
}

function validateAllergyIntolerance(r, errors) {
  if (!r.patient) {
    errors.push('AllergyIntolerance: patient reference is required');
  } else {
    validateReference(r.patient, 'AllergyIntolerance.patient', errors);
  }
  if (r.type && !ALLERGY_TYPES.includes(r.type)) {
    errors.push(`AllergyIntolerance: invalid type "${r.type}"`);
  }
  if (!r.clinicalStatus) {
    errors.push('AllergyIntolerance: clinicalStatus is required');
  }
  if (r.criticality && !ALLERGY_CRITICALITIES.includes(r.criticality)) {
    errors.push(`AllergyIntolerance: invalid criticality "${r.criticality}"`);
  }
  if (r.category) {
    if (!Array.isArray(r.category)) {
      errors.push('AllergyIntolerance: category must be an array');
    } else {
      r.category.forEach((c, i) => {
        if (!ALLERGY_CATEGORIES.includes(c)) {
          errors.push(`AllergyIntolerance.category[${i}]: invalid value "${c}"`);
        }
      });
    }
  }
}

function validateCondition(r, errors) {
  if (!r.subject) {
    errors.push('Condition: subject reference is required');
  } else {
    validateReference(r.subject, 'Condition.subject', errors);
  }
  if (!r.code) {
    errors.push('Condition: code is required');
  }
  // Validate severity coding if present
  if (r.severity?.coding) {
    const validSeverityCodes = CONDITION_SEVERITIES.map(s => s.code);
    r.severity.coding.forEach((c, i) => {
      if (c.system === 'http://snomed.info/sct' && !validSeverityCodes.includes(c.code)) {
        errors.push(`Condition.severity.coding[${i}]: unrecognized SNOMED severity code "${c.code}"`);
      }
    });
  }
}

function validateProcedure(r, errors) {
  // status is required (1..1)
  if (!r.status) {
    errors.push('Procedure: status is required');
  } else if (!PROCEDURE_STATUSES.includes(r.status)) {
    errors.push(`Procedure: invalid status "${r.status}"`);
  }

  // subject is required (1..1)
  if (!r.subject) {
    errors.push('Procedure: subject reference is required');
  } else {
    validateReference(r.subject, 'Procedure.subject', errors);
  }

  // code is required for dental procedures
  if (!r.code) {
    errors.push('Procedure: code is required');
  }

  // performer validation
  if (r.performer && Array.isArray(r.performer)) {
    r.performer.forEach((p, i) => {
      if (!p.actor) {
        errors.push(`Procedure.performer[${i}]: actor is required`);
      } else {
        validateReference(p.actor, `Procedure.performer[${i}].actor`, errors);
      }
    });
  }

  // performedDateTime or performedPeriod should exist for completed procedures
  if (r.status === 'completed' && !r.performedDateTime && !r.performedPeriod) {
    errors.push('Procedure: performedDateTime or performedPeriod is required when status is "completed"');
  }

  // basedOn references
  if (r.basedOn && Array.isArray(r.basedOn)) {
    r.basedOn.forEach((ref, i) => {
      validateReference(ref, `Procedure.basedOn[${i}]`, errors);
    });
  }
}

function validateObservation(r, errors) {
  // status is required (1..1)
  if (!r.status) {
    errors.push('Observation: status is required');
  } else if (!OBSERVATION_STATUSES.includes(r.status)) {
    errors.push(`Observation: invalid status "${r.status}"`);
  }

  // code is required (1..1)
  if (!r.code) {
    errors.push('Observation: code is required');
  }

  // subject reference
  if (r.subject) {
    validateReference(r.subject, 'Observation.subject', errors);
  }

  // value[x] — at least one value type should be present for final observations
  if (r.status === 'final') {
    const hasValue = r.valueQuantity || r.valueCodeableConcept || r.valueString ||
                     r.valueBoolean !== undefined || r.valueInteger !== undefined ||
                     r.valueRange || r.valueRatio || r.valueSampledData ||
                     r.valueTime || r.valueDateTime || r.valuePeriod;
    if (!hasValue && !r.dataAbsentReason && !r.component) {
      errors.push('Observation: a value or dataAbsentReason is required when status is "final"');
    }
  }

  // valueQuantity validation
  if (r.valueQuantity) {
    if (r.valueQuantity.value === undefined || r.valueQuantity.value === null) {
      errors.push('Observation.valueQuantity: value is required');
    }
  }
}

function validateEncounter(r, errors) {
  // status is required (1..1)
  if (!r.status) {
    errors.push('Encounter: status is required');
  } else if (!ENCOUNTER_STATUSES.includes(r.status)) {
    errors.push(`Encounter: invalid status "${r.status}"`);
  }

  // class is required (1..1)
  if (!r.class) {
    errors.push('Encounter: class is required');
  }

  // subject reference
  if (r.subject) {
    validateReference(r.subject, 'Encounter.subject', errors);
  }

  // participant actors
  if (r.participant && Array.isArray(r.participant)) {
    r.participant.forEach((p, i) => {
      if (p.individual) {
        validateReference(p.individual, `Encounter.participant[${i}].individual`, errors);
      }
    });
  }

  // period for finished encounters
  if (r.status === 'finished' && !r.period) {
    errors.push('Encounter: period is required when status is "finished"');
  }
}

function validateDocumentReference(r, errors) {
  // status is required (1..1)
  if (!r.status) {
    errors.push('DocumentReference: status is required');
  } else if (!DOC_REF_STATUSES.includes(r.status)) {
    errors.push(`DocumentReference: invalid status "${r.status}"`);
  }

  // content is required (1..*)
  if (!r.content || !Array.isArray(r.content) || r.content.length === 0) {
    errors.push('DocumentReference: at least one content entry is required');
  } else {
    r.content.forEach((c, i) => {
      if (!c.attachment) {
        errors.push(`DocumentReference.content[${i}]: attachment is required`);
      } else if (!c.attachment.contentType && !c.attachment.url) {
        errors.push(`DocumentReference.content[${i}].attachment: contentType or url is required`);
      }
    });
  }

  // subject reference
  if (r.subject) {
    validateReference(r.subject, 'DocumentReference.subject', errors);
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
  // Validate entries contain resources
  if (r.entry && Array.isArray(r.entry)) {
    r.entry.forEach((e, i) => {
      if (!e.resource && !e.response) {
        errors.push(`Bundle.entry[${i}]: resource is required`);
      }
    });
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
