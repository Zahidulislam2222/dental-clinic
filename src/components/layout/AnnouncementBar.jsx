import { useState } from 'react';
import { X, Phone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const offers = [
  { emoji: '🦷', en: 'Root Canal Treatment — 50% OFF this month!', bn: 'রুট ক্যানাল চিকিৎসা — এই মাসে ৫০% ছাড়!' },
  { emoji: '✨', en: 'Teeth Whitening — 50% OFF', bn: 'দাঁত সাদাকরণ — ৫০% ছাড়' },
  { emoji: '🦷', en: 'Professional Braces — 20% OFF', bn: 'প্রফেশনাল ব্রেসেস — ২০% ছাড়' },
  { emoji: '💳', en: 'Book Online & Get 5% OFF — Pre-Pay with bKash/Nagad', bn: 'অনলাইনে বুক করুন ও ৫% ছাড় পান — bKash/Nagad দিয়ে অগ্রিম পেমেন্ট' },
  { emoji: '📞', en: 'Emergency Dental? Call +880 1712-345678', bn: 'জরুরি দন্ত চিকিৎসা? কল করুন +৮৮০ ১৭১২-৩৪৫৬৭৮' },
];

export const ANNOUNCEMENT_HEIGHT = 36; // px, used by Navbar for offset

const AnnouncementBar = () => {
  const [visible, setVisible] = useState(true);
  const { t, language, toggleLanguage } = useLanguage();

  if (!visible) return null;

  const items = [...offers, ...offers, ...offers, ...offers];

  return (
    <div
      className="fixed top-0 left-0 right-0 bg-navy text-white text-xs z-[60] overflow-hidden"
      style={{ height: ANNOUNCEMENT_HEIGHT }}
    >
      <div className="flex items-center h-full">
        <div className="flex-1 overflow-hidden marquee-wrapper">
          <div className="marquee-track">
            {items.map((offer, i) => (
              <span key={i} className="inline-flex items-center gap-2 px-6 whitespace-nowrap">
                <span>{offer.emoji}</span>
                <span className="font-medium tracking-wide">{t({ en: offer.en, bn: offer.bn })}</span>
                <span className="text-teal mx-2">•</span>
              </span>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 pr-3 shrink-0 bg-navy pl-3 border-l border-white/10 h-full">
          <a
            href="tel:+8801712345678"
            className="flex items-center gap-1.5 text-white/80 hover:text-teal transition-colors text-xs whitespace-nowrap"
          >
            <Phone size={11} />
            <span className="font-medium">+880 1712-345678</span>
          </a>
          <span className="text-white/20">|</span>
          <button
            onClick={toggleLanguage}
            className="text-white/80 hover:text-teal transition-colors text-xs font-semibold px-1"
            aria-label={language === 'en' ? 'Switch to Bengali' : 'Switch to English'}
          >
            {language === 'en' ? 'বাং' : 'EN'}
          </button>
          <span className="text-white/20">|</span>
          <button onClick={() => setVisible(false)} className="p-0.5 hover:bg-white/10 rounded transition-colors" aria-label="Close">
            <X size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
