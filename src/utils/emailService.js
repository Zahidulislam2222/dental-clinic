import emailjs from '@emailjs/browser';

// ──────────────────────────────────────────────────────────
// EmailJS Configuration
// Sign up at https://www.emailjs.com/ (free tier: 200 emails/month)
//
// Steps:
//  1. Create an account → Add an Email Service (Gmail, Outlook, etc.)
//  2. Create Email Templates for: contact, appointment, registration
//  3. Copy your Service ID, Template IDs, and Public Key below
// ──────────────────────────────────────────────────────────

const CONFIG = {
  publicKey:    'YOUR_EMAILJS_PUBLIC_KEY',     // Dashboard → Account → API Keys
  serviceId:    'YOUR_EMAILJS_SERVICE_ID',     // Dashboard → Email Services
  templates: {
    contact:      'YOUR_CONTACT_TEMPLATE_ID',      // Template for contact form
    appointment:  'YOUR_APPOINTMENT_TEMPLATE_ID',   // Template for appointments
    registration: 'YOUR_REGISTRATION_TEMPLATE_ID',  // Template for patient registration
    newsletter:   'YOUR_NEWSLETTER_TEMPLATE_ID',    // Template for newsletter signups
  },
};

// Initialize once
emailjs.init(CONFIG.publicKey);

// Generate reference number
const generateRefNumber = () =>
  'EDS-' + Math.random().toString(36).substring(2, 8).toUpperCase();

/**
 * Send email via EmailJS. Falls back to localStorage if EmailJS is not configured.
 */
const sendEmail = async (templateId, templateParams) => {
  const isConfigured = !CONFIG.publicKey.startsWith('YOUR_');

  if (isConfigured) {
    await emailjs.send(CONFIG.serviceId, templateId, templateParams);
  } else {
    // Fallback: store locally when EmailJS keys aren't set yet
    console.warn('[EmailService] EmailJS not configured — saving to localStorage.');
    await new Promise((resolve) => setTimeout(resolve, 800));
    const key = `eds-${templateId}`;
    const entries = JSON.parse(localStorage.getItem(key) || '[]');
    entries.push({ ...templateParams, createdAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(entries));
  }
};

// ──────────────────────────────────────────────────────────
// Public API (drop-in replacement for mockApi)
// ──────────────────────────────────────────────────────────

export const api = {
  async submitContact(data) {
    await sendEmail(CONFIG.templates.contact, {
      from_name:  data.fullName,
      from_phone: data.phone,
      from_email: data.email || 'N/A',
      service:    data.service || 'N/A',
      message:    data.message,
    });
    return { success: true, message: 'Message sent successfully!' };
  },

  async submitAppointment(data) {
    const refNumber = generateRefNumber();
    await sendEmail(CONFIG.templates.appointment, {
      ref_number:    refNumber,
      patient_name:  data.fullName,
      patient_phone: data.phone,
      patient_email: data.email || 'N/A',
      service:       data.service,
      date:          data.date,
      time:          data.time,
      booking_mode:  data.bookingMode,
      medical_notes: data.medicalNotes || 'None',
    });
    return { success: true, refNumber };
  },

  async submitRegistration(data) {
    const refNumber = generateRefNumber();
    await sendEmail(CONFIG.templates.registration, {
      ref_number:      refNumber,
      patient_name:    data.fullName,
      patient_phone:   data.phone,
      patient_email:   data.email || 'N/A',
      date_of_birth:   data.dob || 'N/A',
      gender:          data.gender || 'N/A',
      blood_group:     data.bloodGroup || 'N/A',
      medical_history: data.medicalHistory || 'None',
      allergies:       data.allergies || 'None',
      preferred_date:  data.preferredDate || 'N/A',
      preferred_time:  data.preferredTime || 'N/A',
    });
    return { success: true, refNumber };
  },

  async subscribeNewsletter(email) {
    await sendEmail(CONFIG.templates.newsletter, {
      subscriber_email: email,
    });
    return { success: true, message: 'Subscribed successfully!' };
  },
};

export default api;
