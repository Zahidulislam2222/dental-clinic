import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/ui/PageTransition';

const SignupPage = () => {
  const { t } = useLanguage();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const inputBase = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 text-navy placeholder-gray-400 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all';

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await signUp(data.email, data.password, {
        full_name: data.fullName,
        phone: data.phone || '',
      });
      setEmailSent(true);
    } catch (err) {
      const msg = err.message?.includes('already registered')
        ? t({ en: 'This email is already registered. Try logging in.', bn: 'এই ইমেইল ইতোমধ্যে নিবন্ধিত। লগ ইন করুন।' })
        : err.message;
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <PageTransition>
        <Helmet>
          <title>{t({ en: 'Verify Email — Everyday Dental Surgery', bn: 'ইমেইল যাচাই — এভরিডে ডেন্টাল সার্জারি' })}</title>
        </Helmet>
        <section className="min-h-[80vh] flex items-center justify-center py-16 bg-offwhite">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-teal" />
            </div>
            <h2 className="font-heading text-xl font-bold text-navy mb-2">
              {t({ en: 'Check Your Email', bn: 'আপনার ইমেইল চেক করুন' })}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {t({
                en: "We've sent a verification link to your email. Please click the link to activate your account.",
                bn: 'আমরা আপনার ইমেইলে একটি যাচাই লিংক পাঠিয়েছি। অ্যাকাউন্ট সক্রিয় করতে লিংকে ক্লিক করুন।',
              })}
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-teal font-semibold hover:underline"
            >
              {t({ en: 'Go to Login', bn: 'লগ ইনে যান' })}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Helmet>
        <title>{t({ en: 'Sign Up — Everyday Dental Surgery', bn: 'সাইন আপ — এভরিডে ডেন্টাল সার্জারি' })}</title>
      </Helmet>

      <section className="min-h-[80vh] flex items-center justify-center py-16 bg-offwhite">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-4"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-8">
              <h1 className="font-heading text-2xl font-bold text-navy mb-2">
                {t({ en: 'Create Account', bn: 'অ্যাকাউন্ট তৈরি করুন' })}
              </h1>
              <p className="text-gray-500 text-sm">
                {t({ en: 'Sign up to access your patient portal', bn: 'রোগী পোর্টালে প্রবেশ করতে সাইন আপ করুন' })}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t({ en: 'Full name', bn: 'পূর্ণ নাম' })}
                    className={inputBase}
                    {...register('fullName', {
                      required: t({ en: 'Name is required', bn: 'নাম আবশ্যক' }),
                      minLength: { value: 2, message: t({ en: 'Minimum 2 characters', bn: 'সর্বনিম্ন ২ অক্ষর' }) },
                    })}
                  />
                </div>
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>

              {/* Email */}
              <div>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder={t({ en: 'Email address', bn: 'ইমেইল ঠিকানা' })}
                    className={inputBase}
                    {...register('email', {
                      required: t({ en: 'Email is required', bn: 'ইমেইল আবশ্যক' }),
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: t({ en: 'Invalid email', bn: 'ভুল ইমেইল' }) },
                    })}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Phone (optional) */}
              <div>
                <div className="relative">
                  <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    placeholder={t({ en: 'Phone (optional)', bn: 'ফোন (ঐচ্ছিক)' })}
                    className={inputBase}
                    {...register('phone', {
                      pattern: { value: /^(\+?880|0)?1[3-9]\d{8}$/, message: t({ en: 'Invalid BD phone', bn: 'ভুল ফোন নম্বর' }) },
                    })}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t({ en: 'Password (min 8 chars)', bn: 'পাসওয়ার্ড (সর্বনিম্ন ৮ অক্ষর)' })}
                    autoComplete="new-password"
                    className={inputBase}
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

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t({ en: 'Confirm password', bn: 'পাসওয়ার্ড নিশ্চিত করুন' })}
                    autoComplete="new-password"
                    className={inputBase}
                    {...register('confirmPassword', {
                      required: t({ en: 'Please confirm password', bn: 'পাসওয়ার্ড নিশ্চিত করুন' }),
                      validate: (v) => v === password || t({ en: 'Passwords do not match', bn: 'পাসওয়ার্ড মিলছে না' }),
                    })}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>

              {/* Consent */}
              <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 text-teal border-gray-300 rounded focus:ring-teal"
                  {...register('consent', {
                    required: t({ en: 'You must agree to continue', bn: 'চালিয়ে যেতে সম্মতি দিন' }),
                  })}
                />
                <span>
                  {t({ en: 'I agree to the ', bn: 'আমি সম্মত ' })}
                  <Link to="/privacy-policy" className="text-teal underline" target="_blank">{t({ en: 'Privacy Policy', bn: 'গোপনীয়তা নীতি' })}</Link>
                  {t({ en: ' and ', bn: ' এবং ' })}
                  <Link to="/terms" className="text-teal underline" target="_blank">{t({ en: 'Terms of Service', bn: 'সেবার শর্তাবলী' })}</Link>
                </span>
              </label>
              {errors.consent && <p className="text-red-500 text-xs">{errors.consent.message}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-teal text-white font-heading font-semibold py-3.5 rounded-xl hover:bg-teal/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting
                  ? t({ en: 'Creating account...', bn: 'অ্যাকাউন্ট তৈরি হচ্ছে...' })
                  : t({ en: 'Create Account', bn: 'অ্যাকাউন্ট তৈরি করুন' })
                }
                {!isSubmitting && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              {t({ en: 'Already have an account?', bn: 'ইতোমধ্যে অ্যাকাউন্ট আছে?' })}{' '}
              <Link to="/login" className="text-teal font-semibold hover:underline">
                {t({ en: 'Log In', bn: 'লগ ইন' })}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
};

export default SignupPage;
