/**
 * Server-side rate limiting using Supabase
 * Tracks submissions by IP address
 */

import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  contact: { maxRequests: 5, windowMs: 60 * 60 * 1000 },       // 5/hr
  appointment: { maxRequests: 3, windowMs: 60 * 60 * 1000 },    // 3/hr
  registration: { maxRequests: 2, windowMs: 60 * 60 * 1000 },   // 2/hr
  newsletter: { maxRequests: 3, windowMs: 60 * 60 * 1000 },     // 3/hr
  login: { maxRequests: 5, windowMs: 15 * 60 * 1000 },          // 5/15min
};

/**
 * Check if request is within rate limit.
 * Uses the audit_logs table to count recent submissions from the same IP.
 */
export async function checkRateLimit(
  supabase: SupabaseClient,
  ip: string,
  formType: string
): Promise<{ allowed: boolean; retryAfterMs?: number }> {
  const config = RATE_LIMITS[formType] || { maxRequests: 10, windowMs: 60 * 60 * 1000 };
  const windowStart = new Date(Date.now() - config.windowMs).toISOString();

  const { count, error } = await supabase
    .from('audit_logs')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .eq('table_name', formType === 'contact' ? 'contacts' :
                      formType === 'appointment' ? 'appointments' :
                      formType === 'registration' ? 'registrations' :
                      formType === 'newsletter' ? 'newsletter_subscribers' : formType)
    .eq('action', 'INSERT')
    .gte('timestamp', windowStart);

  if (error || count === null) {
    // On error, allow the request (fail open) but log it
    console.error('Rate limit check failed:', error);
    return { allowed: true };
  }

  if (count >= config.maxRequests) {
    return { allowed: false, retryAfterMs: config.windowMs };
  }

  return { allowed: true };
}
