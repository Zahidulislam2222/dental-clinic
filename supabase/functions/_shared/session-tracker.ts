/**
 * Server-side Session Activity Tracker
 * HIPAA-SESSION-002: Track session activity server-side for audit
 *
 * Records login, logout, and session refresh events in audit_logs.
 * Called from Edge Functions that handle auth events.
 */

import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export type SessionEvent = 'LOGIN' | 'LOGOUT' | 'SESSION_REFRESH' | 'SESSION_TIMEOUT' | 'MFA_VERIFY';

export interface SessionInfo {
  userId: string;
  userEmail: string;
  userRole: string;
  ipAddress: string;
  userAgent: string;
  event: SessionEvent;
  details?: string;
}

/**
 * Log a session activity event to audit_logs.
 * This provides server-side evidence of session lifecycle
 * independent of client-side timeout tracking.
 */
export async function trackSessionEvent(
  supabase: SupabaseClient,
  info: SessionInfo
): Promise<void> {
  await supabase.from('audit_logs').insert({
    user_id: info.userId,
    user_email: info.userEmail,
    user_role: info.userRole,
    action: `SESSION_${info.event}`,
    table_name: 'auth_sessions',
    details: info.details || `Session event: ${info.event}`,
    ip_address: info.ipAddress,
    user_agent: info.userAgent,
  });
}

/**
 * Check if a session has been active within the HIPAA timeout window.
 * Returns false if the last activity is older than maxInactiveMinutes.
 */
export async function isSessionActive(
  supabase: SupabaseClient,
  userId: string,
  maxInactiveMinutes = 15
): Promise<boolean> {
  const windowStart = new Date(Date.now() - maxInactiveMinutes * 60 * 1000).toISOString();

  const { data } = await supabase
    .from('audit_logs')
    .select('timestamp')
    .eq('user_id', userId)
    .in('action', ['SESSION_LOGIN', 'SESSION_REFRESH', 'SESSION_MFA_VERIFY'])
    .gte('timestamp', windowStart)
    .order('timestamp', { ascending: false })
    .limit(1);

  return Boolean(data && data.length > 0);
}
