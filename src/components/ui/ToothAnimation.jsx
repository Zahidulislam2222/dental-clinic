import { motion } from 'framer-motion';

/**
 * HappyTooth — An animated tooth with blinking eyes, opening mouth and smile
 */
export const HappyTooth = ({ size = 120, className = '' }) => (
  <div className={`inline-block ${className}`} style={{ width: size, height: size * 1.2 }}>
    <svg viewBox="0 0 100 120" width={size} height={size * 1.2}>
      {/* Glow behind tooth */}
      <circle cx="50" cy="50" r="45" fill="rgba(0,191,166,0.08)" className="tooth-glow-pulse" />

      {/* Main tooth body */}
      <path
        d="M50 10C38 10 26 16 24 30C22 44 18 62 30 82C36 92 42 89 50 76C58 89 64 92 70 82C82 62 78 44 76 30C74 16 62 10 50 10Z"
        fill="white"
        stroke="#00BFA6"
        strokeWidth="2.5"
        className="tooth-body-breathe"
      />

      {/* Left eye */}
      <g className="happy-tooth-blink">
        <ellipse cx="39" cy="38" rx="5" ry="6.5" fill="#0A1628" />
        <ellipse cx="40.5" cy="36" rx="2" ry="2" fill="white" />
      </g>

      {/* Right eye */}
      <g className="happy-tooth-blink">
        <ellipse cx="61" cy="38" rx="5" ry="6.5" fill="#0A1628" />
        <ellipse cx="62.5" cy="36" rx="2" ry="2" fill="white" />
      </g>

      {/* Open mouth / smile — morphs between closed smile and open */}
      <g className="happy-tooth-mouth">
        <path
          d="M36 52 Q50 68 64 52"
          fill="#FF6B8A"
          stroke="#0A1628"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M42 54 Q50 48 58 54"
          fill="#FF4068"
          opacity="0.6"
        />
      </g>

      {/* Tongue peek */}
      <ellipse cx="50" cy="60" rx="6" ry="4" fill="#FF8FA3" className="happy-tooth-tongue" />

      {/* Blush cheeks */}
      <circle cx="30" cy="48" r="5" fill="#FFB7C5" opacity="0.4" />
      <circle cx="70" cy="48" r="5" fill="#FFB7C5" opacity="0.4" />

      {/* Sparkles around tooth */}
      <g className="tooth-sparkle-1">
        <path d="M82 20L84 25L89 27L84 29L82 34L80 29L75 27L80 25Z" fill="#D4AF37" />
      </g>
      <g className="tooth-sparkle-2">
        <path d="M15 22L16.5 26L20.5 27.5L16.5 29L15 33L13.5 29L9.5 27.5L13.5 26Z" fill="#00BFA6" />
      </g>
      <g className="tooth-sparkle-3">
        <path d="M75 65L76.5 68L80 69.5L76.5 71L75 74L73.5 71L70 69.5L73.5 68Z" fill="#D4AF37" opacity="0.7" />
      </g>

      {/* Crown / hat (optional flair) */}
      <g className="tooth-crown-wobble">
        <path d="M35 14L38 4L44 10L50 2L56 10L62 4L65 14" fill="#D4AF37" stroke="#B8952B" strokeWidth="1" opacity="0.9" />
      </g>
    </svg>
  </div>
);

/**
 * WigglingTooth — A tooth that wiggles side to side on hover or continuously
 */
export const WigglingTooth = ({ size = 60, continuous = false, className = '' }) => (
  <motion.div
    className={`inline-block ${className}`}
    animate={continuous ? { rotate: [-3, 3, -3] } : undefined}
    whileHover={!continuous ? { rotate: [-5, 5, -5, 5, 0] } : undefined}
    transition={continuous
      ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
      : { duration: 0.5 }
    }
  >
    <svg viewBox="0 0 60 70" width={size} height={size * 1.17} fill="currentColor">
      <path
        d="M30 5C20 5 12 10 10 20C8 30 5 45 15 60C20 67 25 65 30 55C35 65 40 67 45 60C55 45 52 30 50 20C48 10 40 5 30 5Z"
        fill="white"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Simple face */}
      <circle cx="23" cy="25" r="2.5" fill="#0A1628" />
      <circle cx="37" cy="25" r="2.5" fill="#0A1628" />
      <path d="M22 33 Q30 41 38 33" fill="none" stroke="#0A1628" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </motion.div>
);

/**
 * ToothBrushingAnimation — Toothbrush brushing a tooth
 */
