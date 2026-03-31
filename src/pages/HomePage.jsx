import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Award, Users, Star, TrendingUp,
  CircleDot, Activity, GitBranch, Sparkles, Zap, Scissors,
  Monitor, Shield, Heart,
  CalendarPlus, ClipboardCheck, FileText, CheckCircle,
  ChevronLeft, ChevronRight, Phone, Mail, ArrowRight, Play,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal, useStaggerReveal, useParallax } from '../hooks/useGsapAnimations';
import SectionHeading from '../components/ui/SectionHeading';
import Card from '../components/ui/Card';
import TiltCard from '../components/ui/TiltCard';
import MagneticButton from '../components/ui/MagneticButton';
import CursorGlow from '../components/ui/CursorGlow';
import PageTransition from '../components/ui/PageTransition';

gsap.registerPlugin(ScrollTrigger);

/* ── Stock Photo URLs (Unsplash) ── */
const PHOTOS = {
  doctor: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=85&fit=crop',
  clinic: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=85&fit=crop',
  smileAfter: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=85&fit=crop',
  smileBefore: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=85&fit=crop',
  patient: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=85&fit=crop',
  team: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=800&q=85&fit=crop',
};

/* ──────────────────────────────────────────────
   Inline Data
   ────────────────────────────────────────────── */

const testimonials = [
  { name: 'Salman Ahmed', nameBn: 'সালমান আহমেদ', treatment: 'Root Canal', treatmentBn: 'রুট ক্যানাল', rating: 5, text: "I was terrified of root canals but Dr. Rafi made it completely painless. Done in one visit! The clinic is modern and hygienic.", textBn: "আমি রুট ক্যানাল নিয়ে ভীত ছিলাম কিন্তু ডা. রফি এটিকে সম্পূর্ণ ব্যথাহীন করে দিলেন। এক ভিজিটেই সম্পন্ন!" },
  { name: 'Rashida Khatun', nameBn: 'রশিদা খাতুন', treatment: 'Dental Implant', treatmentBn: 'ডেন্টাল ইমপ্লান্ট', rating: 5, text: "After years with dentures, Dr. Arman gave me permanent implants. I can eat and smile with full confidence now.", textBn: "বছরের পর বছর ডেনচার ব্যবহারের পর, ডা. আরমান আমাকে স্থায়ী ইমপ্লান্ট দিয়েছেন।" },
  { name: 'Imran Chowdhury', nameBn: 'ইমরান চৌধুরী', treatment: 'Teeth Whitening', treatmentBn: 'দাঁত সাদাকরণ', rating: 5, text: "ZOOM whitening in just one session — my teeth are 5 shades brighter! Very professional staff and affordable pricing.", textBn: "মাত্র এক সেশনে ZOOM হোয়াইটেনিং — আমার দাঁত ৫ শেড উজ্জ্বল!" },
  { name: 'Sabrina Alam', nameBn: 'সাবরিনা আলম', treatment: 'Braces', treatmentBn: 'ব্রেসেস', rating: 5, text: "Got ceramic braces from Dr. Rafi. The monthly adjustments are quick and painless. Already seeing amazing results!", textBn: "ডা. রফিের কাছ থেকে সিরামিক ব্রেসেস নিয়েছি। দারুণ ফলাফল!" },
  { name: 'Tanvir Islam', nameBn: 'তানভীর ইসলাম', treatment: 'Wisdom Tooth', treatmentBn: 'আক্কেল দাঁত', rating: 5, text: "Had all 4 wisdom teeth removed. Was very nervous but the surgery was smooth and recovery was quick.", textBn: "চারটি আক্কেল দাঁতই তুলেছি। সার্জারি মসৃণ ছিল এবং সেরে ওঠা দ্রুত হয়েছে।" },
];

