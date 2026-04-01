import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Dental3DObject — Premium 3D rotating glass tooth/implant
 * Inspired by crypto/fintech hero 3D objects
 * Pure CSS 3D transforms + gradients — no Three.js needed
 */

/* ── 3D Glass Tooth ── */
export const GlassTooth = ({ size = 320, className = '' }) => {
  return (
    <div
      className={`dental-3d-scene ${className}`}
      style={{ width: size, height: size * 1.2, perspective: '1000px' }}
    >
      <div className="dental-3d-rotate" style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d' }}>
        {/* Main tooth shape — glass layers */}
        <svg
          viewBox="0 0 200 260"
          width="100%"
          height="100%"
          className="dental-3d-tooth"
        >
          <defs>
            {/* Glass gradient */}
            <linearGradient id="glass-main" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,191,166,0.6)" />
              <stop offset="30%" stopColor="rgba(0,191,166,0.15)" />
              <stop offset="60%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(0,191,166,0.4)" />
            </linearGradient>

            {/* Inner glow */}
            <radialGradient id="inner-glow" cx="40%" cy="35%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>

            {/* Edge highlight */}
            <linearGradient id="edge-light" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="100%" stopColor="rgba(0,191,166,0.3)" />
            </linearGradient>

            {/* Reflection gradient */}
            <linearGradient id="reflection" x1="30%" y1="0%" x2="70%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="40%" stopColor="rgba(255,255,255,0)" />
              <stop offset="60%" stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(212,175,55,0.15)" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="tooth-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Soft shadow */}
            <filter id="tooth-shadow" x="-30%" y="-10%" width="160%" height="140%">
              <feDropShadow dx="0" dy="15" stdDeviation="20" floodColor="rgba(0,191,166,0.3)" />
            </filter>

            <clipPath id="tooth-clip">
              <path d="M100 20C72 20 48 35 44 65C40 95 30 145 58 195C72 218 86 213 100 180C114 213 128 218 142 195C170 145 160 95 156 65C152 35 128 20 100 20Z" />
            </clipPath>
          </defs>

          {/* Outer glow ring */}
          <ellipse cx="100" cy="130" rx="85" ry="100" fill="none" stroke="rgba(0,191,166,0.08)" strokeWidth="40" className="dental-3d-glow-ring" />

          {/* Shadow on ground */}
          <ellipse cx="100" cy="240" rx="60" ry="10" fill="rgba(0,191,166,0.15)" className="dental-3d-shadow" />

          {/* Main tooth body — glass effect */}
          <g filter="url(#tooth-shadow)">
            {/* Back face dark */}
            <path
              d="M100 20C72 20 48 35 44 65C40 95 30 145 58 195C72 218 86 213 100 180C114 213 128 218 142 195C170 145 160 95 156 65C152 35 128 20 100 20Z"
              fill="rgba(0,191,166,0.08)"
              stroke="rgba(0,191,166,0.4)"
              strokeWidth="1.5"
            />

            {/* Glass fill */}
            <path
              d="M100 20C72 20 48 35 44 65C40 95 30 145 58 195C72 218 86 213 100 180C114 213 128 218 142 195C170 145 160 95 156 65C152 35 128 20 100 20Z"
              fill="url(#glass-main)"
            />

            {/* Inner glow */}
            <path
              d="M100 20C72 20 48 35 44 65C40 95 30 145 58 195C72 218 86 213 100 180C114 213 128 218 142 195C170 145 160 95 156 65C152 35 128 20 100 20Z"
              fill="url(#inner-glow)"
            />

            {/* Edge highlight stroke */}
            <path
              d="M100 20C72 20 48 35 44 65C40 95 30 145 58 195C72 218 86 213 100 180C114 213 128 218 142 195C170 145 160 95 156 65C152 35 128 20 100 20Z"
              fill="none"
              stroke="url(#edge-light)"
              strokeWidth="2"
            />

            {/* Reflection sweep — the glass shine line */}
            <g clipPath="url(#tooth-clip)">
              <ellipse
                cx="75"
                cy="80"
                rx="35"
                ry="70"
                fill="rgba(255,255,255,0.12)"
                transform="rotate(-20 75 80)"
                className="dental-3d-reflection"
              />
              {/* Secondary reflection */}
              <ellipse
                cx="130"
                cy="140"
                rx="15"
                ry="40"
                fill="rgba(255,255,255,0.06)"
                transform="rotate(-15 130 140)"
              />
            </g>

            {/* Root division line */}
            <path
              d="M100 155C100 155 100 180 100 180"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* Crown detail lines */}
            <path
              d="M70 70 Q100 60 130 70"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          </g>

          {/* Floating particles around tooth */}
          <circle cx="35" cy="60" r="2" fill="rgba(0,191,166,0.6)" className="dental-3d-particle-1" />
          <circle cx="170" cy="90" r="1.5" fill="rgba(212,175,55,0.5)" className="dental-3d-particle-2" />
          <circle cx="155" cy="45" r="2.5" fill="rgba(0,191,166,0.4)" className="dental-3d-particle-3" />
          <circle cx="40" cy="150" r="1.8" fill="rgba(255,255,255,0.4)" className="dental-3d-particle-4" />
          <circle cx="165" cy="160" r="2" fill="rgba(0,191,166,0.5)" className="dental-3d-particle-5" />
          <circle cx="50" cy="100" r="1.2" fill="rgba(212,175,55,0.4)" className="dental-3d-particle-6" />

          {/* Sparkle flares */}
          <g className="dental-3d-sparkle-1">
            <line x1="28" y1="35" x2="28" y2="45" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeLinecap="round" />
            <line x1="23" y1="40" x2="33" y2="40" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeLinecap="round" />
          </g>
          <g className="dental-3d-sparkle-2">
            <line x1="175" y1="125" x2="175" y2="133" stroke="rgba(0,191,166,0.5)" strokeWidth="1" strokeLinecap="round" />
            <line x1="171" y1="129" x2="179" y2="129" stroke="rgba(0,191,166,0.5)" strokeWidth="1" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
};

