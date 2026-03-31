import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const WhatsAppFloat = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 max-w-[260px] relative"
          >
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={14} />
            </button>
            <p className="text-navy font-heading font-bold text-sm mb-1">
              {t({ en: 'Need help?', bn: 'সাহায্য প্রয়োজন?' })}
            </p>
            <p className="text-gray text-xs mb-3">
              {t({
                en: 'Chat with us on WhatsApp for quick appointment booking or any queries.',
                bn: 'দ্রুত অ্যাপয়েন্টমেন্ট বুকিং বা যেকোনো প্রশ্নের জন্য হোয়াটসঅ্যাপে আমাদের সাথে চ্যাট করুন।',
              })}
            </p>
            <a
              href="https://wa.me/8801712345678?text=Hello!%20I%20want%20to%20book%20an%20appointment%20at%20Everyday%20Dental%20Surgery."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-green-600 transition-colors"
            >
              <MessageCircle size={14} />
              {t({ en: 'Start Chat', bn: 'চ্যাট শুরু করুন' })}
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={() => setShowTooltip(!showTooltip)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 flex items-center justify-center relative"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
        <MessageCircle size={26} className="relative z-10" />
      </motion.button>
    </div>
  );
};

export default WhatsAppFloat;
