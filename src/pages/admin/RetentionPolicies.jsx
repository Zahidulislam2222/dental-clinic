import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Clock, Save, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const RetentionPolicies = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [purgeLogs, setPurgeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(null);
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!supabase) { setLoading(false); return; }
    try {
      const [polResult, logResult] = await Promise.all([
        supabase.functions.invoke('admin-query', { body: { table: 'retention_policies' } }),
        supabase.functions.invoke('admin-query', { body: { table: 'purge_logs' } }),
      ]);
      // retention_policies doesn't have created_at — handle gracefully
      setPolicies((polResult.data?.data || []).sort((a, b) => a.table_name.localeCompare(b.table_name)));
      setPurgeLogs(logResult.data?.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRetention = async (id, newDays) => {
    if (!supabase || !isAdmin()) return;
    setSaving(id);
    try {
      const { error: fnError } = await supabase
        .from('retention_policies')
        .update({ retention_days: newDays, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (fnError) throw fnError;
      setSaved(id);
      setTimeout(() => setSaved(null), 2000);
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-teal animate-spin" /></div>;
  if (error) return <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-2"><AlertCircle className="w-5 h-5 text-red-500" /><p className="text-red-700 text-sm">{error}</p></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={18} className="text-teal" />
        <h2 className="font-heading text-xl font-bold text-navy">
          {t({ en: 'Data Retention Policies', bn: 'তথ্য ধারণ নীতি' })}
        </h2>
      </div>

      <div className="bg-teal/5 border border-teal/20 rounded-lg p-3 text-xs text-gray-600 mb-5">
        {t({
          en: 'HIPAA requires retention of medical records for a minimum of 6 years. The automated purge runs nightly at 2:00 AM and only deletes records older than the configured retention period.',
          bn: 'HIPAA অনুসারে ন্যূনতম ৬ বছর চিকিৎসা রেকর্ড সংরক্ষণ প্রয়োজন। স্বয়ংক্রিয় পার্জ প্রতি রাত ২:০০ টায় চলে এবং শুধুমাত্র কনফিগার করা ধারণ সময়ের চেয়ে পুরানো রেকর্ড মুছে দেয়।',
        })}
      </div>

      {/* Policies Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t({ en: 'Table', bn: 'টেবিল' })}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t({ en: 'Retention (days)', bn: 'ধারণ (দিন)' })}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t({ en: 'Years', bn: 'বছর' })}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t({ en: 'Description', bn: 'বিবরণ' })}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t({ en: 'Last Purge', bn: 'শেষ পার্জ' })}</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t({ en: 'Action', bn: 'পদক্ষেপ' })}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {policies.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3 font-mono text-xs text-navy">{p.table_name}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="30"
                    max="3650"
                    defaultValue={p.retention_days}
                    onBlur={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (val && val !== p.retention_days) updateRetention(p.id, val);
                    }}
                    className="w-24 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30"
                  />
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{(p.retention_days / 365).toFixed(1)}y</td>
                <td className="px-4 py-3 text-xs text-gray-500">{p.description}</td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {p.last_purge_at ? new Date(p.last_purge_at).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3">
                  {saving === p.id ? (
                    <Loader2 size={14} className="animate-spin text-teal" />
                  ) : saved === p.id ? (
                    <CheckCircle size={14} className="text-green-500" />
                  ) : (
                    <span className={`text-xs ${p.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                      {p.is_active ? t({ en: 'Active', bn: 'সক্রিয়' }) : t({ en: 'Disabled', bn: 'নিষ্ক্রিয়' })}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Purge Logs */}
      <h3 className="font-heading font-bold text-navy mb-3">
        {t({ en: 'Purge History', bn: 'পার্জ ইতিহাস' })}
      </h3>
      {purgeLogs.length === 0 ? (
        <p className="text-sm text-gray-400">{t({ en: 'No purge operations have been executed yet.', bn: 'এখনও কোন পার্জ অপারেশন কার্যকর হয়নি।' })}</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t({ en: 'Table', bn: 'টেবিল' })}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t({ en: 'Deleted', bn: 'মুছে ফেলা' })}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t({ en: 'Cutoff Date', bn: 'কাটঅফ তারিখ' })}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t({ en: 'Executed', bn: 'কার্যকর' })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {purgeLogs.map((log, i) => (
                <tr key={log.id || i}>
                  <td className="px-4 py-3 font-mono text-xs">{log.table_name}</td>
                  <td className="px-4 py-3 text-xs font-medium text-red-600">{log.records_deleted}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(log.cutoff_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(log.executed_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RetentionPolicies;
