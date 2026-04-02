import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Users, Mail, Newspaper,
  FileText, Shield, UserCog, Clock, AlertTriangle, LogOut, Loader2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import PageTransition from '../../components/ui/PageTransition';
import AdminAppointments from './AdminAppointments';
import AdminRegistrations from './AdminRegistrations';
import AdminContacts from './AdminContacts';
import AdminNewsletter from './AdminNewsletter';
import AuditLogs from './AuditLogs';
import DataRequests from './DataRequests';
import UserManagement from './UserManagement';
import RetentionPolicies from './RetentionPolicies';
import SecurityIncidents from './SecurityIncidents';

const AdminNav = () => {
  const { t } = useLanguage();
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const links = [
    { to: '/admin', icon: LayoutDashboard, label: { en: 'Overview', bn: 'সারসংক্ষেপ' }, exact: true },
    { to: '/admin/appointments', icon: Calendar, label: { en: 'Appointments', bn: 'অ্যাপয়েন্টমেন্ট' } },
    { to: '/admin/registrations', icon: Users, label: { en: 'Registrations', bn: 'নিবন্ধন' } },
    { to: '/admin/contacts', icon: Mail, label: { en: 'Contacts', bn: 'যোগাযোগ' } },
    { to: '/admin/newsletter', icon: Newspaper, label: { en: 'Newsletter', bn: 'নিউজলেটার' } },
    { to: '/admin/audit-logs', icon: FileText, label: { en: 'Audit Logs', bn: 'অডিট লগ' } },
    { to: '/admin/data-requests', icon: Shield, label: { en: 'Data Requests', bn: 'তথ্য অনুরোধ' } },
    { to: '/admin/users', icon: UserCog, label: { en: 'Users', bn: 'ব্যবহারকারী' } },
    { to: '/admin/retention', icon: Clock, label: { en: 'Retention', bn: 'ধারণ নীতি' } },
    { to: '/admin/security', icon: AlertTriangle, label: { en: 'Security', bn: 'নিরাপত্তা' } },
  ];

  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-teal" />
            <span className="font-heading font-bold text-navy text-sm">
              {t({ en: 'Admin Panel', bn: 'অ্যাডমিন প্যানেল' })}
            </span>
            <span className="text-xs bg-teal/10 text-teal px-2 py-0.5 rounded-full font-medium">
              {profile?.role}
            </span>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 text-gray-500 text-xs hover:text-red-500 transition-colors"
          >
            <LogOut size={14} />
            {t({ en: 'Log Out', bn: 'লগ আউট' })}
          </button>
        </div>
        <div className="flex gap-1 overflow-x-auto pb-2 -mb-px scrollbar-hide">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to, link.exact);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-teal/10 text-teal'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-navy'
                }`}
              >
                <Icon size={14} />
                {t(link.label)}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const OverviewPage = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ appointments: '—', patients: '—', requests: '—', incidents: '0' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    if (!supabase) { setLoading(false); return; }
    try {
      const today = new Date().toISOString().split('T')[0];
      const [apptRes, regRes, reqRes] = await Promise.all([
        supabase.functions.invoke('admin-query', { body: { table: 'appointments', filters: { date: today } } }),
        supabase.functions.invoke('admin-query', { body: { table: 'registrations' } }),
        supabase.functions.invoke('admin-query', { body: { table: 'data_access_requests', filters: { status: 'pending' } } }),
      ]);
      setStats({
        appointments: String(apptRes.data?.data?.length ?? '—'),
        patients: String(regRes.data?.data?.length ?? '—'),
        requests: String(reqRes.data?.data?.length ?? '—'),
        incidents: '0',
      });
    } catch {
      // Stats are non-critical
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { label: { en: "Today's Appointments", bn: "আজকের অ্যাপয়েন্টমেন্ট" }, value: stats.appointments, icon: Calendar },
    { label: { en: 'Total Patients', bn: 'মোট রোগী' }, value: stats.patients, icon: Users },
    { label: { en: 'Pending Requests', bn: 'অমীমাংসিত অনুরোধ' }, value: stats.requests, icon: Shield },
    { label: { en: 'Security Incidents', bn: 'নিরাপত্তা ঘটনা' }, value: stats.incidents, icon: AlertTriangle },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="font-heading text-2xl font-bold text-navy mb-6">
        {t({ en: 'Admin Dashboard', bn: 'অ্যাডমিন ড্যাশবোর্ড' })}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-gray-100 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 font-medium">{t(card.label)}</span>
                <Icon size={16} className="text-gray-400" />
              </div>
              {loading ? (
                <Loader2 size={18} className="animate-spin text-gray-300" />
              ) : (
                <span className="font-heading text-2xl font-bold text-navy">{card.value}</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const PlaceholderPage = ({ title }) => {
  const { t } = useLanguage();
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="font-heading text-2xl font-bold text-navy mb-4">{t(title)}</h2>
      <p className="text-gray-500">{t({ en: 'This section will be fully implemented in subsequent phases.', bn: 'এই বিভাগ পরবর্তী পর্যায়ে সম্পূর্ণ কার্যকর হবে।' })}</p>
    </div>
  );
};

const AdminDashboard = () => {
  const { t } = useLanguage();
  return (
    <PageTransition>
      <Helmet>
        <title>{t({ en: 'Admin — Everyday Dental Surgery', bn: 'অ্যাডমিন — এভরিডে ডেন্টাল সার্জারি' })}</title>
      </Helmet>

      <AdminNav />

      <div className="bg-offwhite min-h-[70vh]">
        <Routes>
          <Route index element={<OverviewPage />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="registrations" element={<AdminRegistrations />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="data-requests" element={<DataRequests />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="retention" element={<RetentionPolicies />} />
          <Route path="security" element={<SecurityIncidents />} />
        </Routes>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
