import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageTransition from '../components/ui/PageTransition';

const UnauthorizedPage = () => {
  const { t } = useLanguage();

  return (
    <PageTransition>
      <Helmet>
        <title>{t({ en: 'Unauthorized — Everyday Dental Surgery', bn: 'অননুমোদিত — এভরিডে ডেন্টাল সার্জারি' })}</title>
      </Helmet>

      <section className="min-h-[80vh] flex items-center justify-center py-16 bg-offwhite">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-4"
        >
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <ShieldX className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-navy mb-3">
            {t({ en: 'Access Denied', bn: 'প্রবেশ নিষিদ্ধ' })}
          </h1>
          <p className="text-gray-500 mb-8">
            {t({
              en: "You don't have permission to access this page. Contact the clinic administrator if you believe this is an error.",
              bn: 'এই পৃষ্ঠায় প্রবেশের অনুমতি নেই। ভুল মনে হলে ক্লিনিক প্রশাসকের সাথে যোগাযোগ করুন।',
            })}
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-navy text-white font-semibold text-sm hover:bg-navy/90 transition-colors"
            >
              <Home size={16} />
              {t({ en: 'Go Home', bn: 'হোমে যান' })}
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-navy font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={16} />
              {t({ en: 'Dashboard', bn: 'ড্যাশবোর্ড' })}
            </Link>
          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
};

export default UnauthorizedPage;
