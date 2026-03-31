// Simulated API delay
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Generate random reference number
const generateRefNumber = () => {
  return 'EDS-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Mock API functions
export const api = {
  // Submit appointment
  async submitAppointment(data) {
    await delay(1200);
    const refNumber = generateRefNumber();
    const appointments = JSON.parse(localStorage.getItem('eds-appointments') || '[]');
    const appointment = { ...data, refNumber, status: 'pending', createdAt: new Date().toISOString() };
    appointments.push(appointment);
    localStorage.setItem('eds-appointments', JSON.stringify(appointments));
    return { success: true, refNumber, appointment };
  },

  // Submit patient registration
  async submitRegistration(data) {
    await delay(1500);
    const refNumber = generateRefNumber();
    const registrations = JSON.parse(localStorage.getItem('eds-registrations') || '[]');
    const registration = { ...data, refNumber, createdAt: new Date().toISOString() };
    registrations.push(registration);
    localStorage.setItem('eds-registrations', JSON.stringify(registrations));
    return { success: true, refNumber, registration };
  },

  // Submit contact form
  async submitContact(data) {
    await delay(800);
    const messages = JSON.parse(localStorage.getItem('eds-messages') || '[]');
    messages.push({ ...data, createdAt: new Date().toISOString(), read: false });
    localStorage.setItem('eds-messages', JSON.stringify(messages));
    return { success: true, message: 'Message sent successfully!' };
  },

  // Subscribe to newsletter
  async subscribeNewsletter(email) {
    await delay(600);
    const subs = JSON.parse(localStorage.getItem('eds-newsletter') || '[]');
    if (subs.includes(email)) {
      return { success: false, message: 'Already subscribed!' };
    }
    subs.push(email);
    localStorage.setItem('eds-newsletter', JSON.stringify(subs));
    return { success: true, message: 'Subscribed successfully!' };
  },

  // Get appointments (for admin)
  async getAppointments() {
    await delay(400);
    return JSON.parse(localStorage.getItem('eds-appointments') || '[]');
  },

  // Get registrations (for admin)
  async getRegistrations() {
    await delay(400);
    return JSON.parse(localStorage.getItem('eds-registrations') || '[]');
  }
};

export default api;
