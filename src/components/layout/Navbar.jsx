import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ANNOUNCEMENT_HEIGHT } from './AnnouncementBar';

const navLinks = [
  { to: '/', label: { en: 'Home', bn: 'হোম' } },
  { to: '/about', label: { en: 'About', bn: 'সম্পর্কে' } },
  { to: '/services', label: { en: 'Services', bn: 'সেবাসমূহ' } },
  { to: '/pricing', label: { en: 'Pricing', bn: 'মূল্যতালিকা' } },
  { to: '/blog', label: { en: 'Blog', bn: 'ব্লগ' } },
  { to: '/community', label: { en: 'Community', bn: 'সম্প্রদায়' } },
  { to: '/faq', label: { en: 'FAQ', bn: 'প্রশ্নোত্তর' } },
  { to: '/contact', label: { en: 'Contact', bn: 'যোগাযোগ' } },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, language, toggleLanguage } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
    <nav
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100' : 'bg-white/80 backdrop-blur-md'
      }`}
      style={{ top: ANNOUNCEMENT_HEIGHT }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <svg width="36" height="40" viewBox="0 0 60 70" className="transition-transform group-hover:scale-110">
              <path
                d="M30 5C20 5 12 10 10 20C8 30 5 45 15 60C20 67 25 65 30 55C35 65 40 67 45 60C55 45 52 30 50 20C48 10 40 5 30 5Z"
                fill="#00BFA6" stroke="#00BFA6" strokeWidth="1"
              />
              <path
                d="M25 20C22 20 20 22 20 25C20 28 22 30 25 28C28 26 30 30 30 30C30 30 32 26 35 28C38 30 40 28 40 25C40 22 38 20 35 20C33 20 31 21 30 23C29 21 27 20 25 20Z"
                fill="rgba(255,255,255,0.4)"
              />
            </svg>
            <div>
              <span className={`font-heading font-bold text-lg leading-tight block ${scrolled ? 'text-navy' : 'text-navy'}`}>
                Everyday
              </span>
              <span className={`text-xs font-medium tracking-wider uppercase ${scrolled ? 'text-teal' : 'text-teal'}`}>
                Dental Surgery
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-teal bg-teal/10'
                      : `${scrolled ? 'text-navy hover:text-teal' : 'text-navy hover:text-teal'} hover:bg-teal/5`
                  }`
                }
              >
                {t(link.label)}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="w-8 h-8 rounded-full text-xs font-bold border border-teal/30 text-teal hover:bg-teal/10 transition-colors flex items-center justify-center"
              aria-label={language === 'en' ? 'Switch to Bengali' : 'Switch to English'}
            >
              {language === 'en' ? 'বাং' : 'EN'}
            </button>
            <a href="tel:+8801712345678" className="flex items-center gap-1.5 text-navy hover:text-teal transition-colors whitespace-nowrap px-2 py-1.5 rounded-lg hover:bg-gray-50">
              <Phone size={14} className="text-teal" />
              <span className="hidden xl:inline text-sm font-medium">+880 1712-345678</span>
            </a>
            <Link
              to="/appointment"
              className="bg-teal text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-teal-600 transition-all inline-flex items-center gap-1.5 shadow-sm hover:shadow-md"
            >
              <Calendar size={14} />
              {t({ en: 'Book Now', bn: 'বুক করুন' })}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 rounded text-xs font-semibold border border-teal/30 text-teal"
              aria-label={language === 'en' ? 'Switch to Bengali' : 'Switch to English'}
            >
              {language === 'en' ? 'বাং' : 'EN'}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-navy" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

    </nav>

      {/* Mobile Menu - Full Screen (portal to body so it escapes nav stacking context) */}
      {createPortal(
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-white z-[9999] lg:hidden overflow-y-auto"
            >
              <div className="px-6 py-5 min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                  <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                    <svg width="32" height="36" viewBox="0 0 60 70">
                      <path d="M30 5C20 5 12 10 10 20C8 30 5 45 15 60C20 67 25 65 30 55C35 65 40 67 45 60C55 45 52 30 50 20C48 10 40 5 30 5Z" fill="#00BFA6" stroke="#00BFA6" strokeWidth="1" />
                      <path d="M25 20C22 20 20 22 20 25C20 28 22 30 25 28C28 26 30 30 30 30C30 30 32 26 35 28C38 30 40 28 40 25C40 22 38 20 35 20C33 20 31 21 30 23C29 21 27 20 25 20Z" fill="rgba(255,255,255,0.4)" />
                    </svg>
                    <div>
                      <span className="font-heading font-bold text-base text-navy block leading-tight">Everyday</span>
                      <span className="text-xs font-medium tracking-wider uppercase text-teal">Dental Surgery</span>
                    </div>
                  </Link>
                  <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" aria-label="Close menu">
                    <X size={20} className="text-navy" />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === '/'}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                          isActive ? 'text-teal bg-teal/10 font-semibold' : 'text-navy hover:bg-gray-50'
                        }`
                      }
                    >
                      {t(link.label)}
                    </NavLink>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-6 border-t border-gray-100" />

                {/* Actions */}
                <div className="space-y-3">
                  <a
                    href="tel:+8801712345678"
                    className="flex items-center gap-3 px-4 py-3.5 bg-navy/5 rounded-xl text-navy font-medium"
                  >
                    <div className="w-9 h-9 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                      <Phone size={16} className="text-teal" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">{t({ en: 'Call Us', bn: 'কল করুন' })}</span>
                      <span className="text-sm font-semibold">+880 1712-345678</span>
                    </div>
                  </a>
                  <Link
                    to="/appointment"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 bg-teal text-white px-4 py-3.5 rounded-xl font-semibold text-base shadow-lg shadow-teal/25"
                  >
                    <Calendar size={18} />
                    {t({ en: 'Book Appointment', bn: 'অ্যাপয়েন্টমেন্ট বুক করুন' })}
                  </Link>
                </div>

                {/* Language Toggle */}
                <div className="mt-6 flex items-center justify-center">
                  <button
                    onClick={toggleLanguage}
                    className="px-4 py-2 rounded-lg text-sm font-semibold border border-teal/30 text-teal hover:bg-teal/10 transition-colors"
                  >
                    {language === 'en' ? 'বাংলায় দেখুন' : 'Switch to English'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Navbar;
