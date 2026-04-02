import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, UserCog } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';
import DataTable from '../../components/admin/DataTable';

const ROLES = ['patient', 'doctor', 'receptionist', 'admin'];

const roleBadge = (role) => {
  const colors = {
    admin: 'bg-red-100 text-red-700',
    doctor: 'bg-blue-100 text-blue-700',
    receptionist: 'bg-purple-100 text-purple-700',
    patient: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[role] || colors.patient}`}>
      {role}
    </span>
  );
};

const UserManagement = () => {
  const { t } = useLanguage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!supabase) { setLoading(false); return; }
    try {
      const { data: result, error: fnError } = await supabase.functions.invoke('admin-query', {
        body: { table: 'user_profiles' },
      });
      if (fnError) throw fnError;
      setData(result?.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (userId, newRole) => {
    if (!supabase) return;
    setUpdating(userId);
    try {
      const { error: fnError } = await supabase.functions.invoke('admin-manage-user', {
        body: { action: 'change_role', userId, role: newRole },
      });
      if (fnError) throw fnError;
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const columns = [
    { key: 'full_name', label: { en: 'Name', bn: 'নাম' } },
    { key: 'email', label: { en: 'Email', bn: 'ইমেইল' }, accessor: (row) => row.email || row.id?.slice(0, 8) + '...' },
    { key: 'role', label: { en: 'Role', bn: 'ভূমিকা' }, render: (row) => roleBadge(row.role) },
    { key: 'created_at', label: { en: 'Joined', bn: 'যোগদান' }, render: (row) => (
      <span className="text-xs">{new Date(row.created_at).toLocaleDateString()}</span>
    )},
    { key: 'actions', label: { en: 'Change Role', bn: 'ভূমিকা পরিবর্তন' }, sortable: false, render: (row) => {
      if (updating === row.id) return <Loader2 size={14} className="animate-spin text-teal" />;
      return (
        <select
          value={row.role}
          onChange={(e) => changeRole(row.id, e.target.value)}
          className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal/30"
        >
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      );
    }},
  ];

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-teal animate-spin" /></div>;
  if (error) return <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-2"><AlertCircle className="w-5 h-5 text-red-500" /><p className="text-red-700 text-sm">{error}</p></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <UserCog size={18} className="text-teal" />
        <h2 className="font-heading text-xl font-bold text-navy">
          {t({ en: 'User Management', bn: 'ব্যবহারকারী ব্যবস্থাপনা' })}
        </h2>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 mb-4">
        {t({
          en: 'Role changes take effect immediately. Quarterly access reviews are required per SOC 2 CC6.1.',
          bn: 'ভূমিকা পরিবর্তন তাৎক্ষণিকভাবে কার্যকর হবে। SOC 2 CC6.1 অনুসারে ত্রৈমাসিক অ্যাক্সেস পর্যালোচনা প্রয়োজন।',
        })}
      </div>
      <DataTable columns={columns} data={data} defaultSort={{ key: 'created_at', dir: 'desc' }} />
    </div>
  );
};

export default UserManagement;
