import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Heart,
  Calendar,
  Stethoscope,
  Baby,
  Droplets,
  GraduationCap,
  Megaphone,
  HandHeart,
  ArrowRight,
  CheckCircle2,
  Quote,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageTransition from '../components/ui/PageTransition';
import SectionHeading from '../components/ui/SectionHeading';
import MagneticButton from '../components/ui/MagneticButton';
import Badge from '../components/ui/Badge';
import { useScrollReveal, useStaggerReveal } from '../hooks/useGsapAnimations';

/* ------------------------------------------------------------------ */
/*  PHOTOS                                                             */
/* ------------------------------------------------------------------ */

const HERO_IMG = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=85&fit=crop';

const PHOTOS = {
  camp:       'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=85&fit=crop',
  school:     'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&q=85&fit=crop',
  awareness:  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=85&fit=crop',
  subsidized: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=85&fit=crop',
  mentorship: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=85&fit=crop',
  blood:      'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&q=85&fit=crop',
};

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const programs = [
  {
    icon: Stethoscope,
    image: PHOTOS.camp,
    title: { en: 'Free Dental Checkup Camp', bn: 'বিনামূল্যে ডেন্টাল চেকআপ ক্যাম্প' },
    desc: {
      en: 'We organize free dental screening and checkup camps in underserved communities across Dhaka, providing oral health assessment and basic treatment advice to hundreds of patients who cannot afford regular dental care.',
      bn: 'আমরা ঢাকার সুবিধাবঞ্চিত সম্প্রদায়ে বিনামূল্যে ডেন্টাল স্ক্রিনিং ও চেকআপ ক্যাম্প আয়োজন করি, যেখানে শত শত রোগী যারা নিয়মিত ডেন্টাল কেয়ার বহন করতে পারেন না তাদের মৌখিক স্বাস্থ্য মূল্যায়ন ও মৌলিক চিকিৎসা পরামর্শ প্রদান করা হয়।',
    },
    stats: { en: '500+ patients served', bn: '৫০০+ রোগী সেবা পেয়েছেন' },
    color: 'bg-teal/10 text-teal',
    accent: 'border-teal',
  },
  {
    icon: Baby,
    image: PHOTOS.school,
    title: { en: 'School Oral Health Program', bn: 'স্কুল মৌখিক স্বাস্থ্য কর্মসূচি' },
    desc: {
      en: 'Our team visits local schools to teach children proper brushing techniques, the importance of oral hygiene, and provides free fluoride treatment. Building healthy habits from childhood is the key to lifelong dental health.',
      bn: 'আমাদের দল স্থানীয় স্কুলগুলোতে গিয়ে শিশুদের সঠিক ব্রাশিং কৌশল, মৌখিক স্বাস্থ্যবিধির গুরুত্ব শেখায় এবং বিনামূল্যে ফ্লোরাইড ট্রিটমেন্ট প্রদান করে। শৈশব থেকে স্বাস্থ্যকর অভ্যাস গড়ে তোলাই আজীবন ডেন্টাল স্বাস্থ্যের চাবিকাঠি।',
    },
    stats: { en: '10+ schools reached', bn: '১০+ স্কুলে পৌঁছানো হয়েছে' },
    color: 'bg-gold/10 text-gold',
    accent: 'border-gold',
  },
  {
    icon: Megaphone,
    image: PHOTOS.awareness,
    title: { en: 'Oral Cancer Awareness Drive', bn: 'মুখের ক্যান্সার সচেতনতা অভিযান' },
    desc: {
      en: 'Regular awareness campaigns on oral cancer prevention, early detection signs, and the dangers of tobacco and betel nut. Early screening saves lives — we provide free oral cancer screening at our camps.',
      bn: 'মুখের ক্যান্সার প্রতিরোধ, প্রাথমিক সনাক্তকরণ চিহ্ন এবং তামাক ও সুপারির বিপদ সম্পর্কে নিয়মিত সচেতনতা অভিযান। প্রাথমিক স্ক্রিনিং জীবন বাঁচায় — আমরা আমাদের ক্যাম্পে বিনামূল্যে মুখের ক্যান্সার স্ক্রিনিং প্রদান করি।',
    },
    stats: { en: '1,000+ people educated', bn: '১,০০০+ মানুষকে শিক্ষিত করা হয়েছে' },
    color: 'bg-red-500/10 text-red-500',
    accent: 'border-red-400',
  },
  {
    icon: HandHeart,
    image: PHOTOS.subsidized,
    title: { en: 'Subsidized Treatment for Low-Income Patients', bn: 'স্বল্প আয়ের রোগীদের জন্য ভর্তুকি চিকিৎসা' },
    desc: {
      en: 'We believe quality dental care should be accessible to everyone. Our subsidized treatment program offers significantly reduced fees for patients who demonstrate financial need, ensuring no one suffers due to inability to pay.',
      bn: 'আমরা বিশ্বাস করি মানসম্পন্ন ডেন্টাল কেয়ার সবার জন্য সুলভ হওয়া উচিত। আমাদের ভর্তুকি চিকিৎসা কর্মসূচি আর্থিক প্রয়োজন প্রদর্শনকারী রোগীদের জন্য উল্লেখযোগ্যভাবে হ্রাসকৃত ফি প্রদান করে।',
    },
    stats: { en: '200+ patients helped', bn: '২০০+ রোগীকে সাহায্য করা হয়েছে' },
    color: 'bg-purple-500/10 text-purple-500',
    accent: 'border-purple-400',
  },
  {
    icon: GraduationCap,
    image: PHOTOS.mentorship,
    title: { en: 'Dental Intern Mentorship', bn: 'ডেন্টাল ইন্টার্ন মেন্টরশিপ' },
    desc: {
      en: 'Dr. Rafi mentors dental interns and fresh graduates, sharing clinical expertise in implantology, endodontics, and oral surgery. Building the next generation of skilled dentists in Bangladesh is part of our mission.',
      bn: 'ডা. রফি ডেন্টাল ইন্টার্ন এবং সদ্য স্নাতকদের মেন্টরিং করেন, ইমপ্লান্টোলজি, এন্ডোডন্টিক্স এবং ওরাল সার্জারিতে ক্লিনিক্যাল দক্ষতা শেয়ার করেন।',
    },
    stats: { en: '15+ interns mentored', bn: '১৫+ ইন্টার্নকে মেন্টরিং করা হয়েছে' },
    color: 'bg-blue-500/10 text-blue-500',
    accent: 'border-blue-400',
  },
  {
    icon: Droplets,
    image: PHOTOS.blood,
    title: { en: 'Blood Donation Drive', bn: 'রক্তদান কর্মসূচি' },
    desc: {
      en: 'As part of our commitment to community health beyond dentistry, we organize annual blood donation drives in partnership with local hospitals and blood banks, encouraging our staff and patients to contribute.',
      bn: 'দন্তচিকিৎসার বাইরে সম্প্রদায় স্বাস্থ্যের প্রতি আমাদের প্রতিশ্রুতির অংশ হিসাবে, আমরা স্থানীয় হাসপাতাল ও ব্লাড ব্যাংকের সাথে অংশীদারিত্বে বার্ষিক রক্তদান কর্মসূচি আয়োজন করি।',
    },
    stats: { en: '100+ units collected', bn: '১০০+ ইউনিট সংগৃহীত' },
    color: 'bg-rose-500/10 text-rose-500',
    accent: 'border-rose-400',
  },
];

