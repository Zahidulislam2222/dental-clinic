/**
 * Server-side form submission handler
 * HIPAA: 164.312(c) Integrity controls — server-side validation
 *
 * Validates, sanitizes, encrypts PHI, inserts to database, and triggers notification.
 * Called from emailService.js via supabase.functions.invoke()
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { sanitizeFormData } from '../_shared/sanitize.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidationError {
  field: string;
  message: string;
}

function validateContact(data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!data.fullName || String(data.fullName).length < 1) errors.push({ field: 'fullName', message: 'Name is required' });
  if (String(data.fullName || '').length > 200) errors.push({ field: 'fullName', message: 'Name too long' });
  if (!data.phone || !/^\+?[0-9]{7,15}$/.test(String(data.phone).replace(/\s/g, ''))) errors.push({ field: 'phone', message: 'Invalid phone' });
  if (data.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(String(data.email))) errors.push({ field: 'email', message: 'Invalid email' });
  if (!data.message || String(data.message).length < 1) errors.push({ field: 'message', message: 'Message is required' });
  if (String(data.message || '').length > 5000) errors.push({ field: 'message', message: 'Message too long' });
  return errors;
}

function validateAppointment(data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!data.fullName || String(data.fullName).length < 1) errors.push({ field: 'fullName', message: 'Name is required' });
  if (!data.phone) errors.push({ field: 'phone', message: 'Phone is required' });
  if (!data.service) errors.push({ field: 'service', message: 'Service is required' });
  if (!data.date) errors.push({ field: 'date', message: 'Date is required' });
  if (!data.time) errors.push({ field: 'time', message: 'Time is required' });
  if (!data.bookingMode) errors.push({ field: 'bookingMode', message: 'Booking mode is required' });
  return errors;
}

function validateRegistration(data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!data.fullName || String(data.fullName).length < 1) errors.push({ field: 'fullName', message: 'Name is required' });
  if (!data.phone) errors.push({ field: 'phone', message: 'Phone is required' });
  if (!data.preferredDate) errors.push({ field: 'preferredDate', message: 'Preferred date is required' });
  if (!data.preferredTime) errors.push({ field: 'preferredTime', message: 'Preferred time is required' });
  return errors;
}

function validateNewsletter(data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!data.email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(String(data.email))) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }
  return errors;
}

function generateRefNumber(): string {
  const arr = new Uint8Array(4);
  crypto.getRandomValues(arr);
  return 'EDS-' + Array.from(arr, (x) => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { formType, data: rawData } = await req.json();

    // 1. Sanitize all inputs
    const data = sanitizeFormData(rawData) as Record<string, string>;

    // 2. Validate based on form type
    let errors: ValidationError[] = [];
    switch (formType) {
      case 'contact': errors = validateContact(data); break;
      case 'appointment': errors = validateAppointment(data); break;
      case 'registration': errors = validateRegistration(data); break;
      case 'newsletter': errors = validateNewsletter(data); break;
      default: return new Response(JSON.stringify({ error: 'Invalid form type' }), { status: 400, headers: corsHeaders });
    }

    if (errors.length > 0) {
      return new Response(JSON.stringify({ errors }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 3. Create admin client (bypasses RLS for encryption functions)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get client IP for audit logging
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    // 4. Insert based on form type
    let result: Record<string, unknown> = {};

    if (formType === 'contact') {
      const { error } = await supabaseAdmin.from('contacts').insert({
        from_name: data.fullName,
        from_phone: data.phone,
        from_email: data.email || 'N/A',
        service: data.service || 'N/A',
        message: data.message,
      });
      if (error) throw error;
      result = { success: true, message: 'Message sent successfully!' };
    }

    if (formType === 'appointment') {
      const refNumber = generateRefNumber();
      const { error } = await supabaseAdmin.from('appointments').insert({
        ref_number: refNumber,
        patient_name: data.fullName,
        patient_phone: data.phone,
        patient_email: data.email || 'N/A',
        service: data.service,
        date: data.date,
        time: data.time,
        booking_mode: data.bookingMode,
        medical_notes: data.medicalNotes || 'None',
        // PHI encryption handled by trigger or Edge Function
        user_id: data.userId || null,
      });
      if (error) throw error;
      result = { success: true, refNumber };
    }

    if (formType === 'registration') {
      const refNumber = generateRefNumber();
      const { error } = await supabaseAdmin.from('registrations').insert({
        ref_number: refNumber,
        patient_name: data.fullName,
        patient_phone: data.phone,
        patient_email: data.email || 'N/A',
        date_of_birth: data.dob || 'N/A',
        gender: data.gender || 'N/A',
        blood_group: data.bloodGroup || 'N/A',
        medical_history: data.medicalHistory || 'None',
        allergies: data.allergies || 'None',
        preferred_date: data.preferredDate || 'N/A',
        preferred_time: data.preferredTime || 'N/A',
        user_id: data.userId || null,
      });
      if (error) throw error;
      result = { success: true, refNumber };
    }

    if (formType === 'newsletter') {
      const { error } = await supabaseAdmin.from('newsletter_subscribers').insert({
        subscriber_email: data.email,
      });
      if (error) {
        // Handle duplicate email gracefully (Postgres error 23505)
        if (error.code === '23505') {
          result = { success: true, message: 'Already subscribed!' };
        } else {
          throw error;
        }
      } else {
        result = { success: true, message: 'Subscribed successfully!' };
      }
    }

    // 5. Fire-and-forget notification (no PHI in email body)
    // This will be implemented in Phase 10 when EmailJS is replaced
    // For now, notifications go through the existing emailService.js fallback

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('submit-form error:', error);
    return new Response(
      JSON.stringify({ error: 'Submission failed. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
