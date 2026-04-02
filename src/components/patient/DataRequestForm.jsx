import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Send, Clock, CheckCircle, XCircle, Loader2, AlertCircle, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const REQUEST_TYPES = [
  { value: 'access', label: { en: 'Access My Data', bn: 'আমার তথ্য অ্যাক্সেস' }, hipaa: '164.524' },
  { value: 'amendment', label: { en: 'Amend My Data', bn: 'আমার তথ্য সংশোধন' }, hipaa: '164.526' },
  { value: 'deletion', label: { en: 'Delete My Data', bn: 'আমার তথ্য মুছে ফেলুন' }, hipaa: '164.524' },
  { value: 'restriction', label: { en: 'Restrict Use of My Data', bn: 'আমার তথ্যের ব্যবহার সীমাবদ্ধ করুন' }, hipaa: '164.522' },
];

const STATUS_CONFIG = {
  pending: { icon: Clock, color: 'text-yellow-600 bg-yellow-50', label: { en: 'Pending', bn: 'মুলতুবি' } },
  approved: { icon: CheckCircle, color: 'text-green-600 bg-green-50', label: { en: 'Approved', bn: 'অনুমোদিত' } },
  denied: { icon: XCircle, color: 'text-red-600 bg-red-50', label: { en: 'Denied', bn: 'প্রত্যাখ্যাত' } },
  completed: { icon: CheckCircle, color: 'text-blue-600 bg-blue-50', label: { en: 'Completed', bn: 'সম্পন্ন' } },
};

const DataRequestForm = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [consents, setConsents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ requestType: 'access', details: '' });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!supabase || !user) {
      setLoading(false);
      return;
    }

    try {
      const [reqResult, consentResult] = await Promise.all([
        supabase.from('data_access_requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('consent_records').select('*').eq('user_id', user.id).order('granted_at', { ascending: false }),
      ]);

      setRequests(reqResult.data || []);
      setConsents(consentResult.data || []);
    } catch (err) {
      console.error('Failed to load data rights info:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase || !user || !formData.details.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from('data_access_requests').insert({
        user_id: user.id,
        request_type: formData.requestType,
        details: formData.details.trim(),
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({ requestType: 'access', details: '' });
      setShowForm(false);
      await fetchData();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-teal animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Submit New Request */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-navy">
            {t({ en: 'Data Rights Requests', bn: 'তথ্য অধিকার অনুরোধ' })}
          </h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-sm font-medium text-teal hover:underline"
          >
            {showForm
              ? t({ en: 'Cancel', bn: 'বাতিল' })
              : t({ en: '+ New Request', bn: '+ নতুন অনুরোধ' })}
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-3 overflow-hidden"
            >
              <select
                value={formData.requestType}
                onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal/30"
              >
                {REQUEST_TYPES.map((rt) => (
                  <option key={rt.value} value={rt.value}>
                    {t(rt.label)} (HIPAA {rt.hipaa})
                  </option>
                ))}
              </select>

              <textarea
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                rows={3}
                placeholder={t({ en: 'Describe your request in detail...', bn: 'আপনার অনুরোধ বিস্তারিত বর্ণনা করুন...' })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal/30 resize-none"
                required
              />

              <button
                type="submit"
                disabled={submitting || !formData.details.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-teal/90 transition-colors disabled:opacity-60"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                {t({ en: 'Submit Request', bn: 'অনুরোধ জমা দিন' })}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {success && (
          <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800 flex items-center gap-2">
            <CheckCircle size={14} />
            {t({ en: 'Request submitted successfully', bn: 'অনুরোধ সফলভাবে জমা দেওয়া হয়েছে' })}
          </div>
        )}

        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800 flex items-center gap-2">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {/* Existing Requests */}
        {requests.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              {t({ en: 'Your Requests', bn: 'আপনার অনুরোধ' })}
            </p>
            {requests.map((req, i) => {
              const sc = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
              const Icon = sc.icon;
              return (
                <div key={req.id || i} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                  <div className={`p-1.5 rounded-full ${sc.color}`}>
                    <Icon size={12} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-navy capitalize">{req.request_type}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.color}`}>
                        {t(sc.label)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{req.details}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(req.created_at).toLocaleDateString()}
                    </p>
                    {req.admin_notes && (
                      <p className="text-xs text-navy bg-white rounded p-2 mt-1 border">
                        <span className="font-medium">{t({ en: 'Response:', bn: 'প্রতিক্রিয়া:' })}</span> {req.admin_notes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Consent History */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h3 className="font-heading font-bold text-navy mb-3 flex items-center gap-2">
          <Shield size={16} className="text-teal" />
          {t({ en: 'Consent History', bn: 'সম্মতি ইতিহাস' })}
        </h3>

        {consents.length === 0 ? (
          <p className="text-sm text-gray-400">{t({ en: 'No consent records found', bn: 'কোন সম্মতি রেকর্ড পাওয়া যায়নি' })}</p>
        ) : (
          <div className="space-y-2">
            {consents.map((c, i) => (
              <div key={c.id || i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <FileText size={14} className="text-gray-400" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-navy capitalize">{c.consent_type?.replace(/_/g, ' ')}</span>
                    <span className="text-xs text-gray-400">v{c.version}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {t({ en: 'Granted:', bn: 'প্রদত্ত:' })} {new Date(c.granted_at).toLocaleString()}
                    {c.revoked_at && (
                      <span className="text-red-500 ml-2">
                        {t({ en: 'Revoked:', bn: 'প্রত্যাহার:' })} {new Date(c.revoked_at).toLocaleString()}
                      </span>
                    )}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.revoked_at ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  {c.revoked_at ? t({ en: 'Revoked', bn: 'প্রত্যাহৃত' }) : t({ en: 'Active', bn: 'সক্রিয়' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* HIPAA Rights Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700 mb-1">
          {t({ en: 'Your HIPAA Patient Rights', bn: 'আপনার HIPAA রোগী অধিকার' })}
        </p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>{t({ en: '164.524 — Right to access your Protected Health Information', bn: '164.524 — আপনার সুরক্ষিত স্বাস্থ্য তথ্য অ্যাক্সেসের অধিকার' })}</li>
          <li>{t({ en: '164.526 — Right to request amendments to your records', bn: '164.526 — আপনার রেকর্ডে সংশোধন অনুরোধের অধিকার' })}</li>
          <li>{t({ en: '164.522 — Right to request restrictions on data use', bn: '164.522 — তথ্য ব্যবহারে সীমাবদ্ধতা অনুরোধের অধিকার' })}</li>
          <li>{t({ en: '164.528 — Right to accounting of disclosures', bn: '164.528 — প্রকাশের হিসাবের অধিকার' })}</li>
        </ul>
      </div>
    </div>
  );
};

export default DataRequestForm;
