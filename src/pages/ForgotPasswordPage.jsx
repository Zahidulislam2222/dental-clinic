import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/ui/PageTransition';

const ForgotPasswordPage = () => {
  const { t } = useLanguage();
  const { resetPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await resetPassword(data.email);
      setEmailSent(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>{t({ en: 'Reset Password — Everyday Dental Surgery', bn: 'পাসওয়ার্ড রিসেট — এভরিডে ডেন্টাল সার্জারি' })}</title>
      </Helmet>

      <section className="min-h-[80vh] flex items-center justify-center py-16 bg-offwhite">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
        >
          {emailSent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-teal" />
              </div>
              <h2 className="font-heading text-xl font-bold text-navy mb-2">
                {t({ en: 'Check Your Email', bn: 'ইমেইল চেক করুন' })}
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                {t({
                  en: 'If an account exists with that email, we sent a password reset link.',
                  bn: 'ওই ইমেইলে অ্যাকাউন্ট থাকলে আমরা রিসেট লিংক পাঠিয়েছি।',
                })}
              </p>
              <Link to="/login" className="text-teal font-semibold hover:underline inline-flex items-center gap-1">
                <ArrowLeft size={16} />
                {t({ en: 'Back to Login', bn: 'লগ ইনে ফিরুন' })}
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="font-heading text-2xl font-bold text-navy mb-2">
                  {t({ en: 'Forgot Password?', bn: 'পাসওয়ার্ড ভুলে গেছেন?' })}
                </h1>
                <p className="text-gray-500 text-sm">
                  {t({ en: "Enter your email and we'll send a reset link.", bn: 'আপনার ইমেইল দিন, আমরা রিসেট লিংক পাঠাব।' })}
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder={t({ en: 'Email address', bn: 'ইমেইল ঠিকানা' })}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 text-navy placeholder-gray-400 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all"
                      {...register('email', {
                        required: t({ en: 'Email is required', bn: 'ইমেইল আবশ্যক' }),
                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: t({ en: 'Invalid email', bn: 'ভুল ইমেইল' }) },
                      })}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal text-white font-heading font-semibold py-3.5 rounded-xl hover:bg-teal/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting
                    ? t({ en: 'Sending...', bn: 'পাঠানো হচ্ছে...' })
                    : t({ en: 'Send Reset Link', bn: 'রিসেট লিংক পাঠান' })
                  }
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-gray-500 text-sm hover:text-teal inline-flex items-center gap-1">
                  <ArrowLeft size={14} />
                  {t({ en: 'Back to Login', bn: 'লগ ইনে ফিরুন' })}
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </section>
    </PageTransition>
  );
};

export default ForgotPasswordPage;
