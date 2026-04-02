import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';
import DataTable from '../../components/admin/DataTable';

const AdminContacts = () => {
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
        body: { table: 'contacts' },
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
    { key: 'from_name', label: { en: 'Name', bn: 'নাম' } },
    { key: 'from_phone', label: { en: 'Phone', bn: 'ফোন' } },
    { key: 'from_email', label: { en: 'Email', bn: 'ইমেইল' } },
    { key: 'service', label: { en: 'Service', bn: 'সেবা' } },
    { key: 'message', label: { en: 'Message', bn: 'বার্তা' }, render: (row) => (
      <span className="max-w-[200px] truncate block" title={row.message}>{row.message}</span>
    )},
    { key: 'created_at', label: { en: 'Date', bn: 'তারিখ' }, render: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-teal animate-spin" /></div>;
  if (error) return <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-2"><AlertCircle className="w-5 h-5 text-red-500" /><p className="text-red-700 text-sm">{error}</p></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="font-heading text-xl font-bold text-navy mb-4">
        {t({ en: 'Contact Submissions', bn: 'যোগাযোগ বার্তা' })}
      </h2>
      <DataTable columns={columns} data={data} defaultSort={{ key: 'created_at', dir: 'desc' }} />
    </div>
  );
};

export default AdminContacts;
