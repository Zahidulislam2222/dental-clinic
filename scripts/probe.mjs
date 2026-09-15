import settings from '../config/tooling.json' with { type: 'json' };
const target = process.argv[2];
if (!target) throw new Error('Usage: node scripts/probe.mjs https://your-host/healthz');
const url = new URL(target);
if (url.protocol !== 'https:' && !['localhost','127.0.0.1','[::1]'].includes(url.hostname)) throw new Error('Remote probes require HTTPS');
const start = performance.now();
let ok = false;
try {
  const response = await fetch(url, { signal: AbortSignal.timeout(settings.probeTimeoutMs), redirect:'error' });
  ok = response.ok && (await response.text()).trim() === 'dental-demo-ok';
} catch { /* Output intentionally omits URLs, tokens and network metadata. */ }
console.log(JSON.stringify({ at:new Date().toISOString(), ok, latencyMs:Math.round(performance.now()-start) }));
process.exitCode=ok?0:1;
