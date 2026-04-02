import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';
import DataTable from '../../components/admin/DataTable';

const AdminRegistrations = () => {
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
        body: { table: 'registrations' },
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
    { key: 'ref_number', label: { en: 'Ref', bn: 'রেফ' } },
    { key: 'patient_name', label: { en: 'Name', bn: 'নাম' } },
    { key: 'patient_phone', label: { en: 'Phone', bn: 'ফোন' } },
    { key: 'gender', label: { en: 'Gender', bn: 'লিঙ্গ' } },
    { key: 'blood_group', label: { en: 'Blood Group', bn: 'রক্তের গ্রুপ' } },
    { key: 'preferred_date', label: { en: 'Preferred Date', bn: 'পছন্দের তারিখ' } },
    { key: 'created_at', label: { en: 'Registered', bn: 'নিবন্ধিত' }, render: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-teal animate-spin" /></div>;
  if (error) return <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-2"><AlertCircle className="w-5 h-5 text-red-500" /><p className="text-red-700 text-sm">{error}</p></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="font-heading text-xl font-bold text-navy mb-4">
        {t({ en: 'Patient Registrations', bn: 'রোগী নিবন্ধন' })}
      </h2>
      <DataTable columns={columns} data={data} defaultSort={{ key: 'created_at', dir: 'desc' }} />
    </div>
  );
};

export default AdminRegistrations;
