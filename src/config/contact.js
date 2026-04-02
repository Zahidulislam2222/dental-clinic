/**
 * Centralized contact information — single source of truth.
 * Update here once and all components reflect the change.
 */

export const CONTACT = {
  phone: '+880 1712-345678',
  phoneRaw: '8801712345678',          // For WhatsApp / tel: links
  email: 'info@example-dental.com',
  website: 'https://dental-clinic-anq.pages.dev',

  address: {
    en: '123/A, Greenview Plaza (3rd Floor), Mirpur Road, Dhanmondi, Dhaka-1217',
    bn: '১২৩/এ, গ্রিনভিউ প্লাজা (৩য় তলা), মিরপুর রোড, ধানমন্ডি, ঢাকা-১২১৭',
  },

  hours: {
    en: 'Sat – Thu: 5:00 PM – 9:00 PM',
    bn: 'শনি – বৃহঃ: বিকাল ৫:০০ – রাত ৯:০০',
  },
  closedDay: {
    en: 'Closed on Friday',
    bn: 'শুক্রবার বন্ধ',
  },

  social: {
    facebook: 'https://www.facebook.com/example-dental',
    youtube: 'https://www.youtube.com/@example-dental',
    linkedin: 'https://www.linkedin.com/company/example-dental',
  },

  maps: {
    embedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.2!2d90.41127!3d23.74611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sEveryday+Dental+Surgery!5e0!3m2!1sen!4v1',
    searchUrl: 'https://www.google.com/maps/search/Everyday+Dental+Surgery+Dhanmondi+Dhaka',
  },

  whatsapp: (message = '') =>
    `https://wa.me/${CONTACT.phoneRaw}${message ? `?text=${encodeURIComponent(message)}` : ''}`,
};

export default CONTACT;
