import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Shield,
  Heart,
  Stethoscope,
  ClipboardList,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Home,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../utils/emailService';
import { checkRateLimit, formatCooldown } from '../utils/rateLimit';
import PageTransition from '../components/ui/PageTransition';
import SectionHeading from '../components/ui/SectionHeading';

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

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const steps = [
  { label: { en: 'Personal Information', bn: 'ব্যক্তিগত তথ্য' }, icon: User },
  { label: { en: 'Medical History', bn: 'চিকিৎসা ইতিহাস' }, icon: Heart },
  { label: { en: 'Appointment Preference', bn: 'অ্যাপয়েন্টমেন্ট পছন্দ' }, icon: Calendar },
];

const conditions = [
  { value: 'diabetes', label: { en: 'Diabetes', bn: 'ডায়াবেটিস' } },
  { value: 'heart-disease', label: { en: 'Heart Disease', bn: 'হৃদরোগ' } },
  { value: 'blood-pressure', label: { en: 'Blood Pressure', bn: 'রক্তচাপ' } },
  { value: 'thyroid', label: { en: 'Thyroid', bn: 'থাইরয়েড' } },
  { value: 'asthma', label: { en: 'Asthma', bn: 'হাঁপানি' } },
  { value: 'bleeding-disorder', label: { en: 'Bleeding Disorder', bn: 'রক্তপাত জনিত সমস্যা' } },
  { value: 'pregnancy', label: { en: 'Pregnancy', bn: 'গর্ভাবস্থা' } },
  { value: 'none', label: { en: 'None', bn: 'কোনোটি নয়' } },
];

const allServices = [
  { value: '', label: { en: 'Select a service', bn: 'একটি সেবা নির্বাচন করুন' } },
  { value: 'general-consultation', label: { en: 'General Consultation', bn: 'সাধারণ পরামর্শ' } },
  { value: 'root-canal', label: { en: 'Root Canal Treatment', bn: 'রুট ক্যানেল চিকিৎসা' } },
  { value: 'dental-implant', label: { en: 'Dental Implant', bn: 'ডেন্টাল ইমপ্লান্ট' } },
  { value: 'braces', label: { en: 'Braces / Orthodontics', bn: 'ব্রেসেস / অর্থোডন্টিক্স' } },
  { value: 'aligners', label: { en: 'Clear Aligners', bn: 'ক্লিয়ার অ্যালাইনার' } },
  { value: 'teeth-whitening', label: { en: 'Teeth Whitening', bn: 'দাঁত সাদাকরণ' } },
  { value: 'extraction', label: { en: 'Tooth Extraction', bn: 'দাঁত তোলা' } },
  { value: 'wisdom-tooth', label: { en: 'Wisdom Tooth Surgery', bn: 'আক্কেল দাঁতের সার্জারি' } },
  { value: 'filling', label: { en: 'Dental Filling', bn: 'ডেন্টাল ফিলিং' } },
  { value: 'crown-bridge', label: { en: 'Crown & Bridge', bn: 'ক্রাউন ও ব্রিজ' } },
  { value: 'veneer', label: { en: 'Veneer / Smile Design', bn: 'ভিনিয়ার / স্মাইল ডিজাইন' } },
  { value: 'gum-treatment', label: { en: 'Gum Treatment', bn: 'মাড়ির চিকিৎসা' } },
  { value: 'oral-surgery', label: { en: 'Oral & Maxillofacial Surgery', bn: 'ওরাল ও ম্যাক্সিলোফেসিয়াল সার্জারি' } },
  { value: 'other', label: { en: 'Other', bn: 'অন্যান্য' } },
];

const timeSlots = [
  { value: '5pm', label: '5:00 PM' },
  { value: '6pm', label: '6:00 PM' },
  { value: '7pm', label: '7:00 PM' },
  { value: '8pm', label: '8:00 PM' },
];

