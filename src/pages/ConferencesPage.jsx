import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Globe,
  Award,
  BookOpen,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  GraduationCap,
  Presentation,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import PageTransition from '../components/ui/PageTransition';
import SectionHeading from '../components/ui/SectionHeading';
import TiltCard from '../components/ui/TiltCard';
import MagneticButton from '../components/ui/MagneticButton';
import Badge from '../components/ui/Badge';
import { useScrollReveal, useStaggerReveal } from '../hooks/useGsapAnimations';
import { conferences, continuingEducation } from '../data/conferences';

/* ------------------------------------------------------------------ */
/*  BADGE COLORS                                                       */
/* ------------------------------------------------------------------ */

const badgeColors = {
  Implantology: 'bg-teal/10 text-teal',
  'Digital Dentistry': 'bg-blue-500/10 text-blue-500',
  Speaker: 'bg-gold/10 text-gold',
  Surgery: 'bg-red-500/10 text-red-500',
  'UCLA Certified': 'bg-purple-500/10 text-purple-500',
  Aesthetics: 'bg-pink-500/10 text-pink-500',
  Management: 'bg-orange-500/10 text-orange-500',
};

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

const ConferencesPage = () => {
  const { t } = useLanguage();
  const heroRef = useScrollReveal({ y: 40, duration: 0.8 });
  const ceRef = useStaggerReveal({ stagger: 0.08, y: 40 });
  const ctaRef = useScrollReveal({ y: 50 });

  return (
    <PageTransition>
      <Helmet>
        <title>{t({ en: 'Conferences & Training | Dr. Arman Hossain | Everyday Dental Surgery', bn: 'সম্মেলন ও প্রশিক্ষণ | ডা. আরমান হোসেন | এভরিডে ডেন্টাল সার্জারি' })}</title>
        <meta
          name="description"
          content={t({
            en: 'Dr. Arman Hossain (Rafi) — conferences, international training, and continuing education in implant dentistry, oral surgery, and digital dentistry. UCLA gIDE certified.',
            bn: 'ডা. আরমান হোসেন (রফি) — ইমপ্লান্ট ডেন্টিস্ট্রি, ওরাল সার্জারি এবং ডিজিটাল ডেন্টিস্ট্রিতে সম্মেলন, আন্তর্জাতিক প্রশিক্ষণ এবং অবিরত শিক্ষা।',
          })}
        />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80&fit=crop"
          alt="Medical conference"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/75 to-navy/50" />

        <div ref={heroRef} className="container mx-auto px-4 relative z-10 text-center py-28 md:py-36">
          <Badge variant="gold" className="mb-6">
            <Presentation size={16} />
            {t({ en: 'Continuing Education', bn: 'অবিরত শিক্ষা' })}
          </Badge>
          <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {t({ en: 'Conferences & Training', bn: 'সম্মেলন ও প্রশিক্ষণ' })}
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
            {t({
              en: 'Dr. Rafi stays at the forefront of dentistry through international conferences, hands-on workshops, and continuous professional development across the globe.',
              bn: 'ডা. রফি আন্তর্জাতিক সম্মেলন, হ্যান্ডস-অন ওয়ার্কশপ এবং বিশ্বব্যাপী অবিরত পেশাদার উন্নয়নের মাধ্যমে দন্তচিকিৎসার সর্বাগ্রে থাকেন।',
            })}
          </p>
        </div>
      </section>

      {/* ── Conference Timeline ── */}
      <section className="py-16 md:py-24 bg-offwhite">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Conference & Workshop History"
            titleBn="সম্মেলন ও ওয়ার্কশপের ইতিহাস"
            subtitle="International exposure across USA, Japan, Thailand, Singapore, India & Bangladesh"
            subtitleBn="যুক্তরাষ্ট্র, জাপান, থাইল্যান্ড, সিঙ্গাপুর, ভারত ও বাংলাদেশে আন্তর্জাতিক অভিজ্ঞতা"
          />

          <div className="relative max-w-4xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-teal/20 md:-translate-x-1/2" />

            {conferences.map((conf, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={`relative flex items-start mb-10 md:mb-14 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-row`}
                >
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-teal border-4 border-offwhite shadow -translate-x-1/2 z-10 mt-6" />

                  {/* Spacer mobile */}
                  <div className="w-14 shrink-0 md:hidden" />

                  {/* Card */}
                  <div className={`flex-1 md:w-[calc(50%-2rem)] ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal/20 transition-all">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="inline-block bg-teal/10 text-teal font-heading font-bold text-sm px-3 py-1 rounded-full">
                          {conf.year}
                        </span>
                        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${badgeColors[conf.badge] || 'bg-gray-100 text-gray-600'}`}>
                          {conf.badge}
                        </span>
                      </div>
                      <h3 className="font-heading text-lg font-bold text-navy mb-1">{t(conf.title)}</h3>
                      <p className="text-teal text-xs font-semibold mb-3">{t(conf.type)}</p>
                      <p className="text-gray text-sm leading-relaxed">{t(conf.desc)}</p>
                    </div>
                  </div>

                  {/* Spacer desktop */}
                  <div className="hidden md:block flex-1 md:w-[calc(50%-2rem)]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Continuing Education Hours ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Continuing Education"
            titleBn="অবিরত শিক্ষা"
            subtitle="500+ hours of specialized training across key disciplines"
            subtitleBn="মূল বিষয়গুলোতে ৫০০+ ঘণ্টার বিশেষায়িত প্রশিক্ষণ"
          />

          <div ref={ceRef} className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 max-w-5xl mx-auto">
            {continuingEducation.map((ce, i) => (
              <TiltCard
                key={i}
                intensity={10}
                className="bg-offwhite rounded-2xl p-5 md:p-6 text-center border border-gray-100 shadow-sm hover:shadow-lg hover:border-teal/20 transition-all"
              >
                <div className="text-2xl md:text-3xl font-heading font-bold text-teal mb-1">
                  {ce.hours}
                </div>
                <div className="text-xs text-gray mb-2">{t({ en: 'hours', bn: 'ঘণ্টা' })}</div>
                <h4 className="font-heading font-semibold text-navy text-sm mb-1">{t(ce.title)}</h4>
                <p className="text-gray text-xs">{ce.provider}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-16 md:py-24 text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=80&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-teal/85" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div ref={ctaRef}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              {t({ en: 'Experience World-Class Expertise', bn: 'বিশ্বমানের দক্ষতা অনুভব করুন' })}
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              {t({
                en: 'With training from UCLA, OSSTEM, and top global institutions, Dr. Rafi brings international standards to every procedure.',
                bn: 'UCLA, OSSTEM এবং শীর্ষ বৈশ্বিক প্রতিষ্ঠান থেকে প্রশিক্ষণ নিয়ে, ডা. রফি প্রতিটি পদ্ধতিতে আন্তর্জাতিক মান নিয়ে আসেন।',
              })}
            </p>
            <MagneticButton
              to="/appointment"
              className="bg-white text-teal font-heading font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
            >
              {t({ en: 'Book Appointment', bn: 'অ্যাপয়েন্টমেন্ট বুক করুন' })}
              <ArrowRight size={20} />
            </MagneticButton>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default ConferencesPage;