/* ── 3D Glass Dental Implant ── */
export const GlassImplant = ({ size = 300, className = '' }) => {
  return (
    <div
      className={`dental-3d-scene ${className}`}
      style={{ width: size, height: size * 1.4, perspective: '1000px' }}
    >
      <div className="dental-3d-rotate-slow" style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d' }}>
        <svg viewBox="0 0 180 280" width="100%" height="100%">
          <defs>
            <linearGradient id="implant-metal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(180,200,220,0.7)" />
              <stop offset="25%" stopColor="rgba(100,130,160,0.3)" />
              <stop offset="50%" stopColor="rgba(200,220,240,0.5)" />
              <stop offset="75%" stopColor="rgba(80,110,140,0.3)" />
              <stop offset="100%" stopColor="rgba(160,185,210,0.6)" />
            </linearGradient>
            <linearGradient id="implant-crown" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,191,166,0.5)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
              <stop offset="100%" stopColor="rgba(0,191,166,0.4)" />
            </linearGradient>
            <radialGradient id="implant-glow" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="rgba(0,191,166,0.2)" />
              <stop offset="100%" stopColor="rgba(0,191,166,0)" />
            </radialGradient>
            <filter id="implant-blur" x="-30%" y="-10%" width="160%" height="130%">
              <feDropShadow dx="0" dy="10" stdDeviation="15" floodColor="rgba(0,191,166,0.25)" />
            </filter>
          </defs>

          {/* Background glow */}
          <ellipse cx="90" cy="140" rx="70" ry="90" fill="url(#implant-glow)" className="dental-3d-glow-ring" />

          {/* Shadow */}
          <ellipse cx="90" cy="265" rx="40" ry="8" fill="rgba(0,191,166,0.12)" className="dental-3d-shadow" />

          <g filter="url(#implant-blur)">
            {/* Screw body — metallic */}
            <path d="M75 130L70 170L68 200L72 230L90 250L108 230L112 200L110 170L105 130Z" fill="url(#implant-metal)" stroke="rgba(200,220,240,0.3)" strokeWidth="1" />

            {/* Screw threads */}
            {[145, 160, 175, 190, 205, 220].map((y, i) => (
              <line key={i} x1="70" y1={y} x2="110" y2={y} stroke="rgba(200,220,240,0.15)" strokeWidth="1" />
            ))}

            {/* Abutment — connector */}
            <rect x="78" y="115" width="24" height="20" rx="3" fill="rgba(160,185,210,0.5)" stroke="rgba(200,220,240,0.3)" strokeWidth="1" />

            {/* Crown — glass tooth on top */}
            <path
              d="M90 30C72 30 58 42 55 60C52 78 48 100 65 118C72 127 81 124 90 112C99 124 108 127 115 118C132 100 128 78 125 60C122 42 108 30 90 30Z"
              fill="url(#implant-crown)"
              stroke="rgba(0,191,166,0.4)"
              strokeWidth="1.5"
            />

            {/* Crown reflection */}
            <path
              d="M90 30C72 30 58 42 55 60C52 78 48 100 65 118C72 127 81 124 90 112C99 124 108 127 115 118C132 100 128 78 125 60C122 42 108 30 90 30Z"
              fill="rgba(255,255,255,0.08)"
            />
            <ellipse cx="78" cy="65" rx="15" ry="30" fill="rgba(255,255,255,0.1)" transform="rotate(-15 78 65)" />
          </g>

          {/* Particles */}
          <circle cx="30" cy="70" r="2" fill="rgba(0,191,166,0.5)" className="dental-3d-particle-1" />
          <circle cx="155" cy="100" r="1.5" fill="rgba(212,175,55,0.4)" className="dental-3d-particle-2" />
          <circle cx="145" cy="50" r="2" fill="rgba(0,191,166,0.3)" className="dental-3d-particle-3" />
          <circle cx="35" cy="180" r="1.8" fill="rgba(255,255,255,0.3)" className="dental-3d-particle-4" />

          {/* Sparkle */}
          <g className="dental-3d-sparkle-1">
            <line x1="150" y1="38" x2="150" y2="48" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinecap="round" />
            <line x1="145" y1="43" x2="155" y2="43" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
};

