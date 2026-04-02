import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Shield } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';
import DataTable from '../../components/admin/DataTable';

const actionColors = {
  INSERT: 'bg-green-100 text-green-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-red-100 text-red-700',
  SELECT: 'bg-purple-100 text-purple-700',
  FHIR_READ: 'bg-indigo-100 text-indigo-700',
  FHIR_EXPORT: 'bg-indigo-100 text-indigo-700',
};

const AuditLogs = () => {
  const { t } = useLanguage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!supabase) { setLoading(false); return; }
    try {
      const { data: result, error: fnError } = await supabase.functions.invoke('admin-query', {
        body: { table: 'audit_logs' },
      });
      if (fnError) throw fnError;
      setData(result?.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'timestamp', label: { en: 'Time', bn: 'সময়' }, render: (row) => (
      <span className="text-xs">{new Date(row.timestamp).toLocaleString()}</span>
    )},
    { key: 'user_email', label: { en: 'User', bn: 'ব্যবহারকারী' }, render: (row) => (
      <span className="text-xs">{row.user_email || 'system'}</span>
    )},
    { key: 'user_role', label: { en: 'Role', bn: 'ভূমিকা' }, render: (row) => (
      <span className="text-xs capitalize">{row.user_role || '—'}</span>
    )},
    { key: 'action', label: { en: 'Action', bn: 'কার্যক্রম' }, render: (row) => (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${actionColors[row.action] || 'bg-gray-100 text-gray-600'}`}>
        {row.action}
      </span>
    )},
    { key: 'table_name', label: { en: 'Table', bn: 'টেবিল' } },
    { key: 'details', label: { en: 'Details', bn: 'বিস্তারিত' }, render: (row) => (
      <span className="max-w-[250px] truncate block text-xs" title={row.details}>{row.details || '—'}</span>
    )},
    { key: 'ip_address', label: { en: 'IP', bn: 'আইপি' }, render: (row) => (
      <span className="text-xs font-mono">{row.ip_address || '—'}</span>
    )},
  ];

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-teal animate-spin" /></div>;
  if (error) return <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-2"><AlertCircle className="w-5 h-5 text-red-500" /><p className="text-red-700 text-sm">{error}</p></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Shield size={18} className="text-teal" />
        <h2 className="font-heading text-xl font-bold text-navy">
          {t({ en: 'Audit Logs', bn: 'অডিট লগ' })}
        </h2>
        <span className="text-xs text-gray-400">({data.length} {t({ en: 'records', bn: 'রেকর্ড' })})</span>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 mb-4">
        {t({
          en: 'Audit logs are immutable — they cannot be edited or deleted. HIPAA 164.312(b) requires retention for 6 years.',
          bn: 'অডিট লগ অপরিবর্তনীয় — এগুলি সম্পাদনা বা মুছে ফেলা যাবে না। HIPAA 164.312(b) অনুসারে ৬ বছর সংরক্ষণ প্রয়োজন।',
        })}
      </div>
      <DataTable columns={columns} data={data} defaultSort={{ key: 'timestamp', dir: 'desc' }} />
    </div>
  );
};

export default AuditLogs;
