import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Facebook, Youtube, Linkedin, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  const quickLinks = [
    { to: '/', label: { en: 'Home', bn: 'হোম' } },
    { to: '/about', label: { en: 'About Doctor', bn: 'ডাক্তার সম্পর্কে' } },
    { to: '/services', label: { en: 'Services', bn: 'সেবাসমূহ' } },
    { to: '/pricing', label: { en: 'Pricing', bn: 'মূল্যতালিকা' } },
    { to: '/appointment', label: { en: 'Book Appointment', bn: 'অ্যাপয়েন্টমেন্ট' } },
  ];

  const moreLinks = [
    { to: '/blog', label: { en: 'Blog', bn: 'ব্লগ' } },
    { to: '/faq', label: { en: 'FAQ', bn: 'প্রশ্নোত্তর' } },
    { to: '/community', label: { en: 'Community', bn: 'সম্প্রদায়' } },
    { to: '/conferences', label: { en: 'Conferences', bn: 'সম্মেলন' } },
    { to: '/contact', label: { en: 'Contact', bn: 'যোগাযোগ' } },
    { to: '/register', label: { en: 'Patient Registration', bn: 'রোগী নিবন্ধন' } },
    { to: '/gallery', label: { en: 'Gallery', bn: 'গ্যালারি' } },
  ];

  return (
    <footer className="bg-navy text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <svg width="32" height="36" viewBox="0 0 60 70">
                <path d="M30 5C20 5 12 10 10 20C8 30 5 45 15 60C20 67 25 65 30 55C35 65 40 67 45 60C55 45 52 30 50 20C48 10 40 5 30 5Z" fill="#00BFA6" />
                <path d="M25 20C22 20 20 22 20 25C20 28 22 30 25 28C28 26 30 30 30 30C30 30 32 26 35 28C38 30 40 28 40 25C40 22 38 20 35 20C33 20 31 21 30 23C29 21 27 20 25 20Z" fill="rgba(255,255,255,0.4)" />
              </svg>
              <div>
                <span className="font-heading font-bold text-lg block">Everyday</span>
                <span className="text-teal text-xs tracking-wider uppercase">Dental Surgery</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {t({ en: 'Crafting Healthy Smiles Since 2009. Your trusted partner for comprehensive dental care in Dhaka.', bn: '২০০৯ সাল থেকে সুস্থ হাসি তৈরি করছি। ঢাকায় সম্পূর্ণ দন্ত চিকিৎসার জন্য আপনার বিশ্বস্ত সঙ্গী।' })}
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-teal transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://wa.me/8801712345678" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-teal transition-colors">
                <MessageCircle size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-teal transition-colors">
                <Youtube size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-teal transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">{t({ en: 'Quick Links', bn: 'দ্রুত লিঙ্ক' })}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-teal transition-colors text-sm">
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">{t({ en: 'More', bn: 'আরও' })}</h4>
            <ul className="space-y-2">
              {moreLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-teal transition-colors text-sm">
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">{t({ en: 'Contact Us', bn: 'যোগাযোগ' })}</h4>
            <div className="space-y-3">
              <div className="flex gap-3 text-sm">
                <MapPin size={18} className="text-teal flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">
                  {t({
                    en: '123/A, Greenview Plaza (3rd Floor), Mirpur Road, Dhanmondi, Dhaka',
                    bn: 'গ্রিনভিউ প্লাজা (৩য় তলা), ১২৩/এ মিরপুর রোড, ধানমন্ডি, ঢাকা'
                  })}
                </span>
              </div>
              <div className="flex gap-3 text-sm">
                <Phone size={18} className="text-teal flex-shrink-0" />
                <a href="tel:+8801712345678" className="text-gray-400 hover:text-teal transition-colors">
                  +880 1712-345678
                </a>
              </div>
              <div className="flex gap-3 text-sm">
                <Mail size={18} className="text-teal flex-shrink-0" />
                <a href="mailto:info@example-dental.com" className="text-gray-400 hover:text-teal transition-colors">
                  info@example-dental.com
                </a>
              </div>
              <div className="flex gap-3 text-sm">
                <Clock size={18} className="text-teal flex-shrink-0" />
                <div className="text-gray-400">
                  <p>{t({ en: 'Sat–Thu: 5:00 PM – 9:00 PM', bn: 'শনি–বৃহস্পতি: ৫:০০ PM – ৯:০০ PM' })}</p>
                  <p className="text-red-400">{t({ en: 'Friday: Closed', bn: 'শুক্রবার: বন্ধ' })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; 2026 Everyday Dental Surgery & Implant Center. {t({ en: 'All rights reserved.', bn: 'সর্বস্বত্ব সংরক্ষিত।' })}</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-teal cursor-pointer transition-colors">{t({ en: 'Privacy Policy', bn: 'গোপনীয়তা নীতি' })}</Link>
            <Link to="/terms" className="hover:text-teal cursor-pointer transition-colors">{t({ en: 'Terms & Conditions', bn: 'শর্তাবলী' })}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
