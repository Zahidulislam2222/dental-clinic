/**
 * Breach Detection — Supabase Edge Function
 * HIPAA 164.404-410: Automated anomaly detection
 * SOC 2 CC7: System Operations monitoring
 *
 * Designed to run hourly via pg_cron or Supabase CRON.
 * Checks audit_logs for anomalous patterns and creates security_incidents.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnomalyRule {
  id: number;
  rule_name: string;
  description: string;
  severity: string;
  threshold: number;
  window_minutes: number;
  is_active: boolean;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Fetch active anomaly rules
    const { data: rules, error: rulesError } = await supabaseAdmin
      .from('anomaly_rules')
      .select('*')
      .eq('is_active', true);

    if (rulesError) throw rulesError;
    if (!rules || rules.length === 0) {
      return new Response(JSON.stringify({ message: 'No active rules' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const incidents: string[] = [];

    for (const rule of rules as AnomalyRule[]) {
      const windowStart = new Date(Date.now() - rule.window_minutes * 60 * 1000).toISOString();
      let detected = false;
      let details = '';

      switch (rule.rule_name) {
        case 'excessive_phi_access': {
          // Check for any user with >threshold SELECT/FHIR_READ in window
          const { data } = await supabaseAdmin.rpc('check_excessive_access', {
            p_window_start: windowStart,
            p_threshold: rule.threshold,
          }).maybeSingle();

          // Fallback: count manually if RPC doesn't exist
          if (!data) {
            const { data: logs } = await supabaseAdmin
              .from('audit_logs')
              .select('user_id, user_email')
              .in('action', ['SELECT', 'FHIR_READ', 'FHIR_EXPORT'])
              .gte('timestamp', windowStart);

            if (logs) {
              const userCounts: Record<string, { count: number; email: string }> = {};
              for (const log of logs) {
                const uid = log.user_id || 'unknown';
                if (!userCounts[uid]) userCounts[uid] = { count: 0, email: log.user_email };
                userCounts[uid].count++;
              }
              for (const [uid, info] of Object.entries(userCounts)) {
                if (info.count >= rule.threshold) {
                  detected = true;
                  details = `User ${info.email} (${uid}) made ${info.count} PHI access requests in ${rule.window_minutes} minutes`;
                  break;
                }
              }
            }
          }
          break;
        }

        case 'non_staff_phi_access': {
          const { data: logs } = await supabaseAdmin
            .from('audit_logs')
            .select('user_id, user_email, user_role, action')
            .in('action', ['SELECT', 'FHIR_READ', 'FHIR_EXPORT'])
            .not('user_role', 'in', '("admin","doctor","receptionist")')
            .gte('timestamp', windowStart)
            .limit(rule.threshold);

          if (logs && logs.length >= rule.threshold) {
            detected = true;
            details = `Non-staff user(s) accessed PHI: ${logs.map(l => l.user_email).join(', ')}`;
          }
          break;
        }

        case 'after_hours_access': {
          // Business hours: 5PM-9PM (17:00-21:00) Sat-Thu
          // This is a simplified check — real implementation should check Bangladesh time
          const { data: logs } = await supabaseAdmin
            .from('audit_logs')
            .select('user_id, user_email, timestamp')
            .in('action', ['SELECT', 'FHIR_READ'])
            .gte('timestamp', windowStart);

          if (logs) {
            const afterHours = logs.filter(l => {
              const hour = new Date(l.timestamp).getUTCHours() + 6; // UTC+6 for Bangladesh
              const adjustedHour = hour >= 24 ? hour - 24 : hour;
              return adjustedHour < 17 || adjustedHour >= 21;
            });
            if (afterHours.length >= rule.threshold) {
              detected = true;
              details = `${afterHours.length} PHI access events outside business hours`;
            }
          }
          break;
        }

        case 'bulk_export': {
          const { count } = await supabaseAdmin
            .from('audit_logs')
            .select('*', { count: 'exact', head: true })
            .eq('action', 'FHIR_EXPORT')
            .gte('timestamp', windowStart);

          if (count && count >= rule.threshold) {
            detected = true;
            details = `${count} FHIR exports in ${rule.window_minutes} minutes`;
          }
          break;
        }

        case 'role_escalation': {
          const { data: logs } = await supabaseAdmin
            .from('audit_logs')
            .select('user_email, details')
            .eq('table_name', 'user_profiles')
            .eq('action', 'UPDATE')
            .ilike('details', '%admin%')
            .gte('timestamp', windowStart);

          if (logs && logs.length >= rule.threshold) {
            detected = true;
            details = `Role escalation to admin: ${logs.map(l => l.details).join('; ')}`;
          }
          break;
        }
      }

      if (detected) {
        // Check if a similar incident was already created recently (avoid duplicates)
        const { data: existing } = await supabaseAdmin
          .from('security_incidents')
          .select('id')
          .eq('title', rule.description)
          .in('status', ['detected', 'investigating'])
          .gte('detected_at', new Date(Date.now() - 3600000).toISOString()) // Within last hour
          .limit(1);

        if (!existing || existing.length === 0) {
          await supabaseAdmin.from('security_incidents').insert({
            severity: rule.severity,
            title: rule.description,
            description: details,
            detection_method: 'automated',
          });

          incidents.push(rule.rule_name);

          // Send alert email for high/critical
          if (['high', 'critical'].includes(rule.severity)) {
            await supabaseAdmin.functions.invoke('send-notification', {
              body: {
                type: 'admin_alert',
                subject: `Security Alert: ${rule.description}`,
                message: details,
              },
            }).catch(err => console.error('Alert email failed:', err));
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ checked: rules.length, incidents_created: incidents.length, incidents }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('breach-check error:', error);
    return new Response(
      JSON.stringify({ error: 'Breach check failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
