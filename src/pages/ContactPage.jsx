import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Navigation,
  Send,
  Facebook,
  Youtube,
  Linkedin,
  MapPinned,
  Building2,
  Landmark,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../utils/emailService';
import { checkRateLimit, formatCooldown } from '../utils/rateLimit';
import PageTransition from '../components/ui/PageTransition';
import SectionHeading from '../components/ui/SectionHeading';
import { useScrollReveal, useStaggerReveal } from '../hooks/useGsapAnimations';
import DentalBackground from '../components/ui/DentalBackground';
import { DentalDividerWave } from '../components/ui/DentalDivider';
import RunningTooth from '../components/ui/RunningTooth';

/* ------------------------------------------------------------------ */
/*  ANIMATION HELPERS                                                  */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const contactCards = [
  {
    icon: MapPin,
    title: { en: 'Our Address', bn: 'আমাদের ঠিকানা' },
    detail: {
      en: '123/A, Greenview Plaza (3rd Floor), Mirpur Road, Dhanmondi, Dhaka',
      bn: 'গ্রিনভিউ প্লাজা (৩য় তলা), ১২৩/এ মিরপুর রোড, ধানমন্ডি, ঢাকা',
    },
    href: 'https://maps.google.com/?q=23.7461,90.3742',
  },
  {
    icon: Phone,
    title: { en: 'Phone', bn: 'ফোন' },
    detail: { en: '+880 1712-345678', bn: '+৮৮০ ১৭১২-৩৪৫৬৭৮' },
    href: 'tel:+8801712345678',
  },
  {
    icon: Mail,
    title: { en: 'Email', bn: 'ইমেইল' },
    detail: { en: 'info@example-dental.com', bn: 'info@example-dental.com' },
    href: 'mailto:info@example-dental.com',
  },
  {
    icon: Clock,
    title: { en: 'Working Hours', bn: 'কর্মঘণ্টা' },
    detail: {
      en: 'Sat–Thu: 5:00 PM – 9:00 PM | Fri: Closed',
      bn: 'শনি–বৃহস্পতি: ৫:০০ PM – ৯:০০ PM | শুক্রবার: বন্ধ',
    },
    href: null,
  },
];

const quickActions = [
  {
    icon: MessageCircle,
    label: { en: 'WhatsApp Chat', bn: 'হোয়াটসঅ্যাপ চ্যাট' },
    href: 'https://wa.me/8801712345678',
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    icon: Phone,
    label: { en: 'Call Now', bn: 'এখনই কল করুন' },
    href: 'tel:+8801712345678',
    color: 'bg-teal hover:bg-teal-600',
  },
  {
    icon: Navigation,
    label: { en: 'Get Directions', bn: 'দিকনির্দেশনা পান' },
    href: 'https://maps.google.com/?q=23.7461,90.3742',
    color: 'bg-navy hover:bg-navy-400',
  },
];

const serviceOptions = [
  { value: '', label: { en: 'Select a service', bn: 'একটি সেবা নির্বাচন করুন' } },
  { value: 'general-consultation', label: { en: 'General Consultation', bn: 'সাধারণ পরামর্শ' } },
  { value: 'root-canal', label: { en: 'Root Canal', bn: 'রুট ক্যানেল' } },
  { value: 'dental-implant', label: { en: 'Dental Implant', bn: 'ডেন্টাল ইমপ্লান্ট' } },
  { value: 'braces-aligners', label: { en: 'Braces/Aligners', bn: 'ব্রেসেস/অ্যালাইনার' } },
  { value: 'teeth-whitening', label: { en: 'Teeth Whitening', bn: 'দাঁত সাদাকরণ' } },
  { value: 'extraction', label: { en: 'Extraction', bn: 'দাঁত তোলা' } },
  { value: 'other', label: { en: 'Other', bn: 'অন্যান্য' } },
];

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/example-dental' },
  { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/@example-dental' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/company/example-dental' },
];

const directionsEN = [
  { icon: MapPinned, text: 'Address: 123/A, Greenview Plaza (3rd Floor), Mirpur Road, Dhanmondi, Dhaka' },
  { icon: Building2, text: 'Near Dhanmondi Lake' },
  { icon: Landmark, text: 'Above Standard Bank' },
  { icon: ArrowRight, text: 'From Dhanmondi 27, towards Jigatala' },
];

