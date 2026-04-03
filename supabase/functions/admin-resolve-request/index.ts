/**
 * Admin Resolve Data Request — Supabase Edge Function
 * Processes patient data access/amendment/deletion requests.
 * HIPAA 164.524-526: patient data rights management.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { createLogger } from '../_shared/logger.ts';

const log = createLogger('admin-resolve-request');

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Verify admin role
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Only admins can resolve requests' }), { status: 403, headers: corsHeaders });
    }

    const { requestId, status, adminNotes, resolvedBy } = await req.json();

    if (!requestId || !status) {
      return new Response(JSON.stringify({ error: 'requestId and status are required' }), { status: 400, headers: corsHeaders });
    }

    if (!['approved', 'denied', 'completed'].includes(status)) {
      return new Response(JSON.stringify({ error: 'Invalid status' }), { status: 400, headers: corsHeaders });
    }

    // Update the request
    const { error: updateError } = await supabaseAdmin
      .from('data_access_requests')
      .update({
        status,
        admin_notes: adminNotes || null,
        resolved_at: new Date().toISOString(),
        resolved_by: resolvedBy || user.id,
      })
      .eq('id', requestId);

    if (updateError) throw updateError;

    // Audit log
    await supabaseAdmin.from('audit_logs').insert({
      user_id: user.id,
      user_email: user.email,
      user_role: 'admin',
      action: 'UPDATE',
      table_name: 'data_access_requests',
      record_id: requestId,
      details: `Request ${requestId} resolved as: ${status}`,
      ip_address: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    log.error('admin-resolve-request error', { error_code: error?.code || 'UNKNOWN' });
    return new Response(
      JSON.stringify({ error: 'Failed to resolve request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
