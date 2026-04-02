import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, AlertTriangle, Shield, CheckCircle, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import DataTable from '../../components/admin/DataTable';

const severityConfig = {
  low: { color: 'bg-blue-100 text-blue-700', label: 'Low' },
  medium: { color: 'bg-yellow-100 text-yellow-700', label: 'Medium' },
  high: { color: 'bg-orange-100 text-orange-700', label: 'High' },
  critical: { color: 'bg-red-100 text-red-700', label: 'Critical' },
};

const statusConfig = {
  detected: { icon: AlertTriangle, color: 'text-red-600' },
  investigating: { icon: AlertCircle, color: 'text-orange-600' },
  contained: { icon: Shield, color: 'text-blue-600' },
  notified: { icon: Clock, color: 'text-purple-600' },
  resolved: { icon: CheckCircle, color: 'text-green-600' },
};

const SecurityIncidents = () => {
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!supabase) { setLoading(false); return; }
    try {
      const [incResult, ruleResult] = await Promise.all([
        supabase.functions.invoke('admin-query', { body: { table: 'security_incidents' } }),
        supabase.functions.invoke('admin-query', { body: { table: 'anomaly_rules' } }),
      ]);
      setIncidents(incResult.data?.data || []);
      setRules(ruleResult.data?.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateIncidentStatus = async (id, newStatus) => {
    if (!supabase || !isAdmin()) return;
    setUpdating(id);
    try {
      const updateData = { status: newStatus, updated_at: new Date().toISOString() };
      if (newStatus === 'contained') updateData.contained_at = new Date().toISOString();
      if (newStatus === 'notified') updateData.notification_sent_at = new Date().toISOString();
      if (newStatus === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
        updateData.resolved_by = user?.id;
      }

      const { error: fnError } = await supabase
        .from('security_incidents')
        .update(updateData)
        .eq('id', id);
      if (fnError) throw fnError;
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const runBreachCheck = async () => {
    if (!supabase) return;
    setUpdating('check');
    try {
      const { data, error } = await supabase.functions.invoke('breach-check');
      if (error) throw error;
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const columns = [
    { key: 'severity', label: { en: 'Severity', bn: 'তীব্রতা' }, render: (row) => {
      const c = severityConfig[row.severity] || severityConfig.medium;
      return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.color}`}>{c.label}</span>;
    }},
    { key: 'title', label: { en: 'Title', bn: 'শিরোনাম' }, render: (row) => (
      <span className="text-xs font-medium max-w-[200px] truncate block" title={row.title}>{row.title}</span>
    )},
    { key: 'status', label: { en: 'Status', bn: 'অবস্থা' }, render: (row) => {
      const sc = statusConfig[row.status] || statusConfig.detected;
      const Icon = sc.icon;
      return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium capitalize ${sc.color}`}>
          <Icon size={12} />
          {row.status}
        </span>
      );
    }},
    { key: 'detection_method', label: { en: 'Method', bn: 'পদ্ধতি' } },
    { key: 'affected_records', label: { en: 'Records', bn: 'রেকর্ড' } },
    { key: 'detected_at', label: { en: 'Detected', bn: 'শনাক্ত' }, render: (row) => (
      <span className="text-xs">{new Date(row.detected_at).toLocaleString()}</span>
    )},
    { key: 'notification_deadline', label: { en: 'Notify By', bn: 'জানানোর সময়সীমা' }, render: (row) => {
      if (!row.notification_deadline) return '—';
      const deadline = new Date(row.notification_deadline);
      const isOverdue = deadline < new Date() && row.status !== 'resolved' && row.status !== 'notified';
      return (
        <span className={`text-xs ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
          {deadline.toLocaleDateString()}
          {isOverdue && ' (OVERDUE)'}
        </span>
      );
    }},
    { key: 'actions', label: { en: 'Action', bn: 'পদক্ষেপ' }, sortable: false, render: (row) => {
      if (row.status === 'resolved') return <span className="text-xs text-green-600">Resolved</span>;
      if (updating === row.id) return <Loader2 size={14} className="animate-spin text-teal" />;
      const nextStatus = {
        detected: 'investigating',
        investigating: 'contained',
        contained: 'notified',
        notified: 'resolved',
      };
      const next = nextStatus[row.status];
      if (!next) return null;
      return (
        <button
          onClick={() => updateIncidentStatus(row.id, next)}
          className="text-xs px-2 py-1 bg-teal/10 text-teal rounded hover:bg-teal/20 transition-colors capitalize"
        >
          {next}
        </button>
      );
    }},
  ];

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-teal animate-spin" /></div>;
  if (error) return <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-2"><AlertCircle className="w-5 h-5 text-red-500" /><p className="text-red-700 text-sm">{error}</p></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-red-500" />
          <h2 className="font-heading text-xl font-bold text-navy">
            {t({ en: 'Security Incidents', bn: 'নিরাপত্তা ঘটনা' })}
          </h2>
        </div>
        <button
          onClick={runBreachCheck}
          disabled={updating === 'check'}
          className="flex items-center gap-1.5 px-3 py-2 bg-navy text-white rounded-lg text-xs font-medium hover:bg-navy/90 transition-colors disabled:opacity-60"
        >
          {updating === 'check' ? <Loader2 size={12} className="animate-spin" /> : <Shield size={12} />}
          {t({ en: 'Run Breach Check', bn: 'ব্রিচ চেক চালান' })}
        </button>
      </div>

      {/* HIPAA Notice */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-800 mb-4">
        {t({
          en: 'HIPAA 164.404: Covered entities must notify affected individuals within 60 days of discovering a breach. Breaches affecting 500+ individuals must also be reported to HHS and media.',
          bn: 'HIPAA 164.404: আচ্ছাদিত সত্তাগুলিকে লঙ্ঘন আবিষ্কারের ৬০ দিনের মধ্যে প্রভাবিত ব্যক্তিদের অবহিত করতে হবে। ৫০০+ ব্যক্তিকে প্রভাবিত করে এমন লঙ্ঘন HHS এবং মিডিয়াতেও রিপোর্ট করতে হবে।',
        })}
      </div>

      {/* Incidents Table */}
      <DataTable columns={columns} data={incidents} defaultSort={{ key: 'detected_at', dir: 'desc' }} />

      {/* Anomaly Rules */}
      <h3 className="font-heading font-bold text-navy mt-8 mb-3">
        {t({ en: 'Anomaly Detection Rules', bn: 'অসঙ্গতি সনাক্তকরণ নিয়ম' })}
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {rules.map((rule, i) => {
          const sc = severityConfig[rule.severity] || severityConfig.medium;
          return (
            <motion.div
              key={rule.id || i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-gray-100 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sc.color}`}>{sc.label}</span>
                <span className={`text-xs ${rule.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                  {rule.is_active ? 'Active' : 'Disabled'}
                </span>
              </div>
              <p className="text-sm font-medium text-navy">{rule.description}</p>
              <p className="text-xs text-gray-400 mt-1">
                {t({ en: 'Threshold:', bn: 'সীমা:' })} {rule.threshold} / {rule.window_minutes}min
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SecurityIncidents;
