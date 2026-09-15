import fs from 'node:fs';
import path from 'node:path';
import settings from '../deploy/settings.json' with { type: 'json' };
const output=process.argv[2] || 'deploy/generated';
if(!/^[a-z0-9.-]+$/.test(settings.hostname) || !Number.isInteger(settings.hostPort)) throw new Error('Invalid deployment config');
fs.mkdirSync(output,{recursive:true});
const headers=fs.readFileSync('public/_headers','utf8').split('\n').filter(line=>/^ {2}[A-Za-z-]+: /.test(line)).map(line=>{
  const split=line.indexOf(': ');return [line.slice(2,split),line.slice(split+2)];
});
const securityHeaders=headers.filter(([key])=>key!=='Cache-Control').map(([key,value])=>`add_header ${key} "${value.replaceAll('"','\\"')}" always;`).join('\n');
fs.writeFileSync(path.join(output,'security-headers.conf'),securityHeaders+'\n');
fs.writeFileSync(path.join(output,'nginx.conf'),`pid /tmp/nginx.pid;
worker_processes auto;
events { worker_connections 1024; }
http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;
  access_log off;
  error_log /dev/stderr warn;
  server_tokens off;
  sendfile on;
  gzip on;
  gzip_types text/css application/javascript application/json image/svg+xml;
  client_body_temp_path /tmp/client;
  proxy_temp_path /tmp/proxy;
  fastcgi_temp_path /tmp/fastcgi;
  uwsgi_temp_path /tmp/uwsgi;
  scgi_temp_path /tmp/scgi;
  client_header_timeout ${settings.clientTimeoutSeconds}s;
  client_body_timeout ${settings.clientTimeoutSeconds}s;
  send_timeout ${settings.clientTimeoutSeconds}s;
  client_max_body_size ${settings.maxBodySize};
  server {
    listen ${settings.containerPort};
    root /usr/share/nginx/html;
    include /etc/nginx/security-headers.conf;
    add_header Cache-Control "no-cache, no-transform" always;
    if ($request_method !~ ^(GET|HEAD)$) { return 405; }
    location ~ (^|/)\\. { return 404; }
    location ~ ^/(api|fhir|functions|rest|auth|supabase|src|memory|docs|config|deploy)(/|$) { return 404; }
    location ~* \\.(sql|map|toml|ya?ml|md|env|key|pem)$ { return 404; }
    location = /healthz { default_type text/plain; return 200 "dental-demo-ok\\n"; }
    location /assets/ {
      include /etc/nginx/security-headers.conf;
      add_header Cache-Control "public, max-age=${settings.assetCacheSeconds}, immutable, no-transform" always;
      try_files $uri =404;
    }
    location /images/ {
      include /etc/nginx/security-headers.conf;
      add_header Cache-Control "public, max-age=${settings.imageCacheSeconds}, no-transform" always;
      try_files $uri =404;
    }
    location / { try_files $uri $uri/ @spa; }
    location @spa {
      if ($uri !~ ^/(about|services(/[-a-z0-9]+)?|pricing|blog(/[-a-z0-9]+)?|faq|contact|register|appointment|gallery|community|conferences|privacy-policy|terms|login|signup|forgot-password|reset-password|unauthorized|dashboard(/[-a-z0-9]+)?|admin(/[-a-z0-9]+)?|experience|trust|accessibility)/?$) { return 404; }
      try_files /index.html =404;
    }
  }
}
`);
fs.writeFileSync(path.join(output,'compose.yaml'),`name: ${settings.slug}
services:
  web:
    image: ${settings.image}
    user: "101:101"
    entrypoint: ["nginx", "-g", "daemon off;"]
    read_only: true
    restart: unless-stopped
    cap_drop: [ALL]
    security_opt: [no-new-privileges:true]
    pids_limit: ${settings.pidsLimit}
    mem_limit: ${settings.memory}
    cpus: "${settings.cpus}"
    ports: ["127.0.0.1:${settings.hostPort}:${settings.containerPort}"]
    tmpfs: ["/tmp:rw,noexec,nosuid,size=16m,uid=101,gid=101"]
    volumes:
      - ./dist:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./security-headers.conf:/etc/nginx/security-headers.conf:ro
    healthcheck:
      test: ["CMD-SHELL", "wget -q -O - http://127.0.0.1:${settings.containerPort}/healthz | grep -qx dental-demo-ok"]
      interval: ${settings.healthInterval}
      timeout: ${settings.healthTimeout}
      retries: ${settings.healthRetries}
`);
fs.writeFileSync(path.join(output,'dental-clinic.caddy'),`${settings.hostname} {\n    reverse_proxy 127.0.0.1:${settings.hostPort}\n}\n`);
console.log('Deployment configuration generated:',output);
