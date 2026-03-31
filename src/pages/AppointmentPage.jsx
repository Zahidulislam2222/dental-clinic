import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Lottie from 'lottie-react';
import {
  Shield, Wrench, Activity, Crown, CircleDot, GitBranch,
  Heart, Scissors, Baby, Sparkles, Monitor, Microscope,
  Accessibility, Zap,
  ArrowRight, ArrowLeft, Check,
  Calendar, Clock, User, Phone, Mail, FileText,
  MessageCircle, Home, Download, Edit3,
  CreditCard, Wallet, Building2, Stethoscope,
  ChevronRight, AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../utils/emailService';
import PageTransition from '../components/ui/PageTransition';
import { successCheckAnimation } from '../data/lottieAnimations';

/* ------------------------------------------------------------------ */
/*  ICON MAP                                                           */
/* ------------------------------------------------------------------ */

const iconMap = {
  Shield, Wrench, Activity, Crown, CircleDot, GitBranch,
  Heart, Scissors, Baby, Sparkles, Monitor, Microscope,
  Accessibility, Zap,
};

/* ------------------------------------------------------------------ */
/*  SERVICES DATA                                                      */
/* ------------------------------------------------------------------ */

const services = [
  { slug: 'preventive-diagnostic-care', icon: 'Shield', title: { en: 'Preventive & Diagnostic Care', bn: 'প্রতিরোধমূলক ও ডায়াগনস্টিক কেয়ার' }, desc: { en: 'Regular checkups, digital X-rays, OPG, and 3D CBCT scanning.', bn: 'নিয়মিত চেকআপ, ডিজিটাল এক্স-রে, OPG এবং 3D CBCT স্ক্যানিং।' } },
  { slug: 'restorative-dentistry', icon: 'Wrench', title: { en: 'Restorative Dentistry', bn: 'পুনরুদ্ধার দন্তচিকিৎসা' }, desc: { en: 'Composite fillings, GIC fillings, and dental bonding.', bn: 'কম্পোজিট ফিলিং, GIC ফিলিং এবং ডেন্টাল বন্ডিং।' } },
  { slug: 'root-canal-treatment', icon: 'Activity', title: { en: 'Root Canal Treatment', bn: 'রুট ক্যানাল চিকিৎসা' }, desc: { en: 'Painless modern endodontic treatment using rotary technology.', bn: 'রোটারি প্রযুক্তি ব্যবহার করে ব্যথাহীন আধুনিক এন্ডোডন্টিক চিকিৎসা।' } },
  { slug: 'crowns-bridges-dentures', icon: 'Crown', title: { en: 'Crowns, Bridges & Dentures', bn: 'ক্রাউন, ব্রিজ ও ডেনচার' }, desc: { en: 'Zirconia crowns, E-Max crowns, bridges, and dentures.', bn: 'জিরকোনিয়া ক্রাউন, ই-ম্যাক্স ক্রাউন, ব্রিজ এবং ডেনচার।' } },
  { slug: 'dental-implants', icon: 'CircleDot', title: { en: 'Dental Implants', bn: 'ডেন্টাল ইমপ্লান্ট' }, desc: { en: 'Permanent tooth replacement with titanium implants.', bn: 'টাইটানিয়াম ইমপ্লান্ট দিয়ে স্থায়ী দাঁত প্রতিস্থাপন।' } },
  { slug: 'orthodontics-braces-aligners', icon: 'GitBranch', title: { en: 'Orthodontics — Braces & Aligners', bn: 'অর্থোডন্টিক্স — ব্রেসেস ও অ্যালাইনার' }, desc: { en: 'Metal braces, ceramic braces, and clear aligners.', bn: 'মেটাল ব্রেসেস, সিরামিক ব্রেসেস এবং ক্লিয়ার অ্যালাইনার।' } },
  { slug: 'periodontics-gum-treatment', icon: 'Heart', title: { en: 'Periodontics — Gum Treatment', bn: 'পেরিওডন্টিক্স — মাড়ির চিকিৎসা' }, desc: { en: 'Gum disease treatment, deep cleaning, and laser therapy.', bn: 'মাড়ির রোগের চিকিৎসা, গভীর পরিষ্কার এবং লেজার থেরাপি।' } },
  { slug: 'oral-maxillofacial-surgery', icon: 'Scissors', title: { en: 'Oral & Maxillofacial Surgery', bn: 'ওরাল ও ম্যাক্সিলোফেসিয়াল সার্জারি' }, desc: { en: 'Wisdom tooth extraction, jaw surgery, and trauma management.', bn: 'আক্কেল দাঁত তোলা, চোয়ালের সার্জারি এবং আঘাত ব্যবস্থাপনা।' } },
  { slug: 'pediatric-dentistry', icon: 'Baby', title: { en: 'Pediatric Dentistry', bn: 'শিশু দন্তচিকিৎসা' }, desc: { en: 'Gentle dental care for children in a friendly environment.', bn: 'বন্ধুত্বপূর্ণ পরিবেশে শিশুদের জন্য মৃদু দন্ত চিকিৎসা।' } },
  { slug: 'cosmetic-dentistry', icon: 'Sparkles', title: { en: 'Cosmetic Dentistry & Smile Makeover', bn: 'কসমেটিক ডেন্টিস্ট্রি ও স্মাইল মেকওভার' }, desc: { en: 'Teeth whitening, porcelain veneers, and smile makeover.', bn: 'দাঁত সাদাকরণ, পোর্সেলিন ভেনিয়ার এবং স্মাইল মেকওভার।' } },
  { slug: 'digital-imaging', icon: 'Monitor', title: { en: 'Digital Imaging — 3D CBCT, OPG', bn: 'ডিজিটাল ইমেজিং — 3D CBCT, OPG' }, desc: { en: 'Digital X-ray, panoramic OPG, and 3D CBCT scanning.', bn: 'ডিজিটাল এক্স-রে, প্যানোরামিক OPG এবং 3D CBCT স্ক্যানিং।' } },
  { slug: 'oral-medicine-pathology', icon: 'Microscope', title: { en: 'Oral Medicine & Pathology', bn: 'ওরাল মেডিসিন ও প্যাথলজি' }, desc: { en: 'Oral disease diagnosis, cancer screening, and mucosal disorders.', bn: 'মৌখিক রোগের নির্ণয়, ক্যান্সার স্ক্রিনিং এবং মিউকোসাল ডিসঅর্ডার।' } },
  { slug: 'laser-dentistry', icon: 'Zap', title: { en: 'Laser Dentistry', bn: 'লেজার ডেন্টিস্ট্রি' }, desc: { en: 'Advanced laser treatments for gum disease and whitening.', bn: 'মাড়ির রোগ এবং সাদাকরণের জন্য উন্নত লেজার চিকিৎসা।' } },
];

/* ------------------------------------------------------------------ */
/*  BOOKING MODES                                                      */
/* ------------------------------------------------------------------ */

const bookingModes = [
  {
    id: 'pre-payment',
    icon: CreditCard,
    title: { en: 'Pre-Payment Booking', bn: 'অগ্রিম পেমেন্ট বুকিং' },
    desc: { en: 'Pay online now & get 5% OFF + instant confirmed slot. Priority scheduling.', bn: 'এখনই অনলাইনে পেমেন্ট করুন এবং ৫% ছাড় + তাৎক্ষণিক নিশ্চিত স্লট পান। অগ্রাধিকার সময়সূচী।' },
    badge: { en: 'Recommended', bn: 'প্রস্তাবিত' },
    badgeColor: 'bg-teal text-white',
    discountBadge: { en: '5% OFF', bn: '৫% ছাড়' },
  },
  {
    id: 'post-payment',
    icon: Building2,
    title: { en: 'Pay at Clinic', bn: 'ক্লিনিকে পেমেন্ট' },
    desc: { en: 'Book now, pay when you visit. Slot confirmed after verification call.', bn: 'এখনই বুক করুন, ভিজিটের সময় পেমেন্ট করুন। ভেরিফিকেশন কলের পরে স্লট নিশ্চিত।' },
    badge: null,
    badgeColor: '',
  },
  {
    id: 'consultation-first',
    icon: Stethoscope,
    title: { en: 'Consultation First', bn: 'প্রথমে পরামর্শ' },
    desc: { en: 'Book a consultation first. After diagnosis, choose your treatment & schedule follow-up.', bn: 'প্রথমে পরামর্শ বুক করুন। ডায়াগনোসিসের পরে, আপনার চিকিৎসা বেছে নিন এবং ফলো-আপ নির্ধারণ করুন।' },
    badge: { en: 'For New Patients', bn: 'নতুন রোগীদের জন্য' },
    badgeColor: 'bg-gold/20 text-gold-600',
  },
];

/* ------------------------------------------------------------------ */
/*  PAYMENT METHODS                                                    */
/* ------------------------------------------------------------------ */

const paymentMethods = [
  {
    id: 'bkash',
    name: 'bKash',
    color: '#E2136E',
    number: '01712-345678',
    instruction: { en: 'Send payment to 01712-345678 (Personal). Use your name as reference.', bn: '01712-345678 (পার্সোনাল) এ পেমেন্ট পাঠান। আপনার নাম রেফারেন্স হিসাবে ব্যবহার করুন।' },
  },
  {
    id: 'nagad',
    name: 'Nagad',
    color: '#F6921E',
    number: '01712-345678',
    instruction: { en: 'Send payment to 01712-345678. Use your name as reference.', bn: '01712-345678 এ পেমেন্ট পাঠান। আপনার নাম রেফারেন্স হিসাবে ব্যবহার করুন।' },
  },
  {
    id: 'card',
    name: { en: 'Visa / Mastercard', bn: 'ভিসা / মাস্টারকার্ড' },
    color: '#1A1F71',
    instruction: { en: 'Pay securely with your debit or credit card at the clinic.', bn: 'ক্লিনিকে আপনার ডেবিট বা ক্রেডিট কার্ড দিয়ে নিরাপদে পেমেন্ট করুন।' },
  },
];

/* ------------------------------------------------------------------ */
/*  TIME SLOTS & HELPERS                                               */
/* ------------------------------------------------------------------ */

const timeSlots = ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];

