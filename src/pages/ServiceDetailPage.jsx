import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
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
  ArrowLeft,
  CheckCircle2,
  Clock,
  Stethoscope,
  ListChecks,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageTransition from '../components/ui/PageTransition';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';

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
/*  FULL SERVICE DATA                                                  */
/* ------------------------------------------------------------------ */

const servicesData = [
  {
    slug: 'preventive-diagnostic-care',
    icon: 'Shield',
    title: { en: 'Preventive & Diagnostic Care', bn: 'প্রতিরোধমূলক ও ডায়াগনস্টিক কেয়ার' },
    desc: {
      en: 'Regular checkups, digital X-rays, OPG, and 3D CBCT scanning to catch problems early and maintain oral health.',
      bn: 'নিয়মিত চেকআপ, ডিজিটাল এক্স-রে, OPG, এবং 3D CBCT স্ক্যানিং সমস্যা তাড়াতাড়ি ধরতে।',
    },
  },
  {
    slug: 'restorative-dentistry',
    icon: 'Wrench',
    title: { en: 'Restorative Dentistry', bn: 'পুনরুদ্ধার দন্তচিকিৎসা' },
    desc: {
      en: 'Composite fillings, GIC fillings, and dental bonding to restore damaged teeth to their natural form and function.',
      bn: 'ক্ষতিগ্রস্ত দাঁতকে তাদের স্বাভাবিক আকৃতি ও কার্যকারিতায় ফিরিয়ে আনতে কম্পোজিট ফিলিং।',
    },
  },
  {
    slug: 'root-canal-treatment',
    icon: 'Activity',
    title: { en: 'Root Canal Treatment', bn: 'রুট ক্যানাল চিকিৎসা' },
    desc: {
      en: 'Painless modern endodontic treatment using rotary technology. Save your natural tooth in as little as one visit.',
      bn: 'রোটারি প্রযুক্তি ব্যবহার করে ব্যথাহীন আধুনিক এন্ডোডন্টিক চিকিৎসা। এক ভিজিটেই দাঁত বাঁচান।',
    },
    fullDescription: {
      en: 'Root canal treatment (endodontic therapy) is a dental procedure that removes infected or inflamed pulp tissue from inside the tooth. Using advanced rotary instrumentation and electronic apex locators, Dr. Arman Hossain performs painless root canal procedures that can save your natural tooth. Our modern techniques significantly reduce treatment time — many cases can be completed in a single visit.',
      bn: 'রুট ক্যানাল চিকিৎসা (এন্ডোডন্টিক থেরাপি) একটি দন্ত চিকিৎসা পদ্ধতি যা দাঁতের ভেতর থেকে সংক্রমিত বা প্রদাহিত পাল্প টিস্যু অপসারণ করে। উন্নত রোটারি ইন্সট্রুমেন্টেশন এবং ইলেকট্রনিক এপেক্স লোকেটর ব্যবহার করে, ডা. আরমান হোসেন ব্যথাহীন রুট ক্যানাল পদ্ধতি সম্পাদন করেন। আমাদের আধুনিক কৌশল চিকিৎসার সময় উল্লেখযোগ্যভাবে কমিয়ে দেয় — অনেক ক্ষেত্রে এক ভিজিটেই সম্পন্ন করা যায়।',
    },
    procedures: {
      en: [
        'Digital X-ray and diagnosis of the infected tooth',
        'Local anesthesia for complete pain-free experience',
        'Access opening and removal of infected pulp',
        'Cleaning and shaping canals with rotary instruments',
        'Disinfection with advanced irrigating solutions',
        'Filling canals with biocompatible materials (Gutta-percha)',
        'Crown placement for long-term protection',
      ],
      bn: [
        'সংক্রমিত দাঁতের ডিজিটাল এক্স-রে এবং নির্ণয়',
        'সম্পূর্ণ ব্যথাহীন অভিজ্ঞতার জন্য লোকাল অ্যানেস্থেসিয়া',
        'অ্যাক্সেস ওপেনিং এবং সংক্রমিত পাল্প অপসারণ',
        'রোটারি ইন্সট্রুমেন্ট দিয়ে ক্যানাল পরিষ্কার ও আকৃতি প্রদান',
        'উন্নত ইরিগেটিং সলিউশন দিয়ে জীবাণুমুক্তকরণ',
        'বায়োকম্প্যাটিবল উপাদান (গাটা-পার্চা) দিয়ে ক্যানাল ফিলিং',
        'দীর্ঘমেয়াদী সুরক্ষার জন্য ক্রাউন স্থাপন',
      ],
    },
    benefits: {
      en: [
        'Save your natural tooth instead of extraction',
        'Virtually painless with modern anesthesia',
        'Can be completed in as little as one visit',
        'Prevents infection from spreading to other teeth',
        '95%+ success rate with proper care',
        'Preserves natural appearance and chewing function',
      ],
      bn: [
        'দাঁত তোলার পরিবর্তে আপনার প্রাকৃতিক দাঁত বাঁচান',
        'আধুনিক অ্যানেস্থেসিয়ায় প্রায় ব্যথাহীন',
        'এক ভিজিটেই সম্পন্ন করা সম্ভব',
        'সংক্রমণ অন্য দাঁতে ছড়ানো থেকে রক্ষা করে',
        'সঠিক যত্নে ৯৫%+ সাফল্যের হার',
        'প্রাকৃতিক চেহারা এবং চিবানোর কার্যকারিতা সংরক্ষণ করে',
      ],
    },
    recovery: {
      en: 'Most patients return to normal activities the same day. Mild discomfort for 1-2 days is manageable with over-the-counter pain relief. Avoid chewing on the treated tooth until the permanent crown is placed. Follow-up appointment within 1-2 weeks.',
      bn: 'বেশিরভাগ রোগী একই দিনে স্বাভাবিক কার্যকলাপে ফিরে যান। ১-২ দিনের হালকা অস্বস্তি ওভার-দ্য-কাউন্টার ব্যথার ওষুধে নিয়ন্ত্রণযোগ্য। স্থায়ী ক্রাউন স্থাপন না হওয়া পর্যন্ত চিকিৎসিত দাঁতে চিবানো এড়িয়ে চলুন। ১-২ সপ্তাহের মধ্যে ফলো-আপ অ্যাপয়েন্টমেন্ট।',
    },
  },
  {
    slug: 'crowns-bridges-dentures',
    icon: 'Crown',
    title: { en: 'Crowns, Bridges & Dentures', bn: 'ক্রাউন, ব্রিজ ও ডেনচার' },
    desc: {
      en: 'Zirconia crowns, E-Max crowns, dental bridges, and full/partial dentures for complete smile restoration.',
      bn: 'জিরকোনিয়া ক্রাউন, ই-ম্যাক্স ক্রাউন, ডেন্টাল ব্রিজ এবং সম্পূর্ণ/আংশিক ডেনচার।',
    },
  },
  {
    slug: 'dental-implants',
    icon: 'CircleDot',
    title: { en: 'Dental Implants', bn: 'ডেন্টাল ইমপ্লান্ট' },
    desc: {
      en: 'Permanent tooth replacement with titanium implants. UCLA-trained expertise for single tooth to full mouth rehabilitation.',
      bn: 'টাইটানিয়াম ইমপ্লান্ট দিয়ে স্থায়ী দাঁত প্রতিস্থাপন। UCLA-প্রশিক্ষিত দক্ষতা।',
    },
    fullDescription: {
      en: 'Dental implants are the gold standard for replacing missing teeth. A titanium post is surgically placed into the jawbone, acting as an artificial root. Once integrated with the bone (osseointegration), a custom-made crown is attached, creating a restoration that looks, feels, and functions like a natural tooth. Dr. Arman Hossain, trained at UCLA gIDE in implant dentistry, brings world-class expertise to every implant case — from single tooth replacements to full-arch All-on-4 rehabilitations.',
      bn: 'ডেন্টাল ইমপ্লান্ট হলো হারিয়ে যাওয়া দাঁত প্রতিস্থাপনের সর্বোত্তম মান। একটি টাইটানিয়াম পোস্ট চোয়ালের হাড়ে অস্ত্রোপচারের মাধ্যমে স্থাপন করা হয়, যা কৃত্রিম মূল হিসেবে কাজ করে। হাড়ের সাথে সংযুক্ত হওয়ার পর (অসিওইন্টিগ্রেশন), একটি কাস্টম-মেড ক্রাউন সংযুক্ত করা হয়। ডা. আরমান হোসেন, UCLA gIDE-তে ইমপ্লান্ট ডেন্টিস্ট্রিতে প্রশিক্ষিত, প্রতিটি ইমপ্লান্ট কেসে বিশ্বমানের দক্ষতা নিয়ে আসেন।',
    },
    procedures: {
      en: [
        'Comprehensive assessment with 3D CBCT scan',
        'Custom treatment planning using digital software',
        'Surgical placement of titanium implant under local anesthesia',
        'Healing period for osseointegration (3-6 months)',
        'Abutment placement and digital impression',
        'Custom crown fabrication and final placement',
        'Post-placement care and follow-up schedule',
      ],
      bn: [
        '3D CBCT স্ক্যানের মাধ্যমে ব্যাপক মূল্যায়ন',
        'ডিজিটাল সফটওয়্যার ব্যবহার করে কাস্টম চিকিৎসা পরিকল্পনা',
        'লোকাল অ্যানেস্থেসিয়ায় টাইটানিয়াম ইমপ্লান্টের সার্জিক্যাল স্থাপন',
        'অসিওইন্টিগ্রেশনের জন্য হিলিং পিরিয়ড (৩-৬ মাস)',
        'অ্যাবাটমেন্ট স্থাপন এবং ডিজিটাল ইম্প্রেশন',
        'কাস্টম ক্রাউন তৈরি এবং চূড়ান্ত স্থাপন',
        'স্থাপন-পরবর্তী যত্ন এবং ফলো-আপ সময়সূচী',
      ],
    },
    benefits: {
      en: [
        'Permanent solution — implants can last a lifetime',
        'Looks, feels, and functions like a natural tooth',
        'Preserves jawbone and prevents bone loss',
        'No damage to adjacent healthy teeth',
        'Restores full chewing ability and confidence',
        'Success rate of over 98% with proper care',
      ],
      bn: [
        'স্থায়ী সমাধান — ইমপ্লান্ট সারাজীবন টিকতে পারে',
        'প্রাকৃতিক দাঁতের মতো দেখায়, অনুভূত হয় এবং কাজ করে',
        'চোয়ালের হাড় সংরক্ষণ করে এবং হাড়ের ক্ষয় রোধ করে',
        'পাশের সুস্থ দাঁতের কোনো ক্ষতি হয় না',
        'সম্পূর্ণ চিবানোর ক্ষমতা এবং আত্মবিশ্বাস পুনরুদ্ধার করে',
        'সঠিক যত্নে ৯৮%+ সাফল্যের হার',
      ],
    },
    recovery: {
      en: 'After implant surgery, expect mild swelling for 2-3 days. Soft diet recommended for the first week. The osseointegration period takes 3-6 months, during which a temporary restoration may be provided. Once healed, the final crown is placed and you can resume all normal eating and activities.',
      bn: 'ইমপ্লান্ট সার্জারির পরে ২-৩ দিন হালকা ফোলাভাব থাকতে পারে। প্রথম সপ্তাহে নরম খাবার সুপারিশ করা হয়। অসিওইন্টিগ্রেশন পিরিয়ড ৩-৬ মাস সময় নেয়। সেরে ওঠার পর চূড়ান্ত ক্রাউন স্থাপন করা হয় এবং আপনি সব স্বাভাবিক খাওয়া ও কার্যকলাপ পুনরায় শুরু করতে পারেন।',
    },
  },
  {
    slug: 'orthodontics-braces-aligners',
    icon: 'GitBranch',
    title: { en: 'Orthodontics — Braces & Aligners', bn: 'অর্থোডন্টিক্স — ব্রেসেস ও অ্যালাইনার' },
    desc: {
      en: 'Metal braces, ceramic braces, and clear aligners (Invisalign) for perfectly aligned teeth and beautiful smiles.',
      bn: 'মেটাল ব্রেসেস, সিরামিক ব্রেসেস এবং ক্লিয়ার অ্যালাইনার সুন্দর হাসির জন্য।',
    },
    fullDescription: {
      en: 'Orthodontic treatment corrects misaligned teeth and improper bites to improve both dental health and aesthetics. We offer a full range of orthodontic solutions — from traditional metal braces and tooth-colored ceramic braces to virtually invisible clear aligners. Each treatment is customized after a thorough analysis of your dental structure using digital scanning and 3D treatment planning.',
      bn: 'অর্থোডন্টিক চিকিৎসা দাঁতের এবং কামড়ের অসমতা সংশোধন করে দন্ত স্বাস্থ্য এবং সৌন্দর্য উভয়ই উন্নত করে। আমরা অর্থোডন্টিক সমাধানের সম্পূর্ণ পরিসর প্রদান করি — ঐতিহ্যবাহী মেটাল ব্রেসেস এবং দাঁতের রঙের সিরামিক ব্রেসেস থেকে প্রায় অদৃশ্য ক্লিয়ার অ্যালাইনার পর্যন্ত। প্রতিটি চিকিৎসা ডিজিটাল স্ক্যানিং এবং 3D চিকিৎসা পরিকল্পনা ব্যবহার করে আপনার দাঁতের গঠনের পুঙ্খানুপুঙ্খ বিশ্লেষণের পরে কাস্টমাইজ করা হয়।',
    },
    procedures: {
      en: [
        'Initial consultation and digital dental scanning',
        'Comprehensive orthodontic assessment and X-rays',
        'Customized treatment plan with timeline',
        'Bracket bonding or aligner fitting',
        'Regular adjustment appointments (every 4-6 weeks)',
        'Progress monitoring with digital tracking',
        'Retainer fitting after treatment completion',
      ],
      bn: [
        'প্রাথমিক পরামর্শ এবং ডিজিটাল ডেন্টাল স্ক্যানিং',
        'ব্যাপক অর্থোডন্টিক মূল্যায়ন এবং এক্স-রে',
        'সময়সীমাসহ কাস্টমাইজড চিকিৎসা পরিকল্পনা',
        'ব্র্যাকেট বন্ডিং বা অ্যালাইনার ফিটিং',
        'নিয়মিত অ্যাডজাস্টমেন্ট অ্যাপয়েন্টমেন্ট (প্রতি ৪-৬ সপ্তাহ)',
        'ডিজিটাল ট্র্যাকিংয়ে অগ্রগতি পর্যবেক্ষণ',
        'চিকিৎসা সম্পন্ন হওয়ার পর রিটেইনার ফিটিং',
      ],
    },
    benefits: {
      en: [
        'Straighter teeth improve oral health and cleaning',
        'Corrects bite problems that cause jaw pain',
        'Multiple options — metal, ceramic, or invisible aligners',
        'Boosts self-confidence with a beautiful smile',
        'Modern braces are more comfortable than ever',
        'Clear aligners are removable and nearly invisible',
      ],
      bn: [
        'সোজা দাঁত মৌখিক স্বাস্থ্য এবং পরিষ্কার করা উন্নত করে',
        'কামড়ের সমস্যা সংশোধন করে যা চোয়ালে ব্যথা সৃষ্টি করে',
        'একাধিক বিকল্প — মেটাল, সিরামিক, বা অদৃশ্য অ্যালাইনার',
        'সুন্দর হাসির সাথে আত্মবিশ্বাস বাড়ায়',
        'আধুনিক ব্রেসেস আগের চেয়ে অনেক বেশি আরামদায়ক',
        'ক্লিয়ার অ্যালাইনার অপসারণযোগ্য এবং প্রায় অদৃশ্য',
      ],
    },
    recovery: {
      en: 'Braces may cause mild discomfort for a few days after each adjustment. Clear aligners are generally more comfortable. Treatment duration varies from 6 months to 2 years depending on complexity. Retainers must be worn after treatment to maintain results. Regular dental hygiene is especially important during orthodontic treatment.',
      bn: 'প্রতিটি অ্যাডজাস্টমেন্টের পর ব্রেসেস কয়েক দিন হালকা অস্বস্তি সৃষ্টি করতে পারে। ক্লিয়ার অ্যালাইনার সাধারণত বেশি আরামদায়ক। চিকিৎসার সময়কাল জটিলতার উপর নির্ভর করে ৬ মাস থেকে ২ বছর পর্যন্ত হতে পারে। ফলাফল বজায় রাখতে চিকিৎসার পরে রিটেইনার পরতে হবে।',
    },
  },
  {
    slug: 'periodontics-gum-treatment',
    icon: 'Heart',
    title: { en: 'Periodontics — Gum Treatment', bn: 'পেরিওডন্টিক্স — মাড়ির চিকিৎসা' },
    desc: {
      en: 'Advanced gum disease treatment, deep cleaning, and laser therapy to protect your teeth foundation.',
      bn: 'উন্নত মাড়ির রোগের চিকিৎসা, গভীর পরিষ্কার এবং লেজার থেরাপি।',
    },
  },
  {
    slug: 'oral-maxillofacial-surgery',
    icon: 'Scissors',
    title: { en: 'Oral & Maxillofacial Surgery', bn: 'ওরাল ও ম্যাক্সিলোফেসিয়াল সার্জারি' },
    desc: {
      en: 'Expert surgical procedures including wisdom tooth extraction, jaw surgery, and facial trauma management.',
      bn: 'আক্কেল দাঁত তোলা, চোয়ালের সার্জারি এবং মুখের আঘাত ব্যবস্থাপনা।',
    },
  },
  {
    slug: 'pediatric-dentistry',
    icon: 'Baby',
    title: { en: 'Pediatric Dentistry', bn: 'শিশু দন্তচিকিৎসা' },
    desc: {
      en: 'Gentle dental care for children in a friendly environment. Preventive treatments, sealants, and habit counseling.',
      bn: 'বন্ধুত্বপূর্ণ পরিবেশে শিশুদের জন্য মৃদু দন্ত চিকিৎসা।',
    },
  },
  {
    slug: 'cosmetic-dentistry',
    icon: 'Sparkles',
    title: { en: 'Cosmetic Dentistry & Smile Makeover', bn: 'কসমেটিক ডেন্টিস্ট্রি ও স্মাইল মেকওভার' },
    desc: {
      en: 'Professional teeth whitening (ZOOM), porcelain veneers, and complete smile makeover packages.',
      bn: 'পেশাদার দাঁত সাদাকরণ (ZOOM), পোর্সেলিন ভেনিয়ার এবং সম্পূর্ণ স্মাইল মেকওভার।',
    },
  },
  {
    slug: 'digital-imaging',
    icon: 'Monitor',
    title: { en: 'Digital Imaging — 3D CBCT, OPG', bn: 'ডিজিটাল ইমেজিং — 3D CBCT, OPG' },
    desc: {
      en: 'State-of-the-art digital periapical X-ray, panoramic OPG, and 3D CBCT scanning for precise diagnosis.',
      bn: 'অত্যাধুনিক ডিজিটাল পেরিয়াপিকাল এক্স-রে, প্যানোরামিক OPG এবং 3D CBCT স্ক্যানিং।',
    },
  },
  {
    slug: 'oral-medicine-pathology',
    icon: 'Microscope',
    title: { en: 'Oral Medicine & Pathology', bn: 'ওরাল মেডিসিন ও প্যাথলজি' },
    desc: {
      en: 'Diagnosis and management of oral diseases, mouth ulcers, oral cancer screening, and mucosal disorders.',
      bn: 'মৌখিক রোগের নির্ণয় ও ব্যবস্থাপনা, মুখের আলসার, ওরাল ক্যান্সার স্ক্রিনিং।',
    },
  },
  {
    slug: 'special-needs-dentistry',
    icon: 'Accessibility',
    title: { en: 'Special Needs Dentistry', bn: 'বিশেষ চাহিদা দন্তচিকিৎসা' },
    desc: {
      en: 'Compassionate dental care adapted for patients with physical, intellectual, or medical special needs.',
      bn: 'শারীরিক, মানসিক বা চিকিৎসা সংক্রান্ত বিশেষ চাহিদাসম্পন্ন রোগীদের জন্য সহানুভূতিশীল যত্ন।',
    },
  },
  {
    slug: 'laser-dentistry',
    icon: 'Zap',
    title: { en: 'Laser Dentistry', bn: 'লেজার ডেন্টিস্ট্রি' },
    desc: {
      en: 'Advanced laser treatments for gum disease, cavity detection, teeth whitening, and soft tissue procedures.',
      bn: 'মাড়ির রোগ, ক্যাভিটি সনাক্তকরণ, দাঁত সাদাকরণের জন্য উন্নত লেজার চিকিৎসা।',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  ANIMATION                                                          */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ------------------------------------------------------------------ */
/*  404 COMPONENT                                                      */
/* ------------------------------------------------------------------ */

const ServiceNotFound = ({ t }) => (
  <PageTransition>
    <Helmet>
      <title>Service Not Found | Everyday Dental Surgery</title>
    </Helmet>
    <section className="min-h-[70vh] flex items-center justify-center bg-offwhite pt-24">
      <div className="text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AlertTriangle size={64} className="text-gold mx-auto mb-6" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
            {t({ en: 'Service Not Found', bn: 'সেবা পাওয়া যায়নি' })}
          </h1>
          <p className="text-gray text-lg mb-8 max-w-md mx-auto">
            {t({
              en: 'The service you are looking for does not exist or may have been moved.',
              bn: 'আপনি যে সেবাটি খুঁজছেন তা বিদ্যমান নেই বা সরানো হয়ে থাকতে পারে।',
            })}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button to="/services" variant="primary" icon={ArrowLeft}>
              {t({ en: 'All Services', bn: 'সকল সেবা' })}
            </Button>
            <Button to="/" variant="outline">
              {t({ en: 'Go Home', bn: 'হোমে যান' })}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  </PageTransition>
);

/* ------------------------------------------------------------------ */
/*  GENERIC DETAIL VIEW (for services without full detail data)        */
/* ------------------------------------------------------------------ */

const SERVICE_IMAGES = {
  'preventive-diagnostic-care': 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=1600&q=80&fit=crop',
  'restorative-dentistry': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80&fit=crop',
  'root-canal-treatment': 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1600&q=80&fit=crop',
  'crowns-bridges-dentures': 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1600&q=80&fit=crop',
  'dental-implants': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&q=80&fit=crop',
  'orthodontics-braces-aligners': 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1600&q=80&fit=crop',
  'periodontics-gum-treatment': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1600&q=80&fit=crop',
  'oral-maxillofacial-surgery': 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1600&q=80&fit=crop',
  'pediatric-dentistry': 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=1600&q=80&fit=crop',
  'cosmetic-dentistry': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80&fit=crop',
  'digital-imaging': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1600&q=80&fit=crop',
  'oral-medicine-pathology': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1600&q=80&fit=crop',
  'special-needs-dentistry': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=80&fit=crop',
  'laser-dentistry': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1600&q=80&fit=crop',
};

const GenericDetailView = ({ service, t, Icon }) => (
  <>
    {/* Hero */}
    <section className="relative overflow-hidden min-h-[50vh] flex items-end">
      <img
        src={SERVICE_IMAGES[service.slug] || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=80&fit=crop'}
        alt={t(service.title)}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/40" />
      <div className="container mx-auto px-4 relative z-10 pb-12 pt-28 md:pt-36">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-teal mb-6 hover:text-teal-300 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} />
          {t({ en: 'Back to Services', bn: 'সেবাসমূহে ফিরে যান' })}
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-5 mb-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-teal/20 flex items-center justify-center">
            <Icon size={32} className="text-teal" />
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white">
            {t(service.title)}
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-gray-300 text-lg md:text-xl max-w-3xl"
        >
          {t(service.desc)}
        </motion.p>
      </div>
    </section>

    {/* Content */}
    <section className="py-16 md:py-24 bg-offwhite">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <Stethoscope size={24} className="text-teal" />
            <h2 className="font-heading text-2xl font-bold text-navy">
              {t({ en: 'About This Service', bn: 'এই সেবা সম্পর্কে' })}
            </h2>
          </div>
          <p className="text-gray leading-relaxed mb-8">{t(service.desc)}</p>
          <p className="text-gray leading-relaxed mb-8">
            {t({
              en: 'At Everyday Dental Surgery, this service is performed using the latest technology and techniques by Dr. Arman Hossain and his experienced team. Every procedure is tailored to your individual needs with a focus on comfort and optimal outcomes.',
              bn: 'এভরিডে ডেন্টাল সার্জারিতে, এই সেবাটি ডা. আরমান হোসেন এবং তার অভিজ্ঞ দলের দ্বারা সর্বশেষ প্রযুক্তি এবং কৌশল ব্যবহার করে সম্পাদিত হয়। প্রতিটি পদ্ধতি আরাম এবং সর্বোত্তম ফলাফলের উপর ফোকাস করে আপনার ব্যক্তিগত প্রয়োজন অনুসারে তৈরি করা হয়।',
            })}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button to="/appointment" variant="primary" size="lg" iconRight={ArrowRight}>
              {t({ en: 'Book This Service', bn: 'এই সেবা বুক করুন' })}
            </Button>
            <Button to="/contact" variant="outline" size="lg">
              {t({ en: 'Ask a Question', bn: 'একটি প্রশ্ন করুন' })}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  </>
);

/* ------------------------------------------------------------------ */
/*  FULL DETAIL VIEW (for services with complete data)                 */
/* ------------------------------------------------------------------ */

const FullDetailView = ({ service, t, Icon }) => (
  <>
    {/* Hero */}
    <section className="relative overflow-hidden min-h-[50vh] flex items-end">
      <img
        src={SERVICE_IMAGES[service.slug] || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=80&fit=crop'}
        alt={t(service.title)}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/40" />
      <div className="container mx-auto px-4 relative z-10 pb-12 pt-28 md:pt-36">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-teal mb-6 hover:text-teal-300 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} />
          {t({ en: 'Back to Services', bn: 'সেবাসমূহে ফিরে যান' })}
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-start gap-5 mb-6"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-teal/20 flex items-center justify-center shrink-0">
            <Icon size={36} className="text-teal" />
          </div>
          <div>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-2">
              {t(service.title)}
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl">
              {t(service.desc)}
            </p>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Full description */}
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Stethoscope size={24} className="text-teal" />
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy">
              {t({ en: 'Overview', bn: 'সংক্ষিপ্ত বিবরণ' })}
            </h2>
          </div>
          <p className="text-gray leading-relaxed text-lg">{t(service.fullDescription)}</p>
        </motion.div>
      </div>
    </section>

    {/* Procedure Steps */}
    <section className="py-16 md:py-20 bg-offwhite">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeading
          title="Procedure Steps"
          titleBn="পদ্ধতির ধাপসমূহ"
          subtitle="What to expect during your treatment"
          subtitleBn="আপনার চিকিৎসার সময় কী আশা করবেন"
          centered={false}
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {t(service.procedures).map((step, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="font-heading font-bold text-teal text-sm">{i + 1}</span>
              </div>
              <p className="text-navy font-medium leading-relaxed">{step}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Benefits */}
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeading
          title="Benefits"
          titleBn="সুবিধাসমূহ"
          subtitle="Why choose this treatment"
          subtitleBn="কেন এই চিকিৎসা বেছে নেবেন"
          centered={false}
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-4"
        >
          {t(service.benefits).map((benefit, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="flex items-start gap-3 bg-teal/5 rounded-xl p-5 border border-teal/10"
            >
              <CheckCircle2 size={22} className="text-teal shrink-0 mt-0.5" />
              <p className="text-navy font-medium">{benefit}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Recovery */}
    <section className="py-16 md:py-20 bg-offwhite">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-5">
            <Clock size={24} className="text-gold" />
            <h2 className="font-heading text-2xl font-bold text-navy">
              {t({ en: 'Recovery & Aftercare', bn: 'পুনরুদ্ধার ও পরবর্তী যত্ন' })}
            </h2>
          </div>
          <p className="text-gray leading-relaxed text-lg">{t(service.recovery)}</p>
        </motion.div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 md:py-24 bg-gradient-to-br from-teal to-teal-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            {t({
              en: 'Ready to Get Started?',
              bn: 'শুরু করতে প্রস্তুত?',
            })}
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            {t({
              en: 'Book your appointment for this service and take the first step towards better dental health.',
              bn: 'এই সেবার জন্য আপনার অ্যাপয়েন্টমেন্ট বুক করুন এবং ভালো দন্ত স্বাস্থ্যের দিকে প্রথম পদক্ষেপ নিন।',
            })}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button to="/appointment" variant="white" size="lg" iconRight={ArrowRight}>
              {t({ en: 'Book This Service', bn: 'এই সেবা বুক করুন' })}
            </Button>
            <Button to="/services" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-teal">
              {t({ en: 'View All Services', bn: 'সকল সেবা দেখুন' })}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  </>
);

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const { t } = useLanguage();

  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    return <ServiceNotFound t={t} />;
  }

  const Icon = iconMap[service.icon] || Shield;
  const hasFullDetail = service.fullDescription && service.procedures && service.benefits && service.recovery;

  return (
    <PageTransition>
      <Helmet>
        <title>{`${t(service.title)} | Everyday Dental Surgery`}</title>
        <meta
          name="description"
          content={t(service.fullDescription || service.desc)}
        />
        <meta property="og:title" content={`${t(service.title)} | Everyday Dental Surgery`} />
        <meta property="og:description" content={t(service.desc)} />
        <link rel="canonical" href={`https://example-dental.com/services/${service.slug}`} />
      </Helmet>

      {hasFullDetail ? (
        <FullDetailView service={service} t={t} Icon={Icon} />
      ) : (
        <GenericDetailView service={service} t={t} Icon={Icon} />
      )}
    </PageTransition>
  );
};

export default ServiceDetailPage;
