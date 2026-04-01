import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  BadgePercent,
  Star,
  ShieldCheck,
  Sparkles,
  Phone,
  CalendarCheck,
  Crown,
  Stethoscope,
  Syringe,
  Smile,
  Scissors,
  ScanLine,
  Gem,
  HeartPulse,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageTransition from '../components/ui/PageTransition';
import SectionHeading from '../components/ui/SectionHeading';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import TiltCard from '../components/ui/TiltCard';
import MagneticButton from '../components/ui/MagneticButton';
import { useScrollReveal, useStaggerReveal } from '../hooks/useGsapAnimations';
import DentalBackground from '../components/ui/DentalBackground';
import { DentalDividerWave } from '../components/ui/DentalDivider';
import RunningTooth from '../components/ui/RunningTooth';
import { GlassImplant, DarkSection } from '../components/ui/Dental3DObject';
import { ScrollParallax3D } from '../components/ui/ToothReveal';

/* ─────────────────────── data ─────────────────────── */

const packages = [
  {
    name: { en: 'Basic Care', bn: 'বেসিক কেয়ার' },
    price: '৳3,500',
    features: {
      en: ['Consultation', 'X-Ray', 'Scaling'],
      bn: ['পরামর্শ', 'এক্স-রে', 'স্কেলিং'],
    },
    icon: ShieldCheck,
    highlighted: false,
    badge: null,
  },
  {
    name: { en: 'Smile Starter', bn: 'স্মাইল স্টার্টার' },
    price: '৳8,500',
    features: {
      en: ['Consultation', 'X-Ray', 'Scaling', '1 Filling', 'Fluoride'],
      bn: ['পরামর্শ', 'এক্স-রে', 'স্কেলিং', '১টি ফিলিং', 'ফ্লোরাইড'],
    },
    icon: Star,
    highlighted: true,
    badge: { en: 'Most Popular', bn: 'সর্বাধিক জনপ্রিয়' },
  },
  {
    name: { en: 'Premium Smile', bn: 'প্রিমিয়াম স্মাইল' },
    price: '৳25,000',
    features: {
      en: ['Consultation', 'OPG', 'Scaling', 'Whitening', 'Composite Veneer (1 tooth)'],
      bn: ['পরামর্শ', 'OPG', 'স্কেলিং', 'হোয়াইটেনিং', 'কম্পোজিট ভিনিয়ার (১টি দাঁত)'],
    },
    icon: Sparkles,
    highlighted: false,
    badge: null,
  },
];