const generateDates = () => {
  const dates = [];
  const today = new Date();
  let day = new Date(today);
  day.setDate(day.getDate() + 1);
  while (dates.length < 14) {
    if (day.getDay() !== 5) dates.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }
  return dates;
};

const formatDateShort = (date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return {
    day: days[date.getDay()],
    date: date.getDate(),
    month: months[date.getMonth()],
    full: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  };
};

const generateBookingRef = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = 'EDS-';
  for (let i = 0; i < 6; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
  return ref;
};

const generateICS = (service, dateStr, time, name) => {
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Everyday Dental Surgery//Appointment//EN',
    'BEGIN:VEVENT', `SUMMARY:Dental Appointment - ${service}`,
    `DESCRIPTION:Appointment at Everyday Dental Surgery for ${name}`,
    `LOCATION:Everyday Dental Surgery, Dhanmondi, Dhaka`,
    `DTSTART:${dateStr}`, 'DURATION:PT1H', 'END:VEVENT', 'END:VCALENDAR',
  ];
  return lines.join('\r\n');
};

/* ------------------------------------------------------------------ */
/*  ANIMATION VARIANTS                                                 */
/* ------------------------------------------------------------------ */

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

/* ------------------------------------------------------------------ */
/*  bKash / Nagad / Card SVG Logos                                     */
/* ------------------------------------------------------------------ */

