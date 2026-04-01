import { useState, useEffect } from 'react';

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 600);
    const removeTimer = setTimeout(() => setIsLoading(false), 1000);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-navy flex flex-col items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0 scale-95' : 'opacity-100'}`}
      style={{ transitionProperty: 'opacity, transform' }}
    >
      <div className="text-center">
        {/* CSS-only tooth with pulsing ring — replaces Lottie */}
        <div className="w-24 h-24 mx-auto mb-4 relative flex items-center justify-center">
          {/* Spinning dashed ring */}
          <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-teal animate-spin" style={{ animationDuration: '2s' }} />
          {/* Tooth SVG */}
          <svg width="40" height="48" viewBox="0 0 40 48" className="animate-pulse" style={{ animationDuration: '1.5s' }}>
            <path
              d="M20 2C14 2 9 5.5 8 12C6.5 19 4 30 11 42C14.5 47.5 17.5 46 20 38C22.5 46 25.5 47.5 29 42C36 30 33.5 19 32 12C31 5.5 26 2 20 2Z"
              fill="#00BFA6" stroke="#00BFA6" strokeWidth="0.5"
            />
            <path
              d="M16.5 13C14.5 13 13 14.5 13 16.5C13 18.5 14.5 20 16.5 18.5C18.5 17 20 19 20 19C20 19 21.5 17 23.5 18.5C25.5 20 27 18.5 27 16.5C27 14.5 25.5 13 23.5 13C22 13 21 13.7 20 14.8C19 13.7 18 13 16.5 13Z"
              fill="rgba(255,255,255,0.35)"
            />
          </svg>
        </div>

        <h2 className="font-heading text-2xl font-bold text-white mb-2">
          Everyday Dental Surgery
        </h2>

        {/* CSS progress bar */}
        <div className="w-48 h-1 bg-white/10 rounded-full mx-auto mt-4 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal to-gold"
            style={{
              animation: 'loading-progress 0.6s ease-in-out forwards',
            }}
          />
        </div>

        <p className="text-teal-300 mt-4 text-sm font-medium" style={{ animation: 'loading-text-pulse 2s ease-in-out infinite' }}>
          Crafting Healthy Smiles...
        </p>
      </div>

      <style>{`
        @keyframes loading-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes loading-text-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
