import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/ui/PageTransition';

const LoginPage = () => {
  const { t } = useLanguage();
  const { signIn, signInWithOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [loginMethod, setLoginMethod] = useState('email'); // 'email' | 'phone'
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: regOtp, handleSubmit: handleOtp, formState: { errors: otpErrors } } = useForm();

  const inputBase = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-11 text-navy placeholder-gray-400 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-all';

  const onEmailLogin = async (data) => {
    setIsSubmitting(true);
    try {
      await signIn(data.email, data.password);
      toast.success(t({ en: 'Welcome back!', bn: 'স্বাগতম!' }));
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message === 'Invalid login credentials'
        ? t({ en: 'Invalid email or password', bn: 'ভুল ইমেইল বা পাসওয়ার্ড' })
        : err.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSendOtp = async (data) => {
    setIsSubmitting(true);
    try {
      await signInWithOtp(data.phone);
      setPhoneNumber(data.phone);
      setOtpSent(true);
      toast.success(t({ en: 'OTP sent to your phone', bn: 'আপনার ফোনে OTP পাঠানো হয়েছে' }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onVerifyOtp = async (data) => {
    setIsSubmitting(true);
    try {
      await verifyOtp(phoneNumber, data.otp);
      toast.success(t({ en: 'Welcome!', bn: 'স্বাগতম!' }));
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(t({ en: 'Invalid OTP. Try again.', bn: 'ভুল OTP। আবার চেষ্টা করুন।' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>{t({ en: 'Login — Everyday Dental Surgery', bn: 'লগইন — এভরিডে ডেন্টাল সার্জারি' })}</title>
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
                {t({ en: 'Welcome Back', bn: 'স্বাগতম' })}
              </h1>
              <p className="text-gray-500 text-sm">
                {t({ en: 'Log in to your patient portal', bn: 'আপনার রোগী পোর্টালে লগ ইন করুন' })}
              </p>
            </div>

            {/* Login method tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                type="button"
                onClick={() => { setLoginMethod('email'); setOtpSent(false); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  loginMethod === 'email' ? 'bg-white text-navy shadow-sm' : 'text-gray-500'
                }`}
              >
                <Mail size={14} className="inline mr-1.5" />
                {t({ en: 'Email', bn: 'ইমেইল' })}
              </button>
              <button
                type="button"
                onClick={() => { setLoginMethod('phone'); setOtpSent(false); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  loginMethod === 'phone' ? 'bg-white text-navy shadow-sm' : 'text-gray-500'
                }`}
              >
                <Phone size={14} className="inline mr-1.5" />
                {t({ en: 'Phone OTP', bn: 'ফোন OTP' })}
              </button>
            </div>

            {/* Email login */}
            {loginMethod === 'email' && (
              <form onSubmit={handleSubmit(onEmailLogin)} className="space-y-4">
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

                <div>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t({ en: 'Password', bn: 'পাসওয়ার্ড' })}
                      autoComplete="current-password"
                      className={inputBase}
                      {...register('password', {
                        required: t({ en: 'Password is required', bn: 'পাসওয়ার্ড আবশ্যক' }),
                        minLength: { value: 8, message: t({ en: 'Minimum 8 characters', bn: 'সর্বনিম্ন ৮ অক্ষর' }) },
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

                <div className="text-right">
                  <Link to="/forgot-password" className="text-teal text-sm font-medium hover:underline">
                    {t({ en: 'Forgot password?', bn: 'পাসওয়ার্ড ভুলে গেছেন?' })}
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal text-white font-heading font-semibold py-3.5 rounded-xl hover:bg-teal/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting
                    ? t({ en: 'Logging in...', bn: 'লগ ইন হচ্ছে...' })
                    : t({ en: 'Log In', bn: 'লগ ইন' })
                  }
                  {!isSubmitting && <ArrowRight size={18} />}
                </button>
              </form>
            )}

            {/* Phone OTP login */}
            {loginMethod === 'phone' && !otpSent && (
              <form onSubmit={handleOtp(onSendOtp)} className="space-y-4">
                <div>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="+880 1XXX-XXXXXX"
                      className={inputBase}
                      {...regOtp('phone', {
                        required: t({ en: 'Phone is required', bn: 'ফোন আবশ্যক' }),
                        pattern: { value: /^\+?880?1[3-9]\d{8}$/, message: t({ en: 'Invalid BD phone', bn: 'ভুল ফোন নম্বর' }) },
                      })}
                    />
                  </div>
                  {otpErrors.phone && <p className="text-red-500 text-xs mt-1">{otpErrors.phone.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal text-white font-heading font-semibold py-3.5 rounded-xl hover:bg-teal/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting
                    ? t({ en: 'Sending OTP...', bn: 'OTP পাঠানো হচ্ছে...' })
                    : t({ en: 'Send OTP', bn: 'OTP পাঠান' })
                  }
                </button>
              </form>
            )}

            {loginMethod === 'phone' && otpSent && (
              <form onSubmit={handleOtp(onVerifyOtp)} className="space-y-4">
                <p className="text-sm text-gray-600 text-center mb-2">
                  {t({ en: `OTP sent to ${phoneNumber}`, bn: `${phoneNumber}-এ OTP পাঠানো হয়েছে` })}
                </p>
                <div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-2xl tracking-[0.5em] text-navy font-mono focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none"
                    {...regOtp('otp', {
                      required: t({ en: 'Enter OTP', bn: 'OTP দিন' }),
                      pattern: { value: /^\d{6}$/, message: t({ en: '6-digit code required', bn: '৬ সংখ্যার কোড দিন' }) },
                    })}
                  />
                  {otpErrors.otp && <p className="text-red-500 text-xs mt-1 text-center">{otpErrors.otp.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal text-white font-heading font-semibold py-3.5 rounded-xl hover:bg-teal/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting
                    ? t({ en: 'Verifying...', bn: 'যাচাই হচ্ছে...' })
                    : t({ en: 'Verify & Log In', bn: 'যাচাই করুন ও লগ ইন' })
                  }
                </button>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-sm text-gray-500 hover:text-teal"
                >
                  {t({ en: 'Change number', bn: 'নম্বর পরিবর্তন' })}
                </button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-gray-500">
              {t({ en: "Don't have an account?", bn: 'অ্যাকাউন্ট নেই?' })}{' '}
              <Link to="/signup" className="text-teal font-semibold hover:underline">
                {t({ en: 'Sign Up', bn: 'সাইন আপ' })}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
};

export default LoginPage;
