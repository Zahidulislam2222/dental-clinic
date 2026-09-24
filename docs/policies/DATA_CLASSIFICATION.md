# Data classification and handling

**Draft for adoption — 2026-09-24.** Legal classifications must be mapped separately for each jurisdiction; this engineering table does not replace statutory definitions.

| Class | Examples | Handling |
|---|---|---|
| Public | Approved clinic content, synthetic fixtures, public docs | Reviewed publishing and media rights |
| Internal | Nonpublic plans and operating notes | Authenticated staff access, no public repository |
| Personal | Contact/account/support information | Purpose limitation, access control and approved retention |
| Clinical/restricted | Symptoms, records, appointment context, sensitive exports | Strong identity, subject/tenant scope, encryption, audit and approved regions |
| Secrets | Keys, passwords, recovery codes and signing material | Secret store, least privilege, rotation and protected recovery |

Metadata can reveal health interests; do not assume an email address or appointment reference is harmless in context. Keep clinical data out of URLs, shared caches, telemetry and public screenshots. Store exports privately with bounded access. Encrypt backups and manage keys separately. Follow approved retention/holds and verify secure deletion/recovery behavior. Only synthetic records are permitted in demonstration fixtures and public tests.
