import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import DataTable from '../../components/admin/DataTable';

const DataRequests = () => {
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!supabase) { setLoading(false); return; }
    try {
      const { data: result, error: fnError } = await supabase.functions.invoke('admin-query', {
        body: { table: 'data_access_requests' },
      });
      if (fnError) throw fnError;
      setData(result?.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resolveRequest = async (requestId, status, adminNotes) => {
    if (!supabase || !isAdmin()) return;
    setProcessing(requestId);
    try {
      const { error: fnError } = await supabase.functions.invoke('admin-resolve-request', {
        body: {
          requestId,
          status,
          adminNotes: adminNotes || `${status} by admin`,
          resolvedBy: user.id,
        },
      });
      if (fnError) throw fnError;
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const statusBadge = (status) => {
    const config = {
      pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
      approved: { icon: CheckCircle, color: 'bg-green-100 text-green-700' },
      denied: { icon: XCircle, color: 'bg-red-100 text-red-700' },
      completed: { icon: CheckCircle, color: 'bg-blue-100 text-blue-700' },
    };
    const c = config[status] || config.pending;
    const Icon = c.icon;
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${c.color}`}>
        <Icon size={10} />
        {status}
      </span>
    );
  };

  const columns = [
    { key: 'id', label: { en: 'ID', bn: 'আইডি' } },
    { key: 'request_type', label: { en: 'Type', bn: 'ধরন' }, render: (row) => (
      <span className="capitalize text-xs font-medium">{row.request_type}</span>
    )},
    { key: 'details', label: { en: 'Details', bn: 'বিস্তারিত' }, render: (row) => (
      <span className="max-w-[200px] truncate block text-xs" title={row.details}>{row.details}</span>
    )},
    { key: 'status', label: { en: 'Status', bn: 'অবস্থা' }, render: (row) => statusBadge(row.status) },
    { key: 'created_at', label: { en: 'Submitted', bn: 'জমা দেওয়া' }, render: (row) => (
      <span className="text-xs">{new Date(row.created_at).toLocaleDateString()}</span>
    )},
    { key: 'actions', label: { en: 'Actions', bn: 'পদক্ষেপ' }, sortable: false, render: (row) => {
      if (row.status !== 'pending') return <span className="text-xs text-gray-400">{t({ en: 'Resolved', bn: 'সমাধান হয়েছে' })}</span>;
      if (processing === row.id) return <Loader2 size={14} className="animate-spin text-teal" />;
      return (
        <div className="flex gap-1">
          <button
            onClick={() => resolveRequest(row.id, 'approved', 'Request approved')}
            className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
          >
            {t({ en: 'Approve', bn: 'অনুমোদন' })}
          </button>
          <button
            onClick={() => resolveRequest(row.id, 'denied', 'Request denied')}
            className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
          >
            {t({ en: 'Deny', bn: 'প্রত্যাখ্যান' })}
          </button>
        </div>
      );
    }},
  ];

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-teal animate-spin" /></div>;
  if (error) return <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-2"><AlertCircle className="w-5 h-5 text-red-500" /><p className="text-red-700 text-sm">{error}</p></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="font-heading text-xl font-bold text-navy mb-4">
        {t({ en: 'Patient Data Requests', bn: 'রোগী তথ্য অনুরোধ' })}
      </h2>
      <div className="bg-teal/5 border border-teal/20 rounded-lg p-3 text-xs text-gray-600 mb-4">
        {t({
          en: 'HIPAA requires response to patient data requests within 30 days (extendable to 60 days with written notice).',
          bn: 'HIPAA অনুসারে রোগীর তথ্য অনুরোধের ৩০ দিনের মধ্যে প্রতিক্রিয়া প্রয়োজন (লিখিত নোটিশের মাধ্যমে ৬০ দিন পর্যন্ত বর্ধিত করা যায়)।',
        })}
      </div>
      <DataTable columns={columns} data={data} defaultSort={{ key: 'created_at', dir: 'desc' }} />
    </div>
  );
};

export default DataRequests;