const BkashLogo = () => (
  <svg viewBox="0 0 80 32" className="h-8 w-auto">
    <rect width="80" height="32" rx="6" fill="#E2136E" />
    <text x="12" y="22" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="14">bKash</text>
  </svg>
);

const NagadLogo = () => (
  <svg viewBox="0 0 80 32" className="h-8 w-auto">
    <rect width="80" height="32" rx="6" fill="#F6921E" />
    <text x="12" y="22" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="14">Nagad</text>
  </svg>
);

const CardLogo = () => (
  <svg viewBox="0 0 100 32" className="h-8 w-auto">
    <rect width="100" height="32" rx="6" fill="#1A1F71" />
    <circle cx="35" cy="16" r="10" fill="#EB001B" opacity="0.9" />
    <circle cx="50" cy="16" r="10" fill="#F79E1B" opacity="0.9" />
    <text x="65" y="20" fill="white" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="9">CARD</text>
  </svg>
);

const paymentLogos = { bkash: BkashLogo, nagad: NagadLogo, card: CardLogo };

/* ------------------------------------------------------------------ */
/*  STEP LABELS                                                        */
/* ------------------------------------------------------------------ */

const getStepLabels = (mode) => {
  const base = [
    { en: 'Booking Type', bn: 'বুকিং ধরন' },
    { en: 'Select Service', bn: 'সেবা নির্বাচন' },
    { en: 'Date & Time', bn: 'তারিখ ও সময়' },
    { en: 'Your Details', bn: 'আপনার তথ্য' },
  ];
  if (mode === 'pre-payment') {
    return [...base, { en: 'Payment', bn: 'পেমেন্ট' }, { en: 'Confirm', bn: 'নিশ্চিত' }];
  }
  return [...base, { en: 'Confirm', bn: 'নিশ্চিত' }];
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

const AppointmentPage = () => {
  const { t } = useLanguage();

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [bookingMode, setBookingMode] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const availableDates = useMemo(() => generateDates(), []);
  const stepLabels = useMemo(() => getStepLabels(bookingMode), [bookingMode]);
  const totalSteps = stepLabels.length;

  const {
    register, handleSubmit, formState: { errors }, getValues,
  } = useForm();

  const goToStep = (step) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  };
  const nextStep = () => { setDirection(1); setCurrentStep((p) => Math.min(p + 1, totalSteps - 1)); };
  const prevStep = () => { setDirection(-1); setCurrentStep((p) => Math.max(p - 1, 0)); };

  const onDetailsSubmit = () => nextStep();

  const confirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const fv = getValues();
      const result = await api.submitAppointment({
        fullName: fv.name,
        phone: fv.phone,
        email: fv.email || '',
        service: bookingMode === 'consultation-first' ? 'Consultation' : t(selectedService?.title),
        date: selectedDate ? formatDateShort(new Date(selectedDate)).full : '',
        time: selectedTime,
        bookingMode,
        medicalNotes: fv.medicalNotes || '',
      });
      setBookingRef(result.refNumber);
      setBookingComplete(true);
      toast.success(t({ en: 'Appointment booked successfully!', bn: 'অ্যাপয়েন্টমেন্ট সফলভাবে বুক হয়েছে!' }));
    } catch {
      toast.error(t({ en: 'Booking failed. Please try again.', bn: 'বুকিং ব্যর্থ। আবার চেষ্টা করুন।' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadICS = () => {
    if (!selectedService || !selectedDate || !selectedTime) return;
    const dateObj = new Date(selectedDate);
    const icsDateStr = dateObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const svcTitle = bookingMode === 'consultation-first' ? 'Consultation' : t(selectedService.title);
    const icsContent = generateICS(svcTitle, icsDateStr, selectedTime, getValues('name') || 'Patient');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointment-${bookingRef}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const whatsappLink = () => {
    const fv = getValues();
    const payStatus = bookingMode === 'pre-payment' ? `\nPayment: ${selectedPayment?.toUpperCase()} (TxnID: ${transactionId})` : '\nPayment: At Clinic';
    const message = `Hello! I've booked an appointment.\n\nRef: ${bookingRef}\nType: ${bookingMode}\nService: ${bookingMode === 'consultation-first' ? 'Consultation' : t(selectedService?.title)}\nDate: ${selectedDate ? formatDateShort(new Date(selectedDate)).full : ''}\nTime: ${selectedTime}\nName: ${fv.name}\nPhone: ${fv.phone}${payStatus}`;
    return `https://wa.me/8801712345678?text=${encodeURIComponent(message)}`;
  };

  /* ---- Navigation buttons helper ---- */
  const NavButtons = ({ canNext = true, onNext, nextLabel, isSubmit, isForm }) => (
    <div className="flex justify-between mt-8">
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={prevStep}
        className="font-heading font-semibold px-6 py-3 rounded-xl inline-flex items-center gap-2 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
      >
        <ArrowLeft size={18} />
        {t({ en: 'Back', bn: 'পেছনে' })}
      </motion.button>
      <motion.button
        type={isForm ? 'submit' : 'button'}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={!isForm ? (onNext || nextStep) : undefined}
        disabled={!canNext || isSubmitting}
        className={`font-heading font-semibold px-6 py-3 rounded-xl inline-flex items-center gap-2 transition-all ${
          canNext && !isSubmitting ? 'bg-teal text-white hover:bg-teal-600 shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{t({ en: 'Booking...', bn: 'বুকিং হচ্ছে...' })}</>
        ) : (
          <>{nextLabel || t({ en: 'Next', bn: 'পরবর্তী' })}<ArrowRight size={18} /></>
        )}
      </motion.button>
    </div>
  );

  /* ================================================================ */
  /*  STEP 0: Booking Mode Selection                                   */
  /* ================================================================ */

  const renderBookingMode = () => (
    <div>
      <h2 className="font-heading text-xl md:text-2xl font-bold text-navy mb-2">
        {t({ en: 'How would you like to book?', bn: 'আপনি কিভাবে বুক করতে চান?' })}
      </h2>
      <p className="text-gray text-sm mb-8">
        {t({ en: 'Choose the booking option that works best for you.', bn: 'আপনার জন্য সবচেয়ে ভালো বুকিং অপশন বেছে নিন।' })}
      </p>

      <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
        {bookingModes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = bookingMode === mode.id;
          return (
            <motion.button
              key={mode.id}
              whileHover={{ y: -4, boxShadow: '0 20px 40px -15px rgba(0, 191, 166, 0.2)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setBookingMode(mode.id)}
              className={`relative text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
                isSelected
                  ? 'border-teal bg-teal/5 shadow-xl shadow-teal/10'
                  : 'border-gray-200 bg-white hover:border-teal/30'
              }`}
            >
              {mode.badge && (
                <span className={`absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-bold ${mode.badgeColor}`}>
                  {t(mode.badge)}
                </span>
              )}
              {mode.discountBadge && (
                <span className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white animate-pulse">
                  {t(mode.discountBadge)}
                </span>
              )}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                isSelected ? 'bg-teal text-white' : 'bg-teal/10 text-teal'
              }`}>
                <Icon size={28} />
              </div>
              <h3 className="font-heading font-bold text-navy text-lg mb-2">{t(mode.title)}</h3>
              <p className="text-gray text-sm leading-relaxed">{t(mode.desc)}</p>
              {isSelected && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4">
                  <div className="w-7 h-7 rounded-full bg-teal flex items-center justify-center">
                    <Check size={16} className="text-white" />
                  </div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Payment methods preview for pre-payment */}
      {bookingMode === 'pre-payment' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-teal/5 rounded-xl border border-teal/20"
        >
          <p className="text-sm font-semibold text-navy mb-3 flex items-center gap-2">
            <Wallet size={16} className="text-teal" />
            {t({ en: 'Accepted Payment Methods:', bn: 'গৃহীত পেমেন্ট পদ্ধতি:' })}
          </p>
          <div className="flex items-center gap-3">
            <BkashLogo />
            <NagadLogo />
            <CardLogo />
          </div>
        </motion.div>
      )}

      {/* Consultation info */}
      {bookingMode === 'consultation-first' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gold/5 rounded-xl border border-gold/20"
        >
          <p className="text-sm text-navy flex items-start gap-2">
            <AlertCircle size={16} className="text-gold shrink-0 mt-0.5" />
            {t({
              en: 'After your consultation, Dr. Rafi will recommend a treatment plan. You can then book a follow-up appointment with specific treatments added.',
              bn: 'আপনার পরামর্শের পরে, ডা. রফি একটি চিকিৎসা পরিকল্পনা সুপারিশ করবেন। তারপরে আপনি নির্দিষ্ট চিকিৎসা যোগ করে ফলো-আপ অ্যাপয়েন্টমেন্ট বুক করতে পারেন।',
            })}
          </p>
        </motion.div>
      )}

      <div className="flex justify-end mt-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={nextStep}
          disabled={!bookingMode}
          className={`font-heading font-semibold px-6 py-3 rounded-xl inline-flex items-center gap-2 transition-all ${
            bookingMode ? 'bg-teal text-white hover:bg-teal-600 shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {t({ en: 'Next', bn: 'পরবর্তী' })} <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  );

  /* ================================================================ */
  /*  STEP 1: Select Service                                           */
  /* ================================================================ */

  const renderSelectService = () => {
    const isConsultation = bookingMode === 'consultation-first';

    return (
      <div>
        <h2 className="font-heading text-xl md:text-2xl font-bold text-navy mb-6">
          {isConsultation
            ? t({ en: 'What area do you need help with?', bn: 'আপনার কোন বিষয়ে সাহায্য প্রয়োজন?' })
            : t({ en: 'Select a Service', bn: 'একটি সেবা নির্বাচন করুন' })}
        </h2>
        {isConsultation && (
          <p className="text-gray text-sm mb-4">
            {t({ en: 'Select the area of concern — the doctor will determine the exact treatment after examination.', bn: 'উদ্বেগের ক্ষেত্র নির্বাচন করুন — ডাক্তার পরীক্ষার পরে সঠিক চিকিৎসা নির্ধারণ করবেন।' })}
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Shield;
            const isSelected = selectedService?.slug === service.slug;
            return (
              <motion.button
                key={service.slug}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedService(service)}
                className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected ? 'border-teal bg-teal/5 shadow-lg shadow-teal/10' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-teal text-white' : 'bg-teal/10 text-teal'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading font-semibold text-navy text-sm leading-snug">{t(service.title)}</h3>
                    <p className="text-gray text-xs mt-1 line-clamp-2">{t(service.desc)}</p>
                  </div>
                </div>
                {isSelected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex justify-end mt-2">
                    <div className="w-6 h-6 rounded-full bg-teal flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
        <NavButtons canNext={!!selectedService} />
      </div>
    );
  };

  /* ================================================================ */
  /*  STEP 2: Date & Time                                              */
  /* ================================================================ */

  const renderDateTime = () => (
    <div>
      <h2 className="font-heading text-xl md:text-2xl font-bold text-navy mb-6">
        {t({ en: 'Choose Date & Time', bn: 'তারিখ ও সময় নির্বাচন করুন' })}
      </h2>

      <h3 className="font-heading font-semibold text-navy mb-3 flex items-center gap-2">
        <Calendar size={18} className="text-teal" />
        {t({ en: 'Select a Date', bn: 'একটি তারিখ নির্বাচন করুন' })}
      </h3>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2 md:gap-3 mb-8">
        {availableDates.map((date) => {
          const info = formatDateShort(date);
          const isSelected = selectedDate && new Date(selectedDate).toDateString() === date.toDateString();
          return (
            <motion.button
              key={date.toISOString()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDate(date.toISOString())}
              className={`p-3 rounded-xl text-center border-2 transition-all duration-200 ${
                isSelected ? 'border-teal bg-teal text-white shadow-lg shadow-teal/20' : 'border-gray-200 bg-white hover:border-teal/40 text-navy'
              }`}
            >
              <div className={`text-xs font-medium ${isSelected ? 'text-teal-100' : 'text-gray'}`}>{info.day}</div>
              <div className="text-xl font-bold mt-0.5">{info.date}</div>
              <div className={`text-xs ${isSelected ? 'text-teal-100' : 'text-gray'}`}>{info.month}</div>
            </motion.button>
          );
        })}
      </div>

      <h3 className="font-heading font-semibold text-navy mb-3 flex items-center gap-2">
        <Clock size={18} className="text-teal" />
        {t({ en: 'Select a Time Slot', bn: 'একটি সময় স্লট নির্বাচন করুন' })}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {timeSlots.map((slot) => {
          const isSelected = selectedTime === slot;
          return (
            <motion.button
              key={slot}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedTime(slot)}
              className={`p-4 rounded-xl border-2 font-heading font-semibold text-center transition-all duration-200 ${
                isSelected ? 'border-teal bg-teal text-white shadow-lg shadow-teal/20' : 'border-gray-200 bg-white hover:border-teal/40 text-navy'
              }`}
            >
              {slot}
            </motion.button>
          );
        })}
      </div>

      <p className="text-gray text-sm mb-2 italic">
        {t({ en: '* Fridays are excluded (clinic closed).', bn: '* শুক্রবার বাদ (ক্লিনিক বন্ধ)।' })}
      </p>
      <NavButtons canNext={!!(selectedDate && selectedTime)} />
    </div>
  );

  /* ================================================================ */
  /*  STEP 3: Patient Details                                          */
  /* ================================================================ */

  const renderDetails = () => (
    <div>
      <h2 className="font-heading text-xl md:text-2xl font-bold text-navy mb-6">
        {t({ en: 'Your Details', bn: 'আপনার তথ্য' })}
      </h2>

      <form onSubmit={handleSubmit(onDetailsSubmit)} className="space-y-5 max-w-lg">
        <div>
          <label className="flex items-center gap-2 text-navy font-heading font-semibold text-sm mb-2">
            <User size={16} className="text-teal" />
            {t({ en: 'Full Name', bn: 'পূর্ণ নাম' })} <span className="text-red-500">*</span>
          </label>
          <input
            {...register('name', { required: t({ en: 'Full name is required', bn: 'পূর্ণ নাম আবশ্যক' }) })}
            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.name ? 'border-red-400' : 'border-gray-200 focus:border-teal'} outline-none transition-colors bg-white text-navy`}
            placeholder={t({ en: 'Enter your full name', bn: 'আপনার পূর্ণ নাম লিখুন' })}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-navy font-heading font-semibold text-sm mb-2">
            <Phone size={16} className="text-teal" />
            {t({ en: 'Phone Number', bn: 'ফোন নম্বর' })} <span className="text-red-500">*</span>
          </label>
          <input
            {...register('phone', {
              required: t({ en: 'Phone number is required', bn: 'ফোন নম্বর আবশ্যক' }),
              pattern: { value: /^[0-9+\-\s()]{7,15}$/, message: t({ en: 'Enter a valid phone number', bn: 'একটি বৈধ ফোন নম্বর লিখুন' }) },
            })}
            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.phone ? 'border-red-400' : 'border-gray-200 focus:border-teal'} outline-none transition-colors bg-white text-navy`}
            placeholder={t({ en: 'e.g. 01721-XXXXXX', bn: 'যেমন ০১৭২১-XXXXXX' })}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-navy font-heading font-semibold text-sm mb-2">
            <Mail size={16} className="text-teal" />
            {t({ en: 'Email', bn: 'ইমেইল' })} <span className="text-gray text-xs">({t({ en: 'optional', bn: 'ঐচ্ছিক' })})</span>
          </label>
          <input
            {...register('email', {
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t({ en: 'Enter a valid email', bn: 'একটি বৈধ ইমেইল লিখুন' }) },
            })}
            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.email ? 'border-red-400' : 'border-gray-200 focus:border-teal'} outline-none transition-colors bg-white text-navy`}
            placeholder="your@email.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-navy font-heading font-semibold text-sm mb-2">
            <FileText size={16} className="text-teal" />
            {t({ en: 'Special Notes', bn: 'বিশেষ নোট' })} <span className="text-gray text-xs">({t({ en: 'optional', bn: 'ঐচ্ছিক' })})</span>
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal outline-none transition-colors bg-white text-navy resize-none"
            placeholder={t({ en: 'Any allergies, concerns, or special requests...', bn: 'কোনো অ্যালার্জি, উদ্বেগ বা বিশেষ অনুরোধ...' })}
          />
        </div>

        <NavButtons canNext isForm />
      </form>
    </div>
  );

  /* ================================================================ */
  /*  STEP 4 (pre-payment only): Payment                               */
  /* ================================================================ */

  const renderPayment = () => (
    <div>
      <h2 className="font-heading text-xl md:text-2xl font-bold text-navy mb-2">
        {t({ en: 'Select Payment Method', bn: 'পেমেন্ট পদ্ধতি নির্বাচন করুন' })}
      </h2>
      <p className="text-gray text-sm mb-8">
        {t({ en: 'Complete your payment to confirm your slot instantly.', bn: 'আপনার স্লট তাৎক্ষণিক নিশ্চিত করতে পেমেন্ট সম্পন্ন করুন।' })}
      </p>

      <div className="space-y-4 max-w-lg">
        {paymentMethods.map((method) => {
          const Logo = paymentLogos[method.id];
          const isSelected = selectedPayment === method.id;
          return (
            <motion.button
              key={method.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedPayment(method.id)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                isSelected ? 'border-teal bg-teal/5 shadow-lg' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Logo />
                  <div>
                    <h3 className="font-heading font-bold text-navy">
                      {typeof method.name === 'string' ? method.name : t(method.name)}
                    </h3>
                    {method.number && (
                      <p className="text-teal font-semibold text-sm">{method.number}</p>
                    )}
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-teal bg-teal' : 'border-gray-300'
                }`}>
                  {isSelected && <Check size={14} className="text-white" />}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Transaction details for bKash/Nagad */}
      {selectedPayment && selectedPayment !== 'card' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 max-w-lg"
        >
          <div className="bg-white rounded-2xl border-2 border-teal/20 p-5">
            <h4 className="font-heading font-bold text-navy mb-3 flex items-center gap-2">
              <Wallet size={18} className="text-teal" />
              {t({ en: 'Payment Instructions', bn: 'পেমেন্ট নির্দেশনা' })}
            </h4>
            <div className="bg-offwhite rounded-xl p-4 mb-4">
              <p className="text-sm text-gray leading-relaxed">
                {t(paymentMethods.find((m) => m.id === selectedPayment)?.instruction)}
              </p>
            </div>
            <div>
              <label className="text-navy font-heading font-semibold text-sm mb-2 block">
                {t({ en: 'Transaction ID / TxnID', bn: 'ট্রানজেকশন আইডি' })} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal outline-none transition-colors bg-white text-navy"
                placeholder={t({ en: 'Enter your transaction ID', bn: 'আপনার ট্রানজেকশন আইডি লিখুন' })}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Card info */}
      {selectedPayment === 'card' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 max-w-lg"
        >
          <div className="bg-white rounded-2xl border-2 border-teal/20 p-5">
            <p className="text-sm text-gray flex items-start gap-2">
              <CreditCard size={16} className="text-teal shrink-0 mt-0.5" />
              {t({
                en: 'Card payment will be processed at the clinic. Your slot is confirmed upon booking.',
                bn: 'কার্ড পেমেন্ট ক্লিনিকে প্রক্রিয়া করা হবে। বুকিংয়ের পরে আপনার স্লট নিশ্চিত।',
              })}
            </p>
          </div>
        </motion.div>
      )}

      <NavButtons
        canNext={!!selectedPayment && (selectedPayment === 'card' || transactionId.trim().length > 0)}
      />
    </div>
  );

  /* ================================================================ */
  /*  CONFIRM STEP                                                     */
  /* ================================================================ */

  const renderConfirm = () => {
    const fv = getValues();
    const dateInfo = selectedDate ? formatDateShort(new Date(selectedDate)) : null;
    const modeInfo = bookingModes.find((m) => m.id === bookingMode);

    return (
      <div>
        <h2 className="font-heading text-xl md:text-2xl font-bold text-navy mb-6">
          {t({ en: 'Confirm Your Appointment', bn: 'আপনার অ্যাপয়েন্টমেন্ট নিশ্চিত করুন' })}
        </h2>

        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 md:p-8 max-w-lg space-y-5">
          {/* Booking Type */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-gray text-xs uppercase tracking-wider font-semibold mb-1">
                {t({ en: 'Booking Type', bn: 'বুকিং ধরন' })}
              </p>
              <p className="text-navy font-heading font-bold flex items-center gap-2">
                {modeInfo && (() => { const I = modeInfo.icon; return <I size={16} className="text-teal" />; })()}
                {modeInfo ? t(modeInfo.title) : '—'}
              </p>
            </div>
            <button onClick={() => goToStep(0)} className="text-teal hover:text-teal-600 transition-colors flex-shrink-0"><Edit3 size={16} /></button>
          </div>

          <hr className="border-gray-100" />

          {/* Service */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-gray text-xs uppercase tracking-wider font-semibold mb-1">
                {t({ en: 'Service', bn: 'সেবা' })}
              </p>
              <p className="text-navy font-heading font-bold">
                {bookingMode === 'consultation-first'
                  ? t({ en: `Consultation (${t(selectedService?.title)})`, bn: `পরামর্শ (${t(selectedService?.title)})` })
                  : selectedService ? t(selectedService.title) : '—'}
              </p>
            </div>
            <button onClick={() => goToStep(1)} className="text-teal hover:text-teal-600 transition-colors flex-shrink-0"><Edit3 size={16} /></button>
          </div>

          <hr className="border-gray-100" />

          {/* Date & Time */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-gray text-xs uppercase tracking-wider font-semibold mb-1">
                {t({ en: 'Date & Time', bn: 'তারিখ ও সময়' })}
              </p>
              <p className="text-navy font-heading font-bold">{dateInfo ? dateInfo.full : '—'}</p>
              <p className="text-teal font-semibold text-sm">{selectedTime || '—'}</p>
            </div>
            <button onClick={() => goToStep(2)} className="text-teal hover:text-teal-600 transition-colors flex-shrink-0"><Edit3 size={16} /></button>
          </div>

          <hr className="border-gray-100" />

          {/* Patient */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-gray text-xs uppercase tracking-wider font-semibold mb-1">
                {t({ en: 'Patient Details', bn: 'রোগীর তথ্য' })}
              </p>
              <p className="text-navy font-heading font-bold">{fv.name || '—'}</p>
              <p className="text-gray text-sm">{fv.phone || '—'}</p>
              {fv.email && <p className="text-gray text-sm">{fv.email}</p>}
              {fv.notes && <p className="text-gray text-sm italic mt-1">{t({ en: 'Notes:', bn: 'নোট:' })} {fv.notes}</p>}
            </div>
            <button onClick={() => goToStep(3)} className="text-teal hover:text-teal-600 transition-colors flex-shrink-0"><Edit3 size={16} /></button>
          </div>

          {/* Payment info for pre-payment */}
          {bookingMode === 'pre-payment' && (
            <>
              <hr className="border-gray-100" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-gray text-xs uppercase tracking-wider font-semibold mb-1">
                    {t({ en: 'Payment', bn: 'পেমেন্ট' })}
                  </p>
                  <p className="text-navy font-heading font-bold capitalize">{selectedPayment || '—'}</p>
                  {transactionId && <p className="text-teal font-semibold text-sm">TxnID: {transactionId}</p>}
                  {selectedPayment === 'card' && <p className="text-gray text-sm">{t({ en: 'Pay at clinic', bn: 'ক্লিনিকে পেমেন্ট' })}</p>}
                </div>
                <button onClick={() => goToStep(4)} className="text-teal hover:text-teal-600 transition-colors flex-shrink-0"><Edit3 size={16} /></button>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between mt-8 max-w-lg">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={prevStep}
            className="font-heading font-semibold px-6 py-3 rounded-xl inline-flex items-center gap-2 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
          >
            <ArrowLeft size={18} />
            {t({ en: 'Back', bn: 'পেছনে' })}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={confirmBooking}
            disabled={isSubmitting}
            className="font-heading font-semibold px-8 py-3 rounded-xl inline-flex items-center gap-2 bg-teal text-white hover:bg-teal-600 shadow-lg transition-all disabled:opacity-60"
          >
            {isSubmitting ? (
              <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />{t({ en: 'Booking...', bn: 'বুকিং হচ্ছে...' })}</>
            ) : (
              <><Check size={18} />{t({ en: 'Confirm Appointment', bn: 'অ্যাপয়েন্টমেন্ট নিশ্চিত করুন' })}</>
            )}
          </motion.button>
        </div>
      </div>
    );
  };

  /* ================================================================ */
  /*  SUCCESS                                                          */
  /* ================================================================ */

  const renderSuccess = () => {
    const fv = getValues();
    const dateInfo = selectedDate ? formatDateShort(new Date(selectedDate)) : null;
    const modeInfo = bookingModes.find((m) => m.id === bookingMode);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg mx-auto"
      >
        {/* Lottie success animation */}
        <div className="w-28 h-28 mx-auto mb-4">
          <Lottie animationData={successCheckAnimation} loop={false} className="w-full h-full" />
        </div>

        <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-2">
          {t({ en: 'Appointment Booked!', bn: 'অ্যাপয়েন্টমেন্ট বুক হয়েছে!' })}
        </h2>
        <p className="text-gray mb-6">
          {bookingMode === 'consultation-first'
            ? t({ en: 'Your consultation has been scheduled. After your visit, you can book follow-up treatments.', bn: 'আপনার পরামর্শ নির্ধারিত হয়েছে। আপনার ভিজিটের পরে, আপনি ফলো-আপ চিকিৎসা বুক করতে পারেন।' })
            : t({ en: 'Your appointment has been successfully scheduled.', bn: 'আপনার অ্যাপয়েন্টমেন্ট সফলভাবে নির্ধারিত হয়েছে।' })}
        </p>

        {/* Booking ref */}
        <div className="bg-teal/5 border-2 border-teal/20 rounded-2xl p-6 mb-6">
          <p className="text-gray text-sm mb-1">{t({ en: 'Booking Reference', bn: 'বুকিং রেফারেন্স' })}</p>
          <p className="text-teal font-heading text-3xl font-bold tracking-wider">{bookingRef}</p>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 text-left space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
              {modeInfo && (() => { const I = modeInfo.icon; return <I size={16} className="text-teal" />; })()}
            </div>
            <div>
              <p className="text-xs text-gray">{t({ en: 'Booking Type', bn: 'বুকিং ধরন' })}</p>
              <p className="text-navy font-semibold text-sm">{modeInfo ? t(modeInfo.title) : '—'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
              {selectedService && iconMap[selectedService.icon]
                ? (() => { const I = iconMap[selectedService.icon]; return <I size={16} className="text-teal" />; })()
                : <Shield size={16} className="text-teal" />}
            </div>
            <div>
              <p className="text-xs text-gray">{t({ en: 'Service', bn: 'সেবা' })}</p>
              <p className="text-navy font-semibold text-sm">
                {bookingMode === 'consultation-first' ? t({ en: 'Consultation', bn: 'পরামর্শ' }) : selectedService ? t(selectedService.title) : '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
              <Calendar size={16} className="text-teal" />
            </div>
            <div>
              <p className="text-xs text-gray">{t({ en: 'Date & Time', bn: 'তারিখ ও সময়' })}</p>
              <p className="text-navy font-semibold text-sm">{dateInfo ? dateInfo.full : '—'} | {selectedTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
              <User size={16} className="text-teal" />
            </div>
            <div>
              <p className="text-xs text-gray">{t({ en: 'Patient', bn: 'রোগী' })}</p>
              <p className="text-navy font-semibold text-sm">{fv.name} | {fv.phone}</p>
            </div>
          </div>

          {bookingMode === 'pre-payment' && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
                <Wallet size={16} className="text-teal" />
              </div>
              <div>
                <p className="text-xs text-gray">{t({ en: 'Payment', bn: 'পেমেন্ট' })}</p>
                <p className="text-navy font-semibold text-sm capitalize">
                  {selectedPayment} {transactionId && `(${transactionId})`}
                </p>
              </div>
            </div>
          )}

          {bookingMode === 'post-payment' && (
            <div className="flex items-center gap-3 bg-gold/5 p-3 rounded-xl">
              <AlertCircle size={16} className="text-gold shrink-0" />
              <p className="text-xs text-navy">
                {t({ en: 'Payment due at clinic visit. We will call to confirm your slot.', bn: 'ক্লিনিকে ভিজিটে পেমেন্ট দিতে হবে। আমরা আপনার স্লট নিশ্চিত করতে কল করব।' })}
              </p>
            </div>
          )}

          {bookingMode === 'consultation-first' && (
            <div className="flex items-center gap-3 bg-teal/5 p-3 rounded-xl">
              <Stethoscope size={16} className="text-teal shrink-0" />
              <p className="text-xs text-navy">
                {t({ en: 'After consultation, you can add specific treatments and book follow-up appointments.', bn: 'পরামর্শের পরে, আপনি নির্দিষ্ট চিকিৎসা যোগ করতে এবং ফলো-আপ অ্যাপয়েন্টমেন্ট বুক করতে পারেন।' })}
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={downloadICS}
            className="font-heading font-semibold px-5 py-3 rounded-xl inline-flex items-center justify-center gap-2 border-2 border-teal text-teal hover:bg-teal hover:text-white transition-all"
          >
            <Download size={18} />
            {t({ en: 'Add to Calendar', bn: 'ক্যালেন্ডারে যোগ করুন' })}
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading font-semibold px-5 py-3 rounded-xl inline-flex items-center justify-center gap-2 bg-green-500 text-white hover:bg-green-600 shadow-lg transition-all"
          >
            <MessageCircle size={18} />
            {t({ en: 'WhatsApp Confirmation', bn: 'হোয়াটসঅ্যাপ নিশ্চিতকরণ' })}
          </motion.a>
        </div>

        <div className="mt-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray hover:text-teal font-heading font-semibold transition-colors">
            <Home size={18} />
            {t({ en: 'Back to Home', bn: 'হোমে ফিরে যান' })}
          </Link>
        </div>
      </motion.div>
    );
  };

  /* ================================================================ */
  /*  Build step renderers array based on booking mode                 */
  /* ================================================================ */

  const getStepRenderers = () => {
    const base = [renderBookingMode, renderSelectService, renderDateTime, renderDetails];
    if (bookingMode === 'pre-payment') return [...base, renderPayment, renderConfirm];
    return [...base, renderConfirm];
  };

  const stepRenderers = getStepRenderers();

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <PageTransition>
      <Helmet>
        <title>{t({ en: 'Book Appointment | Everyday Dental Surgery', bn: 'অ্যাপয়েন্টমেন্ট বুক করুন | এভরিডে ডেন্টাল সার্জারি' })}</title>
        <meta name="description" content="Book your dental appointment online at Everyday Dental Surgery, Dhanmondi, Dhaka. Pre-payment, pay-at-clinic, or consultation-first booking. bKash, Nagad, Card accepted." />
        <meta property="og:title" content="Book Appointment | Everyday Dental Surgery" />
        <link rel="canonical" href="https://example-dental.com/appointment" />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[50vh] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=80&fit=crop"
          alt="Book dental appointment"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/75 to-navy/50" />

        <div className="container mx-auto px-4 relative z-10 text-center py-28 md:py-36">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            {t({ en: 'Book Your Appointment', bn: 'আপনার অ্যাপয়েন্টমেন্ট বুক করুন' })}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto"
          >
            {t({ en: 'Pre-pay online, pay at clinic, or book a consultation first', bn: 'অনলাইনে অগ্রিম পেমেন্ট, ক্লিনিকে পেমেন্ট, অথবা প্রথমে পরামর্শ বুক করুন' })}
          </motion.p>

          {/* Payment badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-3 mt-6"
          >
            <span className="bg-white/10 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">bKash</span>
            <span className="bg-white/10 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">Nagad</span>
            <span className="bg-white/10 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">Visa/Master</span>
          </motion.div>
        </div>
      </section>

      {/* Booking Wizard */}
      <section className="py-12 md:py-20 bg-offwhite">
        <div className="container mx-auto px-4">
          {!bookingComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto mb-10 md:mb-14"
            >
              <div className="flex items-center justify-between">
                {stepLabels.map((label, i) => (
                  <div key={i} className="flex flex-col items-center flex-1 relative">
                    {i < stepLabels.length - 1 && (
                      <div className={`absolute top-5 left-[calc(50%+16px)] right-[calc(-50%+16px)] h-0.5 ${
                        i < currentStep ? 'bg-teal' : 'bg-gray-200'
                      } transition-colors duration-300`} />
                    )}
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm transition-all duration-300 ${
                      i < currentStep ? 'bg-teal text-white'
                        : i === currentStep ? 'bg-teal text-white shadow-lg shadow-teal/30 ring-4 ring-teal/20'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {i < currentStep ? <Check size={18} /> : i + 1}
                    </div>
                    <span className={`text-xs font-heading font-semibold mt-2 text-center hidden sm:block ${
                      i <= currentStep ? 'text-navy' : 'text-gray-400'
                    }`}>
                      {t(label)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="max-w-4xl mx-auto min-h-[400px]">
            {bookingComplete ? renderSuccess() : (
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  {stepRenderers[currentStep]()}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default AppointmentPage;
