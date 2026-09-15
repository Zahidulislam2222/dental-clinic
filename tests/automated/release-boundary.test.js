import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
function walk(dir) { return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]); }
test('every clinical entrypoint denies before request processing', () => {
  const files=walk('supabase/functions').filter(p=>p.endsWith('index.ts'));
  assert.ok(files.length>=11);
  for(const file of files) assert.match(fs.readFileSync(file,'utf8'),/serve\(async \(req: Request\) => \{\s*const releaseBlocked = clinicalReleaseBoundary\(\);\s*if \(releaseBlocked\) return releaseBlocked;/,file);
});
test('source does not reintroduce external images, tracking or credentials in active configuration', () => {
  for(const file of walk('src').filter(p=>/\.(js|jsx)$/.test(p))) {
    const source=fs.readFileSync(file,'utf8');
    assert.doesNotMatch(source,/https:\/\/images\.unsplash\.com/,file);
    if (!file.replaceAll('\\','/').startsWith('src/config/')) assert.doesNotMatch(source,/import\.meta\.env/,file);
    assert.doesNotMatch(source,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:sk_live_|sk_test_)[A-Za-z0-9]{16,}/,file);
  }
  const client=fs.readFileSync('src/lib/supabase.js','utf8'); assert.doesNotMatch(client,/createClient/);
  assert.doesNotMatch(fs.readFileSync('index.html','utf8'),/https:\/\/|<script(?! type="module")/);
  assert.doesNotMatch(fs.readFileSync('src/utils/mockApi.js','utf8'),/localStorage|sessionStorage/);
});
test('forms are read-only previews and site CSP denies submissions and frames', () => {
  for(const file of walk('src/pages').filter(p=>p.endsWith('.jsx'))) assert.doesNotMatch(fs.readFileSync(file,'utf8'),/<form\b/,file);
  const headers=fs.readFileSync('public/_headers','utf8');
  for(const directive of ["script-src 'self'", "connect-src 'self'", "form-action 'none'", "frame-ancestors 'none'"]) assert.ok(headers.includes(directive));
  assert.doesNotMatch(headers,/unsafe-eval|script-src[^;]*unsafe-inline/);
});
