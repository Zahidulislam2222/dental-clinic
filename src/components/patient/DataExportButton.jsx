import { useState } from 'react';
import { Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const DataExportButton = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleExport = async () => {
    if (!supabase || !user) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const { data, error } = await supabase.functions.invoke('fhir-export', {
        body: { patientId: user.id },
      });

      if (error) throw error;

      // Create and trigger download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/fhir+json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fhir-export-${user.id.slice(0, 8)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('FHIR export failed:', err);
      setErrorMsg(err.message || 'Export failed');
      setStatus('error');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h3 className="font-heading font-bold text-navy mb-2">
          {t({ en: 'Export Your Health Data', bn: 'আপনার স্বাস্থ্য তথ্য রপ্তানি করুন' })}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {t({
            en: 'Download all your health records in FHIR R4 format (JSON). This standardized format can be imported into any FHIR-compatible health system.',
            bn: 'FHIR R4 ফরম্যাটে (JSON) আপনার সমস্ত স্বাস্থ্য রেকর্ড ডাউনলোড করুন। এই প্রমিত ফরম্যাটটি যেকোনো FHIR-সামঞ্জস্যপূর্ণ স্বাস্থ্য সিস্টেমে আমদানি করা যেতে পারে।',
          })}
        </p>

        <div className="bg-teal/5 border border-teal/20 rounded-lg p-3 text-xs text-gray-600 mb-4">
          <p className="font-medium text-navy mb-1">{t({ en: 'Included in export:', bn: 'রপ্তানিতে অন্তর্ভুক্ত:' })}</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>{t({ en: 'Patient demographics', bn: 'রোগীর জনসংখ্যাতাত্ত্বিক তথ্য' })}</li>
            <li>{t({ en: 'Appointment history', bn: 'অ্যাপয়েন্টমেন্ট ইতিহাস' })}</li>
            <li>{t({ en: 'Medical conditions (SNOMED CT / ICD-10)', bn: 'চিকিৎসা অবস্থা (SNOMED CT / ICD-10)' })}</li>
            <li>{t({ en: 'Allergy information', bn: 'অ্যালার্জি তথ্য' })}</li>
            <li>{t({ en: 'Organization & provider details', bn: 'প্রতিষ্ঠান ও প্রদানকারীর বিবরণ' })}</li>
          </ul>
        </div>

        <button
          onClick={handleExport}
          disabled={status === 'loading'}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal text-white rounded-xl font-medium text-sm hover:bg-teal/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
          {status === 'success' && <CheckCircle size={16} />}
          {status === 'idle' && <Download size={16} />}
          {status === 'error' && <AlertCircle size={16} />}
          {status === 'loading'
            ? t({ en: 'Exporting...', bn: 'রপ্তানি হচ্ছে...' })
            : status === 'success'
            ? t({ en: 'Downloaded!', bn: 'ডাউনলোড হয়েছে!' })
            : t({ en: 'Download FHIR Bundle', bn: 'FHIR বান্ডেল ডাউনলোড' })}
        </button>

        {status === 'error' && (
          <p className="text-red-600 text-xs mt-2">{errorMsg}</p>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700 mb-1">
          {t({ en: 'HIPAA 164.524 — Right to Access', bn: 'HIPAA 164.524 — অ্যাক্সেসের অধিকার' })}
        </p>
        <p>
          {t({
            en: 'You have the right to receive a copy of your Protected Health Information (PHI) in an electronic format. This export fulfills that requirement using the HL7 FHIR R4 standard.',
            bn: 'আপনার সুরক্ষিত স্বাস্থ্য তথ্য (PHI) ইলেকট্রনিক ফরম্যাটে একটি অনুলিপি পাওয়ার অধিকার রয়েছে। এই রপ্তানি HL7 FHIR R4 মান ব্যবহার করে সেই প্রয়োজনীয়তা পূরণ করে।',
          })}
        </p>
      </div>
    </div>
  );
};

export default DataExportButton;
