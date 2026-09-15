import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
const files=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const forbidden=/(^|\/)(CREDENTIALS\.md|PROJECT-DOSSIER\.md|memory\/|\.env(?:$|\.(?!example$))|[^/]*\.(pem|key)$)/;
const violations=files.filter(p=>forbidden.test(p));
for(const file of files.filter(p=>/\.(?:js|jsx|ts|mjs|json|ya?ml|md)$/.test(p) && !p.includes('package-lock') && fs.existsSync(p))) {
  const text=fs.readFileSync(file,'utf8');
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:sk_live_|ghp_)[A-Za-z0-9]{20,}/.test(text)) violations.push(file);
}
if(violations.length) { console.error('Sensitive file/pattern findings:',[...new Set(violations)]);process.exitCode=1; }
else console.log('Tracked-file private-material regression check passed. Also run gitleaks against staged changes and history.');
