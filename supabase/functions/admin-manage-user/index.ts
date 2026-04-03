/**
 * Admin User Management — Supabase Edge Function
 * Handles role changes and user account management.
 * SOC 2 CC6: Logical and Physical Access Controls.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { createLogger } from '../_shared/logger.ts';

const log = createLogger('admin-manage-user');

const VALID_ROLES = ['patient', 'doctor', 'receptionist', 'admin'];

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
      return new Response(JSON.stringify({ error: 'Only admins can manage users' }), { status: 403, headers: corsHeaders });
    }

    const { action, userId, role } = await req.json();

    if (action === 'change_role') {
      if (!userId || !role) {
        return new Response(JSON.stringify({ error: 'userId and role are required' }), { status: 400, headers: corsHeaders });
      }

      if (!VALID_ROLES.includes(role)) {
        return new Response(JSON.stringify({ error: 'Invalid role' }), { status: 400, headers: corsHeaders });
      }

      // Prevent admin from demoting themselves (safety)
      if (userId === user.id && role !== 'admin') {
        return new Response(JSON.stringify({ error: 'Cannot change your own role' }), { status: 400, headers: corsHeaders });
      }

      const { error: updateError } = await supabaseAdmin
        .from('user_profiles')
        .update({ role })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Audit log
      await supabaseAdmin.from('audit_logs').insert({
        user_id: user.id,
        user_email: user.email,
        user_role: 'admin',
        action: 'UPDATE',
        table_name: 'user_profiles',
        record_id: userId,
        details: `Role changed to: ${role}`,
        ip_address: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
      });

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Unknown action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    log.error('admin-manage-user error', { error_code: error?.code || 'UNKNOWN' });
    return new Response(
      JSON.stringify({ error: 'User management failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
