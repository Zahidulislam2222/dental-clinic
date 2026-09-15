import test from 'node:test';
import assert from 'node:assert/strict';
import { estimate } from '../../scripts/capacity.mjs';
test('capacity calculation distinguishes users from requests and cache misses',()=>{
 const s=estimate(1000000,30,3,.95);assert.equal(s.edgeRps,100000);assert.ok(Math.abs(s.originRps-5000)<1e-8);
 assert.throws(()=>estimate(1,0,3,.95));
});
