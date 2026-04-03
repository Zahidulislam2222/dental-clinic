import { sanitizeFormData } from './sanitize';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────

// Fire-and-forget notification via Edge Function (no PHI in email)
const sendNotification = (type, params) => {
  if (!isSupabaseConfigured || !supabase) return;
  supabase.functions
    .invoke('send-notification', { body: { type, ...params } })
    .catch((err) => console.warn('[EmailService] Notification failed:', err.message));
};

// ──────────────────────────────────────────────────────────
// Public API — submits through Supabase Edge Functions
// SEC-PHI-001: No localStorage fallback — PHI must never touch client storage
// FLOW-BYPASS-001: All submissions require backend
// ──────────────────────────────────────────────────────────

function requireBackend() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Backend is not configured. Submissions require a server connection.');
  }
}

export const api = {
  async submitContact(data) {
    requireBackend();
    const sanitized = sanitizeFormData({
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || 'N/A',
      service: data.service || 'N/A',
      message: data.message,
    });

    const { data: result, error } = await supabase.functions.invoke('submit-form', {
      body: { formType: 'contact', data: sanitized },
    });
    if (error) throw new Error('Submission failed. Please try again.');

    sendNotification('admin_new_submission', { formType: 'contact' });
    return result;
  },

  async submitAppointment(data) {
    requireBackend();
    const sanitized = sanitizeFormData({
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || 'N/A',
      service: data.service,
      date: data.date,
      time: data.time,
      bookingMode: data.bookingMode,
      medicalNotes: data.medicalNotes || 'None',
      userId: data.userId || null,
    });

    const { data: result, error } = await supabase.functions.invoke('submit-form', {
      body: { formType: 'appointment', data: sanitized },
    });
    if (error) throw new Error('Submission failed. Please try again.');

    sendNotification('admin_new_submission', { formType: 'appointment', refNumber: result.refNumber });
    if (sanitized.email && sanitized.email !== 'N/A') {
      sendNotification('patient_confirmation', { formType: 'appointment', refNumber: result.refNumber, patientEmail: sanitized.email });
    }

    return result;
  },

  async submitRegistration(data) {
    requireBackend();
    const sanitized = sanitizeFormData({
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || 'N/A',
      dob: data.dob || 'N/A',
      gender: data.gender || 'N/A',
      bloodGroup: data.bloodGroup || 'N/A',
      medicalHistory: data.medicalHistory || 'None',
      allergies: data.allergies || 'None',
      preferredDate: data.preferredDate || 'N/A',
      preferredTime: data.preferredTime || 'N/A',
      userId: data.userId || null,
    });

    const { data: result, error } = await supabase.functions.invoke('submit-form', {
      body: { formType: 'registration', data: sanitized },
    });
    if (error) throw new Error('Submission failed. Please try again.');

    sendNotification('admin_new_submission', { formType: 'registration', refNumber: result.refNumber });
    if (sanitized.email && sanitized.email !== 'N/A') {
      sendNotification('patient_confirmation', { formType: 'registration', refNumber: result.refNumber, patientEmail: sanitized.email });
    }

    return result;
  },

  async subscribeNewsletter(email) {
    requireBackend();
    const sanitized = sanitizeFormData({ email });

    const { data: result, error } = await supabase.functions.invoke('submit-form', {
      body: { formType: 'newsletter', data: sanitized },
    });
    if (error) throw new Error('Subscription failed. Please try again.');
    return result;
  },
};

export default api;
