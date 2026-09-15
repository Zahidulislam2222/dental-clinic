import { performance } from 'node:perf_hooks';
import settings from '../config/tooling.json' with { type: 'json' };
const target = new URL(process.argv[2] || `http://${settings.host}:${settings.previewPort}/`);
if (!['127.0.0.1','localhost','[::1]'].includes(target.hostname)) throw new Error('This load tool is restricted to loopback; use an approved isolated load environment for larger tests.');
if (settings.loadClients > settings.maxLocalClients) throw new Error('Local load safety cap exceeded');
let cursor=0, failures=0; const latencies=[]; const start=performance.now();
await Promise.all(Array.from({length:settings.loadClients},async()=>{
  while(cursor++<settings.loadRequests) {
    const then=performance.now();
    try { const r=await fetch(target,{signal:AbortSignal.timeout(settings.probeTimeoutMs),redirect:'error'});await r.arrayBuffer();if(!r.ok)failures++; } catch { failures++; }
    latencies.push(performance.now()-then);
  }
}));
latencies.sort((a,b)=>a-b);const duration=(performance.now()-start)/1000;
console.log(JSON.stringify({scope:'local HTTP only; no browser or database capacity claim',clients:settings.loadClients,requests:latencies.length,failures,seconds:duration,rps:latencies.length/duration,p95Ms:latencies[Math.ceil(latencies.length*.95)-1]},null,2));
process.exitCode=failures?1:0;
