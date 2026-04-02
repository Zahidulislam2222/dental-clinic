import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';
import DataTable from '../../components/admin/DataTable';

const statusBadge = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {status || 'pending'}
    </span>
  );
};

const AdminAppointments = () => {
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
        body: { table: 'appointments' },
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
    { key: 'patient_name', label: { en: 'Patient', bn: 'রোগী' } },
    { key: 'service', label: { en: 'Service', bn: 'সেবা' } },
    { key: 'date', label: { en: 'Date', bn: 'তারিখ' } },
    { key: 'time', label: { en: 'Time', bn: 'সময়' } },
    { key: 'booking_mode', label: { en: 'Mode', bn: 'মোড' } },
    { key: 'status', label: { en: 'Status', bn: 'অবস্থা' }, render: (row) => statusBadge(row.status) },
    { key: 'created_at', label: { en: 'Created', bn: 'তৈরি' }, render: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-teal animate-spin" /></div>;
  if (error) return <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-2"><AlertCircle className="w-5 h-5 text-red-500" /><p className="text-red-700 text-sm">{error}</p></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="font-heading text-xl font-bold text-navy mb-4">
        {t({ en: 'All Appointments', bn: 'সকল অ্যাপয়েন্টমেন্ট' })}
      </h2>
      <DataTable columns={columns} data={data} defaultSort={{ key: 'created_at', dir: 'desc' }} />
    </div>
  );
};

export default AdminAppointments;