const services = [
  { icon: CircleDot, title: 'Dental Implants', titleBn: 'ডেন্টাল ইমপ্লান্ট', desc: 'Permanent, natural-looking tooth replacements with titanium implants.', descBn: 'টাইটানিয়াম ইমপ্লান্ট দিয়ে স্থায়ী দাঁত প্রতিস্থাপন।', link: '/services/dental-implants' },
  { icon: Activity, title: 'Root Canal Therapy', titleBn: 'রুট ক্যানাল চিকিৎসা', desc: 'Save your natural tooth with modern, painless root canal treatment.', descBn: 'আধুনিক, ব্যথাহীন রুট ক্যানাল চিকিৎসা।', link: '/services/root-canal' },
  { icon: GitBranch, title: 'Cosmetic Braces & Aligners', titleBn: 'কসমেটিক ব্রেসেস ও অ্যালাইনার', desc: 'Straighten your teeth discreetly with ceramic braces or clear aligners.', descBn: 'সিরামিক ব্রেসেস বা ক্লিয়ার অ্যালাইনার দিয়ে দাঁত সোজা করুন।', link: '/services/braces-aligners' },
  { icon: Sparkles, title: 'Teeth Whitening', titleBn: 'দাঁত সাদাকরণ', desc: 'Professional ZOOM whitening to brighten your smile by up to 8 shades.', descBn: 'পেশাদার ZOOM হোয়াইটেনিং।', link: '/services/teeth-whitening' },
  { icon: Zap, title: 'Laser Gum Surgery', titleBn: 'লেজার মাড়ি সার্জারি', desc: 'Minimally invasive laser treatment for gum disease and reshaping.', descBn: 'মাড়ির রোগের জন্য লেজার চিকিৎসা।', link: '/services/laser-gum-surgery' },
  { icon: Scissors, title: 'Wisdom Tooth Extraction', titleBn: 'আক্কেল দাঁত তোলা', desc: 'Safe, efficient wisdom tooth removal by experienced oral surgeon.', descBn: 'অভিজ্ঞ সার্জন দ্বারা নিরাপদ আক্কেল দাঁত অপসারণ।', link: '/services/wisdom-tooth' },
];

const whyChooseUs = [
  { icon: Monitor, title: 'State-of-the-Art Technology', titleBn: 'আধুনিকতম প্রযুক্তি', desc: 'Digital X-rays, 3D imaging, laser systems, and sterilized instruments.', descBn: 'ডিজিটাল এক্স-রে, ৩ডি ইমেজিং, লেজার সিস্টেম।' },
  { icon: Shield, title: 'Painless Surgery Guarantee', titleBn: 'ব্যথাহীন সার্জারি গ্যারান্টি', desc: 'Advanced anesthesia ensures you feel zero pain during any procedure.', descBn: 'উন্নত অ্যানেসথেসিয়া নিশ্চিত করে শূন্য ব্যথা।' },
  { icon: Heart, title: 'Affordable Premium Care', titleBn: 'সাশ্রয়ী প্রিমিয়াম যত্ন', desc: 'World-class treatments at prices that respect your budget.', descBn: 'বিশ্বমানের চিকিৎসা আপনার বাজেটের প্রতি সম্মান রেখে।' },
];

const youtubeVideos = [
  { id: 'R8E-k3Anb24', title: 'Introduce Everyday Dental Surgery & Implant Center', titleBn: 'এভরিডে ডেন্টাল সার্জারি ও ইমপ্লান্ট সেন্টার পরিচিতি', patient: 'Dr. Arman Hossain' },
  { id: '_Sk86HFAXpI', title: 'Dental Filling in 20 Minutes — Patient Feedback', titleBn: 'দাঁতের ফিলিং মাত্র ২০ মিনিটে — রুগীর ফিডব্যাক', patient: 'Patient Review' },
  { id: 'rmtp5V5VTLA', title: 'Root Canal Treatment (RCT)', titleBn: 'রুট ক্যানেল ট্রিটমেন্ট (RCT)', patient: 'Dr. Arman Hossain' },
  { id: 'uT2EOK6_7fc', title: 'Wisdom Tooth Removal', titleBn: 'আক্কেল দাঁত অপসারণ', patient: 'Surgical Procedure' },
  { id: 'CRe5gC76KpU', title: 'Is Scaling Harmful for Teeth?', titleBn: 'স্কেলিং করলে দাঁতের ক্ষতি হবে কি না?', patient: 'Dr. Arman Hossain' },
  { id: 'f_lQIod_LwU', title: 'Patient Feedback — Tooth Pain Solution', titleBn: 'রোগীর ফিডব্যাক — দাঁতে ব্যাথার সমাধান', patient: 'Patient Review' },
];