const pricingCategories = [
  {
    title: { en: 'Preventive & Diagnostic', bn: 'প্রতিরোধমূলক ও ডায়াগনস্টিক' },
    icon: Stethoscope,
    discount: null,
    items: [
      { name: { en: 'Consultation & Examination', bn: 'পরামর্শ ও পরীক্ষা' }, price: '৳500' },
      { name: { en: 'Digital X-Ray (Periapical)', bn: 'ডিজিটাল এক্স-রে (পেরিয়াপিকাল)' }, price: '৳300' },
      { name: { en: 'OPG (Panoramic X-Ray)', bn: 'OPG (প্যানোরামিক এক্স-রে)' }, price: '৳1,500' },
      { name: { en: 'Scaling & Polishing', bn: 'স্কেলিং ও পলিশিং' }, price: '৳1,500 – ৳2,500' },
      { name: { en: 'Fluoride Treatment', bn: 'ফ্লোরাইড ট্রিটমেন্ট' }, price: '৳800' },
    ],
  },
  {
    title: { en: 'Restorative', bn: 'পুনরুদ্ধার' },
    icon: HeartPulse,
    discount: null,
    items: [
      { name: { en: 'Composite Filling (per tooth)', bn: 'কম্পোজিট ফিলিং (প্রতি দাঁত)' }, price: '৳2,000 – ৳4,000' },
      { name: { en: 'GIC Filling', bn: 'GIC ফিলিং' }, price: '৳1,500 – ৳2,500' },
      { name: { en: 'Dental Bonding', bn: 'ডেন্টাল বন্ডিং' }, price: '৳3,000 – ৳6,000' },
    ],
  },
  {
    title: { en: 'Root Canal Treatment', bn: 'রুট ক্যানাল চিকিৎসা' },
    icon: Syringe,
    discount: '50% OFF',
    items: [
      { name: { en: 'Anterior RCT', bn: 'অ্যান্টেরিয়র RCT' }, price: '৳6,000', originalPrice: '৳12,000' },
      { name: { en: 'Posterior RCT', bn: 'পোস্টেরিয়র RCT' }, price: '৳8,000', originalPrice: '৳16,000' },
      { name: { en: 'Single-Visit RCT', bn: 'সিঙ্গেল-ভিজিট RCT' }, price: '৳10,000', originalPrice: '৳20,000' },
    ],
  },
  {
    title: { en: 'Crowns & Prosthetics', bn: 'ক্রাউন ও প্রস্থেটিক্স' },
    icon: Crown,
    discount: null,
    items: [
      { name: { en: 'Zirconia Crown', bn: 'জিরকোনিয়া ক্রাউন' }, price: '৳15,000 – ৳25,000' },
      { name: { en: 'E-Max Crown', bn: 'ই-ম্যাক্স ক্রাউন' }, price: '৳18,000 – ৳30,000' },
      { name: { en: 'Complete Denture (per jaw)', bn: 'কমপ্লিট ডেনচার (প্রতি চোয়াল)' }, price: '৳12,000 – ৳20,000' },
      { name: { en: 'Flexible Partial Denture', bn: 'ফ্লেক্সিবল পার্শিয়াল ডেনচার' }, price: '৳8,000 – ৳15,000' },
    ],
  },
  {
    title: { en: 'Implants', bn: 'ইমপ্লান্ট' },
    icon: ScanLine,
    discount: null,
    items: [
      { name: { en: 'Single Tooth Implant', bn: 'সিঙ্গেল টুথ ইমপ্লান্ট' }, price: '৳60,000 – ৳90,000' },
      { name: { en: 'Full Mouth Rehabilitation', bn: 'ফুল মাউথ রিহ্যাবিলিটেশন' }, price: { en: 'On Consultation', bn: 'পরামর্শ সাপেক্ষে' } },
    ],
  },
  {
    title: { en: 'Orthodontics', bn: 'অর্থোডন্টিক্স' },
    icon: Smile,
    discount: '20% OFF',
    items: [
      { name: { en: 'Metal Braces', bn: 'মেটাল ব্রেসেস' }, price: '৳25,000', originalPrice: '৳31,250' },
      { name: { en: 'Ceramic Braces', bn: 'সিরামিক ব্রেসেস' }, price: '৳35,000', originalPrice: '৳43,750' },
      { name: { en: 'Clear Aligners (Invisalign)', bn: 'ক্লিয়ার অ্যালাইনার (ইনভিসালাইন)' }, price: '৳80,000 – ৳1,50,000' },
    ],
  },
  {
    title: { en: 'Cosmetic', bn: 'কসমেটিক' },
    icon: Gem,
    discount: null,
    items: [
      { name: { en: 'Teeth Whitening (In-Office ZOOM)', bn: 'টিথ হোয়াইটেনিং (ইন-অফিস ZOOM)' }, price: '৳6,000', originalPrice: '৳12,000', itemDiscount: '50% OFF' },
      { name: { en: 'Porcelain Veneers (per tooth)', bn: 'পোর্সেলিন ভিনিয়ার (প্রতি দাঁত)' }, price: '৳15,000 – ৳25,000' },
      { name: { en: 'Smile Makeover Package', bn: 'স্মাইল মেকওভার প্যাকেজ' }, price: { en: 'On Consultation', bn: 'পরামর্শ সাপেক্ষে' } },
    ],
  },
  {
    title: { en: 'Surgical', bn: 'সার্জিক্যাল' },
    icon: Scissors,
    discount: null,
    items: [
      { name: { en: 'Simple Extraction', bn: 'সিম্পল এক্সট্রাকশন' }, price: '৳1,500 – ৳3,000' },
      { name: { en: 'Wisdom Tooth Removal', bn: 'উইজডম টুথ রিমুভাল' }, price: '৳8,000 – ৳15,000' },
      { name: { en: 'Laser Gum Treatment', bn: 'লেজার গাম ট্রিটমেন্ট' }, price: '৳5,000 – ৳10,000' },
    ],
  },
];

