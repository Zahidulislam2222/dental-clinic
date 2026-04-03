/**
 * Appointment Cancellation — Supabase Edge Function
 * FLOW-APPT-002: Handles appointment cancellation with reason tracking
 * HIPAA: Audit-logged, only the patient or staff can cancel
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { createLogger } from '../_shared/logger.ts';

const log = createLogger('cancel-appointment');

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get user role
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role || 'patient';
    const isStaff = ['doctor', 'admin', 'receptionist'].includes(role);

    const { appointmentId, reason } = await req.json();

    if (!appointmentId) {
      return new Response(JSON.stringify({ error: 'Appointment ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch the appointment
    const { data: appointment, error: fetchError } = await supabaseAdmin
      .from('appointments')
      .select('id, user_id, status, ref_number')
      .eq('id', appointmentId)
      .single();

    if (fetchError || !appointment) {
      return new Response(JSON.stringify({ error: 'Appointment not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Authorization: patients can only cancel their own appointments
    if (!isStaff && appointment.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Cannot cancel already cancelled or fulfilled appointments
    if (['cancelled', 'fulfilled'].includes(appointment.status)) {
      return new Response(
        JSON.stringify({ error: `Cannot cancel an appointment that is already ${appointment.status}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update appointment status
    const { error: updateError } = await supabaseAdmin
      .from('appointments')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason || 'No reason provided',
      })
      .eq('id', appointmentId);

    if (updateError) {
      throw updateError;
    }

    // Audit log
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    await supabaseAdmin.from('audit_logs').insert({
      user_id: user.id,
      user_email: user.email,
      user_role: role,
      action: 'CANCEL_APPOINTMENT',
      table_name: 'appointments',
      record_id: appointmentId,
      details: `Cancelled appointment ${appointment.ref_number}. Reason: ${reason || 'Not provided'}`,
      ip_address: clientIp,
    });

    // Send notification to patient (fire-and-forget, no PHI in body)
    supabaseAdmin.functions.invoke('send-notification', {
      body: {
        type: 'appointment_cancelled',
        appointmentRef: appointment.ref_number,
        userId: appointment.user_id,
      },
    }).catch(() => {/* notification failure should not block cancellation */});

    return new Response(
      JSON.stringify({ success: true, message: 'Appointment cancelled successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    log.error('cancel-appointment error', { error_code: error?.code || 'UNKNOWN' });
    return new Response(
      JSON.stringify({ error: 'Cancellation failed. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
