import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  GraduationCap,
  Award,
  Stethoscope,
  BookOpen,
  Globe,
  BarChart3,
  Eye,
  Target,
  Heart,
  CalendarDays,
  Quote,
  ArrowRight,
  ShieldCheck,
  Microscope,
  Gem,
  Brain,
  Sigma,
  Layers,
  Palette,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import PageTransition from '../components/ui/PageTransition';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import TiltCard from '../components/ui/TiltCard';
import MagneticButton from '../components/ui/MagneticButton';
import { useScrollReveal, useStaggerReveal } from '../hooks/useGsapAnimations';

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const credentials = [
  {
    icon: GraduationCap,
    label: { en: 'BDS — National Dental College', bn: 'BDS — ন্যাশনাল ডেন্টাল কলেজ' },
  },
  {
    icon: Award,
    label: {
      en: 'FCPS (Oral & Maxillofacial Surgery) — BCPS Bangladesh',
      bn: 'FCPS (ওরাল ও ম্যাক্সিলোফেসিয়াল সার্জারি) — BCPS বাংলাদেশ',
    },
  },
  {
    icon: Stethoscope,
    label: { en: 'D-Prostho — Prosthodontics Specialization', bn: 'D-Prostho — প্রোস্থোডন্টিক্স বিশেষায়ন' },
  },
  {
    icon: BookOpen,
    label: { en: 'MPH — Master of Public Health', bn: 'MPH — মাস্টার অব পাবলিক হেলথ' },
  },
  {
    icon: Globe,
    label: { en: 'UCLA gIDE — Implant Dentistry Master Program', bn: 'UCLA gIDE — ইমপ্লান্ট ডেন্টিস্ট্রি মাস্টার প্রোগ্রাম' },
  },
  {
    icon: BarChart3,
    label: { en: 'Six Sigma Black Belt — Clinical Management', bn: 'সিক্স সিগমা ব্ল্যাক বেল্ট — ক্লিনিক্যাল ম্যানেজমেন্ট' },
  },
];

const timeline = [
  { year: '2009', en: 'Started dental practice in Dhaka', bn: 'ঢাকায় দন্ত চিকিৎসা শুরু' },
  { year: '2012', en: 'Completed BDS from National Dental College', bn: 'ন্যাশনাল ডেন্টাল কলেজ থেকে BDS সম্পন্ন' },
  { year: '2015', en: 'FCPS in Oral & Maxillofacial Surgery', bn: 'ওরাল ও ম্যাক্সিলোফেসিয়াল সার্জারিতে FCPS' },
  { year: '2017', en: 'Founded Everyday Dental Surgery', bn: 'এভরিডে ডেন্টাল সার্জারি প্রতিষ্ঠা' },
  { year: '2019', en: 'UCLA gIDE Implant Dentistry certification', bn: 'UCLA gIDE ইমপ্লান্ট ডেন্টিস্ট্রি সার্টিফিকেশন' },
  { year: '2021', en: '5,000+ successful surgeries milestone', bn: '৫,০০০+ সফল সার্জারির মাইলফলক' },
  { year: '2023', en: 'Introduced 3D CBCT & Laser Surgery', bn: '3D CBCT এবং লেজার সার্জারি চালু' },
  { year: '2026', en: '10,000+ patients treated, continuing excellence', bn: '১০,০০০+ রোগী চিকিৎসা, শ্রেষ্ঠত্ব অব্যাহত' },
];

const certifications = [
  { label: 'UCLA gIDE', icon: Globe },
  { label: 'OSSTEM Certified', icon: ShieldCheck },
  { label: 'FCPS', icon: Award },
  { label: 'MFDS', icon: Microscope },
  { label: 'Six Sigma Black Belt', icon: Sigma },
  { label: 'Piezo Surgery', icon: Layers },
  { label: 'Veneer Masterclass', icon: Palette },
  { label: 'Biostatistics Research', icon: TrendingUp },
];

const missionVisionValues = [
  {
    icon: Eye,
    heading: { en: 'Vision', bn: 'দৃষ্টিভঙ্গি' },
    text: {
      en: 'To redefine dental care in Bangladesh with world-class standards',
      bn: 'বিশ্বমানের মান দিয়ে বাংলাদেশে দন্ত চিকিৎসা পুনরায় সংজ্ঞায়িত করা',
    },
  },
  {
    icon: Target,
    heading: { en: 'Mission', bn: 'লক্ষ্য' },
    text: {
      en: 'Compassionate, patient-first care using cutting-edge technology',
      bn: 'অত্যাধুনিক প্রযুক্তি ব্যবহার করে সহানুভূতিশীল, রোগী-প্রথম যত্ন',
    },
  },
  {
    icon: Heart,
    heading: { en: 'Values', bn: 'মূল্যবোধ' },
    text: {
      en: 'Honesty, Innovation, Compassion — in every interaction',
      bn: 'সততা, উদ্ভাবন, সহানুভূতি — প্রতিটি মিথষ্ক্রিয়ায়',
    },
  },
];

