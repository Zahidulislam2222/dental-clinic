/**
 * Admin Data Query — Supabase Edge Function
 * Provides audit-logged data access for admin/staff users.
 * HIPAA 164.312(b): every data access is logged.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { createLogger } from '../_shared/logger.ts';

const log = createLogger('admin-query');

const ALLOWED_TABLES = [
  'appointments', 'registrations', 'contacts', 'newsletter_subscribers',
  'audit_logs', 'data_access_requests', 'user_profiles', 'consent_records',
  'fhir_resources', 'security_incidents',
];

const ALLOWED_FILTER_COLUMNS: Record<string, string[]> = {
  appointments: ['id', 'ref_number', 'user_id', 'status', 'service', 'date', 'created_at'],
  registrations: ['id', 'ref_number', 'user_id', 'created_at'],
  contacts: ['id', 'created_at'],
  newsletter_subscribers: ['id', 'subscriber_email', 'created_at'],
  audit_logs: ['user_id', 'action', 'table_name', 'timestamp'],
  data_access_requests: ['user_id', 'request_type', 'status', 'created_at'],
  user_profiles: ['id', 'role', 'is_active', 'created_at'],
  consent_records: ['user_id', 'consent_type', 'created_at'],
  fhir_resources: ['resource_type', 'resource_id', 'created_at'],
  security_incidents: ['severity', 'status', 'detected_at'],
};

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    // Authenticate
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    // Check role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role || 'patient';
    if (!['admin', 'doctor', 'receptionist'].includes(role)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders });
    }

    const { table, filters, limit: queryLimit } = await req.json();

    if (!table || !ALLOWED_TABLES.includes(table)) {
      return new Response(JSON.stringify({ error: 'Invalid table' }), { status: 400, headers: corsHeaders });
    }

    // Audit log the access
    await supabaseAdmin.from('audit_logs').insert({
      user_id: user.id,
      user_email: user.email,
      user_role: role,
      action: 'SELECT',
      table_name: table,
      details: `Admin query: ${table}${filters ? ` with filters` : ''}`,
      ip_address: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
    });

    // Determine which view to use based on role and table
    let viewName = table;
    if (role === 'receptionist') {
      if (table === 'registrations') viewName = 'registrations_reception';
      else if (table === 'appointments') viewName = 'appointments_reception';
    } else if (['admin', 'doctor'].includes(role)) {
      if (table === 'registrations') viewName = 'registrations_decrypted';
      else if (table === 'appointments') viewName = 'appointments_decrypted';
    }

    // audit_logs table — only admin can access
    if (table === 'audit_logs' && role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Only admins can view audit logs' }), { status: 403, headers: corsHeaders });
    }

    let query = supabaseAdmin.from(viewName).select('*');

    // Apply optional filters
    if (filters && typeof filters === 'object') {
      const allowedCols = ALLOWED_FILTER_COLUMNS[table] || [];
      for (const [key, value] of Object.entries(filters)) {
        if (!allowedCols.includes(key)) continue; // Skip disallowed columns
        query = query.eq(key, value);
      }
    }

    const resultLimit = Math.min(queryLimit || 500, 1000);
    query = query.order('created_at', { ascending: false }).limit(resultLimit);

    const { data, error } = await query;
    if (error) throw error;

    return new Response(
      JSON.stringify({ data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    log.error('admin-query error', { error_code: error?.code || 'UNKNOWN' });
    return new Response(
      JSON.stringify({ error: 'Query failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
