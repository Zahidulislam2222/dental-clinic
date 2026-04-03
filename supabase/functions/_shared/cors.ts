/**
 * Shared CORS Configuration
 * Restricts Access-Control-Allow-Origin to the clinic domain.
 * Audit fix: SEC-CORS-001 (CRITICAL)
 */

const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') || 'https://dental-clinic-anq.pages.dev';

export const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, accept',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  return null;
}
