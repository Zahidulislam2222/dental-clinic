/**
 * HIPAA-Safe Email Notification — Supabase Edge Function
 * Sends admin/patient notifications via Resend.
 *
 * CRITICAL: NO PHI is included in email body.
 * Emails contain only reference numbers and login links.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const CLINIC_EMAIL = Deno.env.get('CLINIC_NOTIFICATION_EMAIL') || 'admin@everyday-dental.com';
const FROM_EMAIL = 'Everyday Dental Surgery <noreply@everyday-dental.com>';
const PORTAL_URL = Deno.env.get('SITE_URL') || 'https://everyday-dental.com';

interface NotificationRequest {
  type: 'admin_new_submission' | 'patient_confirmation' | 'admin_alert';
  formType?: string;
  refNumber?: string;
  patientEmail?: string;
  subject?: string;
  message?: string;
}

function buildAdminNotificationHtml(formType: string, refNumber: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #0A1628;">New ${formType} Submission</h2>
      <p>A new <strong>${formType}</strong> has been submitted.</p>
      ${refNumber ? `<p>Reference: <strong>${refNumber}</strong></p>` : ''}
      <p>Log in to the admin portal to view the full details:</p>
      <a href="${PORTAL_URL}/admin/${formType === 'contact' ? 'contacts' : formType + 's'}"
         style="display: inline-block; background: #00BFA6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
        View in Admin Portal
      </a>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; color: #888;">
        This is an automated notification from Everyday Dental Surgery.
        No patient health information is included in this email for HIPAA compliance.
      </p>
    </div>
  `;
}

function buildPatientConfirmationHtml(formType: string, refNumber: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #0A1628;">Everyday Dental Surgery</h2>
      <p>Thank you for your ${formType} submission.</p>
      ${refNumber ? `<p>Your reference number: <strong>${refNumber}</strong></p>` : ''}
      <p>For your security, detailed information is only available in your patient portal:</p>
      <a href="${PORTAL_URL}/dashboard"
         style="display: inline-block; background: #00BFA6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
        View in Patient Portal
      </a>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; color: #888;">
        This email does not contain any medical information for your security.
        If you did not make this submission, please contact us immediately.
      </p>
    </div>
  `;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: NotificationRequest = await req.json();
    const { type, formType, refNumber, patientEmail, subject, message } = body;

    if (!RESEND_API_KEY) {
      // Resend not configured — log and succeed silently
      console.warn('[send-notification] RESEND_API_KEY not set, skipping email');
      return new Response(
        JSON.stringify({ success: true, skipped: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emails: Array<{ to: string; subject: string; html: string }> = [];

    if (type === 'admin_new_submission' && formType) {
      emails.push({
        to: CLINIC_EMAIL,
        subject: `New ${formType} submission${refNumber ? ` (${refNumber})` : ''}`,
        html: buildAdminNotificationHtml(formType, refNumber || ''),
      });
    }

    if (type === 'patient_confirmation' && patientEmail && formType) {
      emails.push({
        to: patientEmail,
        subject: `Your ${formType} — Everyday Dental Surgery${refNumber ? ` (${refNumber})` : ''}`,
        html: buildPatientConfirmationHtml(formType, refNumber || ''),
      });
    }

    if (type === 'admin_alert' && subject && message) {
      emails.push({
        to: CLINIC_EMAIL,
        subject: `[ALERT] ${subject}`,
        html: `<div style="font-family: sans-serif; padding: 20px;"><h2 style="color: red;">${subject}</h2><p>${message}</p></div>`,
      });
    }

    // Send all emails via Resend
    const results = await Promise.allSettled(
      emails.map((email) =>
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: FROM_EMAIL,
            to: [email.to],
            subject: email.subject,
            html: email.html,
          }),
        })
      )
    );

    const failures = results.filter((r) => r.status === 'rejected');
    if (failures.length > 0) {
      console.error('[send-notification] Some emails failed:', failures);
    }

    return new Response(
      JSON.stringify({ success: true, sent: emails.length - failures.length, failed: failures.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('send-notification error:', error);
    return new Response(
      JSON.stringify({ error: 'Notification failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