const steps = [
  { icon: CalendarPlus, title: 'Book Online or Call', titleBn: 'অনলাইনে বুক বা কল করুন', desc: 'Schedule your visit online in 60 seconds or call us.', descBn: '৬০ সেকেন্ডে অনলাইনে ভিজিট নির্ধারণ করুন।' },
  { icon: ClipboardCheck, title: 'Arrive & Initial Exam', titleBn: 'আসুন এবং প্রাথমিক পরীক্ষা', desc: 'Our friendly team welcomes you for a thorough examination.', descBn: 'সম্পূর্ণ মৌখিক পরীক্ষার জন্য আপনাকে স্বাগত।' },
  { icon: FileText, title: 'Personalised Treatment Plan', titleBn: 'ব্যক্তিগত চিকিৎসা পরিকল্পনা', desc: 'Dr. Rafi creates a customised plan with transparent pricing.', descBn: 'ডা. রফি স্বচ্ছ মূল্য নির্ধারণে পরিকল্পনা তৈরি করেন।' },
  { icon: CheckCircle, title: 'Treatment & Follow-up', titleBn: 'চিকিৎসা এবং ফলো-আপ', desc: 'Expert treatment followed by attentive aftercare.', descBn: 'বিশেষজ্ঞ চিকিৎসার পরে মনোযোগী পরবর্তী যত্ন।' },
];

/* ──────────────────────────────────────────────
   Component: HomePage
   ────────────────────────────────────────────── */
