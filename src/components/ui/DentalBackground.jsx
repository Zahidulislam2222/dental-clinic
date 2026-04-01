import { useMemo } from 'react';

/* ── SVG Dental Icons ── */
const ToothIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 60 70" fill="currentColor" className={className}>
    <path d="M30 5C20 5 12 10 10 20C8 30 5 45 15 60C20 67 25 65 30 55C35 65 40 67 45 60C55 45 52 30 50 20C48 10 40 5 30 5Z" />
  </svg>
);

const ToothbrushIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size * 0.35} viewBox="0 0 100 35" fill="currentColor" className={className}>
    <rect x="0" y="12" width="55" height="11" rx="5" />
    <rect x="55" y="8" width="40" height="19" rx="4" />
    <rect x="62" y="11" width="4" height="13" rx="1" opacity="0.5" />
    <rect x="70" y="11" width="4" height="13" rx="1" opacity="0.5" />
    <rect x="78" y="11" width="4" height="13" rx="1" opacity="0.5" />
    <rect x="86" y="11" width="4" height="13" rx="1" opacity="0.5" />
  </svg>
);

const MolarIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 60 65" fill="currentColor" className={className}>
    <path d="M15 5C8 5 5 12 5 20C5 30 3 45 12 58C16 64 20 62 24 52C27 58 33 58 36 52C40 62 44 64 48 58C57 45 55 30 55 20C55 12 52 5 45 5C40 5 37 8 30 8C23 8 20 5 15 5Z" />
  </svg>
);

const DentalMirrorIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 70" fill="currentColor" className={className}>
    <circle cx="20" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="3" />
    <circle cx="20" cy="16" r="9" opacity="0.3" />
    <rect x="18" y="30" width="4" height="36" rx="2" />
  </svg>
);

const SparkleIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="currentColor" className={className}>
    <path d="M20 0L23 15L40 20L23 25L20 40L17 25L0 20L17 15Z" />
  </svg>
);

const BracesIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 80 48" fill="currentColor" className={className}>
    <rect x="5" y="16" width="12" height="16" rx="2" opacity="0.7" />
    <rect x="22" y="16" width="12" height="16" rx="2" opacity="0.7" />
    <rect x="46" y="16" width="12" height="16" rx="2" opacity="0.7" />
    <rect x="63" y="16" width="12" height="16" rx="2" opacity="0.7" />
    <rect x="0" y="22" width="80" height="4" rx="2" opacity="0.4" />
  </svg>
);

/* Small dot / bubble particle */
const DotIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" className={className}>
    <circle cx="10" cy="10" r="10" />
  </svg>
);

/* Plus / cross sparkle */
const CrossSparkle = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="currentColor" className={className}>
    <rect x="12" y="2" width="6" height="26" rx="3" />
    <rect x="2" y="12" width="26" height="6" rx="3" />
  </svg>
);

const ICONS = [ToothIcon, SparkleIcon, MolarIcon, DotIcon, ToothbrushIcon, CrossSparkle, DentalMirrorIcon, SparkleIcon, BracesIcon, DotIcon];

/**
 * DentalBackground — floating dental SVG icons as background decoration
 * @param {number} count - number of floating icons (default 20)
 * @param {'light'|'dark'} theme - color theme
 * @param {'subtle'|'normal'|'dense'} density - opacity/visibility level
 * @param {string} className - additional classes
 */
const DentalBackground = ({ count = 20, theme = 'light', density = 'normal', className = '' }) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const IconComp = ICONS[i % ICONS.length];
      const size = 14 + Math.random() * 38;
      const left = (i / count) * 100 + (Math.random() * 12 - 6);
      const top = Math.random() * 100;
      const duration = 12 + Math.random() * 18;
      const delay = Math.random() * -duration;
      const startRotation = Math.random() * 360;
      const animType = i % 3; // 0=float-drift, 1=zigzag, 2=circular

      return { IconComp, size, left, top, duration, delay, startRotation, animType, id: i };
    });
  }, [count]);

  const opacityMap = {
    subtle: { light: 'text-teal/[0.06]', dark: 'text-teal/[0.05]' },
    normal: { light: 'text-teal/[0.12]', dark: 'text-teal/[0.10]' },
    dense:  { light: 'text-teal/[0.18]', dark: 'text-teal/[0.14]' },
  };
  const color = opacityMap[density]?.[theme] || opacityMap.normal[theme];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`} aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute dental-bg-particle dental-bg-anim-${p.animType} ${color}`}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.startRotation}deg)`,
          }}
        >
          <p.IconComp size={p.size} />
        </div>
      ))}
    </div>
  );
};

export { ToothIcon, ToothbrushIcon, MolarIcon, DentalMirrorIcon, SparkleIcon, BracesIcon };
export default DentalBackground;
