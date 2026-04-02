import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Heart, AlertTriangle, Droplets, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const MedicalDataView = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMedicalData();
  }, [user]);

  const fetchMedicalData = async () => {
    if (!supabase || !user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error: fnError } = await supabase.functions.invoke('get-patient-data', {
        body: { table: 'registrations', patientId: user.id },
      });

      if (fnError) throw fnError;
      const records = data?.data || [];
      setRegistration(records[0] || null);
    } catch (err) {
      console.error('Failed to load medical data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-teal animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
        <div>
          <p className="font-medium text-red-800">{t({ en: 'Failed to load medical data', bn: 'চিকিৎসা তথ্য লোড করতে ব্যর্থ' })}</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">{t({ en: 'No medical records found', bn: 'কোন চিকিৎসা রেকর্ড পাওয়া যায়নি' })}</p>
        <a href="/register" className="text-teal text-sm font-medium hover:underline mt-2 inline-block">
          {t({ en: 'Complete your registration', bn: 'আপনার রেজিস্ট্রেশন সম্পন্ন করুন' })}
        </a>
      </div>
    );
  }

  const fields = [
    { icon: Heart, label: { en: 'Medical History', bn: 'চিকিৎসা ইতিহাস' }, value: registration.medical_history },
    { icon: AlertTriangle, label: { en: 'Allergies', bn: 'অ্যালার্জি' }, value: registration.allergies },
    { icon: Droplets, label: { en: 'Blood Group', bn: 'রক্তের গ্রুপ' }, value: registration.blood_group },
  ];

  return (
    <div className="space-y-4">
      {/* Basic Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-100 rounded-xl p-5"
      >
        <h3 className="font-heading font-bold text-navy mb-3">
          {t({ en: 'Personal Information', bn: 'ব্যক্তিগত তথ্য' })}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-400">{t({ en: 'Name', bn: 'নাম' })}</span>
            <p className="text-navy font-medium">{registration.patient_name}</p>
          </div>
          <div>
            <span className="text-gray-400">{t({ en: 'Phone', bn: 'ফোন' })}</span>
            <p className="text-navy font-medium">{registration.patient_phone}</p>
          </div>
          <div>
            <span className="text-gray-400">{t({ en: 'Email', bn: 'ইমেইল' })}</span>
            <p className="text-navy font-medium">{registration.patient_email || 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-400">{t({ en: 'Date of Birth', bn: 'জন্ম তারিখ' })}</span>
            <p className="text-navy font-medium">{registration.date_of_birth || 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-400">{t({ en: 'Gender', bn: 'লিঙ্গ' })}</span>
            <p className="text-navy font-medium">{registration.gender || 'N/A'}</p>
          </div>
          {registration.ref_number && (
            <div>
              <span className="text-gray-400">{t({ en: 'Reference', bn: 'রেফারেন্স' })}</span>
              <p className="text-navy font-medium">{registration.ref_number}</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Medical fields */}
      {fields.map((field, i) => {
        const Icon = field.icon;
        const val = field.value;
        if (!val || val === 'None' || val === 'N/A') return null;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (i + 1) * 0.08 }}
            className="bg-white border border-gray-100 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon size={16} className="text-teal" />
              <h3 className="font-heading font-bold text-navy text-sm">{t(field.label)}</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{val}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MedicalDataView;
