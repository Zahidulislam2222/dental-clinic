// @ts-check
import demo from '../data/demo.json' with { type: 'json' };

/** Demonstration policy only. Never use a browser-selected role as server authorization.
 * @param {string} role @param {string} action @param {string} subject
 */
export function canAccess(role, action, subject) {
  if (!demo.roles.includes(role)) return false;
  const own = subject === demo.patient.id;
  switch (action) {
    case 'schedule': return role !== 'patient' || own;
    case 'clinical': return ['doctor', 'admin'].includes(role) || (role === 'patient' && own);
    case 'export': case 'consent': case 'erase': return role === 'patient' && own;
    case 'hold': return role === 'admin';
    default: return false;
  }
}

export function initialDemo() {
  return { status: demo.appointment.status, consent: false, legalHold: true, erased: false };
}

/** @param {ReturnType<typeof initialDemo>} state @param {string} role @param {string} action */
export function transition(state, role, action) {
  const permission = action === 'cancel' ? 'schedule' : action;
  if (!canAccess(role, permission, demo.patient.id) || state.erased) {
    return { state, message: demo.messages.denied, outcome: 'denied' };
  }
  switch (action) {
    case 'cancel': return { state: { ...state, status: 'cancelled' }, message: demo.messages.cancelled, outcome: 'allowed' };
    case 'consent': return { state: { ...state, consent: !state.consent }, message: demo.messages.consent, outcome: 'allowed' };
    case 'hold': return { state: { ...state, legalHold: !state.legalHold }, message: demo.messages.hold, outcome: 'allowed' };
    case 'erase': return state.legalHold
      ? { state, message: demo.messages.held, outcome: 'deferred' }
      : { state: { ...state, erased: true }, message: demo.messages.erased, outcome: 'allowed' };
    case 'export': return { state, message: demo.messages.exported, outcome: 'allowed' };
    default: return { state, message: demo.messages.denied, outcome: 'denied' };
  }
}

export function sampleBundle() {
  return {
    resourceType: 'Bundle', type: 'collection',
    entry: [{ resource: { resourceType: 'Patient', id: demo.patient.id,
      name: [{ text: demo.patient.name }], birthDate: demo.patient.birthDate,
      active: true } }],
  };
}
