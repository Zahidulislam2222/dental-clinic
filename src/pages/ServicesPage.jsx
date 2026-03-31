import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Shield,
  Wrench,
  Activity,
  Crown,
  CircleDot,
  GitBranch,
  Heart,
  Scissors,
  Baby,
  Sparkles,
  Monitor,
  Microscope,
  Accessibility,
  Zap,
  ArrowRight,
  Phone,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageTransition from '../components/ui/PageTransition';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';
import TiltCard from '../components/ui/TiltCard';
import MagneticButton from '../components/ui/MagneticButton';
import { useScrollReveal, useStaggerReveal } from '../hooks/useGsapAnimations';

/* ------------------------------------------------------------------ */
/*  ICON MAP                                                           */
/* ------------------------------------------------------------------ */

const iconMap = {
  Shield,
  Wrench,
  Activity,
  Crown,
  CircleDot,
  GitBranch,
  Heart,
  Scissors,
  Baby,
  Sparkles,
  Monitor,
  Microscope,
  Accessibility,
  Zap,
};

/* ------------------------------------------------------------------ */
/*  SERVICES DATA                                                      */
/* ------------------------------------------------------------------ */

const services = [
  {
    slug: 'preventive-diagnostic-care', icon: 'Shield',
    image: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600&q=85&fit=crop',
    title: { en: 'Preventive & Diagnostic Care', bn: 'প্রতিরোধমূলক ও ডায়াগনস্টিক কেয়ার' },
    desc: { en: 'Regular checkups, digital X-rays, OPG, and 3D CBCT scanning to catch problems early and maintain oral health.', bn: 'নিয়মিত চেকআপ, ডিজিটাল এক্স-রে, OPG, এবং 3D CBCT স্ক্যানিং সমস্যা তাড়াতাড়ি ধরতে।' },
  },
  {
    slug: 'restorative-dentistry', icon: 'Wrench',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=85&fit=crop',
    title: { en: 'Restorative Dentistry', bn: 'পুনরুদ্ধার দন্তচিকিৎসা' },
    desc: { en: 'Composite fillings, GIC fillings, and dental bonding to restore damaged teeth to their natural form and function.', bn: 'ক্ষতিগ্রস্ত দাঁতকে তাদের স্বাভাবিক আকৃতি ও কার্যকারিতায় ফিরিয়ে আনতে কম্পোজিট ফিলিং।' },
  },
  {
    slug: 'root-canal-treatment', icon: 'Activity',
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&q=85&fit=crop',
    title: { en: 'Root Canal Treatment', bn: 'রুট ক্যানাল চিকিৎসা' },
    desc: { en: 'Painless modern endodontic treatment using rotary technology. Save your natural tooth in as little as one visit.', bn: 'রোটারি প্রযুক্তি ব্যবহার করে ব্যথাহীন আধুনিক এন্ডোডন্টিক চিকিৎসা। এক ভিজিটেই দাঁত বাঁচান।' },
  },
  {
    slug: 'crowns-bridges-dentures', icon: 'Crown',
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=85&fit=crop',
    title: { en: 'Crowns, Bridges & Dentures', bn: 'ক্রাউন, ব্রিজ ও ডেনচার' },
    desc: { en: 'Zirconia crowns, E-Max crowns, dental bridges, and full/partial dentures for complete smile restoration.', bn: 'জিরকোনিয়া ক্রাউন, ই-ম্যাক্স ক্রাউন, ডেন্টাল ব্রিজ এবং সম্পূর্ণ/আংশিক ডেনচার।' },
  },
  {
    slug: 'dental-implants', icon: 'CircleDot',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=85&fit=crop',
    title: { en: 'Dental Implants', bn: 'ডেন্টাল ইমপ্লান্ট' },
    desc: { en: 'Permanent tooth replacement with titanium implants. UCLA-trained expertise for single tooth to full mouth rehabilitation.', bn: 'টাইটানিয়াম ইমপ্লান্ট দিয়ে স্থায়ী দাঁত প্রতিস্থাপন। UCLA-প্রশিক্ষিত দক্ষতা।' },
  },
  {
    slug: 'orthodontics-braces-aligners', icon: 'GitBranch',
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=85&fit=crop',
    title: { en: 'Orthodontics — Braces & Aligners', bn: 'অর্থোডন্টিক্স — ব্রেসেস ও অ্যালাইনার' },
    desc: { en: 'Metal braces, ceramic braces, and clear aligners (Invisalign) for perfectly aligned teeth and beautiful smiles.', bn: 'মেটাল ব্রেসেস, সিরামিক ব্রেসেস এবং ক্লিয়ার অ্যালাইনার সুন্দর হাসির জন্য।' },
  },
  {
    slug: 'periodontics-gum-treatment', icon: 'Heart',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&q=85&fit=crop',
    title: { en: 'Periodontics — Gum Treatment', bn: 'পেরিওডন্টিক্স — মাড়ির চিকিৎসা' },
    desc: { en: 'Advanced gum disease treatment, deep cleaning, and laser therapy to protect your teeth foundation.', bn: 'উন্নত মাড়ির রোগের চিকিৎসা, গভীর পরিষ্কার এবং লেজার থেরাপি।' },
  },
  {
    slug: 'oral-maxillofacial-surgery', icon: 'Scissors',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&q=85&fit=crop',
    title: { en: 'Oral & Maxillofacial Surgery', bn: 'ওরাল ও ম্যাক্সিলোফেসিয়াল সার্জারি' },
    desc: { en: 'Expert surgical procedures including wisdom tooth extraction, jaw surgery, and facial trauma management.', bn: 'আক্কেল দাঁত তোলা, চোয়ালের সার্জারি এবং মুখের আঘাত ব্যবস্থাপনা।' },
  },
  {
    slug: 'pediatric-dentistry', icon: 'Baby',
    image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&q=85&fit=crop',
    title: { en: 'Pediatric Dentistry', bn: 'শিশু দন্তচিকিৎসা' },
    desc: { en: 'Gentle dental care for children in a friendly environment. Preventive treatments, sealants, and habit counseling.', bn: 'বন্ধুত্বপূর্ণ পরিবেশে শিশুদের জন্য মৃদু দন্ত চিকিৎসা।' },
  },
  {
    slug: 'cosmetic-dentistry', icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=85&fit=crop',
    title: { en: 'Cosmetic Dentistry & Smile Makeover', bn: 'কসমেটিক ডেন্টিস্ট্রি ও স্মাইল মেকওভার' },
    desc: { en: 'Professional teeth whitening (ZOOM), porcelain veneers, and complete smile makeover packages.', bn: 'পেশাদার দাঁত সাদাকরণ (ZOOM), পোর্সেলিন ভেনিয়ার এবং সম্পূর্ণ স্মাইল মেকওভার।' },
  },
  {
    slug: 'digital-imaging', icon: 'Monitor',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&q=85&fit=crop',
    title: { en: 'Digital Imaging — 3D CBCT, OPG', bn: 'ডিজিটাল ইমেজিং — 3D CBCT, OPG' },
    desc: { en: 'State-of-the-art digital periapical X-ray, panoramic OPG, and 3D CBCT scanning for precise diagnosis.', bn: 'অত্যাধুনিক ডিজিটাল পেরিয়াপিকাল এক্স-রে, প্যানোরামিক OPG এবং 3D CBCT স্ক্যানিং।' },
  },
  {
    slug: 'oral-medicine-pathology', icon: 'Microscope',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=85&fit=crop',
    title: { en: 'Oral Medicine & Pathology', bn: 'ওরাল মেডিসিন ও প্যাথলজি' },
    desc: { en: 'Diagnosis and management of oral diseases, mouth ulcers, oral cancer screening, and mucosal disorders.', bn: 'মৌখিক রোগের নির্ণয় ও ব্যবস্থাপনা, মুখের আলসার, ওরাল ক্যান্সার স্ক্রিনিং।' },
  },
  {
    slug: 'special-needs-dentistry', icon: 'Accessibility',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=85&fit=crop',
    title: { en: 'Special Needs Dentistry', bn: 'বিশেষ চাহিদা দন্তচিকিৎসা' },
    desc: { en: 'Compassionate dental care adapted for patients with physical, intellectual, or medical special needs.', bn: 'শারীরিক, মানসিক বা চিকিৎসা সংক্রান্ত বিশেষ চাহিদাসম্পন্ন রোগীদের জন্য সহানুভূতিশীল যত্ন।' },
  },
  {
    slug: 'laser-dentistry', icon: 'Zap',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=85&fit=crop',
    title: { en: 'Laser Dentistry', bn: 'লেজার ডেন্টিস্ট্রি' },
    desc: { en: 'Advanced laser treatments for gum disease, cavity detection, teeth whitening, and soft tissue procedures.', bn: 'মাড়ির রোগ, ক্যাভিটি সনাক্তকরণ, দাঁত সাদাকরণের জন্য উন্নত লেজার চিকিৎসা।' },
  },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

const ServicesPage = () => {
  const { t } = useLanguage();
  const heroRef = useScrollReveal({ y: 40, duration: 0.8 });
  const gridRef = useStaggerReveal({ stagger: 0.08, y: 60 });
  const ctaRef = useScrollReveal({ y: 50 });

  return (
    <PageTransition>
      <Helmet>
        <title>
          {t({
            en: 'Our Dental Services | Everyday Dental Surgery',
            bn: 'আমাদের ডেন্টাল সেবাসমূহ | এভরিডে ডেন্টাল সার্জারি',
          })}
        </title>
        <meta
          name="description"
          content="Explore 14+ dental services at Everyday Dental Surgery — from preventive care and root canals to dental implants, orthodontics, cosmetic dentistry, and laser treatments."
        />
        <meta property="og:title" content="Our Dental Services | Everyday Dental Surgery" />
        <meta
          property="og:description"
          content="Comprehensive dental services including implants, braces, cosmetic dentistry, oral surgery, and more."
        />
        <link rel="canonical" href="https://example-dental.com/services" />
      </Helmet>

      {/* ========================= HERO BANNER ========================== */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=80&fit=crop"
          alt="Modern dental clinic"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/75 to-navy/50" />

        <div ref={heroRef} className="container mx-auto px-4 relative z-10 text-center py-28 md:py-36">
          <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {t({ en: 'Our Dental Services', bn: 'আমাদের ডেন্টাল সেবাসমূহ' })}
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            {t({
              en: 'Comprehensive dental care powered by modern technology and compassionate expertise.',
              bn: 'আধুনিক প্রযুক্তি এবং সহানুভূতিশীল দক্ষতায় সমৃদ্ধ ব্যাপক দন্ত চিকিৎসা।',
            })}
          </p>
          <div className="mt-4 h-1 w-20 rounded-full bg-teal mx-auto" />
        </div>
      </section>

      {/* ========================= SERVICES GRID ======================== */}
      <section className="py-16 md:py-24 bg-offwhite">
        <div className="container mx-auto px-4">
          <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || Shield;
              return (
                <TiltCard
                  key={service.slug}
                  intensity={10}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col transition-all hover:border-teal/30 hover:shadow-xl hover:shadow-teal/10"
                >
                  {/* photo */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={service.image}
                      alt={t(service.title)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                      <Icon size={20} className="text-teal" />
                    </div>
                  </div>

                  <div className="p-6 md:p-8 pt-4 flex flex-col flex-1">
                    {/* title */}
                    <h3 className="font-heading text-lg font-bold text-navy mb-2 leading-snug">
                      {t(service.title)}
                    </h3>

                    {/* description */}
                    <p className="text-gray text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                      {t(service.desc)}
                    </p>

                    {/* view details link */}
                    <Link
                      to={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 text-teal font-heading font-semibold text-sm group"
                    >
                      {t({ en: 'View Details', bn: 'বিস্তারিত দেখুন' })}
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================== CTA ============================== */}
      <section className="relative py-16 md:py-24 text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy/85" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div ref={ctaRef}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              {t({
                en: "Can't find what you need?",
                bn: 'আপনার প্রয়োজনীয় সেবা খুঁজে পাচ্ছেন না?',
              })}
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              {t({
                en: 'Contact us directly and we will guide you to the right treatment.',
                bn: 'সরাসরি আমাদের সাথে যোগাযোগ করুন এবং আমরা আপনাকে সঠিক চিকিৎসায় গাইড করব।',
              })}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton to="/contact" className="bg-teal text-white font-heading font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:bg-teal-600 transition-colors inline-flex items-center gap-2">
                <Phone size={20} />
                {t({ en: 'Contact Us', bn: 'যোগাযোগ করুন' })}
              </MagneticButton>
              <MagneticButton to="/appointment" className="border-2 border-white text-white font-heading font-semibold rounded-xl px-8 py-4 text-lg hover:bg-white hover:text-navy transition-colors inline-flex items-center gap-2">
                {t({ en: 'Book Appointment', bn: 'অ্যাপয়েন্টমেন্ট বুক করুন' })}
                <ArrowRight size={20} />
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default ServicesPage;
