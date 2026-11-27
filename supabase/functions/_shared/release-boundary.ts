/** This repository release is an independent build on sample data, not a clinical deployment.
 * No environment flag can reopen the unverified early clinical backend.
 * Replace this boundary only after docs/CLINICAL-RELEASE.md gates pass.
 */
export function clinicalReleaseBoundary(): Response {
  return new Response(JSON.stringify({ error: 'Clinical services are not available on this site.' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Retry-After': '86400' },
  });
}
