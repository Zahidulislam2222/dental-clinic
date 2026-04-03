/**
 * Appointment Cancellation UI
 * FLOW-APPT-002: Patient can cancel their own appointments with reason
 */

import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';
import { XCircle, Loader2, AlertTriangle } from 'lucide-react';

const CANCELLATION_REASONS = [
  { en: 'Schedule conflict', bn: 'সময়সূচীর দ্বন্দ্ব' },
  { en: 'Feeling better', bn: 'ভালো লাগছে' },
  { en: 'Found another provider', bn: 'অন্য সেবাদাতা পেয়েছি' },
  { en: 'Financial reasons', bn: 'আর্থিক কারণ' },
  { en: 'Transportation issues', bn: 'যাতায়াত সমস্যা' },
  { en: 'Other', bn: 'অন্যান্য' },
];

export default function CancelAppointment({ appointmentId, refNumber, onCancelled, onClose }) {
  const { t } = useLanguage();
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleCancel = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setError('Backend not configured');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const finalReason = reason === 'Other' ? customReason : reason;

      const { data, error: fnError } = await supabase.functions.invoke('cancel-appointment', {
        body: { appointmentId, reason: finalReason },
      });

      if (fnError) throw new Error('Cancellation failed. Please try again.');

      setConfirmed(true);
      onCancelled?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (confirmed) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-md text-center">
        <XCircle className="mx-auto text-red-400 mb-3" size={48} />
        <h3 className="text-lg font-heading font-bold text-navy mb-2">
          {t({ en: 'Appointment Cancelled', bn: 'অ্যাপয়েন্টমেন্ট বাতিল হয়েছে' })}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {t({ en: `Reference: ${refNumber}`, bn: `রেফারেন্স: ${refNumber}` })}
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-gray-100 text-navy font-semibold rounded-xl hover:bg-gray-200 transition-colors"
        >
          {t({ en: 'Close', bn: 'বন্ধ করুন' })}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-md">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="text-amber-500" size={24} />
        <h3 className="text-lg font-heading font-bold text-navy">
          {t({ en: 'Cancel Appointment', bn: 'অ্যাপয়েন্টমেন্ট বাতিল করুন' })}
        </h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {t({
          en: `Are you sure you want to cancel appointment ${refNumber}? This action cannot be undone.`,
          bn: `আপনি কি নিশ্চিত যে আপনি অ্যাপয়েন্টমেন্ট ${refNumber} বাতিল করতে চান? এই পদক্ষেপ পূর্বাবস্থায় ফিরিয়ে আনা যাবে না।`,
        })}
      </p>

      <div className="space-y-3 mb-4">
        <label className="text-sm font-semibold text-navy block">
          {t({ en: 'Reason for cancellation:', bn: 'বাতিলের কারণ:' })}
        </label>
        <div className="space-y-2">
          {CANCELLATION_REASONS.map((r) => (
            <label
              key={r.en}
              className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                reason === r.en ? 'border-teal bg-teal/5' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <input
                type="radio"
                name="cancelReason"
                value={r.en}
                checked={reason === r.en}
                onChange={() => setReason(r.en)}
                className="w-4 h-4 text-teal border-gray-300 focus:ring-teal"
              />
              <span className="text-sm text-navy">{t(r)}</span>
            </label>
          ))}
        </div>

        {reason === 'Other' && (
          <input
            type="text"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder={t({ en: 'Please specify...', bn: 'অনুগ্রহ করে উল্লেখ করুন...' })}
            autoComplete="off"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-navy placeholder-gray-400 focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none"
          />
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2.5 bg-gray-100 text-navy font-semibold rounded-xl hover:bg-gray-200 transition-colors"
        >
          {t({ en: 'Keep Appointment', bn: 'অ্যাপয়েন্টমেন্ট রাখুন' })}
        </button>
        <button
          onClick={handleCancel}
          disabled={loading || !reason || (reason === 'Other' && !customReason)}
          className="flex-1 px-4 py-2.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {t({ en: 'Cancel', bn: 'বাতিল করুন' })}
        </button>
      </div>
    </div>
  );
}
