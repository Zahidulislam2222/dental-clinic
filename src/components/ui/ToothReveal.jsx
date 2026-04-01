import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ToothReveal — A tooth that splits open as user scrolls, revealing content.
 * The two halves of the tooth separate left/right and content appears in the gap.
 *
 * @param {'split'|'open'|'smile'} variant
 *   - split: tooth splits vertically into 2 halves
 *   - open: tooth top opens like a lid
 *   - smile: tooth mouth opens progressively into a smile
 * @param {string} className - wrapper classes
 */
const ToothReveal = ({ variant = 'split', className = '', children }) => {
  const containerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const topRef = useRef(null);
  const contentRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (variant === 'split') {
        // Tooth splits into left and right halves
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1.5,
          },
        });

        tl.fromTo(leftRef.current, { x: 0, opacity: 1 }, { x: -80, opacity: 0.3, rotate: -15 }, 0);
        tl.fromTo(rightRef.current, { x: 0, opacity: 1 }, { x: 80, opacity: 0.3, rotate: 15 }, 0);
        tl.fromTo(contentRef.current, { opacity: 0, scale: 0.8, y: 20 }, { opacity: 1, scale: 1, y: 0 }, 0.2);
        tl.fromTo(glowRef.current, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1 }, 0);

      } else if (variant === 'open') {
        // Top of tooth opens like a lid
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'top 25%',
            scrub: 1.5,
          },
        });

        tl.fromTo(topRef.current, { y: 0, rotate: 0 }, { y: -60, rotate: -25, transformOrigin: 'left bottom' }, 0);
        tl.fromTo(contentRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, 0.2);
        tl.fromTo(glowRef.current, { opacity: 0 }, { opacity: 1 }, 0);

      } else if (variant === 'smile') {
        // Tooth mouth progressively opens into a smile
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1.5,
          },
        });

        // Scale the mouth open
        tl.fromTo('.smile-mouth', { scaleY: 0, transformOrigin: 'top center' }, { scaleY: 1, duration: 1 }, 0);
        // Sparkles appear
        tl.fromTo('.smile-sparkles circle', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.1 }, 0.3);
        tl.fromTo(contentRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.3);
        tl.fromTo(glowRef.current, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1 }, 0);
      }
    }, containerRef);

    return () => ctx.revert();
  }, [variant]);

  if (variant === 'split') {
    return (
      <div ref={containerRef} className={`relative py-16 md:py-24 overflow-hidden ${className}`}>
        {/* Center glow */}
        <div ref={glowRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[300px] h-[300px] rounded-full bg-teal/10 blur-[80px]" />
        </div>

        {/* Split tooth halves */}
        <div className="flex justify-center items-center gap-0 mb-8 pointer-events-none" aria-hidden="true">
          {/* Left half */}
          <svg ref={leftRef} width="120" height="160" viewBox="0 0 120 180" className="will-change-transform">
            <defs>
              <linearGradient id="split-left-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(0,191,166,0.4)" />
                <stop offset="100%" stopColor="rgba(0,191,166,0.1)" />
              </linearGradient>
            </defs>
            <path
              d="M110 20C88 10 68 15 58 30C48 50 38 90 50 140C58 165 78 160 100 130L100 20Z"
              fill="url(#split-left-grad)"
              stroke="rgba(0,191,166,0.5)"
              strokeWidth="2"
            />
            <path d="M85 50 Q95 45 100 50" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          </svg>
          {/* Right half */}
          <svg ref={rightRef} width="120" height="160" viewBox="0 0 120 180" className="will-change-transform">
            <defs>
              <linearGradient id="split-right-grad" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(0,191,166,0.4)" />
                <stop offset="100%" stopColor="rgba(0,191,166,0.1)" />
              </linearGradient>
            </defs>
            <path
              d="M10 20C32 10 52 15 62 30C72 50 82 90 70 140C62 165 42 160 20 130L20 20Z"
              fill="url(#split-right-grad)"
              stroke="rgba(0,191,166,0.5)"
              strokeWidth="2"
            />
            <path d="M35 50 Q25 45 20 50" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Revealed content */}
        <div ref={contentRef} className="relative z-10">
          {children}
        </div>
      </div>
    );
  }

  if (variant === 'open') {
    return (
      <div ref={containerRef} className={`relative py-16 md:py-24 overflow-hidden ${className}`}>
        <div ref={glowRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[250px] h-[250px] rounded-full bg-teal/8 blur-[60px]" />
        </div>

        <div className="flex justify-center mb-8 pointer-events-none" aria-hidden="true">
          <div className="relative">
            {/* Bottom/body of tooth */}
            <svg width="160" height="120" viewBox="0 0 200 150">
              <path
                d="M100 10C70 10 50 25 45 50C40 75 35 110 60 140C72 155 86 150 100 125C114 150 128 155 140 140C165 110 160 75 155 50C150 25 130 10 100 10Z"
                fill="rgba(0,191,166,0.1)"
                stroke="rgba(0,191,166,0.4)"
                strokeWidth="2"
              />
              <ellipse cx="100" cy="50" rx="35" ry="8" fill="rgba(0,191,166,0.06)" />
            </svg>
            {/* Top lid — this rotates open */}
            <svg ref={topRef} width="160" height="70" viewBox="0 0 200 80" className="absolute -top-6 left-0 will-change-transform">
              <path
                d="M50 70C50 70 45 35 65 20C80 10 120 10 135 20C155 35 150 70 150 70Z"
                fill="rgba(0,191,166,0.2)"
                stroke="rgba(0,191,166,0.5)"
                strokeWidth="2"
              />
              <path d="M80 40 Q100 30 120 40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        <div ref={contentRef} className="relative z-10">
          {children}
        </div>
      </div>
    );
  }

  // variant === 'smile'
  return (
    <div ref={containerRef} className={`relative py-16 md:py-24 overflow-hidden ${className}`}>
      <div ref={glowRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[280px] h-[280px] rounded-full bg-teal/8 blur-[70px]" />
      </div>

      <div className="flex justify-center mb-8 pointer-events-none" aria-hidden="true">
        <svg width="180" height="220" viewBox="0 0 200 240">
          <defs>
            <linearGradient id="smile-tooth-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,191,166,0.35)" />
              <stop offset="100%" stopColor="rgba(0,191,166,0.08)" />
            </linearGradient>
          </defs>

          {/* Tooth body */}
          <path
            d="M100 15C72 15 50 30 47 58C44 86 38 125 62 170C75 192 87 188 100 158C113 188 125 192 138 170C162 125 156 86 153 58C150 30 128 15 100 15Z"
            fill="url(#smile-tooth-grad)"
            stroke="rgba(0,191,166,0.5)"
            strokeWidth="2"
          />

          {/* Eyes — get happier as scroll progresses */}
          <ellipse cx="78" cy="72" rx="8" ry="10" fill="rgba(0,191,166,0.5)" />
          <ellipse cx="122" cy="72" rx="8" ry="10" fill="rgba(0,191,166,0.5)" />
          <ellipse cx="80" cy="69" rx="3" ry="3" fill="rgba(255,255,255,0.5)" />
          <ellipse cx="124" cy="69" rx="3" ry="3" fill="rgba(255,255,255,0.5)" />

          {/* Mouth — opens via scaleY scroll */}
          <g className="smile-mouth">
            <path
              d="M72 100 Q100 140 128 100"
              fill="rgba(0,191,166,0.3)"
              stroke="rgba(0,191,166,0.6)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* Sparkles that appear */}
          <g className="smile-sparkles">
            <circle cx="40" cy="40" r="4" fill="rgba(212,175,55,0.6)" />
            <circle cx="165" cy="50" r="3" fill="rgba(0,191,166,0.5)" />
            <circle cx="155" cy="25" r="5" fill="rgba(255,255,255,0.4)" />
            <circle cx="35" cy="100" r="3.5" fill="rgba(0,191,166,0.4)" />
            <circle cx="170" cy="110" r="4" fill="rgba(212,175,55,0.5)" />
            <circle cx="50" cy="160" r="3" fill="rgba(255,255,255,0.3)" />
          </g>
        </svg>
      </div>

      <div ref={contentRef} className="relative z-10">
        {children}
      </div>
    </div>
  );
};

/**
 * ScrollParallax3D — Wraps a 3D dental object and makes it scale/rotate on scroll
 */
export const ScrollParallax3D = ({ children, className = '' }) => {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { scale: 0.6, rotateY: -30, rotateX: 10, opacity: 0 },
        {
          scale: 1,
          rotateY: 0,
          rotateX: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 90%',
            end: 'top 30%',
            scrub: 1.5,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={`will-change-transform ${className}`} style={{ perspective: '1000px' }}>
      {children}
    </div>
  );
};

export default ToothReveal;
