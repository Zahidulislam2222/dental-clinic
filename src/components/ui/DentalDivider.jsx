/**
 * DentalDivider — Animated dental icons scrolling across as section dividers
 * Like a marquee but with cute dental SVG icons
 */

const toothSvg = (
  <svg viewBox="0 0 40 48" width="28" height="34" fill="currentColor">
    <path d="M20 4C14 4 9 8 8 15C7 22 5 32 11 42C14 47 17 46 20 39C23 46 26 47 29 42C35 32 33 22 32 15C31 8 26 4 20 4Z" />
  </svg>
);

const brushSvg = (
  <svg viewBox="0 0 50 18" width="36" height="14" fill="currentColor">
    <rect x="0" y="6" width="28" height="6" rx="3" />
    <rect x="28" y="4" width="20" height="10" rx="2" />
    <rect x="31" y="6" width="2" height="6" rx="0.5" opacity="0.5" />
    <rect x="35" y="6" width="2" height="6" rx="0.5" opacity="0.5" />
    <rect x="39" y="6" width="2" height="6" rx="0.5" opacity="0.5" />
    <rect x="43" y="6" width="2" height="6" rx="0.5" opacity="0.5" />
  </svg>
);

const mirrorSvg = (
  <svg viewBox="0 0 24 40" width="18" height="30" fill="currentColor">
    <circle cx="12" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="10" r="5" opacity="0.3" />
    <rect x="10.5" y="18" width="3" height="20" rx="1.5" />
  </svg>
);

const sparkleSvg = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 0L14 9L24 12L14 15L12 24L10 15L0 12L10 9Z" />
  </svg>
);

const molarSvg = (
  <svg viewBox="0 0 40 45" width="28" height="32" fill="currentColor">
    <path d="M10 4C5 4 3 9 3 15C3 22 2 32 8 42C11 46 14 45 17 37C19 42 23 42 25 37C28 45 31 46 34 42C40 32 38 22 38 15C38 9 35 4 30 4C27 4 25 6 20 6C15 6 13 4 10 4Z" />
  </svg>
);

const icons = [toothSvg, sparkleSvg, brushSvg, sparkleSvg, molarSvg, sparkleSvg, mirrorSvg, sparkleSvg];

const DentalDivider = ({ speed = 20, theme = 'light', className = '' }) => {
  const color = theme === 'dark' ? 'text-teal/20' : 'text-teal/15';

  // Double the icons for seamless loop
  const track = [...icons, ...icons, ...icons, ...icons];

  return (
    <div className={`w-full overflow-hidden py-4 ${className}`} aria-hidden="true">
      <div
        className={`dental-divider-track flex items-center gap-10 ${color}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {track.map((icon, i) => (
          <div key={i} className="flex-shrink-0 dental-divider-item" style={{ animationDelay: `${(i % 8) * 0.2}s` }}>
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * DentalDividerFancy — A wavy line with teeth popping up along it
 */
export const DentalDividerWave = ({ className = '' }) => (
  <div className={`w-full py-6 flex items-center justify-center ${className}`} aria-hidden="true">
    <svg viewBox="0 0 800 60" width="100%" height="60" preserveAspectRatio="none">
      {/* Wavy line */}
      <path
        d="M0 30 Q50 10 100 30 T200 30 T300 30 T400 30 T500 30 T600 30 T700 30 T800 30"
        fill="none"
        stroke="#00BFA6"
        strokeWidth="2"
        opacity="0.2"
      />
      {/* Mini teeth along the wave */}
      {[100, 250, 400, 550, 700].map((x, i) => (
        <g key={i} className="dental-wave-tooth" style={{ animationDelay: `${i * 0.3}s` }}>
          <path
            d={`M${x} 15C${x - 5} 15 ${x - 8} 18 ${x - 9} 23C${x - 10} 28 ${x - 11} 35 ${x - 5} 42C${x - 3} 45 ${x - 1} 44 ${x} 38C${x + 1} 44 ${x + 3} 45 ${x + 5} 42C${x + 11} 35 ${x + 10} 28 ${x + 9} 23C${x + 8} 18 ${x + 5} 15 ${x} 15Z`}
            fill="white"
            stroke="#00BFA6"
            strokeWidth="1.5"
          />
          {/* tiny face */}
          <circle cx={x - 3} cy={24} r="1.2" fill="#0A1628" />
          <circle cx={x + 3} cy={24} r="1.2" fill="#0A1628" />
          <path d={`M${x - 3} 28 Q${x} 32 ${x + 3} 28`} fill="none" stroke="#0A1628" strokeWidth="1" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  </div>
);

export default DentalDivider;
