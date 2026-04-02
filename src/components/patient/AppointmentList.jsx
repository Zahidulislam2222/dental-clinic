import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  booked: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
};

const AppointmentList = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    if (!supabase || !user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error: fnError } = await supabase.functions.invoke('get-patient-data', {
        body: { table: 'appointments', patientId: user.id },
      });

      if (fnError) throw fnError;
      setAppointments(data?.data || []);
    } catch (err) {
      console.error('Failed to load appointments:', err);
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
          <p className="font-medium text-red-800">{t({ en: 'Failed to load appointments', bn: 'অ্যাপয়েন্টমেন্ট লোড করতে ব্যর্থ' })}</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">{t({ en: 'No appointments found', bn: 'কোন অ্যাপয়েন্টমেন্ট পাওয়া যায়নি' })}</p>
        <a href="/appointment" className="text-teal text-sm font-medium hover:underline mt-2 inline-block">
          {t({ en: 'Book an appointment', bn: 'অ্যাপয়েন্টমেন্ট বুক করুন' })}
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map((appt, i) => (
        <motion.div
          key={appt.id || i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-teal" />
                <span className="text-sm font-medium text-navy">{appt.service}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {appt.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {appt.time}
                </span>
              </div>
              {appt.ref_number && (
                <p className="text-xs text-gray-400">Ref: {appt.ref_number}</p>
              )}
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[appt.status] || 'bg-gray-100 text-gray-600'}`}>
              {appt.status || 'pending'}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AppointmentList;
