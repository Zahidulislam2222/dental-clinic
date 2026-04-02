import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import PageTransition from '../components/ui/PageTransition';
import CONTACT from '../config/contact';

const PrivacyPolicyPage = () => {
  const { t } = useLanguage();

  return (
    <PageTransition>
      <Helmet>
        <title>{t({ en: 'Privacy Policy — Everyday Dental Surgery', bn: 'গোপনীয়তা নীতি — এভরিডে ডেন্টাল সার্জারি' })}</title>
        <meta name="description" content="Privacy policy for Everyday Dental Surgery & Implant Center." />
      </Helmet>

      <section className="py-16 md:py-24 bg-offwhite">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-8">
            {t({ en: 'Privacy Policy', bn: 'গোপনীয়তা নীতি' })}
          </h1>
          <p className="text-gray text-sm mb-8">
            {t({ en: 'Last updated: April 2, 2026', bn: 'সর্বশেষ আপডেট: ২ এপ্রিল, ২০২৬' })}
          </p>

          <div className="prose prose-navy max-w-none space-y-8 text-navy/80">
            {/* 1. Introduction */}
            <div>
              <h2 className="font-heading text-xl font-bold text-navy mb-3">
                {t({ en: '1. Introduction', bn: '১. ভূমিকা' })}
              </h2>
              <p>
                {t({
                  en: 'Everyday Dental Surgery & Implant Center ("we", "our", "us") respects your privacy and is committed to protecting the personal and health information you provide through our website. This Privacy Policy explains what data we collect, how we use it, and your rights regarding that data.',
                  bn: 'এভরিডে ডেন্টাল সার্জারি অ্যান্ড ইমপ্লান্ট সেন্টার ("আমরা", "আমাদের") আপনার গোপনীয়তাকে সম্মান করে এবং আমাদের ওয়েবসাইটের মাধ্যমে আপনার প্রদত্ত ব্যক্তিগত ও স্বাস্থ্য তথ্য সুরক্ষিত রাখতে প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা নীতি ব্যাখ্যা করে আমরা কী তথ্য সংগ্রহ করি, কীভাবে ব্যবহার করি এবং সেই তথ্যে আপনার অধিকার।',
                })}
              </p>
            </div>

            {/* 2. Data We Collect */}
            <div>
              <h2 className="font-heading text-xl font-bold text-navy mb-3">
                {t({ en: '2. Information We Collect', bn: '২. আমরা যে তথ্য সংগ্রহ করি' })}
              </h2>
              <p>{t({ en: 'Through our website forms, we may collect:', bn: 'আমাদের ওয়েবসাইট ফর্মের মাধ্যমে আমরা সংগ্রহ করতে পারি:' })}</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>{t({ en: 'Full name, phone number, and email address', bn: 'পূর্ণ নাম, ফোন নম্বর এবং ইমেইল ঠিকানা' })}</li>
                <li>{t({ en: 'Date of birth, gender, and blood group', bn: 'জন্ম তারিখ, লিঙ্গ এবং রক্তের গ্রুপ' })}</li>
                <li>{t({ en: 'Medical history, allergies, and current medications', bn: 'চিকিৎসা ইতিহাস, অ্যালার্জি এবং বর্তমান ওষুধ' })}</li>
                <li>{t({ en: 'Appointment preferences (date, time, service)', bn: 'অ্যাপয়েন্টমেন্ট পছন্দ (তারিখ, সময়, সেবা)' })}</li>
                <li>{t({ en: 'Messages and inquiries via the contact form', bn: 'যোগাযোগ ফর্মের মাধ্যমে বার্তা ও অনুসন্ধান' })}</li>
                <li>{t({ en: 'Language preference', bn: 'ভাষা পছন্দ' })}</li>
              </ul>
            </div>

            {/* 3. How We Use Your Data */}
            <div>
              <h2 className="font-heading text-xl font-bold text-navy mb-3">
                {t({ en: '3. How We Use Your Information', bn: '৩. আমরা কিভাবে আপনার তথ্য ব্যবহার করি' })}
              </h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>{t({ en: 'To schedule and manage your dental appointments', bn: 'আপনার ডেন্টাল অ্যাপয়েন্টমেন্ট সময়সূচী ও পরিচালনা করতে' })}</li>
                <li>{t({ en: 'To communicate with you regarding your appointments and inquiries', bn: 'আপনার অ্যাপয়েন্টমেন্ট ও অনুসন্ধান সম্পর্কে আপনার সাথে যোগাযোগ করতে' })}</li>
                <li>{t({ en: 'To send you dental health tips if you subscribe to our newsletter', bn: 'আপনি নিউজলেটারে সাবস্ক্রাইব করলে ডেন্টাল স্বাস্থ্য টিপস পাঠাতে' })}</li>
                <li>{t({ en: 'To improve our website and services', bn: 'আমাদের ওয়েবসাইট ও সেবা উন্নত করতে' })}</li>
              </ul>
            </div>

            {/* 4. Data Storage */}
            <div>
              <h2 className="font-heading text-xl font-bold text-navy mb-3">
                {t({ en: '4. Data Storage & Security', bn: '৪. তথ্য সংরক্ষণ ও নিরাপত্তা' })}
              </h2>
              <p>
                {t({
                  en: 'All form submissions are processed through our secure backend (Supabase) with HIPAA-compliant encryption. Protected Health Information (PHI) is encrypted at rest using AES-256 (pgcrypto). Email notifications are sent through Resend and never contain PHI — only reference numbers and portal login links.',
                  bn: 'সমস্ত ফর্ম জমা আমাদের নিরাপদ ব্যাকএন্ডের (Supabase) মাধ্যমে HIPAA-সম্মত এনক্রিপশন সহ প্রক্রিয়া করা হয়। সুরক্ষিত স্বাস্থ্য তথ্য (PHI) AES-256 (pgcrypto) ব্যবহার করে বিশ্রামে এনক্রিপ্ট করা হয়। ইমেইল বিজ্ঞপ্তি Resend এর মাধ্যমে পাঠানো হয় এবং কখনও PHI থাকে না — শুধুমাত্র রেফারেন্স নম্বর এবং পোর্টাল লগইন লিঙ্ক।',
                })}
              </p>
            </div>

            {/* 5. Third Parties */}
            <div>
              <h2 className="font-heading text-xl font-bold text-navy mb-3">
                {t({ en: '5. Third-Party Services', bn: '৫. তৃতীয় পক্ষের সেবা' })}
              </h2>
              <p>{t({ en: 'We use the following third-party services:', bn: 'আমরা নিম্নলিখিত তৃতীয় পক্ষের সেবা ব্যবহার করি:' })}</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong>Supabase</strong> — {t({ en: 'for secure database, authentication, and server-side processing (BAA signed)', bn: 'নিরাপদ ডাটাবেস, প্রমাণীকরণ এবং সার্ভার-সাইড প্রসেসিংয়ের জন্য (BAA স্বাক্ষরিত)' })}</li>
                <li><strong>Resend</strong> — {t({ en: 'for HIPAA-safe email notifications (no PHI in email body)', bn: 'HIPAA-নিরাপদ ইমেইল বিজ্ঞপ্তির জন্য (ইমেইল বডিতে কোন PHI নেই)' })}</li>
                <li><strong>Google Fonts</strong> — {t({ en: 'for website typography', bn: 'ওয়েবসাইট টাইপোগ্রাফির জন্য' })}</li>
                <li><strong>Google Maps</strong> — {t({ en: 'for displaying clinic location', bn: 'ক্লিনিকের অবস্থান প্রদর্শনের জন্য' })}</li>
                <li><strong>Cloudflare Pages</strong> — {t({ en: 'for website hosting', bn: 'ওয়েবসাইট হোস্টিংয়ের জন্য' })}</li>
              </ul>
            </div>

            {/* 6. Your Rights */}
            <div>
              <h2 className="font-heading text-xl font-bold text-navy mb-3">
                {t({ en: '6. Your Rights', bn: '৬. আপনার অধিকার' })}
              </h2>
              <p>{t({ en: 'You have the right to:', bn: 'আপনার অধিকার আছে:' })}</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>{t({ en: 'Request access to your personal data', bn: 'আপনার ব্যক্তিগত তথ্যে প্রবেশের অনুরোধ করা' })}</li>
                <li>{t({ en: 'Request correction or deletion of your data', bn: 'আপনার তথ্য সংশোধন বা মুছে ফেলার অনুরোধ করা' })}</li>
                <li>{t({ en: 'Withdraw consent at any time by contacting us', bn: 'যেকোনো সময় আমাদের সাথে যোগাযোগ করে সম্মতি প্রত্যাহার করা' })}</li>
                <li>{t({ en: 'Opt out of newsletter emails', bn: 'নিউজলেটার ইমেইল থেকে বেরিয়ে আসা' })}</li>
              </ul>
            </div>

            {/* 7. Contact */}
            <div>
              <h2 className="font-heading text-xl font-bold text-navy mb-3">
                {t({ en: '7. Contact Us', bn: '৭. যোগাযোগ করুন' })}
              </h2>
              <p>
                {t({
                  en: `If you have questions about this Privacy Policy or wish to exercise your rights, contact us at ${CONTACT.phone} or ${CONTACT.email}.`,
                  bn: `এই গোপনীয়তা নীতি সম্পর্কে প্রশ্ন থাকলে বা আপনার অধিকার প্রয়োগ করতে চাইলে আমাদের সাথে যোগাযোগ করুন ${CONTACT.phone} বা ${CONTACT.email}।`,
                })}
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link to="/" className="text-teal font-semibold hover:underline">
              &larr; {t({ en: 'Back to Home', bn: 'হোমে ফিরে যান' })}
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default PrivacyPolicyPage;
