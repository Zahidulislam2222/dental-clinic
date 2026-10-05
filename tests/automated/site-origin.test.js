import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

function walk(dir) { return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]); }

test('the canonical link is set once, from the configured site origin', () => {
 const canonical=walk('src').filter(p=>/\.(js|jsx)$/.test(p)).filter(p=>/rel="canonical"/.test(fs.readFileSync(p,'utf8')));
 assert.deepEqual(canonical.map(p=>p.replaceAll('\\','/')),['src/App.jsx']);
 assert.match(fs.readFileSync('src/App.jsx','utf8'),/<link rel="canonical" href=\{runtime\.siteUrl \+ location\.pathname\} \/>/);
});

test('no source names the retired pages.dev host', () => {
 for(const file of [...walk('src'),...walk('supabase/functions'),'index.html'].filter(p=>/\.(js|jsx|ts|html)$/.test(p))) {
  assert.doesNotMatch(fs.readFileSync(file,'utf8'),/dental-clinic-anq\.pages\.dev/,file);
 }
});

test('backend CORS has no hardcoded fallback origin', () => {
 for(const file of ['supabase/functions/_shared/cors.ts','supabase/functions/stripe-payment/index.ts']) {
  const source=fs.readFileSync(file,'utf8');
  assert.match(source,/const ALLOWED_ORIGIN = Deno\.env\.get\('ALLOWED_ORIGIN'\);/,file);
  assert.doesNotMatch(source,/ALLOWED_ORIGIN'\)\s*(\|\||\?\?)/,file);
 }
});
