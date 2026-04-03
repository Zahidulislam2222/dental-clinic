/**
 * PHI Data Access with Audit Logging
 * HIPAA: 164.312(b) — Logs every SELECT on PHI data
 *
 * PostgreSQL triggers can't fire on SELECT, so this Edge Function
 * handles all PHI reads and logs access to audit_logs.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { createLogger } from '../_shared/logger.ts';

const log = createLogger('get-patient-data');

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Authenticate the request
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    // Create user-context client to check auth
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    // Create admin client for data access and audit logging
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get user profile to check role
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role || 'patient';
    const { table, recordId, patientId } = await req.json();

    // Authorization check
    if (role === 'patient') {
      // Patients can only access their own data
      if (patientId && patientId !== user.id) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders });
      }
    }

    // Log the SELECT access
    await supabaseAdmin.from('audit_logs').insert({
      user_id: user.id,
      user_email: user.email,
      user_role: role,
      action: 'SELECT',
      table_name: table,
      record_id: recordId || null,
      details: `PHI data accessed. Patient ID: ${patientId || 'all'}`,
      ip_address: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
    });

    // Fetch the data using decrypted views
    let query;
    const viewName = table === 'registrations' ? 'registrations_decrypted'
                   : table === 'appointments' ? 'appointments_decrypted'
                   : table;

    if (role === 'patient') {
      query = supabaseAdmin.from(viewName).select('*').eq('user_id', user.id);
    } else if (role === 'receptionist') {
      // Receptionist uses non-PHI views
      const receptionView = table === 'registrations' ? 'registrations_reception'
                          : table === 'appointments' ? 'appointments_reception'
                          : table;
      query = supabaseAdmin.from(receptionView).select('*');
    } else {
      // Doctor and admin get full decrypted data
      query = supabaseAdmin.from(viewName).select('*');
    }

    if (recordId) {
      query = query.eq('id', recordId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return new Response(
      JSON.stringify({ data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    log.error('get-patient-data error', { error_code: error?.code || 'UNKNOWN' });
    return new Response(
      JSON.stringify({ error: 'Failed to fetch data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
