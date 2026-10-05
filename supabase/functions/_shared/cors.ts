/**
 * Shared CORS Configuration
 * Restricts Access-Control-Allow-Origin to the clinic domain.
 * Audit fix: SEC-CORS-001 (CRITICAL)
 */

// No fallback origin: without ALLOWED_ORIGIN the header is omitted and browsers block cross-origin calls.
const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN');

export const corsHeaders: Record<string, string> = {
  ...(ALLOWED_ORIGIN ? { 'Access-Control-Allow-Origin': ALLOWED_ORIGIN } : {}),
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, accept',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  return null;
}
