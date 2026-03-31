import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  CalendarDays,
  Stethoscope,
  Building,
  CreditCard,
  HelpCircle,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageTransition from '../components/ui/PageTransition';
import SectionHeading from '../components/ui/SectionHeading';
import Accordion from '../components/ui/Accordion';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import MagneticButton from '../components/ui/MagneticButton';
import { useScrollReveal } from '../hooks/useGsapAnimations';

/* ─────────────────────── data ─────────────────────── */

const tabs = [
  {
    key: 'booking',
    label: { en: 'Booking', bn: 'বুকিং' },
    icon: CalendarDays,
  },
  {
    key: 'treatments',
    label: { en: 'Treatments', bn: 'চিকিৎসা' },
    icon: Stethoscope,
  },
  {
    key: 'facilities',
    label: { en: 'Facilities', bn: 'সুবিধাসমূহ' },
    icon: Building,
  },
  {
    key: 'payment',
    label: { en: 'Payment', bn: 'পেমেন্ট' },
    icon: CreditCard,
  },
];

const faqData = {
  booking: [
    {
      question: {
        en: 'Do I need an appointment?',
        bn: 'আমার কি অ্যাপয়েন্টমেন্ট দরকার?',
      },
      answer: {
        en: 'Yes, we recommend booking at least 1 day in advance. Walk-ins are welcome but may face waiting time. Call +880 1712-345678 to confirm.',
        bn: 'হ্যাঁ, কমপক্ষে ১ দিন আগে বুকিং দেওয়ার পরামর্শ দিই। ওয়াক-ইন স্বাগত কিন্তু অপেক্ষা করতে হতে পারে। নিশ্চিত করতে +৮৮০ ১৭১২-৩৪৫৬৭৮ কল করুন।',
      },
    },
    {
      question: {
        en: 'What are your hours?',
        bn: 'আপনাদের সময়সূচী কী?',
      },
      answer: {
        en: 'Saturday to Thursday, 5:00 PM to 9:00 PM. We are closed on Fridays.',
        bn: 'শনিবার থেকে বৃহস্পতিবার, বিকাল ৫:০০ টা থেকে রাত ৯:০০ টা। শুক্রবার বন্ধ।',
      },
    },
    {
      question: {
        en: 'Can I book online?',
        bn: 'আমি কি অনলাইনে বুকিং দিতে পারি?',
      },
      answer: {
        en: 'Yes, use our online appointment form or WhatsApp us at +880 1712-345678.',
        bn: 'হ্যাঁ, আমাদের অনলাইন অ্যাপয়েন্টমেন্ট ফর্ম ব্যবহার করুন বা +৮৮০ ১৭১২-৩৪৫৬৭৮ এ হোয়াটসঅ্যাপ করুন।',
      },
    },
    {
      question: {
        en: 'Is consultation free?',
        bn: 'পরামর্শ কি বিনামূল্যে?',
      },
      answer: {
        en: 'First consultation is ৳500 which is adjusted against your treatment cost.',
        bn: 'প্রথম পরামর্শ ৳৫০০ যা আপনার চিকিৎসা খরচের সাথে সমন্বয় করা হয়।',
      },
    },
  ],
  treatments: [
    {
      question: {
        en: 'Is root canal treatment painful?',
        bn: 'রুট ক্যানাল চিকিৎসা কি বেদনাদায়ক?',
      },
      answer: {
        en: 'No. We use modern rotary technology and proper anaesthesia — most patients feel nothing during the procedure.',
        bn: 'না। আমরা আধুনিক রোটারি প্রযুক্তি এবং সঠিক অ্যানেসথেসিয়া ব্যবহার করি — বেশিরভাগ রোগী প্রক্রিয়ার সময় কিছুই অনুভব করেন না।',
      },
    },
    {
      question: {
        en: 'How long does teeth whitening last?',
        bn: 'দাঁত সাদাকরণ কতদিন স্থায়ী হয়?',
      },
      answer: {
        en: 'In-office ZOOM whitening results last 1–3 years with proper care.',
        bn: 'অফিসে ZOOM হোয়াইটেনিং এর ফলাফল সঠিক যত্নে ১-৩ বছর স্থায়ী হয়।',
      },
    },
    {
      question: {
        en: 'What is the recovery time for implants?',
        bn: 'ইমপ্লান্টের জন্য সেরে ওঠার সময় কত?',
      },
      answer: {
        en: 'Initial healing takes 3–5 days. Implant integration takes 3–6 months, during which a temporary crown is placed.',
        bn: 'প্রাথমিক নিরাময়ে ৩-৫ দিন লাগে। ইমপ্লান্ট ইন্টিগ্রেশনে ৩-৬ মাস লাগে।',
      },
    },
    {
      question: {
        en: 'At what age can braces be started?',
        bn: 'কত বয়সে ব্রেসেস শুরু করা যায়?',
      },
      answer: {
        en: 'Braces can typically start from age 12–13. Dr. Arman will assess the best timing.',
        bn: 'সাধারণত ১২-১৩ বছর বয়সে ব্রেসেস শুরু করা যায়। ডা. আরমান সেরা সময় নির্ধারণ করবেন।',
      },
    },
  ],
  facilities: [
    {
      question: {
        en: 'Do you have digital X-ray?',
        bn: 'আপনাদের কি ডিজিটাল এক্স-রে আছে?',
      },
      answer: {
        en: 'Yes, we have digital periapical X-ray, OPG, and 3D CBCT scanning available in-clinic.',
        bn: 'হ্যাঁ, ক্লিনিকে ডিজিটাল পেরিয়াপিকাল এক্স-রে, OPG এবং 3D CBCT স্ক্যানিং আছে।',
      },
    },
    {
      question: {
        en: 'Is the clinic hygienic and sterilised?',
        bn: 'ক্লিনিক কি স্বাস্থ্যকর ও জীবাণুমুক্ত?',
      },
      answer: {
        en: 'All instruments are autoclave-sterilised after each use. We follow strict infection control protocols.',
        bn: 'প্রতিটি ব্যবহারের পর সমস্ত যন্ত্রপাতি অটোক্লেভ-জীবাণুমুক্ত করা হয়।',
      },
    },
    {
      question: {
        en: 'Is parking available?',
        bn: 'পার্কিং আছে কি?',
      },
      answer: {
        en: 'Street parking is available near Greenview Plaza. We are near Dhanmondi Rail Gate — easily accessible by CNG and rickshaw.',
        bn: 'গ্রিনভিউ প্লাজাের কাছে রাস্তায় পার্কিং আছে। ধানমন্ডি রেলগেটের কাছে — CNG এবং রিকশায় সহজে আসা যায়।',
      },
    },
  ],
  payment: [
    {
      question: {
        en: 'Do you accept bKash or Nagad?',
        bn: 'আপনারা কি বিকাশ বা নগদ গ্রহণ করেন?',
      },
      answer: {
        en: 'Yes, we accept bKash, Nagad, Rocket, and all major bank cards.',
        bn: 'হ্যাঁ, আমরা বিকাশ, নগদ, রকেট এবং সমস্ত প্রধান ব্যাংক কার্ড গ্রহণ করি।',
      },
    },
    {
      question: {
        en: 'Is there an EMI option?',
        bn: 'EMI সুবিধা আছে কি?',
      },
      answer: {
        en: 'EMI facilities are available for treatments above ৳20,000 through partner banks.',
        bn: '৳২০,০০০ এর উপরে চিকিৎসার জন্য পার্টনার ব্যাংকের মাধ্যমে EMI সুবিধা আছে।',
      },
    },
    {
      question: {
        en: 'Are the advertised discounts real?',
        bn: 'বিজ্ঞাপিত ছাড়গুলো কি আসল?',
      },
      answer: {
        en: 'Yes — Root Canal 50% OFF and Braces 20% OFF are active promotions. Call to confirm current offers.',
        bn: 'হ্যাঁ — রুট ক্যানাল ৫০% ছাড় এবং ব্রেসেস ২০% ছাড় সক্রিয় প্রচার। বর্তমান অফার নিশ্চিত করতে কল করুন।',
      },
    },
  ],
};

