/**
 * RunningTooth — A cute animated tooth character that runs across the screen
 * Place between sections for a fun dental vibe
 */
const RunningTooth = ({ direction = 'left', speed = 12, size = 60, className = '' }) => {
  const isLeft = direction === 'left';

  return (
    <div className={`relative w-full overflow-hidden pointer-events-none ${className}`} style={{ height: size + 20 }} aria-hidden="true">
      <div
        className={`absolute running-tooth ${isLeft ? 'running-tooth-left' : 'running-tooth-right'}`}
        style={{
          animationDuration: `${speed}s`,
          width: size,
          height: size + 16,
          bottom: 0,
        }}
      >
        {/* Tooth Body */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 80 90"
          className="running-tooth-bounce"
          style={{ animationDuration: `${speed / 20}s` }}
        >
          {/* Shadow */}
          <ellipse cx="40" cy="87" rx="20" ry="3" fill="rgba(0,0,0,0.08)" className="running-tooth-shadow" />

          {/* Main tooth body */}
          <path
            d="M40 8C28 8 18 14 16 26C14 38 10 55 22 72C28 80 33 78 40 66C47 78 52 80 58 72C70 55 66 38 64 26C62 14 52 8 40 8Z"
            fill="white"
            stroke="#00BFA6"
            strokeWidth="2.5"
          />

          {/* Left eye */}
          <g className="running-tooth-blink">
            <ellipse cx="31" cy="32" rx="4" ry="5" fill="#0A1628" />
            <ellipse cx="32" cy="30" rx="1.5" ry="1.5" fill="white" />
          </g>

          {/* Right eye */}
          <g className="running-tooth-blink">
            <ellipse cx="49" cy="32" rx="4" ry="5" fill="#0A1628" />
            <ellipse cx="50" cy="30" rx="1.5" ry="1.5" fill="white" />
          </g>

          {/* Happy smile */}
          <path
            d="M30 42 Q40 54 50 42"
            fill="none"
            stroke="#0A1628"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Blush cheeks */}
          <circle cx="24" cy="40" r="4" fill="#FFB7C5" opacity="0.5" />
          <circle cx="56" cy="40" r="4" fill="#FFB7C5" opacity="0.5" />

          {/* Sparkle on tooth */}
          <g className="running-tooth-sparkle">
            <path d="M55 18L56.5 22L60.5 23.5L56.5 25L55 29L53.5 25L49.5 23.5L53.5 22Z" fill="#00BFA6" opacity="0.8" />
          </g>

          {/* Left leg */}
          <g className="running-tooth-left-leg" style={{ transformOrigin: '32px 70px' }}>
            <rect x="30" y="68" width="5" height="14" rx="2.5" fill="#00BFA6" />
            <ellipse cx="32" cy="83" rx="5" ry="2.5" fill="#009985" />
          </g>

          {/* Right leg */}
          <g className="running-tooth-right-leg" style={{ transformOrigin: '48px 70px' }}>
            <rect x="45" y="68" width="5" height="14" rx="2.5" fill="#00BFA6" />
            <ellipse cx="48" cy="83" rx="5" ry="2.5" fill="#009985" />
          </g>

          {/* Left arm */}
          <g className="running-tooth-left-arm" style={{ transformOrigin: '18px 40px' }}>
            <rect x="10" y="38" width="12" height="4" rx="2" fill="#00BFA6" />
          </g>

          {/* Right arm */}
          <g className="running-tooth-right-arm" style={{ transformOrigin: '62px 40px' }}>
            <rect x="58" y="38" width="12" height="4" rx="2" fill="#00BFA6" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default RunningTooth;
