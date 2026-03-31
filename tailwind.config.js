/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A1628',
          50: '#E8EBF0',
          100: '#C5CBD6',
          200: '#8E9BB3',
          300: '#576B90',
          400: '#2F4470',
          500: '#0A1628',
          600: '#081222',
          700: '#060E1B',
          800: '#040A14',
          900: '#02050A',
        },
        teal: {
          DEFAULT: '#00BFA6',
          50: '#E0FFF9',
          100: '#B3FFF0',
          200: '#66FFE1',
          300: '#1AFFD2',
          400: '#00E6BD',
          500: '#00BFA6',
          600: '#009985',
          700: '#007364',
          800: '#004D43',
          900: '#002621',
        },
        gold: {
          DEFAULT: '#D4AF37',
          50: '#FBF6E7',
          100: '#F5EAC4',
          200: '#EDD98F',
          300: '#E4C85A',
          400: '#D4AF37',
          500: '#B8952B',
          600: '#8E7321',
          700: '#645118',
          800: '#3A2F0E',
          900: '#100D04',
        },
        slate: {
          DEFAULT: '#1E293B',
        },
        gray: {
          DEFAULT: '#64748B',
        },
        offwhite: '#F8FAFC',
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'float-slow': 'float 8s ease-in-out 1s infinite',
        'pulse-teal': 'pulse-teal 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'brush': 'brush 1.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'dental-float-1': 'dental-float-1 12s ease-in-out infinite',
        'dental-float-2': 'dental-float-2 15s ease-in-out infinite',
        'dental-float-3': 'dental-float-3 10s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        'pulse-teal': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 191, 166, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(0, 191, 166, 0)' },
        },
        brush: {
          '0%': { transform: 'rotate(-30deg)' },
          '50%': { transform: 'rotate(30deg)' },
          '100%': { transform: 'rotate(-30deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 191, 166, 0.3), 0 0 20px rgba(0, 191, 166, 0.1)' },
          '50%': { boxShadow: '0 0 15px rgba(0, 191, 166, 0.5), 0 0 40px rgba(0, 191, 166, 0.2)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'dental-float-1': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)', opacity: '0.06' },
          '25%': { transform: 'translate(30px, -40px) rotate(90deg)', opacity: '0.1' },
          '50%': { transform: 'translate(-20px, -80px) rotate(180deg)', opacity: '0.06' },
          '75%': { transform: 'translate(40px, -40px) rotate(270deg)', opacity: '0.1' },
        },
        'dental-float-2': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: '0.05' },
          '33%': { transform: 'translate(-50px, -60px) rotate(120deg) scale(1.2)', opacity: '0.08' },
          '66%': { transform: 'translate(30px, -100px) rotate(240deg) scale(0.8)', opacity: '0.05' },
        },
        'dental-float-3': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: '0.04' },
          '50%': { transform: 'translateY(-50px) rotate(180deg)', opacity: '0.08' },
        },
      },
    },
  },
  plugins: [],
}