const certificateImages = [
  { src: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&q=85&fit=crop', alt: 'Certificate 1' },
  { src: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&q=85&fit=crop', alt: 'Certificate 2' },
  { src: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&q=85&fit=crop', alt: 'Certificate 3' },
  { src: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&q=85&fit=crop', alt: 'Certificate 4' },
  { src: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&q=85&fit=crop', alt: 'Certificate 5' },
  { src: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&q=85&fit=crop', alt: 'Certificate 6' },
  { src: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&q=85&fit=crop', alt: 'Certificate 7' },
  { src: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&q=85&fit=crop', alt: 'Certificate 8' },
  { src: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&q=85&fit=crop', alt: 'Certificate 9' },
  { src: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&q=85&fit=crop', alt: 'Certificate 10' },
  { src: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&q=85&fit=crop', alt: 'Certificate 11' },
  { src: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&q=85&fit=crop', alt: 'Certificate 12' },
];

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
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

const DOCTOR_PHOTO = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=85&fit=crop&crop=face';
const CLINIC_PHOTO = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=85&fit=crop';

const AboutPage = () => {
  const { t, language } = useLanguage();
  const heroRef = useScrollReveal({ y: 40, duration: 0.8 });
  const credentialsRef = useStaggerReveal({ stagger: 0.08, y: 40 });
  const certsRef = useStaggerReveal({ stagger: 0.08, y: 40 });
  const certImagesRef = useStaggerReveal({ stagger: 0.06, y: 40 });
  const missionRef = useStaggerReveal({ stagger: 0.15, y: 50 });
  const ctaRef = useScrollReveal({ y: 50 });

  return (
    <PageTransition>
      <Helmet>
        <title>About Dr. Arman Hossain | Everyday Dental Surgery</title>
        <meta
          name="description"
          content="Meet Dr. Arman Hossain (Rafi) — Senior Dental Surgeon with FCPS, UCLA gIDE certification, and 10,000+ patients treated. Learn about his vision for world-class dental care in Bangladesh."
        />
        <meta property="og:title" content="About Dr. Arman Hossain | Everyday Dental Surgery" />
        <meta
          property="og:description"
          content="Senior Dental Surgeon specializing in Oral & Maxillofacial Surgery, Implant Dentistry, and Painless Procedures."
        />
        <link rel="canonical" href="https://example-dental.com/about" />
      </Helmet>

      {/* ============================== HERO ============================== */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=80&fit=crop"
          alt="About Dr. Arman Hossain"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/80 to-navy/60" />

        <div className="container mx-auto px-4 relative z-10 py-28 md:py-36">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center"
          >
            {/* doctor photo */}
            <motion.div variants={fadeUp} custom={0} className="mb-8">
              <div className="w-44 h-44 md:w-56 md:h-56 rounded-full ring-4 ring-teal ring-offset-4 ring-offset-navy overflow-hidden">
                <img
                  src={DOCTOR_PHOTO}
                  alt="Dr. Arman Hossain"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* name */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3"
            >
              {t({
                en: 'Dr. Arman Hossain (Rafi)',
                bn: 'ডা. আরমান হোসেন (রফি)',
              })}
            </motion.h1>

            {/* badge */}
            <motion.div variants={fadeUp} custom={2} className="mb-8">
              <Badge variant="gold">SENIOR DENTAL SURGEON</Badge>
            </motion.div>

            {/* credentials */}
            <ul
              ref={credentialsRef}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl w-full"
            >
              {credentials.map((cred, i) => {
                const Icon = cred.icon;
                return (
                  <li
                    key={i}
                    className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-left"
                  >
                    <Icon size={20} className="text-teal shrink-0" />
                    <span className="text-sm md:text-base text-gray-200">{t(cred.label)}</span>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ======================== PHILOSOPHY QUOTE ======================== */}
      <section className="py-16 md:py-24 bg-offwhite">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border-l-4 border-gold p-8 md:p-12 relative"
          >
            <Quote size={48} className="absolute top-6 right-6 text-gold/20" />
            <p className="font-heading text-lg md:text-xl text-navy leading-relaxed mb-4">
              {t({
                en: '"Rooted in a Patient-First philosophy, I am committed to pioneering painless surgery. Every patient deserves dignity, comfort, and world-class care."',
                bn: '"রোগী-প্রথম দর্শনে প্রোথিত, আমি ব্যথাহীন সার্জারির পথিকৃৎ হতে প্রতিশ্রুতিবদ্ধ। প্রতিটি রোগী মর্যাদা, আরাম এবং বিশ্বমানের যত্ন পাওয়ার যোগ্য।"',
              })}
            </p>
            <p className="text-gray text-sm font-medium">
              — {t({ en: 'Dr. Arman Hossain (Rafi)', bn: 'ডা. আরমান হোসেন (রফি)' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ======================== CAREER TIMELINE ======================== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Career Timeline"
            titleBn="ক্যারিয়ার টাইমলাইন"
            subtitle="A journey of dedication, learning, and excellence"
            subtitleBn="নিষ্ঠা, শিক্ষা এবং শ্রেষ্ঠত্বের যাত্রা"
          />

          <div className="relative max-w-4xl mx-auto">
            {/* vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-teal/20 -translate-x-1/2 hidden md:block" />
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-teal/20 md:hidden" />

            {timeline.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={`relative flex items-center mb-10 md:mb-12 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-row`}
                >
                  {/* dot */}
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-teal border-4 border-white shadow -translate-x-1/2 z-10" />

                  {/* spacer for mobile */}
                  <div className="w-14 shrink-0 md:hidden" />

                  {/* card */}
                  <div
                    className={`flex-1 md:w-[calc(50%-2rem)] ${
                      isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
                    }`}
                  >
                    <div className="bg-offwhite rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <span className="inline-block bg-teal/10 text-teal font-heading font-bold text-sm px-3 py-1 rounded-full mb-2">
                        {item.year}
                      </span>
                      <p className="text-navy font-medium">{t({ en: item.en, bn: item.bn })}</p>
                    </div>
                  </div>

                  {/* invisible spacer for the other side on md+ */}
                  <div className="hidden md:block flex-1 md:w-[calc(50%-2rem)]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== CREDENTIALS GRID ========================= */}
      <section className="py-16 md:py-24 bg-offwhite">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Certifications & Credentials"
            titleBn="সার্টিফিকেশন ও প্রমাণপত্র"
            subtitle="Internationally recognized qualifications"
            subtitleBn="আন্তর্জাতিকভাবে স্বীকৃত যোগ্যতা"
          />

          <div
            ref={certsRef}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto"
          >
            {certifications.map((cert) => {
              const Icon = cert.icon;
              return (
                <TiltCard
                  key={cert.label}
                  intensity={12}
                  className="bg-white rounded-2xl p-5 md:p-6 flex flex-col items-center text-center shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal/30 transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-teal/10 flex items-center justify-center mb-3">
                    <Icon size={28} className="text-teal" />
                  </div>
                  <span className="font-heading font-semibold text-navy text-sm md:text-base">
                    {cert.label}
                  </span>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================== MISSION / VISION / VALUES =================== */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Mission, Vision & Values"
            titleBn="লক্ষ্য, দৃষ্টিভঙ্গি ও মূল্যবোধ"
          />

          <div ref={missionRef} className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {missionVisionValues.map((item, i) => {
              const Icon = item.icon;
              return (
                <TiltCard
                  key={i}
                  intensity={10}
                  className="bg-offwhite rounded-2xl p-6 md:p-8 text-center border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-teal/10 transition-shadow"
                >
                  <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-5">
                    <Icon size={32} className="text-teal" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-navy mb-3">
                    {t(item.heading)}
                  </h3>
                  <p className="text-gray leading-relaxed">{t(item.text)}</p>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================== CERTIFICATE GALLERY =================== */}
      <section className="py-16 md:py-24 bg-offwhite">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Certificates & Diplomas"
            titleBn="সার্টিফিকেট ও ডিপ্লোমা"
            subtitle="Internationally recognized qualifications and training"
            subtitleBn="আন্তর্জাতিকভাবে স্বীকৃত যোগ্যতা ও প্রশিক্ষণ"
          />
          <div
            ref={certImagesRef}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto"
          >
            {certificateImages.map((cert, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className="relative rounded-xl overflow-hidden shadow-md border border-gray-200 bg-white cursor-pointer group"
              >
                <img
                  src={cert.src}
                  alt={cert.alt}
                  className="w-full h-48 md:h-56 object-cover group-hover:brightness-110 transition-all duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="text-white text-xs font-semibold">{cert.alt}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== CTA ============================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-teal to-teal-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div ref={ctaRef}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              {t({
                en: 'Ready to meet the doctor?',
                bn: 'ডাক্তারের সাথে দেখা করতে প্রস্তুত?',
              })}
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              {t({
                en: 'Book your appointment today and experience world-class dental care.',
                bn: 'আজই আপনার অ্যাপয়েন্টমেন্ট বুক করুন এবং বিশ্বমানের দন্ত চিকিৎসা অনুভব করুন।',
              })}
            </p>
            <MagneticButton to="/appointment" className="bg-white text-teal font-heading font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2">
              {t({ en: 'Book Appointment', bn: 'অ্যাপয়েন্টমেন্ট বুক করুন' })}
              <ArrowRight size={20} />
            </MagneticButton>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default AboutPage;