const HomePage = () => {
  const { t } = useLanguage();

  /* ── Hero GSAP text animation ── */
  const heroRef = useRef(null);
  const heroHeadlineRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroCtaRef = useRef(null);
  const heroImageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline words
      const words = heroHeadlineRef.current?.querySelectorAll('.hero-word');
      if (words) {
        gsap.fromTo(words,
          { y: 80, opacity: 0, rotateX: 40 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.12, ease: 'power4.out', delay: 0.3 }
        );
      }
      // Subtitle
      if (heroSubRef.current) {
        gsap.fromTo(heroSubRef.current,
          { y: 30, opacity: 0, filter: 'blur(10px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, delay: 1.2, ease: 'power3.out' }
        );
      }
      // CTA buttons
      if (heroCtaRef.current) {
        gsap.fromTo(heroCtaRef.current.children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, delay: 1.5, ease: 'power3.out' }
        );
      }
      // Doctor image
      if (heroImageRef.current) {
        gsap.fromTo(heroImageRef.current,
          { x: 100, opacity: 0, scale: 0.9 },
          { x: 0, opacity: 1, scale: 1, duration: 1.2, delay: 0.5, ease: 'power3.out' }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  /* ── Testimonials carousel ── */
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonialTimerRef = useRef(null);

  const startAutoScroll = useCallback(() => {
    if (testimonialTimerRef.current) clearInterval(testimonialTimerRef.current);
    testimonialTimerRef.current = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
  }, []);

  useEffect(() => {
    startAutoScroll();
    return () => clearInterval(testimonialTimerRef.current);
  }, [startAutoScroll]);

  const goToTestimonial = (dir) => {
    setCurrentTestimonial((prev) => {
      if (dir === 'next') return (prev + 1) % testimonials.length;
      return (prev - 1 + testimonials.length) % testimonials.length;
    });
    startAutoScroll();
  };

  /* ── Before/After Slider ── */
  const sliderRef = useRef(null);
  const [sliderPos, setSliderPos] = useState(50);
  const isDragging = useRef(false);

  const handleSliderMove = useCallback((clientX) => {
    if (!isDragging.current || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    setSliderPos(Math.max(5, Math.min(95, (x / rect.width) * 100)));
  }, []);

  useEffect(() => {
    const up = () => { isDragging.current = false; };
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    return () => { window.removeEventListener('mouseup', up); window.removeEventListener('touchend', up); };
  }, []);

  /* ── Newsletter ── */
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const onNewsletterSubmit = async (data) => {
    try {
      const { api } = await import('../utils/emailService');
      await api.subscribeNewsletter(data.email);
      toast.success(t({ en: `Thanks! ${data.email} has been subscribed.`, bn: `ধন্যবাদ! ${data.email} সাবস্ক্রাইব হয়েছে।` }));
      reset();
    } catch {
      toast.error(t({ en: 'Subscription failed. Please try again.', bn: 'সাবস্ক্রিপশন ব্যর্থ। আবার চেষ্টা করুন।' }));
    }
  };

  /* ── GSAP scroll refs ── */
  const servicesGridRef = useStaggerReveal({ stagger: 0.08 });
  const whyGridRef = useStaggerReveal({ stagger: 0.12 });
  const stepsRef = useStaggerReveal({ stagger: 0.1 });
  const ctaBannerRef = useScrollReveal({ y: 40 });
  const newsletterRef = useScrollReveal({ y: 30 });
  const videoGridRef = useStaggerReveal({ stagger: 0.1, y: 50 });

  /* ── Hero words ── */
  const heroWordsEn = ["Dhaka's", 'Most', 'Trusted', 'Dental', 'Surgeon'];
  const heroWordsBn = ['ঢাকার', 'সবচেয়ে', 'বিশ্বস্ত', 'ডেন্টাল', 'সার্জন'];
  const heroWords = t({ en: heroWordsEn, bn: heroWordsBn });

  return (
    <PageTransition>
      {/* ═══════════════════════════════════════════
          1. HERO SECTION — Premium with GSAP
          ═══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-offwhite via-white to-teal-50"
      >
        {/* Cursor glow */}
        <CursorGlow containerRef={heroRef} />

        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-teal/8 blur-[100px] animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-gold/8 blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-60 h-60 rounded-full bg-teal/5 blur-[60px] animate-pulse" style={{ animationDelay: '4s' }} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Text */}
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center gap-2 bg-teal/10 text-teal px-5 py-2 rounded-full text-sm font-semibold mb-8 border border-teal/20 backdrop-blur-sm"
              >
                <span className="w-2 h-2 bg-teal rounded-full animate-pulse" />
                {t({ en: '#1 Dental Surgeon in Dhaka', bn: 'ঢাকার ১ নম্বর ডেন্টাল সার্জন' })}
              </motion.div>

              {/* Hero headline — GSAP animated words */}
              <h1
                ref={heroHeadlineRef}
                className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] xl:text-7xl font-bold text-navy leading-[1.1] mb-8"
                style={{ perspective: '800px' }}
              >
                {heroWords.map((word, i) => (
                  <span key={i} className="inline-block overflow-hidden mr-3">
                    <span
                      className={`hero-word inline-block ${word === 'Trusted' || word === 'বিশ্বস্ত' ? 'text-teal' : ''}`}
                      style={{ willChange: 'transform, opacity' }}
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </h1>

              {/* Subtitle */}
              <p ref={heroSubRef} className="text-gray text-lg md:text-xl mb-10 max-w-lg leading-relaxed opacity-0">
                {t({
                  en: 'Dr. Arman Hossain (Rafi) — BDS, FCPS | Oral & Maxillofacial Surgery | 15+ Years of Painless Care',
                  bn: 'ডা. আরমান হোসেন (রফি) — বিডিএস, এফসিপিএস | ওরাল ও ম্যাক্সিলোফেসিয়াল সার্জারি | ১৫+ বছরের ব্যথাহীন যত্ন',
                })}
              </p>

              {/* CTA — Magnetic buttons */}
              <div ref={heroCtaRef} className="flex flex-wrap gap-4 mb-8">
                <MagneticButton
                  to="/appointment"
                  className="bg-teal text-white font-heading font-semibold px-8 py-4 rounded-xl text-lg inline-flex items-center gap-3 shadow-xl shadow-teal/25 hover:shadow-teal/40 hover:bg-teal-600 transition-all duration-300"
                >
                  <Phone size={20} />
                  {t({ en: 'Book Appointment', bn: 'অ্যাপয়েন্টমেন্ট বুক করুন' })}
                </MagneticButton>
                <MagneticButton
                  to="/services"
                  className="border-2 border-navy/20 text-navy font-heading font-semibold px-8 py-4 rounded-xl text-lg inline-flex items-center gap-3 hover:border-teal hover:text-teal transition-all duration-300 bg-white/50 backdrop-blur-sm"
                >
                  {t({ en: 'View Services', bn: 'সেবাসমূহ দেখুন' })}
                  <ArrowRight size={20} />
                </MagneticButton>
              </div>

              {/* Trust row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="flex items-center gap-6 text-sm text-gray"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-teal" /> {t({ en: '10,000+ Patients', bn: '১০,০০০+ রোগী' })}
                </span>
                <span className="flex items-center gap-2">
                  <Star size={16} className="text-gold fill-gold" /> {t({ en: '4.9/5 Rating', bn: '৪.৯/৫ রেটিং' })}
                </span>
                <span className="flex items-center gap-2">
                  <Shield size={16} className="text-teal" /> {t({ en: '15+ Years', bn: '১৫+ বছর' })}
                </span>
              </motion.div>
            </div>

            {/* Right - Real Doctor Photo */}
            <div ref={heroImageRef} className="relative flex justify-center lg:justify-end opacity-0">
              <div className="relative">
                {/* Decorative ring */}
                <div className="absolute -inset-4 rounded-3xl border-2 border-dashed border-teal/20 animate-spin-slow" />

                {/* Main photo container */}
                <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-[22rem] md:h-[22rem] lg:w-[26rem] lg:h-[26rem] rounded-3xl overflow-hidden shadow-2xl shadow-navy/20 relative">
                  <img
                    src={PHOTOS.doctor}
                    alt="Dr. Arman Hossain - Dental Surgeon"
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                  />
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="font-heading font-bold text-lg">{t({ en: 'Dr. Arman Hossain', bn: 'ডা. আরমান হোসেন' })}</p>
                    <p className="text-white/80 text-sm">BDS, FCPS (OMS)</p>
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-3 -left-6 glass-badge rounded-2xl px-4 py-3 text-sm font-semibold text-navy flex items-center gap-2 shadow-lg"
                >
                  <span className="w-8 h-8 bg-teal/20 rounded-full flex items-center justify-center">
                    <CheckCircle size={16} className="text-teal" />
                  </span>
                  {t({ en: 'Verified Expert', bn: 'যাচাইকৃত বিশেষজ্ঞ' })}
                </motion.div>

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute top-1/3 -right-8 glass-badge rounded-2xl px-4 py-3 text-sm font-semibold text-navy flex items-center gap-2 shadow-lg"
                >
                  <span className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-sm">🏆</span>
                  {t({ en: '#1 in Dhaka', bn: 'ঢাকায় ১ নম্বর' })}
                </motion.div>

                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass-badge rounded-2xl px-5 py-3 text-sm font-semibold text-navy flex items-center gap-2 shadow-lg"
                >
                  <span className="w-8 h-8 bg-teal/20 rounded-full flex items-center justify-center">
                    <Shield size={16} className="text-teal" />
                  </span>
                  {t({ en: 'Painless Surgery', bn: 'ব্যথাহীন সার্জারি' })}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. STATS BAR — Animated counters
          ═══════════════════════════════════════════ */}
      <section className="bg-navy py-14 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,191,166,0.08)_0%,transparent_70%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {[
              { end: 15, suffix: '+', label: t({ en: 'Years Experience', bn: 'বছরের অভিজ্ঞতা' }), icon: Award },
              { end: 10000, suffix: '+', label: t({ en: 'Patients Treated', bn: 'রোগী চিকিৎসিত' }), icon: Users },
              { end: 49, suffix: '/5', label: t({ en: 'Patient Rating', bn: 'রোগীদের রেটিং' }), icon: Star, decimal: true },
              { end: 98, suffix: '%', label: t({ en: 'Success Rate', bn: 'সফলতার হার' }), icon: TrendingUp },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="text-center"
                >
                  <Icon className="w-8 h-8 text-teal mx-auto mb-3 opacity-70" />
                  <div className="font-heading text-4xl md:text-5xl font-bold text-white mb-1">
                    <CountUp end={stat.end} decimal={stat.decimal} />
                    <span className="text-teal">{stat.suffix}</span>
                  </div>
                  <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. SERVICES — 3D Tilt Cards
          ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-offwhite">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Specialised Services"
            titleBn="আমাদের বিশেষায়িত সেবাসমূহ"
            subtitle="Comprehensive dental care from routine check-ups to advanced surgeries."
            subtitleBn="নিয়মিত চেক-আপ থেকে উন্নত সার্জারি পর্যন্ত সম্পূর্ণ ডেন্টাল কেয়ার।"
          />

          <div ref={servicesGridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, idx) => {
              const IconComp = service.icon;
              return (
                <TiltCard key={idx} className="h-full">
                  <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 h-full flex flex-col group hover:shadow-xl hover:shadow-teal/10 transition-shadow duration-500">
                    <div className="w-14 h-14 rounded-xl bg-teal/10 flex items-center justify-center mb-5 group-hover:bg-teal group-hover:text-white text-teal transition-all duration-500">
                      <IconComp className="w-7 h-7" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-navy mb-3">
                      {t({ en: service.title, bn: service.titleBn })}
                    </h3>
                    <p className="text-gray text-sm leading-relaxed mb-5 flex-1">
                      {t({ en: service.desc, bn: service.descBn })}
                    </p>
                    <Link
                      to={service.link}
                      className="inline-flex items-center gap-1.5 text-teal font-semibold text-sm hover:gap-3 transition-all duration-300 group/link"
                    >
                      {t({ en: 'Learn More', bn: 'আরও জানুন' })}
                      <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. WHY CHOOSE US — with Tilt Cards
          ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Why Choose Us"
            titleBn="কেন আমাদের বেছে নেবেন"
            subtitle="What sets Everyday Dental Surgery apart from the rest."
            subtitleBn="যা এভরিডে ডেন্টাল সার্জারিকে অন্যদের থেকে আলাদা করে।"
          />

          <div ref={whyGridRef} className="grid md:grid-cols-3 gap-8">
            {whyChooseUs.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <TiltCard key={idx} className="h-full">
                  <div className="bg-gradient-to-br from-white to-teal-50/30 rounded-2xl p-8 shadow-sm border border-gray-100 text-center h-full hover:shadow-xl hover:shadow-teal/10 transition-shadow duration-500">
                    <div className="w-20 h-20 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-6">
                      <IconComp className="w-10 h-10 text-teal" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-navy mb-3">
                      {t({ en: item.title, bn: item.titleBn })}
                    </h3>
                    <p className="text-gray text-sm leading-relaxed">
                      {t({ en: item.desc, bn: item.descBn })}
                    </p>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. HOW IT WORKS
          ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-offwhite">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="How It Works"
            titleBn="কিভাবে কাজ করে"
            subtitle="Your journey to a perfect smile in 4 simple steps."
            subtitleBn="মাত্র ৪টি সহজ ধাপে নিখুঁত হাসির যাত্রা।"
          />

          <div ref={stepsRef} className="relative">
            <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-teal/20 via-teal to-teal/20" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 relative z-10">
              {steps.map((step, idx) => {
                const IconComp = step.icon;
                return (
                  <div key={idx} className="text-center">
                    <div className="relative inline-block mb-6">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white shadow-xl border-2 border-teal/30 flex items-center justify-center mx-auto hover:scale-110 transition-transform duration-500">
                        <IconComp className="w-10 h-10 md:w-12 md:h-12 text-teal" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-8 h-8 bg-teal text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                        {idx + 1}
                      </span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-navy mb-2">
                      {t({ en: step.title, bn: step.titleBn })}
                    </h3>
                    <p className="text-gray text-sm leading-relaxed max-w-xs mx-auto">
                      {t({ en: step.desc, bn: step.descBn })}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. TESTIMONIALS
          ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="What Our Patients Say"
            titleBn="আমাদের রোগীরা যা বলেন"
            subtitle="Real stories from real patients who trust us with their smiles."
            subtitleBn="যে রোগীরা তাদের হাসির জন্য আমাদের বিশ্বাস করেন তাদের সত্য গল্প।"
          />

          <div className="relative max-w-3xl mx-auto">
            <div className="overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 60, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -60, filter: 'blur(8px)' }}
                  transition={{ duration: 0.5 }}
                >
                  <Card hover={false} className="text-center">
                    <div className="flex justify-center gap-1 mb-4">
                      {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-gold fill-gold" />
                      ))}
                    </div>
                    <p className="text-gray text-base md:text-lg leading-relaxed mb-6 italic">
                      &ldquo;{t({ en: testimonials[currentTestimonial].text, bn: testimonials[currentTestimonial].textBn })}&rdquo;
                    </p>
                    <div>
                      <p className="font-heading font-bold text-navy text-lg">
                        {t({ en: testimonials[currentTestimonial].name, bn: testimonials[currentTestimonial].nameBn })}
                      </p>
                      <p className="text-teal text-sm font-medium">
                        {t({ en: testimonials[currentTestimonial].treatment, bn: testimonials[currentTestimonial].treatmentBn })}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center items-center gap-4 mt-6">
              <button onClick={() => goToTestimonial('prev')} className="w-10 h-10 rounded-full bg-teal/10 hover:bg-teal/20 flex items-center justify-center transition-colors">
                <ChevronLeft className="w-5 h-5 text-teal" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button key={idx} onClick={() => { setCurrentTestimonial(idx); startAutoScroll(); }}
                    className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentTestimonial ? 'bg-teal w-8' : 'bg-teal/30 w-2.5'}`}
                  />
                ))}
              </div>
              <button onClick={() => goToTestimonial('next')} className="w-10 h-10 rounded-full bg-teal/10 hover:bg-teal/20 flex items-center justify-center transition-colors">
                <ChevronRight className="w-5 h-5 text-teal" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          7. BEFORE / AFTER — Real Photos
          ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-offwhite">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="See the Difference"
            titleBn="পার্থক্য দেখুন"
            subtitle="Drag the slider to compare before and after results."
            subtitleBn="আগের এবং পরের ফলাফল তুলনা করতে স্লাইডারটি টেনে নিন।"
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div
              ref={sliderRef}
              className="relative h-72 sm:h-80 md:h-[28rem] rounded-2xl overflow-hidden cursor-col-resize select-none shadow-2xl"
              onMouseMove={(e) => handleSliderMove(e.clientX)}
              onMouseDown={() => { isDragging.current = true; }}
              onMouseUp={() => { isDragging.current = false; }}
              onTouchMove={(e) => handleSliderMove(e.touches[0].clientX)}
              onTouchStart={() => { isDragging.current = true; }}
              onTouchEnd={() => { isDragging.current = false; }}
            >
              {/* After - full background */}
              <div className="absolute inset-0">
                <img src={PHOTOS.smileAfter} alt="After dental treatment" className="w-full h-full object-cover" />
                <div className="absolute bottom-4 right-4 bg-teal/90 text-white px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm">
                  {t({ en: 'After', bn: 'পরে' })}
                </div>
              </div>

              {/* Before - clipped */}
              <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                <img src={PHOTOS.smileBefore} alt="Before dental treatment" className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 bg-navy/80 text-white px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm">
                  {t({ en: 'Before', bn: 'আগে' })}
                </div>
              </div>

              {/* Drag handle */}
              <div className="absolute top-0 bottom-0 z-20 flex items-center" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}>
                <div className="w-1 h-full bg-white/90 shadow-lg" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl border-2 border-teal flex items-center justify-center hover:scale-110 transition-transform">
                  <div className="flex gap-0.5">
                    <ChevronLeft size={16} className="text-teal" />
                    <ChevronRight size={16} className="text-teal" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          7.5 YOUTUBE PATIENT REVIEWS
          ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Patient Reviews"
            titleBn="আমাদের রোগীদের মতামত"
            subtitle="Watch real patient experiences and treatment procedures"
            subtitleBn="সত্যিকারের রোগীর অভিজ্ঞতা এবং চিকিৎসা পদ্ধতি দেখুন"
          />
          <div ref={videoGridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {youtubeVideos.map((video) => (
              <TiltCard key={video.id} intensity={8} className="bg-offwhite rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-teal/10 transition-all group">
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play size={28} className="text-white ml-1" fill="white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-navy text-sm leading-snug mb-1 line-clamp-2">
                      {t({ en: video.title, bn: video.titleBn })}
                    </h3>
                    <p className="text-gray text-xs">{video.patient}</p>
                  </div>
                </a>
              </TiltCard>
            ))}
          </div>
          <div className="text-center mt-8">
            <MagneticButton
              href="https://www.youtube.com/@example-dental"
              className="border-2 border-navy text-navy font-heading font-semibold rounded-xl px-8 py-3 text-sm hover:bg-navy hover:text-white transition-colors inline-flex items-center gap-2"
            >
              {t({ en: 'View All Videos on YouTube', bn: 'ইউটিউবে সব ভিডিও দেখুন' })}
              <ArrowRight size={18} />
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          8. CTA BANNER
          ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,191,166,0.15)_0%,transparent_60%)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div ref={ctaBannerRef} className="text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
              {t({ en: 'Ready to Transform Your Smile?', bn: 'আপনার হাসি রূপান্তর করতে প্রস্তুত?' })}
            </h2>
            <p className="text-gray-300 text-lg md:text-xl mb-10">
              {t({ en: 'Book a free consultation today. Online payment gets you 5% OFF.', bn: 'আজই একটি বিনামূল্যে পরামর্শ বুক করুন। অনলাইন পেমেন্টে ৫% ছাড়।' })}
            </p>
            <MagneticButton
              to="/appointment"
              className="bg-white text-navy font-heading font-bold px-10 py-5 rounded-xl text-lg inline-flex items-center gap-3 shadow-2xl hover:shadow-white/20 hover:bg-teal hover:text-white transition-all duration-500"
            >
              <CalendarPlus size={22} />
              {t({ en: 'Book Appointment', bn: 'অ্যাপয়েন্টমেন্ট বুক করুন' })}
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          9. NEWSLETTER
          ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-offwhite">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={newsletterRef} className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-teal/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-teal" />
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-3">
              {t({ en: 'Get Dental Health Tips', bn: 'ডেন্টাল স্বাস্থ্য টিপস পান' })}
            </h2>
            <p className="text-gray text-sm md:text-base mb-8">
              {t({ en: 'Join 2,000+ patients receiving monthly oral health tips from Dr. Arman.', bn: 'ডা. আরমানের কাছ থেকে মাসিক মৌখিক স্বাস্থ্য টিপস পাচ্ছেন ২,০০০+ রোগীদের সাথে যুক্ত হন।' })}
            </p>
            <form onSubmit={handleSubmit(onNewsletterSubmit)} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder={t({ en: 'Enter your email', bn: 'আপনার ইমেইল লিখুন' })}
                  className={`w-full px-5 py-4 rounded-xl border-2 ${errors.email ? 'border-red-400' : 'border-gray-200'} focus:border-teal focus:outline-none text-navy placeholder:text-gray/50 transition-colors`}
                  {...register('email', {
                    required: true,
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i },
                  })}
                />
              </div>
              <MagneticButton
                type="submit"
                className="bg-teal text-white font-heading font-semibold px-8 py-4 rounded-xl inline-flex items-center gap-2 hover:bg-teal-600 transition-colors shadow-lg"
              >
                <Mail size={18} />
                {t({ en: 'Subscribe', bn: 'সাবস্ক্রাইব' })}
              </MagneticButton>
            </form>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

/* ── Animated counter component ── */
const CountUp = ({ end, decimal = false }) => {
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: end,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = decimal
              ? (obj.val / 10).toFixed(1)
              : Math.floor(obj.val).toLocaleString();
          },
        });
      }
    }, { threshold: 0.5 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, decimal]);

  return <span ref={ref}>0</span>;
};

export default HomePage;
