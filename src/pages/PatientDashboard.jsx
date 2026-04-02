import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { User, Calendar, FileText, Download, Shield, LogOut } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/ui/PageTransition';
import AppointmentList from '../components/patient/AppointmentList';
import MedicalDataView from '../components/patient/MedicalDataView';
import DataExportButton from '../components/patient/DataExportButton';
import DataRequestForm from '../components/patient/DataRequestForm';

const TABS = [
  { id: 'profile', icon: User, label: { en: 'Profile', bn: 'প্রোফাইল' } },
  { id: 'appointments', icon: Calendar, label: { en: 'Appointments', bn: 'অ্যাপয়েন্টমেন্ট' } },
  { id: 'medical', icon: FileText, label: { en: 'Medical Data', bn: 'চিকিৎসা তথ্য' } },
  { id: 'export', icon: Download, label: { en: 'Export (FHIR)', bn: 'রপ্তানি (FHIR)' } },
  { id: 'rights', icon: Shield, label: { en: 'Data Rights', bn: 'তথ্য অধিকার' } },
];

const PatientDashboard = () => {
  const { t } = useLanguage();
  const { profile, user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab user={user} profile={profile} t={t} />;
      case 'appointments':
        return <AppointmentList />;
      case 'medical':
        return <MedicalDataView />;
      case 'export':
        return <DataExportButton />;
      case 'rights':
        return <DataRequestForm />;
      default:
        return null;
    }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>{t({ en: 'Patient Dashboard — Everyday Dental Surgery', bn: 'রোগী ড্যাশবোর্ড — এভরিডে ডেন্টাল সার্জারি' })}</title>
      </Helmet>

      <section className="py-8 bg-offwhite min-h-[80vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-navy">
                {t({ en: 'Patient Portal', bn: 'রোগী পোর্টাল' })}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {t({ en: 'Welcome back, ', bn: 'স্বাগতম, ' })}{profile?.full_name || t({ en: 'Patient', bn: 'রোগী' })}
              </p>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">{t({ en: 'Log Out', bn: 'লগ আউট' })}</span>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 overflow-x-auto pb-2 mb-6 border-b border-gray-200 scrollbar-hide">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-white text-teal border border-gray-200 border-b-white -mb-[1px]'
                      : 'text-gray-500 hover:text-navy hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  {t(tab.label)}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>

          {/* HIPAA Notice */}
          <div className="mt-8 bg-teal/5 border border-teal/20 rounded-xl p-4 text-xs text-gray-600">
            <Shield size={14} className="inline mr-1 text-teal" />
            {t({
              en: 'Your data is encrypted and protected under HIPAA regulations. All access is logged for your security.',
              bn: 'আপনার তথ্য HIPAA প্রবিধান অনুযায়ী এনক্রিপ্ট এবং সুরক্ষিত। আপনার নিরাপত্তার জন্য সমস্ত অ্যাক্সেস লগ করা হয়।',
            })}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

// ── Profile Tab ──
const ProfileTab = ({ user, profile, t }) => {
  const fields = [
    { label: { en: 'Full Name', bn: 'পূর্ণ নাম' }, value: profile?.full_name },
    { label: { en: 'Email', bn: 'ইমেইল' }, value: user?.email },
    { label: { en: 'Phone', bn: 'ফোন' }, value: user?.phone || profile?.phone },
    { label: { en: 'Role', bn: 'ভূমিকা' }, value: profile?.role },
    { label: { en: 'Account Created', bn: 'অ্যাকাউন্ট তৈরি' }, value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A' },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6">
      <h3 className="font-heading font-bold text-navy mb-4">
        {t({ en: 'Your Profile', bn: 'আপনার প্রোফাইল' })}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <p className="text-xs text-gray-400 mb-0.5">{t(field.label)}</p>
            <p className="text-sm font-medium text-navy">{field.value || 'N/A'}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
        {t({ en: 'User ID:', bn: 'ব্যবহারকারী আইডি:' })} <code className="bg-gray-50 px-1.5 py-0.5 rounded">{user?.id}</code>
      </div>
    </div>
  );
};

export default PatientDashboard;