const impactStats = [
  { number: '500+', label: { en: 'Free Checkups Given', bn: 'বিনামূল্যে চেকআপ প্রদান' } },
  { number: '10+', label: { en: 'Schools Visited', bn: 'স্কুল পরিদর্শন' } },
  { number: '1,000+', label: { en: 'People Educated', bn: 'মানুষ শিক্ষিত' } },
  { number: '15+', label: { en: 'Interns Mentored', bn: 'ইন্টার্ন মেন্টরিং' } },
];

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600&q=85&fit=crop', caption: { en: 'Free checkup camp at Kamrangirchar', bn: 'কামরাঙ্গীরচরে বিনামূল্যে চেকআপ ক্যাম্প' } },
  { src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=85&fit=crop', caption: { en: 'Teaching children proper brushing', bn: 'শিশুদের সঠিক ব্রাশিং শেখানো' } },
  { src: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&q=85&fit=crop', caption: { en: 'Dental screening in progress', bn: 'ডেন্টাল স্ক্রিনিং চলছে' } },
  { src: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=85&fit=crop', caption: { en: 'Community awareness event', bn: 'সম্প্রদায় সচেতনতা ইভেন্ট' } },
  { src: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=85&fit=crop', caption: { en: 'Dr. Rafi mentoring interns', bn: 'ডা. রফি ইন্টার্নদের মেন্টরিং করছেন' } },
  { src: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&q=85&fit=crop', caption: { en: 'Blood donation drive', bn: 'রক্তদান কর্মসূচি' } },
];

const upcomingEvents = [
  {
    title: { en: 'Free Dental Camp — Kamrangirchar', bn: 'বিনামূল্যে ডেন্টাল ক্যাম্প — কামরাঙ্গীরচর' },
    date: { en: 'April 2026', bn: 'এপ্রিল ২০২৬' },
    desc: {
      en: 'Free dental screening, basic treatment, and oral hygiene kits for 200+ residents.',
      bn: '২০০+ বাসিন্দার জন্য বিনামূল্যে ডেন্টাল স্ক্রিনিং, মৌলিক চিকিৎসা এবং ওরাল হাইজিন কিট।',
    },
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&q=85&fit=crop',
  },
  {
    title: { en: 'World Oral Health Day Celebration', bn: 'বিশ্ব মৌখিক স্বাস্থ্য দিবস উদযাপন' },
    date: { en: 'March 2027', bn: 'মার্চ ২০২৭' },
    desc: {
      en: 'School visits, awareness rally, and free oral cancer screening across 5 locations in Dhaka.',
      bn: 'স্কুল পরিদর্শন, সচেতনতা র‍্যালি এবং ঢাকার ৫টি স্থানে বিনামূল্যে মুখের ক্যান্সার স্ক্রিনিং।',
    },
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=85&fit=crop',
  },
];

/* ------------------------------------------------------------------ */
/*  ANIMATION                                                          */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' },
  }),
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

const CommunityPage = () => {
  const { t } = useLanguage();
  const heroRef = useScrollReveal({ y: 40, duration: 0.8 });
  const statsRef = useStaggerReveal({ stagger: 0.1, y: 40 });
  const galleryRef = useStaggerReveal({ stagger: 0.08, y: 40 });
  const ctaRef = useScrollReveal({ y: 50 });

  const [lightbox, setLightbox] = useState(null);

  return (
    <PageTransition>
      <Helmet>
        <title>{t({ en: 'Community & Social Responsibility | Everyday Dental Surgery', bn: 'সম্প্রদায় ও সামাজিক দায়বদ্ধতা | এভরিডে ডেন্টাল সার্জারি' })}</title>
        <meta
          name="description"
          content={t({
            en: 'Everyday Dental Surgery gives back through free dental camps, school programs, oral cancer awareness, and subsidized care for low-income patients in Dhaka.',
            bn: 'এভরিডে ডেন্টাল সার্জারি বিনামূল্যে ডেন্টাল ক্যাম্প, স্কুল কর্মসূচি, মুখের ক্যান্সার সচেতনতা এবং ঢাকায় স্বল্প আয়ের রোগীদের জন্য ভর্তুকি সেবার মাধ্যমে সম্প্রদায়কে ফিরিয়ে দেয়।',
          })}
        />
      </Helmet>

      {/* ── Hero with full-width photo ── */}
      <section className="relative overflow-hidden min-h-[60vh] md:min-h-[70vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Community dental camp"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/40" />
        </div>

        <div ref={heroRef} className="container mx-auto px-4 relative z-10 py-32 md:py-40">
          <div className="max-w-2xl">
            <Badge variant="white" className="mb-6">
              <Heart size={16} />
              {t({ en: 'Giving Back', bn: 'প্রতিদান' })}
            </Badge>
            <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {t({ en: 'Community & Social Responsibility', bn: 'সম্প্রদায় ও সামাজিক দায়বদ্ধতা' })}
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-xl">
              {t({
                en: 'Beyond clinical excellence, we are committed to improving oral health across Bangladesh through free camps, education, and community programs.',
                bn: 'ক্লিনিক্যাল শ্রেষ্ঠত্বের বাইরে, আমরা বিনামূল্যে ক্যাম্প, শিক্ষা এবং সম্প্রদায় কর্মসূচির মাধ্যমে সমগ্র বাংলাদেশে মৌখিক স্বাস্থ্যের উন্নতিতে প্রতিশ্রুতিবদ্ধ।',
              })}
            </p>
          </div>
        </div>
      </section>

      {/* ── Impact Stats with bg image ── */}
      <section className="relative py-16 md:py-20 bg-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=1400&q=50&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {impactStats.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <div className="text-3xl md:text-5xl font-heading font-bold text-teal mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm md:text-base">{t(stat.label)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programs — alternating image+text rows ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Our Programs"
            titleBn="আমাদের কর্মসূচি"
            subtitle="How we serve the community beyond our clinic"
            subtitleBn="কিভাবে আমরা ক্লিনিকের বাইরে সম্প্রদায়কে সেবা করি"
          />

          <div className="max-w-6xl mx-auto space-y-16 md:space-y-24">
            {programs.map((program, i) => {
              const Icon = program.icon;
              const isReversed = i % 2 !== 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-12 items-center`}
                >
                  {/* Image */}
                  <div className="w-full md:w-1/2">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                      <img
                        src={program.image}
                        alt={program.title.en}
                        className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
                      <div className={`absolute bottom-0 left-0 right-0 h-1 ${program.accent}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full md:w-1/2">
                    <div className={`w-14 h-14 rounded-xl ${program.color} flex items-center justify-center mb-4`}>
                      <Icon size={28} />
                    </div>
                    <h3 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
                      {t(program.title)}
                    </h3>
                    <p className="text-gray leading-relaxed mb-5">
                      {t(program.desc)}
                    </p>
                    <div className="flex items-center gap-2 text-teal font-semibold">
                      <CheckCircle2 size={20} />
                      {t(program.stats)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Photo Gallery ── */}
      <section className="py-16 md:py-24 bg-offwhite">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Moments from the Field"
            titleBn="মাঠ থেকে মুহূর্ত"
            subtitle="Snapshots of our community work in action"
            subtitleBn="আমাদের সম্প্রদায় কাজের স্ন্যাপশট"
          />

          <div ref={galleryRef} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6 }}
                onClick={() => setLightbox(i)}
                className="relative rounded-xl overflow-hidden shadow-md cursor-pointer group aspect-[4/3]"
              >
                <img
                  src={img.src}
                  alt={img.caption.en}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-sm font-medium">{t(img.caption)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-navy/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryImages[lightbox].src.replace('w=600', 'w=1200')}
                alt={galleryImages[lightbox].caption.en}
                className="w-full rounded-2xl shadow-2xl max-h-[80vh] object-contain bg-black"
              />
              <p className="text-white text-center mt-4 font-heading font-medium">
                {t(galleryImages[lightbox].caption)}
              </p>

              {/* Close */}
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-navy" />
              </button>

              {/* Prev / Next */}
              {lightbox > 0 && (
                <button
                  onClick={() => setLightbox(lightbox - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
                >
                  <ChevronLeft size={24} className="text-white" />
                </button>
              )}
              {lightbox < galleryImages.length - 1 && (
                <button
                  onClick={() => setLightbox(lightbox + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
                >
                  <ChevronRight size={24} className="text-white" />
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Dr. Rafi Quote ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 bg-offwhite rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="w-full md:w-2/5 h-64 md:h-auto md:min-h-[320px]">
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=85&fit=crop&crop=face"
                alt="Dr. Arman Hossain"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 md:p-10 flex-1 relative">
              <Quote size={48} className="absolute top-4 right-4 text-teal/10" />
              <p className="font-heading text-lg md:text-xl text-navy leading-relaxed mb-4">
                {t({
                  en: '"A healthy smile should never be a privilege. As dentists, we have a responsibility to reach those who need us most — in schools, in underserved communities, and in every corner of our city."',
                  bn: '"একটি সুস্থ হাসি কখনো বিশেষ সুবিধা হওয়া উচিত নয়। দন্ত চিকিৎসক হিসেবে, আমাদের দায়িত্ব যারা আমাদের সবচেয়ে বেশি প্রয়োজন তাদের কাছে পৌঁছানো — স্কুলে, সুবিধাবঞ্চিত সম্প্রদায়ে এবং আমাদের শহরের প্রতিটি কোণায়।"',
                })}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center text-white font-heading font-bold text-sm">
                  DS
                </div>
                <div>
                  <p className="text-navy font-heading font-bold text-sm">
                    {t({ en: 'Dr. Arman Hossain (Rafi)', bn: 'ডা. আরমান হোসেন (রফি)' })}
                  </p>
                  <p className="text-gray text-xs">{t({ en: 'Founder, Everyday Dental Surgery', bn: 'প্রতিষ্ঠাতা, এভরিডে ডেন্টাল সার্জারি' })}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Upcoming Events with images ── */}
      <section className="py-16 md:py-24 bg-offwhite">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Upcoming Events"
            titleBn="আসন্ন ইভেন্ট"
            subtitle="Join us in making a difference"
            subtitleBn="পরিবর্তন আনতে আমাদের সাথে যোগ দিন"
          />

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-shadow group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title.en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-teal text-white font-heading font-bold text-sm px-4 py-1.5 rounded-full shadow">
                    {t(event.date)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-bold text-navy mb-2">{t(event.title)}</h3>
                  <p className="text-gray text-sm leading-relaxed">{t(event.desc)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-teal to-teal-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div ref={ctaRef}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              {t({ en: 'Want to Support Our Mission?', bn: 'আমাদের মিশন সমর্থন করতে চান?' })}
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              {t({
                en: 'Whether you want to volunteer at a camp, sponsor a patient, or partner with us — we welcome your support.',
                bn: 'আপনি ক্যাম্পে স্বেচ্ছাসেবক হতে চান, একজন রোগীর স্পনসর করতে চান, বা আমাদের সাথে অংশীদার হতে চান — আমরা আপনার সমর্থনকে স্বাগত জানাই।',
              })}
            </p>
            <MagneticButton
              to="/contact"
              className="bg-white text-teal font-heading font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
            >
              {t({ en: 'Get in Touch', bn: 'যোগাযোগ করুন' })}
              <ArrowRight size={20} />
            </MagneticButton>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default CommunityPage;