export const ToothBrushing = ({ size = 140, className = '' }) => (
  <div className={`inline-block relative ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 140 120" width={size} height={size * 0.86}>
      {/* Tooth */}
      <path
        d="M70 15C58 15 48 22 46 35C44 48 40 65 52 82C58 90 63 88 70 76C77 88 82 90 88 82C100 65 96 48 94 35C92 22 82 15 70 15Z"
        fill="white"
        stroke="#00BFA6"
        strokeWidth="2"
      />
      {/* Eyes - happy/closed during brushing */}
      <path d="M59 38C59 38 63 34 67 38" fill="none" stroke="#0A1628" strokeWidth="2" strokeLinecap="round" />
      <path d="M73 38C73 38 77 34 81 38" fill="none" stroke="#0A1628" strokeWidth="2" strokeLinecap="round" />

      {/* Smile */}
      <path d="M60 48 Q70 58 80 48" fill="none" stroke="#0A1628" strokeWidth="2" strokeLinecap="round" />

      {/* Toothbrush — animates brushing */}
      <g className="tooth-brushing-motion">
        <rect x="5" y="35" width="38" height="9" rx="4" fill="#00BFA6" />
        <rect x="38" y="32" width="22" height="15" rx="3" fill="#009985" />
        <rect x="41" y="34" width="3" height="11" rx="1" fill="white" opacity="0.6" />
        <rect x="47" y="34" width="3" height="11" rx="1" fill="white" opacity="0.6" />
        <rect x="53" y="34" width="3" height="11" rx="1" fill="white" opacity="0.6" />
      </g>

      {/* Foam bubbles */}
      <g className="tooth-foam-bubbles">
        <circle cx="55" cy="28" r="3" fill="white" stroke="#E0FFF9" strokeWidth="1" opacity="0.8" />
        <circle cx="62" cy="22" r="2.5" fill="white" stroke="#E0FFF9" strokeWidth="1" opacity="0.6" />
        <circle cx="48" cy="24" r="2" fill="white" stroke="#E0FFF9" strokeWidth="1" opacity="0.7" />
        <circle cx="58" cy="18" r="1.8" fill="white" stroke="#E0FFF9" strokeWidth="1" opacity="0.5" />
        <circle cx="52" cy="16" r="2.2" fill="white" stroke="#E0FFF9" strokeWidth="1" opacity="0.6" />
      </g>

      {/* Sparkle stars */}
      <g className="tooth-sparkle-1">
        <path d="M105 20L107 25L112 27L107 29L105 34L103 29L98 27L103 25Z" fill="#D4AF37" />
      </g>
      <g className="tooth-sparkle-2">
        <path d="M115 50L116.5 54L120.5 55.5L116.5 57L115 61L113.5 57L109.5 55.5L113.5 54Z" fill="#00BFA6" />
      </g>
    </svg>
  </div>
);

/**
 * ToothParade — Row of tiny teeth with different expressions walking together
 */
export const ToothParade = ({ count = 5, size = 40, className = '' }) => {
  const expressions = [
    // Happy
    (cx, cy) => <path d={`M${cx - 5} ${cy + 4} Q${cx} ${cy + 10} ${cx + 5} ${cy + 4}`} fill="none" stroke="#0A1628" strokeWidth="1.5" strokeLinecap="round" />,
    // Wink
    (cx, cy) => (<><path d={`M${cx - 5} ${cy + 4} Q${cx} ${cy + 10} ${cx + 5} ${cy + 4}`} fill="none" stroke="#0A1628" strokeWidth="1.5" strokeLinecap="round" /><path d={`M${cx + 3} ${cy - 4} L${cx + 7} ${cy - 4}`} stroke="#0A1628" strokeWidth="1.5" strokeLinecap="round" /></>),
    // O mouth
    (cx, cy) => <ellipse cx={cx} cy={cy + 5} rx="3" ry="4" fill="#FF6B8A" stroke="#0A1628" strokeWidth="1" />,
    // Tongue out
    (cx, cy) => (<><path d={`M${cx - 5} ${cy + 4} Q${cx} ${cy + 10} ${cx + 5} ${cy + 4}`} fill="none" stroke="#0A1628" strokeWidth="1.5" strokeLinecap="round" /><ellipse cx={cx} cy={cy + 9} rx="3" ry="2" fill="#FF8FA3" /></>),
    // Big grin
    (cx, cy) => <path d={`M${cx - 6} ${cy + 3} Q${cx} ${cy + 13} ${cx + 6} ${cy + 3}`} fill="#FF6B8A" stroke="#0A1628" strokeWidth="1.5" strokeLinecap="round" />,
  ];

  return (
    <div className={`flex items-end justify-center gap-1 ${className}`} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="tooth-parade-member"
          style={{ animationDelay: `${i * 0.15}s` }}
        >
          <svg viewBox="0 0 40 55" width={size} height={size * 1.375}>
            {/* Tooth body */}
            <path
              d="M20 4C14 4 9 8 8 15C7 22 5 32 11 42C14 47 17 46 20 39C23 46 26 47 29 42C35 32 33 22 32 15C31 8 26 4 20 4Z"
              fill="white"
              stroke="#00BFA6"
              strokeWidth="1.5"
            />
            {/* Eyes */}
            <circle cx="15" cy="18" r="2" fill="#0A1628" />
            <circle cx="25" cy="18" r="2" fill="#0A1628" />
            {/* Expression */}
            {expressions[i % expressions.length](20, 20)}
            {/* Tiny legs */}
            <g className="tooth-parade-legs" style={{ animationDelay: `${i * 0.15}s` }}>
              <rect x="14" y="41" width="3" height="9" rx="1.5" fill="#00BFA6" />
              <rect x="23" y="41" width="3" height="9" rx="1.5" fill="#00BFA6" />
            </g>
          </svg>
        </div>
      ))}
    </div>
  );
};

export default HappyTooth;
