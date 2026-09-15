import test from 'node:test';
import assert from 'node:assert/strict';
import demo from '../../src/data/demo.json' with { type: 'json' };
import { canAccess, initialDemo, transition, sampleBundle } from '../../src/lib/demo-policy.js';
import { readRuntime } from '../../src/config/runtime.js';
import { clinicalReleaseBoundary } from '../../supabase/functions/_shared/release-boundary.ts';

for (const role of ['patient','receptionist','doctor','admin','unknown']) {
  test(`${role}: patient subject isolation`, () => {
    assert.equal(canAccess(role,'clinical',demo.otherPatientId), ['doctor','admin'].includes(role));
    assert.equal(canAccess(role,'export',demo.patient.id), role === 'patient');
    assert.equal(canAccess(role,'unexpected',demo.patient.id), false);
  });
}
test('reception cannot see clinical details or change consent', () => {
  assert.equal(canAccess('receptionist','clinical',demo.patient.id),false);
  assert.equal(transition(initialDemo(),'receptionist','consent').outcome,'denied');
});
test('consent starts off, toggles and can be withdrawn', () => {
  const original=initialDemo(); assert.equal(original.consent,false);
  const granted=transition(original,'patient','consent').state;
  assert.equal(granted.consent,true); assert.equal(original.consent,false);
  assert.equal(transition(granted,'patient','consent').state.consent,false);
});
test('hold defers erasure; only admin releases hold; erased data cannot be exported', () => {
  const original=initialDemo(); assert.equal(transition(original,'patient','erase').outcome,'deferred');
  assert.equal(transition(original,'patient','hold').outcome,'denied');
  const released=transition(original,'admin','hold').state;
  const erased=transition(released,'patient','erase').state;
  assert.equal(erased.erased,true); assert.equal(transition(erased,'patient','export').outcome,'denied');
});
test('cancellation and export never accept caller-supplied patient data', () => {
  assert.equal(transition(initialDemo(),'patient','cancel').state.status,'cancelled');
  assert.equal(sampleBundle().entry[0].resource.id,demo.patient.id);
});
test('configuration rejects live mode, credentials and insecure origins', () => {
  for (const env of [{VITE_APP_MODE:'live'},{VITE_SITE_URL:'http://example.test'},{VITE_SITE_URL:'https://name:password@example.test'}]) assert.throws(()=>readRuntime(env));
  assert.equal(readRuntime({VITE_SITE_URL:'https://example.test'}).clinicalEnabled,false);
});
test('clinical handler cannot be reopened by an environment flag', async () => {
  const response=clinicalReleaseBoundary(); assert.equal(response.status,503);
  assert.equal(response.headers.get('cache-control'),'no-store');
  assert.match(await response.text(),/not available/);
});
