import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const groups = readFileSync(new URL('../../public/robots.txt', import.meta.url), 'utf8')
 .split(/\r?\n\s*\r?\n/)
 .map(block => block.split(/\r?\n/).filter(line => line && !line.startsWith('#')));
const group = agent => groups.find(lines => lines.some(l => l.toLowerCase() === `user-agent: ${agent}`.toLowerCase()));

test('robots.txt lets LinkedIn build link previews but blocks every other crawler', () => {
 assert.deepEqual(group('LinkedInBot'), ['User-agent: LinkedInBot', 'Allow: /']);
 assert.deepEqual(group('*'), ['User-agent: *', 'Disallow: /']);
});

test('the demo stays noindex for search engines', () => {
 const read = file => readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8');
 assert.match(read('index.html'), /<meta name="robots" content="noindex, nofollow"/);
 assert.match(read('src/App.jsx'), /<meta name="robots" content="noindex, nofollow"/);
 // Source of the live nginx headers (scripts/build-deploy.mjs generates security-headers.conf from it).
 assert.match(read('public/_headers'), /^ {2}X-Robots-Tag: noindex, nofollow$/m);
});