const directionsBN = [
  { icon: MapPinned, text: 'ঠিকানা: গ্রিনভিউ প্লাজা (৩য় তলা), ১২৩/এ মিরপুর রোড, ধানমন্ডি' },
  { icon: Building2, text: 'ইবনে সিনা ধানমন্ডিের ঠিক বিপরীতে' },
  { icon: Landmark, text: 'স্ট্যান্ডার্ড ব্যাংকের উপরে অবস্থিত' },
  { icon: ArrowRight, text: 'ধানমন্ডি ২৭ থেকে জিগাতলার দিকে' },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

const ContactPage = () => {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const heroRef = useScrollReveal({ y: 40, duration: 0.8 });
  const cardsRef = useStaggerReveal({ stagger: 0.1, y: 50 });
  const formRef = useScrollReveal({ y: 40 });
  const mapRef = useScrollReveal({ y: 40 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { canSubmit, remainingMs } = checkRateLimit('contact-form');
    if (!canSubmit) {
      toast.error(t({ en: `Too many submissions. Try again in ${formatCooldown(remainingMs)}.`, bn: `অনেক বেশি জমা দেওয়া হয়েছে। ${formatCooldown(remainingMs)} পর আবার চেষ্টা করুন।` }));
      return;
    }
    setIsSubmitting(true);
    try {
      await api.submitContact(data);
      if (language === 'bn') {
        toast.success('বার্তা পাঠানো হয়েছে! আমরা ২ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করব।');
      } else {
        toast.success("Message sent! We'll contact you within 2 hours.");
      }
      reset();
    } catch {
      toast.error(language === 'bn' ? 'বার্তা পাঠানো যায়নি। আবার চেষ্টা করুন।' : 'Failed to send. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBase =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-navy placeholder-gray-400 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all duration-300';
  const labelBase = 'block text-sm font-semibold text-navy mb-1.5';
  const errorBase = 'text-red-500 text-xs mt-1';

  return (
    <PageTransition>
      <Helmet>
        <title>Contact Us | Everyday Dental Surgery</title>
        <meta
          name="description"
          content="Get in touch with Everyday Dental Surgery in Dhanmondi, Dhaka. Call +880 1712-345678 or visit us at Greenview Plaza, Mirpur Road. Open Sat-Thu 5-9 PM."
        />
        <meta property="og:title" content="Contact Us | Everyday Dental Surgery" />
        <meta
          property="og:description"
          content="Contact Everyday Dental Surgery for appointments, inquiries, and directions. Located at Dhanmondi, Dhaka."
        />
        <link rel="canonical" href="https://example-dental.com/contact" />
      </Helmet>

      {/* ============================== HERO ============================== */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=80&fit=crop"
          alt="Contact Everyday Dental Surgery"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/60 to-transparent" />

        <div ref={heroRef} className="container mx-auto px-4 relative z-10 py-28 md:py-36">
          <div className="flex flex-col items-start max-w-2xl">
            <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {t({ en: 'Get in Touch', bn: 'যোগাযোগ করুন' })}
            </h1>
            <p className="text-gray-200 text-lg md:text-xl">
              {t({
                en: 'We\'re here to help you with all your dental needs. Reach out to us through any of the channels below.',
                bn: 'আমরা আপনার সকল দন্ত চিকিৎসার প্রয়োজনে সাহায্য করতে এখানে আছি। নিচের যেকোনো মাধ্যমে আমাদের সাথে যোগাযোগ করুন।',
              })}
            </p>
            <div className="mt-4 h-1 w-20 rounded-full bg-teal" />
          </div>
        </div>
      </section>

      {/* Dental wave divider */}
      <DentalDividerWave className="bg-offwhite" />

      {/* ======================== CONTACT CARDS =========================== */}
      <section className="py-16 md:py-24 bg-offwhite relative">
        <DentalBackground count={32} density="dense" />
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Contact Information"
            titleBn="যোগাযোগের তথ্য"
            subtitle="Multiple ways to reach us"
            subtitleBn="আমাদের সাথে যোগাযোগের একাধিক উপায়"
          />

          <div
            ref={cardsRef}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {contactCards.map((card, i) => {
              const Icon = card.icon;
              const inner = (
                <motion.div
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ y: -8, boxShadow: '0 20px 60px -15px rgba(0, 191, 166, 0.25)' }}
                  className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-sm border border-gray-100 h-full flex flex-col items-center cursor-pointer transition-all"
                >
                  <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mb-5">
                    <Icon size={28} className="text-teal" />
                  </div>
                  <h3 className="font-heading font-bold text-navy text-lg mb-2">{t(card.title)}</h3>
                  <p className="text-gray text-sm leading-relaxed">{t(card.detail)}</p>
                </motion.div>
              );

              if (card.href) {
                return (
                  <a
                    key={i}
                    href={card.href}
                    target={card.href.startsWith('http') ? '_blank' : undefined}
                    rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="no-underline"
                  >
                    {inner}
                  </a>
                );
              }
              return <div key={i}>{inner}</div>;
            })}
          </div>
        </div>
      </section>

      {/* ===================== QUICK ACTION BUTTONS ======================= */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
          >
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.a
                  key={i}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  href={action.href}
                  target={action.href.startsWith('http') ? '_blank' : undefined}
                  rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`${action.color} text-white font-heading font-semibold rounded-2xl px-8 py-5 text-lg inline-flex items-center gap-3 shadow-lg transition-all duration-300 w-full sm:w-auto justify-center`}
                >
                  <Icon size={24} />
                  {t(action.label)}
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Running tooth */}
      <RunningTooth direction="left" speed={13} size={45} className="bg-offwhite" />

      {/* ======================== CONTACT FORM ============================ */}
      <section className="py-16 md:py-24 bg-offwhite">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Send Us a Message"
            titleBn="আমাদের একটি বার্তা পাঠান"
            subtitle="Fill out the form below and we'll get back to you promptly"
            subtitleBn="নিচের ফর্মটি পূরণ করুন এবং আমরা দ্রুত আপনার সাথে যোগাযোগ করব"
          />

          <div
            ref={formRef}
            className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8 items-start"
          >
            {/* Side image */}
            <div className="hidden lg:block lg:col-span-2 sticky top-32">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=85&fit=crop"
                  alt={t({ en: 'Modern dental clinic', bn: 'আধুনিক ডেন্টাল ক্লিনিক' })}
                  className="w-full h-72 object-cover"
                />
              </div>
              <div className="mt-6 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=85&fit=crop"
                  alt={t({ en: 'Dr. Arman Hossain', bn: 'ডা. আরমান হোসেন' })}
                  className="w-full h-72 object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10 space-y-6"
            >
              {/* Name & Phone row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-fullName" className={labelBase}>
                    {t({ en: 'Full Name', bn: 'পূর্ণ নাম' })} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-fullName"
                    type="text"
                    className={inputBase}
                    placeholder={t({ en: 'Enter your full name', bn: 'আপনার পূর্ণ নাম লিখুন' })}
                    aria-invalid={errors.fullName ? 'true' : undefined}
                    {...register('fullName', {
                      required: t({ en: 'Name is required', bn: 'নাম আবশ্যক' }),
                    })}
                  />
                  {errors.fullName && <p className={errorBase}>{errors.fullName.message}</p>}
                </div>

                <div>
                  <label htmlFor="contact-phone" className={labelBase}>
                    {t({ en: 'Phone Number', bn: 'ফোন নম্বর' })} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    className={inputBase}
                    placeholder="+880 1XXX-XXXXXX"
                    aria-invalid={errors.phone ? 'true' : undefined}
                    {...register('phone', {
                      required: t({ en: 'Phone number is required', bn: 'ফোন নম্বর আবশ্যক' }),
                      pattern: {
                        value: /^(\+?880|0)?1[3-9]\d{8}$/,
                        message: t({ en: 'Enter a valid BD phone number', bn: 'একটি বৈধ বাংলাদেশি ফোন নম্বর দিন' }),
                      },
                    })}
                  />
                  {errors.phone && <p className={errorBase}>{errors.phone.message}</p>}
                </div>
              </div>

              {/* Email & Service row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-email" className={labelBase}>{t({ en: 'Email Address', bn: 'ইমেইল ঠিকানা' })}</label>
                  <input
                    id="contact-email"
                    type="email"
                    className={inputBase}
                    placeholder={t({ en: 'your@email.com', bn: 'your@email.com' })}
                    aria-invalid={errors.email ? 'true' : undefined}
                    {...register('email', {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t({ en: 'Enter a valid email', bn: 'একটি বৈধ ইমেইল দিন' }),
                      },
                    })}
                  />
                  {errors.email && <p className={errorBase}>{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="contact-service" className={labelBase}>{t({ en: 'Service Interested In', bn: 'আগ্রহের সেবা' })}</label>
                  <select id="contact-service" className={inputBase} {...register('service')}>
                    {serviceOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(opt.label)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact-message" className={labelBase}>
                  {t({ en: 'Message', bn: 'বার্তা' })} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  className={inputBase}
                  placeholder={t({ en: 'Write your message here...', bn: 'আপনার বার্তা এখানে লিখুন...' })}
                  aria-invalid={errors.message ? 'true' : undefined}
                  {...register('message', {
                    required: t({ en: 'Message is required', bn: 'বার্তা আবশ্যক' }),
                    minLength: {
                      value: 10,
                      message: t({ en: 'Message must be at least 10 characters', bn: 'বার্তা কমপক্ষে ১০ অক্ষরের হতে হবে' }),
                    },
                    maxLength: {
                      value: 1000,
                      message: t({ en: 'Message cannot exceed 1000 characters', bn: 'বার্তা ১০০০ অক্ষরের বেশি হতে পারে না' }),
                    },
                  })}
                />
                {errors.message && <p className={errorBase}>{errors.message.message}</p>}
              </div>

              {/* Privacy consent */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="contact-consent"
                  {...register('privacyConsent', { required: t({ en: 'You must agree to the privacy policy', bn: 'আপনাকে গোপনীয়তা নীতিতে সম্মত হতে হবে' }) })}
                  className="mt-1 w-4 h-4 text-teal border-gray-300 rounded focus:ring-teal"
                />
                <label htmlFor="contact-consent" className="text-sm text-navy/70">
                  {t({ en: 'I agree to the', bn: 'আমি সম্মত' })}{' '}
                  <a href="/privacy-policy" target="_blank" className="text-teal underline">{t({ en: 'Privacy Policy', bn: 'গোপনীয়তা নীতি' })}</a>
                  {t({ en: ' and consent to my data being processed.', bn: ' এবং আমার তথ্য প্রক্রিয়াকরণে সম্মতি দিচ্ছি।' })}
                </label>
              </div>
              {errors.privacyConsent && <p className={errorBase}>{errors.privacyConsent.message}</p>}

              {/* Data notice */}
              <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-4 py-2">
                {t({ en: 'Your data is stored locally in your browser. We are working on a secure backend.', bn: 'আপনার তথ্য আপনার ব্রাউজারে স্থানীয়ভাবে সংরক্ষিত। আমরা একটি নিরাপদ ব্যাকএন্ডে কাজ করছি।' })}
              </p>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-teal text-white font-heading font-semibold rounded-xl px-8 py-4 text-lg inline-flex items-center justify-center gap-3 shadow-lg hover:bg-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    {t({ en: 'Sending...', bn: 'পাঠানো হচ্ছে...' })}
                  </>
                ) : (
                  <>
                    <Send size={22} />
                    {t({ en: 'Send Message', bn: 'বার্তা পাঠান' })}
                  </>
                )}
              </motion.button>
            </form>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== GOOGLE MAPS ============================= */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Find Us on the Map"
            titleBn="মানচিত্রে আমাদের খুঁজুন"
            subtitle="Located in the heart of Dhanmondi, Dhaka"
            subtitleBn="ঢাকার ধানমন্ডিের কেন্দ্রস্থলে অবস্থিত"
          />

          <div
            ref={mapRef}
            className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-gray-100"
          >
            <iframe
              title="Everyday Dental Surgery Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.2!2d90.41127!3d23.74611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b90000000001%3A0x1!2sExample+Dental+Clinic!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
            {/* Fallback: Direct link to Google Maps */}
            <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
              <a
                href="https://www.google.com/maps/search/Example+Dental+Clinic+Dhanmondi+Dhaka/@23.7461,90.3742,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal font-semibold text-sm hover:underline inline-flex items-center gap-2"
              >
                <MapPin size={16} />
                {t({ en: 'Open in Google Maps', bn: 'গুগল ম্যাপে খুলুন' })}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== DIRECTIONS GUIDE ========================== */}
      <section className="py-16 md:py-24 bg-offwhite">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="How to Find Us"
            titleBn="আমাদের কিভাবে খুঁজে পাবেন"
            subtitle="Step-by-step directions to our clinic"
            subtitleBn="আমাদের ক্লিনিকে যাওয়ার ধাপে ধাপে নির্দেশনা"
          />

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* English Directions */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
                  <Navigation size={20} className="text-teal" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">Directions (English)</h3>
              </div>
              <ul className="space-y-4">
                {directionsEN.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <Icon size={20} className="text-teal shrink-0 mt-0.5" />
                      <span className="text-gray leading-relaxed">{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>

            {/* Bengali Directions */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <Navigation size={20} className="text-gold" />
                </div>
                <h3 className="font-heading text-xl font-bold text-navy">দিকনির্দেশনা (বাংলা)</h3>
              </div>
              <ul className="space-y-4">
                {directionsBN.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <Icon size={20} className="text-gold shrink-0 mt-0.5" />
                      <span className="text-gray leading-relaxed">{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================== SOCIAL LINKS ============================= */}
      <section className="relative py-16 md:py-24 text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=80&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-teal/85" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              {t({ en: 'Follow Us on Social Media', bn: 'সোশ্যাল মিডিয়ায় আমাদের অনুসরণ করুন' })}
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              {t({
                en: 'Stay updated with dental tips, patient stories, and clinic news.',
                bn: 'দন্ত চিকিৎসা টিপস, রোগীর গল্প এবং ক্লিনিকের খবরের সাথে আপডেট থাকুন।',
              })}
            </p>

            <div className="flex items-center justify-center gap-4 md:gap-6">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={i}
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon size={28} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
};

export default ContactPage;
