# Deployment, monitoring and recovery

## Build and inspect

Use Node 24 or newer within the supported toolchain. Run `npm ci`, `npm run check`, `npm audit`, `npm run test:browser` against a local preview, and `node scripts/security-check.mjs`. Run gitleaks over history and staged changes. Retain raw logs privately. `node scripts/build-deploy.mjs` generates Compose, nginx and gateway-site files from deployment settings and the canonical header policy.

The release consists only of `dist/`, `compose.yaml`, `nginx.conf`, `security-headers.conf` and the project gateway file. Do not upload source, environment files, credentials, memory, source maps, SQL or local research artifacts to the web root. Settings identify the hostname, pinned image, loopback port and resource bounds in one place.

## Deploy safely

1. Read the shared infrastructure inventory, then inspect current DNS, listeners, containers and capacity. Confirm project ownership and compare any existing project files with local snapshots.
2. Build a new versioned release locally. Generate a SHA256 manifest, save an off-server archive and verify extraction against the manifest.
3. Upload only the allowlisted release to its unique release directory. Validate Compose and nginx before starting the project container. Verify loopback health and inspect actual limits/bindings.
4. Prepare only this project's gateway site locally. Preserve the shared main configuration and unrelated sites. Validate the whole gateway configuration before reloading.
5. Create/update only the confirmed project DNS record. Verify direct-origin certificate validity using hostname SNI, then public TLS, expected content and security/cache headers.
6. Compare every deployed release file hash with local. Record image digest, release, gateway hash and DNS change evidence privately.

## Rollback

Retain the previous release and its manifests. Compare current project configuration first to avoid overwriting newer work. Start the previous project release with its own verified Compose file, then verify health, public content and hashes. Restore only this project's gateway/DNS values when they changed. Never remove unrelated containers or volumes, run a global prune or use `down -v` as a routine rollback.

This static release has no patient-generated persistent state. A later clinical release requires an application-consistent database and upload backup, keys, restored permissions/holds and compatible migrations; restoring static files does not recover patient data.

## Monitoring

Run `node scripts/probe.mjs https://your-host/healthz` from an independently hosted scheduler and retain its JSON output. Configure a named responder and alert policy before making an operating SLA. The probe requires valid TLS and the expected body, returns nonzero on failure and does not print sensitive URLs. Do not count a one-time probe or server-local healthcheck as a month of availability.

The loopback load tool refuses remote targets. Increase load only in an explicitly isolated test environment after agreeing on resource limits. Never run a million-user test against this shared VPS or a free third-party project.

## Recovery records

The private checkpoint stores deployment state before/after each significant action. The dossier stores durable incident lessons. CREDENTIALS.md is gitignored and must be reconciled privately when credentials change. Public verification contains counts and limits, not passwords, account IDs or server access details. Independent review is deferred to a separate session by the owner; do not record an invented approval.
