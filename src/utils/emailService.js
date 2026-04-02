import { sanitizeFormData } from './sanitize';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────

// localStorage fallback for dev mode (no Supabase configured)
const FALLBACK_KEYS = {
  contacts: 'eds-contact-messages',
  appointments: 'eds-appointments',
  registrations: 'eds-registrations',
  newsletter: 'eds-newsletter',
};

const saveToLocalStorage = async (table, data) => {
  console.warn('[EmailService] No backend configured — saving to localStorage.');
  await new Promise((resolve) => setTimeout(resolve, 800));
  const key = FALLBACK_KEYS[table] || `eds-${table}`;
  const entries = JSON.parse(localStorage.getItem(key) || '[]');
  entries.push({ ...data, createdAt: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(entries));
};

// Fire-and-forget notification via Edge Function (no PHI in email)
const sendNotification = (type, params) => {
  if (!isSupabaseConfigured || !supabase) return;
  supabase.functions
    .invoke('send-notification', { body: { type, ...params } })
    .catch((err) => console.warn('[EmailService] Notification failed:', err.message));
};

// ──────────────────────────────────────────────────────────
// Public API — submits through Supabase Edge Functions
// ──────────────────────────────────────────────────────────

export const api = {
  async submitContact(data) {
    const sanitized = sanitizeFormData({
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || 'N/A',
      service: data.service || 'N/A',
      message: data.message,
    });

    if (isSupabaseConfigured) {
      const { data: result, error } = await supabase.functions.invoke('submit-form', {
        body: { formType: 'contact', data: sanitized },
      });
      if (error) throw new Error(error.message);
      if (result?.errors) throw new Error(result.errors.map((e) => e.message).join(', '));

      // Fire-and-forget admin notification (no PHI)
      sendNotification('admin_new_submission', { formType: 'contact' });

      return result;
    }

    await saveToLocalStorage('contacts', sanitized);
    return { success: true, message: 'Message sent successfully!' };
  },

  async submitAppointment(data) {
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

    if (isSupabaseConfigured) {
      const { data: result, error } = await supabase.functions.invoke('submit-form', {
        body: { formType: 'appointment', data: sanitized },
      });
      if (error) throw new Error(error.message);
      if (result?.errors) throw new Error(result.errors.map((e) => e.message).join(', '));

      // Notifications (no PHI in email body)
      sendNotification('admin_new_submission', { formType: 'appointment', refNumber: result.refNumber });
      if (sanitized.email && sanitized.email !== 'N/A') {
        sendNotification('patient_confirmation', { formType: 'appointment', refNumber: result.refNumber, patientEmail: sanitized.email });
      }

      return result;
    }

    await saveToLocalStorage('appointments', sanitized);
    return { success: true, refNumber: 'DEV-LOCAL' };
  },

  async submitRegistration(data) {
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

    if (isSupabaseConfigured) {
      const { data: result, error } = await supabase.functions.invoke('submit-form', {
        body: { formType: 'registration', data: sanitized },
      });
      if (error) throw new Error(error.message);
      if (result?.errors) throw new Error(result.errors.map((e) => e.message).join(', '));

      sendNotification('admin_new_submission', { formType: 'registration', refNumber: result.refNumber });
      if (sanitized.email && sanitized.email !== 'N/A') {
        sendNotification('patient_confirmation', { formType: 'registration', refNumber: result.refNumber, patientEmail: sanitized.email });
      }

      return result;
    }

    await saveToLocalStorage('registrations', sanitized);
    return { success: true, refNumber: 'DEV-LOCAL' };
  },

  async subscribeNewsletter(email) {
    const sanitized = sanitizeFormData({ email });

    if (isSupabaseConfigured) {
      const { data: result, error } = await supabase.functions.invoke('submit-form', {
        body: { formType: 'newsletter', data: sanitized },
      });
      if (error) throw new Error(error.message);
      if (result?.errors) throw new Error(result.errors.map((e) => e.message).join(', '));
      return result;
    }

    await saveToLocalStorage('newsletter', sanitized);
    return { success: true, message: 'Subscribed successfully!' };
  },
};

export default api;