/* ── Abstract Dental Morph — blob-like morphing shape ── */
export const DentalMorph = ({ size = 350, className = '' }) => {
  return (
    <div
      className={`dental-3d-scene ${className}`}
      style={{ width: size, height: size, perspective: '1200px' }}
    >
      <div className="dental-3d-rotate" style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d' }}>
        <svg viewBox="0 0 300 300" width="100%" height="100%">
          <defs>
            <radialGradient id="morph-fill" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="rgba(0,191,166,0.5)" />
              <stop offset="40%" stopColor="rgba(0,191,166,0.15)" />
              <stop offset="100%" stopColor="rgba(10,22,40,0.3)" />
            </radialGradient>
            <radialGradient id="morph-inner" cx="40%" cy="30%" r="40%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <filter id="morph-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer glow */}
          <circle cx="150" cy="150" r="120" fill="rgba(0,191,166,0.04)" className="dental-3d-glow-ring" />

          {/* Morphing blob — tooth-inspired organic shape */}
          <g filter="url(#morph-glow)">
            <path
              className="dental-morph-path"
              d="M150 40C110 40 80 60 75 95C70 130 60 170 90 210C108 235 128 228 150 195C172 228 192 235 210 210C240 170 230 130 225 95C220 60 190 40 150 40Z"
              fill="url(#morph-fill)"
              stroke="rgba(0,191,166,0.35)"
              strokeWidth="1.5"
            />
            <path
              className="dental-morph-path"
              d="M150 40C110 40 80 60 75 95C70 130 60 170 90 210C108 235 128 228 150 195C172 228 192 235 210 210C240 170 230 130 225 95C220 60 190 40 150 40Z"
              fill="url(#morph-inner)"
            />
            {/* Reflection arc */}
            <path
              d="M105 70C105 70 120 55 145 55"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* Orbiting ring */}
          <ellipse
            cx="150"
            cy="150"
            rx="130"
            ry="40"
            fill="none"
            stroke="rgba(0,191,166,0.12)"
            strokeWidth="1"
            strokeDasharray="6 8"
            className="dental-3d-orbit"
          />

          {/* Orbit dots */}
          <circle r="4" fill="rgba(0,191,166,0.6)" className="dental-3d-orbit-dot">
            <animateMotion dur="8s" repeatCount="indefinite" path="M150,150 m-130,0 a130,40 0 1,0 260,0 a130,40 0 1,0 -260,0" />
          </circle>
          <circle r="2.5" fill="rgba(212,175,55,0.5)" className="dental-3d-orbit-dot">
            <animateMotion dur="8s" repeatCount="indefinite" begin="-4s" path="M150,150 m-130,0 a130,40 0 1,0 260,0 a130,40 0 1,0 -260,0" />
          </circle>

          {/* Floating particles */}
          <circle cx="40" cy="100" r="2.5" fill="rgba(0,191,166,0.5)" className="dental-3d-particle-1" />
          <circle cx="260" cy="120" r="2" fill="rgba(212,175,55,0.4)" className="dental-3d-particle-2" />
          <circle cx="250" cy="60" r="3" fill="rgba(0,191,166,0.3)" className="dental-3d-particle-3" />
          <circle cx="50" cy="200" r="2" fill="rgba(255,255,255,0.3)" className="dental-3d-particle-4" />
          <circle cx="260" cy="210" r="2.5" fill="rgba(0,191,166,0.4)" className="dental-3d-particle-5" />
          <circle cx="45" cy="155" r="1.5" fill="rgba(212,175,55,0.3)" className="dental-3d-particle-6" />

          {/* Sparkle crosses */}
          <g className="dental-3d-sparkle-1">
            <line x1="30" y1="55" x2="30" y2="67" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="24" y1="61" x2="36" y2="61" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          <g className="dental-3d-sparkle-2">
            <line x1="270" y1="170" x2="270" y2="180" stroke="rgba(0,191,166,0.4)" strokeWidth="1" strokeLinecap="round" />
            <line x1="265" y1="175" x2="275" y2="175" stroke="rgba(0,191,166,0.4)" strokeWidth="1" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
};

/* ── Premium dark section wrapper with mesh gradient ── */
export const DarkSection = ({ children, className = '', gradient = 'default' }) => {
  const gradients = {
    default: 'from-[#050d1a] via-[#0a1628] to-[#0d1f3c]',
    teal: 'from-[#041210] via-[#071e1a] to-[#0a1628]',
    deep: 'from-[#020810] via-[#0a1628] to-[#051020]',
  };

  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${gradients[gradient] || gradients.default} ${className}`}>
      {/* Mesh gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-teal/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-teal/[0.03] blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-gold/[0.02] blur-[80px] pointer-events-none" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,191,166,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,166,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />

      <div className="relative z-10">{children}</div>
    </section>
  );
};

export default GlassTooth;