/* ─────────────────────── page ─────────────────────── */

const FAQPage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('booking');
  const heroRef = useScrollReveal({ y: 40, duration: 0.8 });
  const ctaRef = useScrollReveal({ y: 50 });

  // Map FAQ items with translated strings for the Accordion
  const currentItems = faqData[activeTab].map((item) => ({
    question: t(item.question),
    answer: t(item.answer),
  }));

  return (
    <PageTransition>
      <Helmet>
        <title>{t({ en: 'FAQ — Everyday Dental Surgery', bn: 'সচরাচর জিজ্ঞাসা — এভরিডে ডেন্টাল সার্জারি' })}</title>
        <meta
          name="description"
          content={t({
            en: 'Frequently asked questions about appointments, treatments, facilities, and payment at Everyday Dental Surgery, Dhanmondi, Dhaka.',
            bn: 'এভরিডে ডেন্টাল সার্জারি, ধানমন্ডি, ঢাকায় অ্যাপয়েন্টমেন্ট, চিকিৎসা, সুবিধা এবং পেমেন্ট সম্পর্কে সচরাচর জিজ্ঞাসা।',
          })}
        />
      </Helmet>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=1600&q=80&fit=crop"
          alt="Frequently asked questions"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/75 to-navy/50" />
        <div ref={heroRef} className="container mx-auto px-4 relative z-10 text-center py-32">
          <Badge variant="white" className="mb-6">
            <HelpCircle size={16} />
            {t({ en: 'Got Questions?', bn: 'প্রশ্ন আছে?' })}
          </Badge>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {t({ en: 'Frequently Asked Questions', bn: 'সচরাচর জিজ্ঞাসা' })}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            {t({
              en: 'Find answers to common questions about our dental services, booking process, and more.',
              bn: 'আমাদের ডেন্টাল সেবা, বুকিং প্রক্রিয়া এবং আরও অনেক কিছু সম্পর্কে সাধারণ প্রশ্নের উত্তর খুঁজুন।',
            })}
          </p>
        </div>
      </section>

      {/* ── Tabs + Accordion ── */}
      <section className="py-16 md:py-24 bg-offwhite">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="How Can We Help?"
            titleBn="আমরা কীভাবে সাহায্য করতে পারি?"
            subtitle="Select a category below to find your answer"
            subtitleBn="আপনার উত্তর খুঁজে পেতে নিচে একটি বিভাগ নির্বাচন করুন"
          />

          {/* Tab Navigation */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex flex-wrap justify-center gap-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <motion.button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-heading font-semibold text-sm md:text-base transition-all duration-300 ${
                      isActive
                        ? 'bg-teal text-white shadow-lg shadow-teal/25'
                        : 'bg-white text-navy border border-gray-200 hover:border-teal/40 hover:text-teal'
                    }`}
                  >
                    <Icon size={18} />
                    {t(tab.label)}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Accordion Content */}
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Accordion items={currentItems} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Still have questions CTA ── */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-teal to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div ref={ctaRef}>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              {t({ en: "Still have questions?", bn: 'এখনও প্রশ্ন আছে?' })}
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              {t({
                en: "Can't find the answer you're looking for? Feel free to reach out to our friendly team.",
                bn: 'আপনি যে উত্তর খুঁজছেন তা পাচ্ছেন না? আমাদের বন্ধুভাবাপন্ন দলের সাথে যোগাযোগ করতে দ্বিধা করবেন না।',
              })}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton to="/contact" className="bg-white text-teal font-heading font-semibold rounded-xl px-8 py-4 text-lg shadow-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2">
                <Phone size={20} />
                {t({ en: 'Contact Us', bn: 'যোগাযোগ করুন' })}
              </MagneticButton>
              <MagneticButton href="https://wa.me/8801712345678" className="border-2 border-white text-white font-heading font-semibold rounded-xl px-8 py-4 text-lg hover:bg-white hover:text-teal transition-colors inline-flex items-center gap-2">
                <MessageCircle size={20} />
                {t({ en: 'WhatsApp Us', bn: 'হোয়াটসঅ্যাপ করুন' })}
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default FAQPage;
