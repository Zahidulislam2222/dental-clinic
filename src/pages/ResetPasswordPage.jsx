import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/ui/PageTransition';

const ResetPasswordPage = () => {
  const { t } = useLanguage();
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await updatePassword(data.password);
      toast.success(t({ en: 'Password updated successfully!', bn: 'পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!' }));
      navigate('/login');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>{t({ en: 'New Password — Everyday Dental Surgery', bn: 'নতুন পাসওয়ার্ড — এভরিডে ডেন্টাল সার্জারি' })}</title>
      </Helmet>

      <section className="min-h-[80vh] flex items-center justify-center py-16 bg-offwhite">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
        >
          <div className="text-center mb-6">
            <h1 className="font-heading text-2xl font-bold text-navy mb-2">
              {t({ en: 'Set New Password', bn: 'নতুন পাসওয়ার্ড সেট করুন' })}
            </h1>
            <p className="text-gray-500 text-sm">
              {t({ en: 'Choose a strong password for your account.', bn: 'আপনার অ্যাকাউন্টের জন্য একটি শক্তিশালী পাসওয়ার্ড বেছে নিন।' })}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t({ en: 'New password', bn: 'নতুন পাসওয়ার্ড' })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 text-navy placeholder-gray-400 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all"
                  {...register('password', {
                    required: t({ en: 'Password is required', bn: 'পাসওয়ার্ড আবশ্যক' }),
                    minLength: { value: 8, message: t({ en: 'Minimum 8 characters', bn: 'সর্বনিম্ন ৮ অক্ষর' }) },
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*\d)/,
                      message: t({ en: 'Must include uppercase letter and number', bn: 'বড় হাতের অক্ষর ও সংখ্যা থাকতে হবে' }),
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t({ en: 'Confirm new password', bn: 'নতুন পাসওয়ার্ড নিশ্চিত করুন' })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 text-navy placeholder-gray-400 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all"
                  {...register('confirmPassword', {
                    required: t({ en: 'Please confirm password', bn: 'পাসওয়ার্ড নিশ্চিত করুন' }),
                    validate: (v) => v === password || t({ en: 'Passwords do not match', bn: 'পাসওয়ার্ড মিলছে না' }),
                  })}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal text-white font-heading font-semibold py-3.5 rounded-xl hover:bg-teal/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting
                ? t({ en: 'Updating...', bn: 'আপডেট হচ্ছে...' })
                : t({ en: 'Update Password', bn: 'পাসওয়ার্ড আপডেট করুন' })
              }
              {!isSubmitting && <CheckCircle size={18} />}
            </button>
          </form>
        </motion.div>
      </section>
    </PageTransition>
  );
};

export default ResetPasswordPage;
