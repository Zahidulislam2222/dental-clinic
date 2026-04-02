import { motion, AnimatePresence } from 'framer-motion';
import { Clock, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const SessionTimeout = () => {
  const { showTimeoutWarning, setShowTimeoutWarning, signOut, resetInactivityTimers } = useAuth();
  const { t } = useLanguage();

  const handleStayLoggedIn = () => {
    setShowTimeoutWarning(false);
    resetInactivityTimers();
  };

  return (
    <AnimatePresence>
      {showTimeoutWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-navy/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="font-heading text-xl font-bold text-navy mb-2">
              {t({ en: 'Session Expiring', bn: 'সেশন শেষ হচ্ছে' })}
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              {t({
                en: 'Your session will expire in 1 minute due to inactivity. Would you like to stay logged in?',
                bn: 'নিষ্ক্রিয়তার কারণে আপনার সেশন ১ মিনিটের মধ্যে শেষ হয়ে যাবে। আপনি কি লগ ইন থাকতে চান?',
              })}
            </p>
            <div className="flex gap-3">
              <button
                onClick={signOut}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-navy font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                {t({ en: 'Log Out', bn: 'লগ আউট' })}
              </button>
              <button
                onClick={handleStayLoggedIn}
                className="flex-1 px-4 py-3 rounded-xl bg-teal text-white font-semibold text-sm hover:bg-teal/90 transition-colors"
              >
                {t({ en: 'Stay Logged In', bn: 'লগ ইন থাকুন' })}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SessionTimeout;
