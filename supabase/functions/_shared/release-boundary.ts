/** This repository release is a synthetic portfolio, not a clinical deployment.
 * No environment flag can reopen the unverified clinical prototype.
 * Replace this boundary only after docs/CLINICAL-RELEASE.md gates pass.
 */
export function clinicalReleaseBoundary(): Response {
  return new Response(JSON.stringify({ error: 'Clinical services are not available in this demonstration.' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Retry-After': '86400' },
  });
}
