import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageTransition from '../components/ui/PageTransition';
import TiltCard from '../components/ui/TiltCard';
import { useScrollReveal, useStaggerReveal } from '../hooks/useGsapAnimations';
import DentalBackground from '../components/ui/DentalBackground';
import DentalDivider from '../components/ui/DentalDivider';

/* ------------------------------------------------------------------ */
/*  ARTICLES DATA                                                      */
/* ------------------------------------------------------------------ */

const articles = [
  {
    id: 1,
    slug: 'why-root-canals-no-longer-painful',
    title: {
      en: 'Why Root Canals Are No Longer Painful — The Truth in 2026',
      bn: 'কেন রুট ক্যানাল আর বেদনাদায়ক নয় — ২০২৬ এর সত্য',
    },
    category: { en: 'Endodontics', bn: 'এন্ডোডন্টিক্স' },
    readTime: '5 min',
    date: 'March 15, 2026',
    excerpt: {
      en: "Modern rotary technology and advanced anaesthesia have completely transformed root canal treatment. Here's what you need to know.",
      bn: 'আধুনিক রোটারি প্রযুক্তি এবং উন্নত অ্যানেসথেসিয়া রুট ক্যানাল চিকিৎসাকে সম্পূর্ণ বদলে দিয়েছে।',
    },
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&q=85&fit=crop',
  },
  {
    id: 2,
    slug: 'dental-implants-vs-dentures',
    title: {
      en: 'Dental Implants vs Dentures: Which is Right for You?',
      bn: 'ডেন্টাল ইমপ্লান্ট বনাম ডেনচার: আপনার জন্য কোনটি সঠিক?',
    },
    category: { en: 'Implants', bn: 'ইমপ্লান্ট' },
    readTime: '7 min',
    date: 'March 8, 2026',
    excerpt: {
      en: 'A comprehensive comparison of dental implants and dentures — cost, comfort, durability, and which option suits your lifestyle.',
      bn: 'ডেন্টাল ইমপ্লান্ট এবং ডেনচারের ব্যাপক তুলনা — খরচ, আরাম, স্থায়িত্ব।',
    },
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=85&fit=crop',
  },
  {
    id: 3,
    slug: 'how-often-visit-dentist',
    title: {
      en: 'How Often Should You Really Visit the Dentist?',
      bn: 'আসলে কতবার ডেন্টিস্টের কাছে যাওয়া উচিত?',
    },
    category: { en: 'Preventive Care', bn: 'প্রতিরোধমূলক যত্ন' },
    readTime: '4 min',
    date: 'February 28, 2026',
    excerpt: {
      en: 'Most people wait until something hurts. But preventive dental visits can save you thousands in treatment costs and preserve your natural teeth.',
      bn: 'বেশিরভাগ মানুষ ব্যথা না হওয়া পর্যন্ত অপেক্ষা করেন। কিন্তু প্রতিরোধমূলক পরিদর্শন হাজার টাকা বাঁচাতে পারে।',
    },
    image: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600&q=85&fit=crop',
  },
  {
    id: 4,
    slug: 'clear-aligners-vs-metal-braces',
    title: {
      en: 'Clear Aligners vs Metal Braces: A Complete Comparison',
      bn: 'ক্লিয়ার অ্যালাইনার বনাম মেটাল ব্রেসেস: সম্পূর্ণ তুলনা',
    },
    category: { en: 'Orthodontics', bn: 'অর্থোডন্টিক্স' },
    readTime: '6 min',
    date: 'February 20, 2026',
    excerpt: {
      en: 'Choosing between clear aligners and traditional braces? We break down the pros, cons, costs, and treatment times for each option.',
      bn: 'ক্লিয়ার অ্যালাইনার এবং ঐতিহ্যবাহী ব্রেসেসের মধ্যে পছন্দ? আমরা প্রতিটি বিকল্পের সুবিধা-অসুবিধা বিশ্লেষণ করি।',
    },
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=85&fit=crop',
  },
  {
    id: 5,
    slug: '10-foods-destroying-your-teeth',
    title: {
      en: '10 Foods That Are Secretly Destroying Your Teeth',
      bn: '১০টি খাবার যা গোপনে আপনার দাঁত ধ্বংস করছে',
    },
    category: { en: 'Oral Health', bn: 'মৌখিক স্বাস্থ্য' },
    readTime: '5 min',
    date: 'February 10, 2026',
    excerpt: {
      en: 'From citrus fruits to sports drinks — these common foods might be eroding your enamel without you even knowing it.',
      bn: 'সাইট্রাস ফল থেকে স্পোর্টস ড্রিংক — এই সাধারণ খাবারগুলো আপনার এনামেল ক্ষয় করতে পারে।',
    },
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=85&fit=crop',
  },
  {
    id: 6,
    slug: 'first-dental-implant-consultation',
    title: {
      en: 'What to Expect During Your First Dental Implant Consultation',
      bn: 'আপনার প্রথম ডেন্টাল ইমপ্লান্ট পরামর্শে কী আশা করবেন',
    },
    category: { en: 'Implants', bn: 'ইমপ্লান্ট' },
    readTime: '8 min',
    date: 'January 30, 2026',
    excerpt: {
      en: "Your first implant consultation doesn't have to be scary. Here's a step-by-step guide of what happens and how to prepare.",
      bn: 'আপনার প্রথম ইমপ্লান্ট পরামর্শ ভীতিকর হতে হবে না। এখানে ধাপে ধাপে গাইড।',
    },
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&q=85&fit=crop',
  },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

const BlogPage = () => {
  const { t } = useLanguage();
  const heroRef = useScrollReveal({ y: 40, duration: 0.8 });
  const gridRef = useStaggerReveal({ stagger: 0.1, y: 60 });

  return (
    <PageTransition>
      <Helmet>
        <title>
          {t({
            en: 'Dental Health Blog | Everyday Dental Surgery',
            bn: 'দন্ত স্বাস্থ্য ব্লগ | এভরিডে ডেন্টাল সার্জারি',
          })}
        </title>
        <meta
          name="description"
          content="Expert dental health insights, tips, and articles from Dr. Arman Hossain at Everyday Dental Surgery, Rangpur."
        />
        <meta property="og:title" content="Dental Health Blog | Everyday Dental Surgery" />
        <meta
          property="og:description"
          content="Read expert dental health articles on root canals, implants, orthodontics, oral hygiene, and more."
        />
        <link rel="canonical" href="https://example-dental.com/blog" />
      </Helmet>

      {/* ========================= HERO BANNER ========================== */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=80&fit=crop"
          alt="Dental health blog"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/75 to-navy/50" />

        <div ref={heroRef} className="container mx-auto px-4 relative z-10 text-center py-28 md:py-36">
          <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {t({ en: 'Dental Health Blog', bn: 'দন্ত স্বাস্থ্য ব্লগ' })}
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            {t({
              en: 'Expert insights from Dr. Arman Hossain',
              bn: 'ডা. আরমানের বিশেষজ্ঞ অন্তর্দৃষ্টি',
            })}
          </p>
          <div className="mt-4 h-1 w-20 rounded-full bg-teal mx-auto" />
        </div>
      </section>

      {/* Dental divider */}
      <DentalDivider speed={22} className="bg-offwhite" />

      {/* ========================= BLOG GRID ============================ */}
      <section className="py-16 md:py-24 bg-offwhite relative">
        <DentalBackground count={32} density="dense" />
        <div className="container mx-auto px-4">
          <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {articles.map((article) => (
              <TiltCard
                key={article.id}
                intensity={8}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col transition-all hover:border-teal/30 hover:shadow-xl hover:shadow-teal/10"
              >
                {/* Featured image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={t(article.title)}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <span className="absolute top-4 left-4 bg-teal text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {t(article.category)}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-heading text-lg font-bold text-navy mb-2 leading-snug line-clamp-2">
                    {t(article.title)}
                  </h3>
                  <p className="text-gray text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
                    {t(article.excerpt)}
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                      <User size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-navy text-xs font-semibold">Dr. Arman Hossain</p>
                      <div className="flex items-center gap-2 text-gray text-xs">
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {article.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {article.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-teal font-heading font-semibold text-sm group"
                  >
                    {t({ en: 'Read More', bn: 'আরও পড়ুন' })}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default BlogPage;