const referralSources = [
  { value: 'google', label: { en: 'Google', bn: 'গুগল' } },
  { value: 'facebook', label: { en: 'Facebook', bn: 'ফেসবুক' } },
  { value: 'referral', label: { en: 'Referral', bn: 'রেফারেল' } },
  { value: 'walked-in', label: { en: 'Walked In', bn: 'সরাসরি এসেছি' } },
  { value: 'other', label: { en: 'Other', bn: 'অন্যান্য' } },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

const RegisterPage = () => {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');

  // Toggle states for medical history
  const [hasAllergies, setHasAllergies] = useState(false);
  const [hasCurrentMeds, setHasCurrentMeds] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onTouched' });

  const inputBase =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-navy placeholder-gray-400 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all duration-300';
  const labelBase = 'block text-sm font-semibold text-navy mb-1.5';
  const errorBase = 'text-red-500 text-xs mt-1';

  /* ---- step navigation ---- */
  const nextStep = async () => {
    let fieldsToValidate = [];
    if (currentStep === 0) {
      fieldsToValidate = ['fullName', 'phone'];
    }
    if (currentStep === 2) {
      fieldsToValidate = ['preferredDate', 'preferredTime'];
    }

    const isValid = fieldsToValidate.length > 0 ? await trigger(fieldsToValidate) : true;
    if (isValid && currentStep < 2) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  /* ---- submit ---- */
  const onSubmit = async (data) => {
    const { canSubmit, remainingMs } = checkRateLimit('registration-form');
    if (!canSubmit) {
      toast.error(t({ en: `Too many submissions. Try again in ${formatCooldown(remainingMs)}.`, bn: `অনেক বেশি জমা দেওয়া হয়েছে। ${formatCooldown(remainingMs)} পর আবার চেষ্টা করুন।` }));
      return;
    }
    setIsSubmitting(true);
    try {
      // Build medicalHistory from Step 2 fields
      const medicalParts = [];
      if (data.conditions?.length) medicalParts.push(`Conditions: ${data.conditions.join(', ')}`);
      if (hasCurrentMeds && data.medicationDetails) medicalParts.push(`Medications: ${data.medicationDetails}`);
      if (data.previousDentalHistory) medicalParts.push(`Dental history: ${data.previousDentalHistory}`);
      if (data.lastDentalVisit) medicalParts.push(`Last visit: ${data.lastDentalVisit}`);

      const result = await api.submitRegistration({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || '',
        dob: data.dateOfBirth || '',
        gender: data.gender || '',
        bloodGroup: data.bloodGroup || '',
        medicalHistory: medicalParts.join(' | ') || '',
        allergies: hasAllergies ? (data.allergyDetails || 'Yes (unspecified)') : 'None',
        preferredDate: data.preferredDate || '',
        preferredTime: data.preferredTime || '',
      });
      setReferenceNumber(result.refNumber);
      setIsSuccess(true);
      reset();
      if (language === 'bn') {
        toast.success('নিবন্ধন সফল! আমরা ফোনে আপনার অ্যাপয়েন্টমেন্ট নিশ্চিত করব।');
      } else {
        toast.success("Registration successful! We'll confirm your appointment via phone.");
      }
    } catch {
      toast.error(language === 'bn' ? 'নিবন্ধন ব্যর্থ। আবার চেষ্টা করুন।' : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---- progress bar ---- */
  const ProgressBar = () => (
    <div className="max-w-2xl mx-auto mb-10 md:mb-14">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;
          return (
            <div key={i} className="flex items-center flex-1">
              {/* step circle */}
              <div className="flex flex-col items-center relative z-10">
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isCompleted || isActive ? '#00BFA6' : '#E5E7EB',
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-sm ${
                    isCompleted || isActive ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check size={22} /> : <Icon size={22} />}
                </motion.div>
                <span
                  className={`text-xs md:text-sm font-medium mt-2 text-center whitespace-nowrap ${
                    isCompleted || isActive ? 'text-teal' : 'text-gray-400'
                  }`}
                >
                  {t(step.label)}
                </span>
              </div>

              {/* connector line */}
              {i < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 md:mx-4 rounded-full bg-gray-200 relative overflow-hidden -mt-6">
                  <motion.div
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-y-0 left-0 bg-teal rounded-full"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ---- Step 1: Personal Information ---- */
  const Step1 = () => (
    <motion.div
      key="step1"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
          <User size={20} className="text-teal" />
        </div>
        <h3 className="font-heading text-xl font-bold text-navy">
          {t({ en: 'Personal Information', bn: 'ব্যক্তিগত তথ্য' })}
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label htmlFor="reg-fullName" className={labelBase}>
            {t({ en: 'Full Name', bn: 'পূর্ণ নাম' })} <span className="text-red-500">*</span>
          </label>
          <input
            id="reg-fullName"
            type="text"
            className={inputBase}
            placeholder={t({ en: 'Enter your full name', bn: 'আপনার পূর্ণ নাম লিখুন' })}
            {...register('fullName', {
              required: t({ en: 'Full name is required', bn: 'পূর্ণ নাম আবশ্যক' }),
            })}
          />
          {errors.fullName && <p className={errorBase}>{errors.fullName.message}</p>}
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="reg-dob" className={labelBase}>{t({ en: 'Date of Birth', bn: 'জন্ম তারিখ' })}</label>
          <input id="reg-dob" type="date" className={inputBase} max={new Date().toISOString().split('T')[0]} {...register('dateOfBirth', {
            validate: (v) => {
              if (!v) return true;
              const age = (Date.now() - new Date(v).getTime()) / (365.25 * 24 * 60 * 60 * 1000);
              if (age < 1 || age > 150) return t({ en: 'Enter a valid date of birth', bn: 'একটি বৈধ জন্ম তারিখ দিন' });
              return true;
            },
          })} />
          {errors.dateOfBirth && <p className={errorBase}>{errors.dateOfBirth.message}</p>}
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className={labelBase}>{t({ en: 'Gender', bn: 'লিঙ্গ' })}</label>
        <div className="flex items-center gap-6 mt-1">
          {[
            { value: 'male', label: { en: 'Male', bn: 'পুরুষ' } },
            { value: 'female', label: { en: 'Female', bn: 'মহিলা' } },
            { value: 'other', label: { en: 'Other', bn: 'অন্যান্য' } },
          ].map((g) => (
            <label key={g.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={g.value}
                {...register('gender')}
                className="w-4 h-4 text-teal border-gray-300 focus:ring-teal"
              />
              <span className="text-sm text-navy">{t(g.label)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* National ID */}
        <div>
          <label htmlFor="reg-nationalId" className={labelBase}>{t({ en: 'National ID / Passport Number', bn: 'জাতীয় পরিচয়পত্র নম্বর' })}</label>
          <input
            id="reg-nationalId"
            type="text"
            className={inputBase}
            placeholder={t({ en: 'Enter NID or Passport number', bn: 'NID বা পাসপোর্ট নম্বর দিন' })}
            {...register('nationalId')}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="reg-phone" className={labelBase}>
            {t({ en: 'Phone Number', bn: 'ফোন নম্বর' })} <span className="text-red-500">*</span>
          </label>
          <input
            id="reg-phone"
            type="tel"
            className={inputBase}
            placeholder="+880 1XXX-XXXXXX"
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

      <div className="grid md:grid-cols-2 gap-6">
        {/* Email */}
        <div>
          <label htmlFor="reg-email" className={labelBase}>{t({ en: 'Email Address', bn: 'ইমেইল' })}</label>
          <input
            id="reg-email"
            type="email"
            className={inputBase}
            placeholder="your@email.com"
            {...register('email', {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t({ en: 'Enter a valid email', bn: 'একটি বৈধ ইমেইল দিন' }),
              },
            })}
          />
          {errors.email && <p className={errorBase}>{errors.email.message}</p>}
        </div>

        {/* Emergency Contact Name */}
        <div>
          <label htmlFor="reg-emergencyName" className={labelBase}>{t({ en: 'Emergency Contact Name', bn: 'জরুরি যোগাযোগ নাম' })}</label>
          <input
            id="reg-emergencyName"
            type="text"
            className={inputBase}
            placeholder={t({ en: 'Emergency contact name', bn: 'জরুরি যোগাযোগের নাম' })}
            {...register('emergencyContactName')}
          />
        </div>
      </div>

      {/* Emergency Contact Phone */}
      <div className="md:w-1/2">
        <label htmlFor="reg-emergencyPhone" className={labelBase}>{t({ en: 'Emergency Contact Phone', bn: 'জরুরি যোগাযোগ ফোন' })}</label>
        <input
          id="reg-emergencyPhone"
          type="tel"
          className={inputBase}
          placeholder="+880 1XXX-XXXXXX"
          {...register('emergencyContactPhone')}
        />
      </div>
    </motion.div>
  );

  /* ---- Step 2: Medical History ---- */
  const Step2 = () => (
    <motion.div
      key="step2"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
          <Heart size={20} className="text-teal" />
        </div>
        <h3 className="font-heading text-xl font-bold text-navy">
          {t({ en: 'Medical History', bn: 'চিকিৎসা ইতিহাস' })}
        </h3>
      </div>

      {/* Allergies */}
      <div className="bg-offwhite rounded-xl p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-navy">
            {t({ en: 'Do you have any allergies?', bn: 'আপনার কি কোনো অ্যালার্জি আছে?' })}
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setHasAllergies(false)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                !hasAllergies ? 'bg-teal text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {t({ en: 'No', bn: 'না' })}
            </button>
            <button
              type="button"
              onClick={() => setHasAllergies(true)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                hasAllergies ? 'bg-teal text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {t({ en: 'Yes', bn: 'হ্যাঁ' })}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {hasAllergies && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <label htmlFor="reg-allergyDetails" className="sr-only">{t({ en: 'Allergy Details', bn: 'অ্যালার্জির বিবরণ' })}</label>
              <input
                id="reg-allergyDetails"
                type="text"
                className={inputBase}
                placeholder={t({ en: 'Please specify your allergies', bn: 'আপনার অ্যালার্জি উল্লেখ করুন' })}
                {...register('allergyDetails')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Current Medications */}
      <div className="bg-offwhite rounded-xl p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-navy">
            {t({ en: 'Are you on any current medications?', bn: 'আপনি কি বর্তমানে কোনো ওষুধ খাচ্ছেন?' })}
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setHasCurrentMeds(false)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                !hasCurrentMeds ? 'bg-teal text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {t({ en: 'No', bn: 'না' })}
            </button>
            <button
              type="button"
              onClick={() => setHasCurrentMeds(true)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                hasCurrentMeds ? 'bg-teal text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {t({ en: 'Yes', bn: 'হ্যাঁ' })}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {hasCurrentMeds && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <label htmlFor="reg-medicationDetails" className="sr-only">{t({ en: 'Medication Details', bn: 'ওষুধের বিবরণ' })}</label>
              <input
                id="reg-medicationDetails"
                type="text"
                className={inputBase}
                placeholder={t({ en: 'Please list your current medications', bn: 'আপনার বর্তমান ওষুধের তালিকা দিন' })}
                {...register('medicationDetails')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Conditions */}
      <div>
        <label className={labelBase}>
          {t({ en: 'Do you have any of these conditions?', bn: 'আপনার কি নিচের কোনো সমস্যা আছে?' })}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
          {conditions.map((cond) => (
            <label
              key={cond.value}
              className="flex items-center gap-2 bg-offwhite rounded-lg px-3 py-2.5 border border-gray-100 hover:border-teal/30 cursor-pointer transition-all"
            >
              <input
                type="checkbox"
                value={cond.value}
                {...register('conditions')}
                className="w-4 h-4 text-teal border-gray-300 rounded focus:ring-teal"
              />
              <span className="text-sm text-navy">{t(cond.label)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Previous dental treatment */}
      <div>
        <label htmlFor="reg-dentalHistory" className={labelBase}>
          {t({ en: 'Previous Dental Treatment History', bn: 'পূর্ববর্তী দন্ত চিকিৎসার ইতিহাস' })}
        </label>
        <textarea
          id="reg-dentalHistory"
          rows={3}
          className={inputBase}
          placeholder={t({
            en: 'Describe any previous dental treatments...',
            bn: 'পূর্ববর্তী দন্ত চিকিৎসার বিবরণ দিন...',
          })}
          {...register('previousDentalHistory')}
        />
      </div>

      {/* Last dental visit */}
      <div className="md:w-1/2">
        <label htmlFor="reg-lastVisit" className={labelBase}>
          {t({ en: 'Last Dental Visit', bn: 'শেষ দন্ত চিকিৎসা পরিদর্শন' })}
        </label>
        <div className="flex items-center gap-4">
          <input id="reg-lastVisit" type="date" className={`${inputBase} flex-1`} {...register('lastDentalVisit')} />
          <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              {...register('neverVisited')}
              className="w-4 h-4 text-teal border-gray-300 rounded focus:ring-teal"
            />
            <span className="text-sm text-navy">{t({ en: 'Never', bn: 'কখনো যাইনি' })}</span>
          </label>
        </div>
      </div>
    </motion.div>
  );

  /* ---- Step 3: Appointment Preference ---- */
  const Step3 = () => (
    <motion.div
      key="step3"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
          <Calendar size={20} className="text-teal" />
        </div>
        <h3 className="font-heading text-xl font-bold text-navy">
          {t({ en: 'Appointment Preference', bn: 'অ্যাপয়েন্টমেন্ট পছন্দ' })}
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Preferred Service */}
        <div>
          <label htmlFor="reg-preferredService" className={labelBase}>{t({ en: 'Preferred Service', bn: 'পছন্দের সেবা' })}</label>
          <select id="reg-preferredService" className={inputBase} {...register('preferredService')}>
            {allServices.map((svc) => (
              <option key={svc.value} value={svc.value}>
                {t(svc.label)}
              </option>
            ))}
          </select>
        </div>

        {/* Preferred Date */}
        <div>
          <label htmlFor="reg-preferredDate" className={labelBase}>{t({ en: 'Preferred Date', bn: 'পছন্দের তারিখ' })}</label>
          <input id="reg-preferredDate" type="date" className={inputBase} min={new Date().toISOString().split('T')[0]} {...register('preferredDate', {
            required: t({ en: 'Preferred date is required', bn: 'পছন্দের তারিখ আবশ্যক' }),
          })} />
          {errors.preferredDate && <p className={errorBase}>{errors.preferredDate.message}</p>}
        </div>
      </div>

      {/* Preferred Time Slot */}
      <div>
        <label className={labelBase}>{t({ en: 'Preferred Time Slot', bn: 'পছন্দের সময়' })}</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
          {timeSlots.map((slot) => (
            <label
              key={slot.value}
              className="flex items-center justify-center gap-2 bg-offwhite rounded-xl px-4 py-3 border border-gray-100 hover:border-teal/30 cursor-pointer transition-all has-[:checked]:bg-teal/10 has-[:checked]:border-teal"
            >
              <input
                type="radio"
                value={slot.value}
                {...register('preferredTime', {
                  required: t({ en: 'Please select a time slot', bn: 'একটি সময় স্লট নির্বাচন করুন' }),
                })}
                className="w-4 h-4 text-teal border-gray-300 focus:ring-teal"
              />
              <Clock size={16} className="text-teal" />
              <span className="text-sm font-medium text-navy">{slot.label}</span>
            </label>
          ))}
        </div>
        {errors.preferredTime && <p className={errorBase}>{errors.preferredTime.message}</p>}
      </div>

      {/* How did you hear about us */}
      <div>
        <label className={labelBase}>
          {t({ en: 'How did you hear about us?', bn: 'আমাদের সম্পর্কে কিভাবে জানলেন?' })}
        </label>
        <div className="flex flex-wrap gap-3 mt-2">
          {referralSources.map((src) => (
            <label
              key={src.value}
              className="flex items-center gap-2 bg-offwhite rounded-lg px-4 py-2.5 border border-gray-100 hover:border-teal/30 cursor-pointer transition-all has-[:checked]:bg-teal/10 has-[:checked]:border-teal"
            >
              <input
                type="radio"
                value={src.value}
                {...register('referralSource')}
                className="w-4 h-4 text-teal border-gray-300 focus:ring-teal"
              />
              <span className="text-sm text-navy">{t(src.label)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Special Notes */}
      <div>
        <label htmlFor="reg-specialNotes" className={labelBase}>
          {t({ en: 'Special Notes or Concerns', bn: 'বিশেষ নোট বা উদ্বেগ' })}
        </label>
        <textarea
          id="reg-specialNotes"
          rows={4}
          className={inputBase}
          placeholder={t({
            en: 'Any special notes, concerns, or requests...',
            bn: 'কোনো বিশেষ নোট, উদ্বেগ বা অনুরোধ...',
          })}
          {...register('specialNotes')}
        />
      </div>

      {/* HIPAA Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <p className="text-amber-800 text-xs">
          <strong>{t({ en: 'Notice:', bn: 'বিজ্ঞপ্তি:' })}</strong>{' '}
          {t({
            en: 'This system is not yet HIPAA-compliant. Please do not submit sensitive medical records. Data is stored locally in your browser.',
            bn: 'এই সিস্টেমটি এখনও HIPAA-সম্মত নয়। সংবেদনশীল চিকিৎসা রেকর্ড জমা দেবেন না। তথ্য আপনার ব্রাউজারে স্থানীয়ভাবে সংরক্ষিত হয়।',
          })}
        </p>
      </div>

      {/* Privacy consent */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="reg-consent"
          {...register('privacyConsent', { required: t({ en: 'You must agree to proceed', bn: 'এগিয়ে যেতে আপনাকে সম্মত হতে হবে' }) })}
          className="mt-1 w-4 h-4 text-teal border-gray-300 rounded focus:ring-teal"
        />
        <label htmlFor="reg-consent" className="text-sm text-navy/70">
          {t({
            en: 'I consent to the collection of my personal and medical information as described in the',
            bn: 'আমি আমার ব্যক্তিগত ও চিকিৎসা তথ্য সংগ্রহে সম্মতি দিচ্ছি যা বর্ণিত আছে',
          })}{' '}
          <a href="/privacy-policy" target="_blank" className="text-teal underline">{t({ en: 'Privacy Policy', bn: 'গোপনীয়তা নীতিতে' })}</a>.
        </label>
      </div>
      {errors.privacyConsent && <p className={errorBase}>{errors.privacyConsent.message}</p>}
    </motion.div>
  );

  /* ---- Success Screen ---- */
  const SuccessScreen = () => {
    const formData = getValues();
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-8"
      >
        {/* Checkmark Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.5 }}
          >
            <CheckCircle2 size={48} className="text-green-500" />
          </motion.div>
        </motion.div>

        <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-3">
          {t({ en: 'Registration Successful!', bn: 'নিবন্ধন সফল!' })}
        </h2>

        <p className="text-gray text-lg mb-6">
          {t({
            en: "We'll confirm your appointment via phone.",
            bn: 'আমরা ফোনে আপনার অ্যাপয়েন্টমেন্ট নিশ্চিত করব।',
          })}
        </p>

        {/* Reference Number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="inline-block bg-teal/10 border border-teal/30 rounded-2xl px-8 py-5 mb-8"
        >
          <p className="text-sm text-gray mb-1">
            {t({ en: 'Your Reference Number', bn: 'আপনার রেফারেন্স নম্বর' })}
          </p>
          <p className="font-heading text-2xl md:text-3xl font-bold text-teal">{referenceNumber}</p>
        </motion.div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="max-w-md mx-auto bg-offwhite rounded-2xl p-6 text-left space-y-3 mb-8 border border-gray-100"
        >
          <h4 className="font-heading font-bold text-navy text-center mb-4">
            {t({ en: 'Registration Summary', bn: 'নিবন্ধন সারাংশ' })}
          </h4>
          {formData.fullName && (
            <div className="flex justify-between text-sm">
              <span className="text-gray">{t({ en: 'Name', bn: 'নাম' })}</span>
              <span className="text-navy font-medium">{formData.fullName}</span>
            </div>
          )}
          {formData.phone && (
            <div className="flex justify-between text-sm">
              <span className="text-gray">{t({ en: 'Phone', bn: 'ফোন' })}</span>
              <span className="text-navy font-medium">{formData.phone}</span>
            </div>
          )}
          {formData.preferredService && (
            <div className="flex justify-between text-sm">
              <span className="text-gray">{t({ en: 'Service', bn: 'সেবা' })}</span>
              <span className="text-navy font-medium">
                {t(allServices.find((s) => s.value === formData.preferredService)?.label || { en: formData.preferredService, bn: formData.preferredService })}
              </span>
            </div>
          )}
          {formData.preferredDate && (
            <div className="flex justify-between text-sm">
              <span className="text-gray">{t({ en: 'Date', bn: 'তারিখ' })}</span>
              <span className="text-navy font-medium">{formData.preferredDate}</span>
            </div>
          )}
          {formData.preferredTime && (
            <div className="flex justify-between text-sm">
              <span className="text-gray">{t({ en: 'Time', bn: 'সময়' })}</span>
              <span className="text-navy font-medium">
                {timeSlots.find((s) => s.value === formData.preferredTime)?.label || formData.preferredTime}
              </span>
            </div>
          )}
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-teal text-white font-heading font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:bg-teal-600 transition-all duration-300"
          >
            <Home size={22} />
            {t({ en: 'Back to Home', bn: 'হোমে ফিরে যান' })}
          </Link>
        </motion.div>
      </motion.div>
    );
  };

  /* ---- Render ---- */
  return (
    <PageTransition>
      <Helmet>
        <title>Patient Registration | Everyday Dental Surgery</title>
        <meta
          name="description"
          content="Register as a new patient at Everyday Dental Surgery. Fill out your personal details, medical history, and appointment preferences online."
        />
        <meta property="og:title" content="Patient Registration | Everyday Dental Surgery" />
        <meta
          property="og:description"
          content="Complete your patient registration online for Everyday Dental Surgery, Dhanmondi, Dhaka."
        />
        <link rel="canonical" href="https://example-dental.com/register" />
      </Helmet>

      {/* ============================== HERO ============================== */}
      <section className="relative overflow-hidden min-h-[50vh] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=80&fit=crop"
          alt="Patient registration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/75 to-navy/50" />

        <div className="container mx-auto px-4 relative z-10 py-28 md:py-36">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="mb-5">
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <ClipboardList size={32} className="text-teal" />
              </div>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
            >
              {t({ en: 'Patient Registration', bn: 'রোগী নিবন্ধন' })}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-gray-300 text-lg md:text-xl max-w-2xl"
            >
              {t({
                en: 'Complete your registration in 3 simple steps. Your information is safe and secure with us.',
                bn: '৩টি সহজ ধাপে আপনার নিবন্ধন সম্পন্ন করুন। আপনার তথ্য আমাদের কাছে নিরাপদ।',
              })}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ======================== REGISTRATION FORM ======================== */}
      <section className="py-16 md:py-24 bg-offwhite">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {!isSuccess && <ProgressBar />}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10"
            >
              {isSuccess ? (
                <SuccessScreen />
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <AnimatePresence mode="wait" custom={direction}>
                    {currentStep === 0 && <Step1 />}
                    {currentStep === 1 && <Step2 />}
                    {currentStep === 2 && <Step3 />}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
                    {currentStep > 0 ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center gap-2 font-heading font-semibold text-navy bg-gray-100 hover:bg-gray-200 rounded-xl px-6 py-3 transition-all duration-300"
                      >
                        <ChevronLeft size={20} />
                        {t({ en: 'Previous', bn: 'পূর্ববর্তী' })}
                      </motion.button>
                    ) : (
                      <div />
                    )}

                    {currentStep < 2 ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={nextStep}
                        className="inline-flex items-center gap-2 font-heading font-semibold text-white bg-teal hover:bg-teal-600 rounded-xl px-6 py-3 shadow-lg transition-all duration-300"
                      >
                        {t({ en: 'Next', bn: 'পরবর্তী' })}
                        <ChevronRight size={20} />
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 font-heading font-semibold text-white bg-teal hover:bg-teal-600 rounded-xl px-8 py-3 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            {t({ en: 'Submitting...', bn: 'জমা হচ্ছে...' })}
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={20} />
                            {t({ en: 'Submit Registration', bn: 'নিবন্ধন জমা দিন' })}
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default RegisterPage;
