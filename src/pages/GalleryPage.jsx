import media from '../data/media.json';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageTransition from '../components/ui/PageTransition';
import DentalBackground from '../components/ui/DentalBackground';
import RunningTooth from '../components/ui/RunningTooth';

/* ------------------------------------------------------------------ */
/*  GALLERY DATA                                                       */
/* ------------------------------------------------------------------ */

const galleryItems = [
  { id: 1, category: 'clinic', label: 'Reception Area', labelBn: 'রিসেপশন এরিয়া', image: media.image34 },
  { id: 2, category: 'clinic', label: 'Treatment Room 1', labelBn: 'চিকিৎসা কক্ষ ১', image: media.image47 },
  { id: 3, category: 'clinic', label: 'Sterilization Unit', labelBn: 'জীবাণুমুক্তকরণ ইউনিট', image: media.image23 },
  { id: 4, category: 'procedures', label: 'Digital X-Ray Setup', labelBn: 'ডিজিটাল এক্স-রে সেটআপ', image: media.image6 },
  { id: 5, category: 'procedures', label: 'Implant Surgery', labelBn: 'ইমপ্লান্ট সার্জারি', image: media.image30 },
  { id: 6, category: 'procedures', label: 'Laser Treatment', labelBn: 'লেজার চিকিৎসা', image: media.image41 },
  { id: 7, category: 'team', label: 'Dr. Arman Hossain', labelBn: 'ডা. আরমান হোসেন', image: media.image12 },
  { id: 8, category: 'team', label: 'Dental Team', labelBn: 'ডেন্টাল টিম', image: media.image12 },
  { id: 9, category: 'team', label: 'Support Staff', labelBn: 'সহায়তা কর্মী', image: media.image17 },
  { id: 10, category: 'before-after', label: 'Smile Makeover', labelBn: 'স্মাইল মেকওভার', image: media.image3 },
  { id: 11, category: 'before-after', label: 'Teeth Whitening Result', labelBn: 'দাঁত সাদাকরণ ফলাফল', image: media.image37 },
  { id: 12, category: 'before-after', label: 'Braces Transformation', labelBn: 'ব্রেসেস পরিবর্তন', image: media.image6 },
];

const categories = [
  { key: 'all', label: { en: 'All', bn: 'সব' } },
  { key: 'clinic', label: { en: 'Clinic', bn: 'ক্লিনিক' } },
  { key: 'procedures', label: { en: 'Procedures', bn: 'পদ্ধতি' } },
  { key: 'team', label: { en: 'Team', bn: 'টিম' } },
  { key: 'before-after', label: { en: 'Before & After', bn: 'আগে ও পরে' } },
];

/* ------------------------------------------------------------------ */
/*  MASONRY HEIGHT PATTERN                                             */
/* ------------------------------------------------------------------ */

const heightClasses = [
  'h-52', 'h-64', 'h-48', 'h-60',
  'h-56', 'h-44', 'h-64', 'h-52',
  'h-48', 'h-60', 'h-56', 'h-44',
];

/* ------------------------------------------------------------------ */
/*  ANIMATION HELPERS                                                  */
/* ------------------------------------------------------------------ */

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
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
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

const GalleryPage = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const filteredItems =
    activeCategory === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setDirection(0);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goNext = useCallback(() => {
    setDirection(1);
    setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
  }, [filteredItems.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  }, [filteredItems.length]);

  /* Lock body scroll when lightbox is open */
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxOpen]);

  /* Keyboard nav */
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, goNext, goPrev]);

  return (
    <PageTransition>
      <Helmet>
        <title>
          {t({
            en: 'Clinic Gallery | Everyday Dental Surgery',
            bn: 'ক্লিনিক গ্যালারি | এভরিডে ডেন্টাল সার্জারি',
          })}
        </title>
        <meta
          name="description"
          content="Explore our modern dental clinic, treatment rooms, advanced equipment, and team at Everyday Dental Surgery, Rangpur."
        />
        <meta property="og:title" content="Clinic Gallery | Everyday Dental Surgery" />
        <link rel="canonical" href="https://example-dental.com/gallery" />
      </Helmet>

      {/* ========================= HERO ================================= */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-center">
        <img
          src={media.image45}
          alt="Dental clinic gallery"
          width={800}
          height={600}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/75 to-navy/50" />

        <div className="container mx-auto px-4 relative z-10 text-center py-28 md:py-36">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            {t({ en: 'Our Clinic Gallery', bn: 'আমাদের ক্লিনিক গ্যালারি' })}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto"
          >
            {t({
              en: 'Take a virtual tour of our modern dental facility and meet the team',
              bn: 'আমাদের আধুনিক ডেন্টাল সুবিধার ভার্চুয়াল ট্যুর নিন এবং টিমের সাথে পরিচিত হন',
            })}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 h-1 w-20 rounded-full bg-teal mx-auto"
          />
        </div>
      </section>

      {/* Running tooth */}
      <RunningTooth direction="right" speed={12} size={45} className="bg-offwhite" />

      {/* ========================= FILTER + GALLERY ===================== */}
      <section className="py-16 md:py-24 bg-offwhite relative">
        <DentalBackground count={34} density="dense" />
        <div className="container mx-auto px-4">
          {/* Filter tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-14"
          >
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key);
                  setLightboxIndex(0);
                }}
                className={`px-5 py-2 rounded-full text-sm font-heading font-semibold transition-all duration-300 ${
                  activeCategory === cat.key
                    ? 'bg-teal text-white shadow-lg shadow-teal/20'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {t(cat.label)}
              </button>
            ))}
          </motion.div>

          {/* Masonry grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="break-inside-avoid"
                >
                  <motion.button
                    onClick={() => openLightbox(i)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative w-full ${heightClasses[item.id - 1] || 'h-52'} rounded-2xl overflow-hidden group cursor-pointer block`}
                  >
                    <img
                      src={item.image}
                      alt={t({ en: item.label, bn: item.labelBn })}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <span className="text-white font-heading font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                        {t({ en: item.label, bn: item.labelBn })}
                      </span>
                    </div>
                    {/* Default label */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm text-navy text-sm font-heading font-semibold px-3 py-1.5 rounded-lg shadow-sm">
                        {t({ en: item.label, bn: item.labelBn })}
                      </span>
                    </div>
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ========================= LIGHTBOX ============================= */}
      <AnimatePresence>
        {lightboxOpen && filteredItems[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-navy/90 backdrop-blur-md" />

            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Navigation arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <ChevronRight size={28} />
            </button>

            {/* Content */}
            <div
              className="relative w-full max-w-3xl aspect-[4/3] mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={filteredItems[lightboxIndex].id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-2xl overflow-hidden"
                >
                  <img
                    src={filteredItems[lightboxIndex].image}
                    alt={t({ en: filteredItems[lightboxIndex].label, bn: filteredItems[lightboxIndex].labelBn })}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-heading font-bold text-xl md:text-2xl">
                      {t({
                        en: filteredItems[lightboxIndex].label,
                        bn: filteredItems[lightboxIndex].labelBn,
                      })}
                    </h3>
                    <p className="text-white/70 text-sm mt-1">
                      {lightboxIndex + 1} / {filteredItems.length}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default GalleryPage;
