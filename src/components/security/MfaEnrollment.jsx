/**
 * MFA Enrollment & Verification Component
 * SOC2-MFA-001: Staff accounts must support TOTP-based MFA
 *
 * Uses Supabase Auth TOTP MFA (supabase.auth.mfa.*)
 * Enrollment flow: enroll → show QR → verify code → activated
 */

import { useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';
import { Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function MfaEnrollment() {
  const { t } = useLanguage();
  const [step, setStep] = useState('idle'); // idle, enrolling, verify, success, error
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState(null);
  const [factorId, setFactorId] = useState(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const startEnrollment = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setError('Backend not configured');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'EDS Dental Authenticator',
      });

      if (enrollError) throw enrollError;

      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setFactorId(data.id);
      setStep('verify');
    } catch (err) {
      setError(err.message || 'Failed to start MFA enrollment');
      setStep('error');
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyEnrollment = useCallback(async () => {
    if (!factorId || !verifyCode) return;

    setLoading(true);
    setError(null);
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: verifyCode,
      });
      if (verifyError) throw verifyError;

      setStep('success');
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [factorId, verifyCode]);

  const unenroll = useCallback(async () => {
    if (!factorId) return;
    setLoading(true);
    try {
      await supabase.auth.mfa.unenroll({ factorId });
      setStep('idle');
      setQrCode(null);
      setSecret(null);
      setFactorId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [factorId]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-md">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="text-teal" size={24} />
        <h3 className="text-lg font-heading font-bold text-navy">
          {t({ en: 'Two-Factor Authentication', bn: 'দ্বি-স্তর প্রমাণীকরণ' })}
        </h3>
      </div>

      {step === 'idle' && (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            {t({
              en: 'Add an extra layer of security to your account using an authenticator app (Google Authenticator, Authy, etc.)',
              bn: 'একটি প্রমাণীকরণ অ্যাপ ব্যবহার করে আপনার অ্যাকাউন্টে নিরাপত্তার অতিরিক্ত স্তর যোগ করুন',
            })}
          </p>
          <button
            onClick={startEnrollment}
            disabled={loading}
            className="w-full bg-teal text-white font-semibold py-3 rounded-xl hover:bg-teal/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {t({ en: 'Enable MFA', bn: 'MFA সক্রিয় করুন' })}
          </button>
        </div>
      )}

      {step === 'verify' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {t({
              en: 'Scan this QR code with your authenticator app, then enter the 6-digit code below.',
              bn: 'আপনার প্রমাণীকরণ অ্যাপ দিয়ে এই QR কোড স্ক্যান করুন, তারপর নিচে ৬-সংখ্যার কোড লিখুন।',
            })}
          </p>

          {qrCode && (
            <div className="flex justify-center">
              <img src={qrCode} alt="MFA QR Code" className="w-48 h-48 border rounded-lg" />
            </div>
          )}

          {secret && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">{t({ en: 'Manual entry key:', bn: 'ম্যানুয়াল কী:' })}</p>
              <code className="text-sm font-mono text-navy break-all">{secret}</code>
            </div>
          )}

          <div>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
              autoComplete="one-time-code"
              className="w-full text-center text-2xl font-mono tracking-[0.5em] rounded-xl border border-gray-200 bg-white px-4 py-3 text-navy focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none"
            />
          </div>

          <button
            onClick={verifyEnrollment}
            disabled={loading || verifyCode.length !== 6}
            className="w-full bg-teal text-white font-semibold py-3 rounded-xl hover:bg-teal/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {t({ en: 'Verify & Activate', bn: 'যাচাই ও সক্রিয় করুন' })}
          </button>
        </div>
      )}

      {step === 'success' && (
        <div className="text-center space-y-3">
          <CheckCircle className="mx-auto text-green-500" size={48} />
          <p className="text-green-700 font-semibold">
            {t({ en: 'MFA activated successfully!', bn: 'MFA সফলভাবে সক্রিয় হয়েছে!' })}
          </p>
          <p className="text-sm text-gray-500">
            {t({
              en: 'You will be asked for a code from your authenticator app when signing in.',
              bn: 'সাইন ইন করার সময় আপনার প্রমাণীকরণ অ্যাপ থেকে কোড চাইবে।',
            })}
          </p>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-start gap-2 text-red-600 bg-red-50 rounded-lg p-3">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