/* ─────────────────── components ─────────────────── */

const PackageCard = ({ pkg, index, t }) => {
  const Icon = pkg.icon;
  return (
    <div className="relative">
      {pkg.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-teal text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
            {t(pkg.badge)}
          </span>
        </div>
      )}
      <TiltCard
        intensity={pkg.highlighted ? 8 : 12}
        className={`rounded-2xl p-6 md:p-8 text-center h-full flex flex-col transition-all duration-300 ${
          pkg.highlighted
            ? 'bg-white border-2 border-teal shadow-2xl shadow-teal/15 scale-[1.03]'
            : 'bg-white border border-gray-200 shadow-lg hover:shadow-xl'
        }`}
      >
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${
            pkg.highlighted ? 'bg-teal text-white' : 'bg-teal/10 text-teal'
          }`}
        >
          <Icon size={28} />
        </div>
        <h3 className="font-heading text-xl font-bold text-navy mb-2">{t(pkg.name)}</h3>
        <p className="text-3xl md:text-4xl font-bold text-teal mb-6">{pkg.price}</p>
        <ul className="space-y-3 mb-8 flex-1">
          {pkg.features[t({ en: 'en', bn: 'bn' })].map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-gray">
              <ShieldCheck size={16} className="text-teal flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button to="/appointment" variant={pkg.highlighted ? 'primary' : 'outline'} className="w-full">
          {t({ en: 'Book Now', bn: 'এখনই বুক করুন' })}
        </Button>
      </TiltCard>
    </div>
  );
};

const PricingTable = ({ category, t }) => {
  const Icon = category.icon;
  return (
    <Card hover={false} padding={false} className="overflow-hidden">
      {/* Category Header */}
      <div className="bg-navy px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon size={22} className="text-teal" />
          <h3 className="font-heading text-lg md:text-xl font-bold text-white">
            {t(category.title)}
          </h3>
        </div>
        {category.discount && (
          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <BadgePercent size={14} />
            {category.discount}
          </span>
        )}
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100">
        {category.items.map((item, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-6 py-4 transition-colors hover:bg-teal/5 ${
              item.originalPrice || item.itemDiscount ? 'bg-green-50/40' : ''
            }`}
          >
            <span className="text-navy font-medium pr-4">{t(item.name)}</span>
            <div className="flex items-center gap-2 flex-shrink-0 text-right">
              {item.originalPrice && (
                <span className="text-gray line-through text-sm">{item.originalPrice}</span>
              )}
              <span className={`font-bold ${item.originalPrice || item.itemDiscount ? 'text-teal' : 'text-navy'}`}>
                {typeof item.price === 'object' ? t(item.price) : item.price}
              </span>
              {item.itemDiscount && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1">
                  {item.itemDiscount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

/* ─────────────────── page ─────────────────── */

const PricingPage = () => {
  const { t } = useLanguage();
  const heroRef = useScrollReveal({ y: 40, duration: 0.8 });
  const packagesRef = useStaggerReveal({ stagger: 0.15, y: 60 });
  const tablesRef = useStaggerReveal({ stagger: 0.1, y: 50 });
  const ctaRef = useScrollReveal({ y: 50 });

  return (
    <PageTransition>
      <Helmet>
        <title>{t({ en: 'Pricing — Everyday Dental Surgery', bn: 'মূল্য তালিকা — এভরিডে ডেন্টাল সার্জারি' })}</title>
        <meta
          name="description"
          content={t({
            en: 'Transparent dental pricing at Everyday Dental Surgery. Root canal 50% off, braces 20% off. No hidden charges.',
            bn: 'এভরিডে ডেন্টাল সার্জারিতে স্বচ্ছ মূল্য তালিকা। রুট ক্যানাল ৫০% ছাড়, ব্রেসেস ২০% ছাড়।',
          })}
        />
      </Helmet>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80&fit=crop"
          alt="Transparent dental pricing"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/75 to-navy/50" />
        <div ref={heroRef} className="container mx-auto px-4 relative z-10 text-center py-32">
          <Badge variant="white" className="mb-6">
            <BadgePercent size={16} />
            {t({ en: 'No Hidden Charges', bn: 'কোনো লুকানো চার্জ নেই' })}
          </Badge>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {t({ en: 'Transparent Pricing', bn: 'স্বচ্ছ মূল্য তালিকা' })}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            {t({
              en: 'Quality dental care at honest prices. No surprises, no hidden fees — just exceptional care you can trust.',
              bn: 'সৎ মূল্যে মানসম্পন্ন দাঁতের যত্ন। কোনো চমক নেই, কোনো লুকানো ফি নেই — শুধু ব্যতিক্রমী যত্ন যা আপনি বিশ্বাস করতে পারেন।',
            })}
          </p>
        </div>
      </section>

      {/* Dental wave divider */}
      <DentalDividerWave className="bg-offwhite" />

      {/* ── Package Cards ── */}
      <section className="py-16 md:py-24 bg-offwhite relative">
        <DentalBackground count={34} density="dense" />
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Value Packages"
            titleBn="ভ্যালু প্যাকেজ"
            subtitle="Save more with our bundled care packages"
            subtitleBn="আমাদের বান্ডেল কেয়ার প্যাকেজে আরও সাশ্রয় করুন"
          />
          <div ref={packagesRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {packages.map((pkg, i) => (
              <PackageCard key={i} pkg={pkg} index={i} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Detailed Pricing Tables ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Detailed Price List"
            titleBn="বিস্তারিত মূল্য তালিকা"
            subtitle="Complete breakdown of all our dental services"
            subtitleBn="আমাদের সকল ডেন্টাল সেবার সম্পূর্ণ বিবরণ"
          />
          <div ref={tablesRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {pricingCategories.map((category, i) => (
              <PricingTable key={i} category={category} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className="py-12 bg-offwhite">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray text-sm md:text-base leading-relaxed">
              {t({
                en: 'Prices are approximate and may vary based on case complexity. Final pricing will be confirmed after examination. All prices in BDT (৳).',
                bn: 'মূল্য আনুমানিক এবং কেসের জটিলতার উপর ভিত্তি করে পরিবর্তন হতে পারে। চূড়ান্ত মূল্য পরীক্ষার পরে নিশ্চিত করা হবে।',
              })}
            </p>
          </div>
        </div>
      </section>

      {/* Running tooth */}
      <RunningTooth direction="left" speed={10} size={50} className="bg-gradient-to-br from-teal to-teal-700" />

      {/* ── CTA Section — Premium Dark ── */}
      <DarkSection className="py-20 md:py-28" gradient="deep">
        <div className="container mx-auto px-4">
          <div ref={ctaRef} className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">
                {t({ en: 'Questions about pricing?', bn: 'মূল্য সম্পর্কে প্রশ্ন আছে?' })}
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl">
                {t({
                  en: 'Contact us for a detailed quote or book a consultation to discuss your treatment plan.',
                  bn: 'বিস্তারিত উদ্ধৃতির জন্য আমাদের সাথে যোগাযোগ করুন বা আপনার চিকিৎসা পরিকল্পনা নিয়ে আলোচনা করতে পরামর্শ বুক করুন।',
                })}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <MagneticButton glow sparkle to="/contact" className="bg-teal text-white font-heading font-semibold rounded-xl px-8 py-4 text-lg shadow-2xl shadow-teal/20 hover:shadow-teal/40 transition-all inline-flex items-center gap-2">
                  <Phone size={20} />
                  {t({ en: 'Contact Us', bn: 'যোগাযোগ করুন' })}
                </MagneticButton>
                <MagneticButton sparkle to="/appointment" className="border border-teal/30 text-teal font-heading font-semibold rounded-xl px-8 py-4 text-lg hover:bg-teal/10 transition-all inline-flex items-center gap-2 backdrop-blur-sm">
                  <CalendarCheck size={20} />
                  {t({ en: 'Book Appointment', bn: 'অ্যাপয়েন্টমেন্ট বুক করুন' })}
                </MagneticButton>
              </div>
            </div>
            <div className="flex justify-center">
              <ScrollParallax3D><GlassImplant size={220} /></ScrollParallax3D>
            </div>
          </div>
        </div>
      </DarkSection>
    </PageTransition>
  );
};

export default PricingPage;
