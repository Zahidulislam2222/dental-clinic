import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────
   ScrollStorySection
   A single alternating left/right section that slides in
   from left or right as the user scrolls into view.
   ────────────────────────────────────────────────────────── */
const ScrollStorySection = ({ item, index, isReversed }) => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const visualRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const direction = isReversed ? 1 : -1;

      // Content slides in from the side
      gsap.fromTo(
        contentRef.current,
        { x: direction * 120, opacity: 0, filter: 'blur(6px)' },
        {
          x: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 30%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Visual slides in from the opposite side
      gsap.fromTo(
        visualRef.current,
        { x: -direction * 120, opacity: 0, scale: 0.85, filter: 'blur(6px)' },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 30%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Subtle parallax on the whole section
      gsap.fromTo(
        sectionRef.current,
        { y: 40 },
        {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isReversed]);

  const IconComp = item.icon;
  const accentColors = ['from-teal/20 to-teal/5', 'from-gold/20 to-gold/5', 'from-teal/15 to-cyan-500/5'];
  const iconBg = ['bg-teal', 'bg-gold', 'bg-teal'];
  const numberColor = ['text-teal/10', 'text-gold/10', 'text-teal/10'];

  return (
    <div
      ref={sectionRef}
      className="py-16 md:py-24 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-10 md:gap-16 items-center ${isReversed ? 'direction-rtl' : ''}`}>
          {/* Visual / Icon side */}
          <div
            ref={visualRef}
            className={`flex justify-center ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}
          >
            <div className={`relative w-64 h-64 md:w-80 md:h-80 rounded-3xl bg-gradient-to-br ${accentColors[index % 3]} flex items-center justify-center shadow-2xl`}>
              {/* Large background number */}
              <span className={`absolute top-4 left-6 font-heading text-[120px] md:text-[160px] font-black ${numberColor[index % 3]} select-none leading-none`}>
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Icon */}
              <div className={`relative z-10 w-24 h-24 md:w-28 md:h-28 rounded-2xl ${iconBg[index % 3]} flex items-center justify-center shadow-xl`}>
                <IconComp className="w-12 h-12 md:w-14 md:h-14 text-white" />
              </div>

              {/* Decorative dots */}
              <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-teal/30 animate-pulse" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-gold/40 animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 -right-4 w-3 h-3 rounded-full bg-teal/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* Content side */}
          <div
            ref={contentRef}
            className={`${isReversed ? 'lg:order-1 lg:text-right' : 'lg:order-2 lg:text-left'} text-center`}
          >
            {/* Tag */}
            <div className={`inline-flex items-center gap-2 mb-4 ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
              <span className="w-8 h-[2px] bg-teal" />
              <span className="text-teal text-sm font-semibold tracking-wider uppercase font-heading">
                {t(item.tag)}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-heading text-2xl md:text-4xl font-bold text-navy mb-5 leading-tight">
              {t(item.title)}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0">
              {t(item.description)}
            </p>

            {/* Highlights */}
            {item.highlights && (
              <div className={`flex flex-wrap gap-3 ${isReversed ? 'lg:justify-end justify-center' : 'lg:justify-start justify-center'}`}>
                {item.highlights.map((h, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-teal/10 text-teal text-sm font-medium border border-teal/20"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                    {t(h)}
                  </motion.span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   ScrollStory
   Renders multiple alternating sections with a vertical
   progress line connecting them.
   ────────────────────────────────────────────────────────── */
const ScrollStory = ({ sections, className = '' }) => {
  const containerRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    if (!progressRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        progressRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 0.5,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Vertical progress line */}
      <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gray-200">
        <div
          ref={progressRef}
          className="absolute inset-0 bg-gradient-to-b from-teal via-teal to-gold origin-top"
        />
      </div>

      {/* Sections */}
      {sections.map((item, index) => (
        <ScrollStorySection
          key={index}
          item={item}
          index={index}
          isReversed={index % 2 !== 0}
        />
      ))}
    </div>
  );
};

export default ScrollStory;
