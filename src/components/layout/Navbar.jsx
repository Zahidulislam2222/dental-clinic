import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Calendar, LogIn, User, Shield, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { ANNOUNCEMENT_HEIGHT } from './AnnouncementBar';

/* ── Consolidated Nav Structure ── */
const navItems = [
  { to: '/', label: { en: 'Home', bn: 'হোম' } },
  {
    label: { en: 'About', bn: 'সম্পর্কে' },
    children: [
      { to: '/about', label: { en: 'About Us', bn: 'আমাদের সম্পর্কে' } },
      { to: '/faq', label: { en: 'FAQ', bn: 'প্রশ্নোত্তর' } },
    ],
  },
  {
    label: { en: 'Services', bn: 'সেবা' },
    children: [
      { to: '/services', label: { en: 'Our Services', bn: 'আমাদের সেবা' } },
      { to: '/pricing', label: { en: 'Pricing', bn: 'মূল্যতালিকা' } },
    ],
  },
  {
    label: { en: 'Resources', bn: 'তথ্যসূত্র' },
    children: [
      { to: '/blog', label: { en: 'Blog', bn: 'ব্লগ' } },
      { to: '/community', label: { en: 'Community', bn: 'সম্প্রদায়' } },
    ],
  },
  { to: '/contact', label: { en: 'Contact', bn: 'যোগাযোগ' } },
];

/* Flat list for mobile */
const mobileNavLinks = [
  { to: '/', label: { en: 'Home', bn: 'হোম' } },
  { to: '/about', label: { en: 'About', bn: 'সম্পর্কে' } },
  { to: '/services', label: { en: 'Services', bn: 'সেবাসমূহ' } },
  { to: '/pricing', label: { en: 'Pricing', bn: 'মূল্যতালিকা' } },
  { to: '/blog', label: { en: 'Blog', bn: 'ব্লগ' } },
  { to: '/community', label: { en: 'Community', bn: 'সম্প্রদায়' } },
  { to: '/faq', label: { en: 'FAQ', bn: 'প্রশ্নোত্তর' } },
  { to: '/contact', label: { en: 'Contact', bn: 'যোগাযোগ' } },
];

/* ── Dropdown Component ── */
const NavDropdown = ({ item, t, location }) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);

  const isChildActive = item.children.some((child) =>
    child.to === '/' ? location.pathname === '/' : location.pathname.startsWith(child.to)
  );

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        className={`nav-link-premium flex items-center gap-1 px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors duration-200 ${
          isChildActive ? 'text-teal active-link' : 'text-navy/70 hover:text-navy'
        }`}
        onClick={() => setOpen(!open)}
      >
        {t(item.label)}
        <ChevronDown
          size={11}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-0 pt-3"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100/80 py-1.5 min-w-[180px]">
              {item.children.map((child) => (
                <NavLink
                  key={child.to}
                  to={child.to}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'text-teal bg-teal/5'
                        : 'text-navy/70 hover:text-teal hover:bg-teal/5 hover:pl-5'
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  {t(child.label)}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Auth Button ── */
const AuthNavButton = () => {
  const { isAuthenticated, profile } = useAuth();
  const { t } = useLanguage();

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-1.5 text-navy/70 hover:text-teal transition-colors px-3 py-2 rounded-lg text-[13px] font-semibold uppercase tracking-[0.05em]"
      >
        <LogIn size={14} />
        <span>{t({ en: 'Login', bn: 'লগইন' })}</span>
      </Link>
    );
  }

  const dashboardLink = ['admin', 'doctor', 'receptionist'].includes(profile?.role)
    ? '/admin'
    : '/dashboard';

  return (
    <Link
      to={dashboardLink}
      className="flex items-center gap-1.5 text-navy/70 hover:text-teal transition-colors px-3 py-2 rounded-lg text-[13px] font-semibold uppercase tracking-[0.05em]"
    >
      {profile?.role === 'admin' ? (
        <Shield size={14} className="text-teal" />
      ) : (
        <User size={14} className="text-teal" />
      )}
      <span className="max-w-[100px] truncate">
        {profile?.full_name || t({ en: 'Portal', bn: 'পোর্টাল' })}
      </span>
    </Link>
  );
};

/* ── Main Navbar ── */
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
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-2xl shadow-[0_1px_20px_rgba(0,0,0,0.06)] border-b border-gray-200/50'
            : 'bg-white/60 backdrop-blur-md border-b border-transparent'
        }`}
        style={{ top: ANNOUNCEMENT_HEIGHT }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <svg
                width="36"
                height="40"
                viewBox="0 0 60 70"
                className="transition-transform duration-300 group-hover:scale-110"
              >
                <path
                  d="M30 5C20 5 12 10 10 20C8 30 5 45 15 60C20 67 25 65 30 55C35 65 40 67 45 60C55 45 52 30 50 20C48 10 40 5 30 5Z"
                  fill="#00BFA6"
                  stroke="#00BFA6"
                  strokeWidth="1"
                />
                <path
                  d="M25 20C22 20 20 22 20 25C20 28 22 30 25 28C28 26 30 30 30 30C30 30 32 26 35 28C38 30 40 28 40 25C40 22 38 20 35 20C33 20 31 21 30 23C29 21 27 20 25 20Z"
                  fill="rgba(255,255,255,0.4)"
                />
              </svg>
              <div>
                <span className="font-heading font-bold text-lg leading-tight block text-navy">
                  Everyday
                </span>
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-teal">
                  Dental Surgery
                </span>
              </div>
            </Link>

            {/* Desktop Nav — 5 items instead of 8 */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item, i) =>
                item.children ? (
                  <NavDropdown key={i} item={item} t={t} location={location} />
                ) : (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `nav-link-premium px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors duration-200 ${
                        isActive ? 'text-teal active-link' : 'text-navy/70 hover:text-navy'
                      }`
                    }
                  >
                    {t(item.label)}
                  </NavLink>
                )
              )}
            </div>

            {/* Right Actions — clean: only Book Now + Login */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/appointment"
                className="group relative bg-teal text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-teal-600 transition-all duration-300 inline-flex items-center gap-2 shadow-[0_2px_15px_rgba(0,191,166,0.3)] hover:shadow-[0_4px_25px_rgba(0,191,166,0.4)] hover:scale-[1.02]"
              >
                <Calendar size={14} />
                {t({ en: 'Book Now', bn: 'বুক করুন' })}
              </Link>
              <div className="w-px h-5 bg-gray-200" />
              <AuthNavButton />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-navy rounded-lg hover:bg-gray-50 transition-colors"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — Full Screen Portal */}
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
                <div className="flex justify-between items-center mb-10">
                  <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                    <svg width="32" height="36" viewBox="0 0 60 70">
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
                      <span className="font-heading font-bold text-base text-navy block leading-tight">
                        Everyday
                      </span>
                      <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-teal">
                        Dental Surgery
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={20} className="text-navy" />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="space-y-1">
                  {mobileNavLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === '/'}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                          isActive
                            ? 'text-teal bg-teal/10 font-semibold'
                            : 'text-navy hover:bg-gray-50'
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
                      <span className="text-xs text-gray-500 block">
                        {t({ en: 'Call Us', bn: 'কল করুন' })}
                      </span>
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
