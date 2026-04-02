import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import PageTransition from '../components/ui/PageTransition';
import CONTACT from '../config/contact';

const TermsPage = () => {
  const { t } = useLanguage();

  return (
    <PageTransition>
      <Helmet>
        <title>{t({ en: 'Terms of Service — Everyday Dental Surgery', bn: 'সেবার শর্তাবলী — এভরিডে ডেন্টাল সার্জারি' })}</title>
        <meta name="description" content="Terms of service for Everyday Dental Surgery & Implant Center." />
      </Helmet>

      <section className="py-16 md:py-24 bg-offwhite">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-8">
            {t({ en: 'Terms of Service', bn: 'সেবার শর্তাবলী' })}
          </h1>
          <p className="text-gray text-sm mb-8">
            {t({ en: 'Last updated: April 2, 2026', bn: 'সর্বশেষ আপডেট: ২ এপ্রিল, ২০২৬' })}
          </p>

          <div className="prose prose-navy max-w-none space-y-8 text-navy/80">
            <div>
              <h2 className="font-heading text-xl font-bold text-navy mb-3">
                {t({ en: '1. Acceptance of Terms', bn: '১. শর্তাবলী গ্রহণ' })}
              </h2>
              <p>
                {t({
                  en: 'By accessing and using the Everyday Dental Surgery website, you agree to be bound by these Terms of Service. If you do not agree, please do not use this website.',
                  bn: 'এভরিডে ডেন্টাল সার্জারির ওয়েবসাইট ব্যবহার করে আপনি এই সেবার শর্তাবলী মেনে চলতে সম্মত হচ্ছেন। আপনি সম্মত না হলে দয়া করে এই ওয়েবসাইট ব্যবহার করবেন না।',
                })}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-bold text-navy mb-3">
                {t({ en: '2. Appointment Booking', bn: '২. অ্যাপয়েন্টমেন্ট বুকিং' })}
              </h2>
              <p>
                {t({
                  en: 'Online appointment bookings are requests, not confirmed appointments. Our staff will contact you via phone to confirm your appointment. Booking is subject to availability.',
                  bn: 'অনলাইন অ্যাপয়েন্টমেন্ট বুকিং হলো অনুরোধ, নিশ্চিত অ্যাপয়েন্টমেন্ট নয়। আমাদের কর্মীরা আপনার অ্যাপয়েন্টমেন্ট নিশ্চিত করতে ফোনে যোগাযোগ করবেন। বুকিং উপলব্ধতা সাপেক্ষে।',
                })}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-bold text-navy mb-3">
                {t({ en: '3. Medical Information Disclaimer', bn: '৩. চিকিৎসা তথ্য দায়মুক্তি' })}
              </h2>
              <p>
                {t({
                  en: 'Information provided on this website is for general informational purposes only and does not constitute medical advice. Always consult with a qualified dental professional for diagnosis and treatment.',
                  bn: 'এই ওয়েবসাইটে প্রদত্ত তথ্য শুধুমাত্র সাধারণ তথ্যমূলক উদ্দেশ্যে এবং চিকিৎসা পরামর্শ নয়। রোগ নির্ণয় ও চিকিৎসার জন্য সর্বদা একজন যোগ্য ডেন্টাল পেশাদারের সাথে পরামর্শ করুন।',
                })}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-bold text-navy mb-3">
                {t({ en: '4. Data Security Notice', bn: '৪. তথ্য নিরাপত্তা বিজ্ঞপ্তি' })}
              </h2>
              <p>
                {t({
                  en: 'This website is currently in development. Form data is stored temporarily in your browser and may be sent via email service. A fully secure, HIPAA-compliant backend system is under development. Until then, avoid submitting highly sensitive medical records through this website.',
                  bn: 'এই ওয়েবসাইটটি বর্তমানে উন্নয়নাধীন। ফর্ম ডেটা আপনার ব্রাউজারে অস্থায়ীভাবে সংরক্ষিত হয় এবং ইমেইল সেবার মাধ্যমে পাঠানো হতে পারে। একটি সম্পূর্ণ নিরাপদ ব্যাকএন্ড সিস্টেম উন্নয়নাধীন। ততদিন পর্যন্ত এই ওয়েবসাইটের মাধ্যমে অত্যন্ত সংবেদনশীল চিকিৎসা রেকর্ড জমা দেওয়া থেকে বিরত থাকুন।',
                })}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-bold text-navy mb-3">
                {t({ en: '5. Pricing & Payments', bn: '৫. মূল্য ও পেমেন্ট' })}
              </h2>
              <p>
                {t({
                  en: 'Prices listed on the website are approximate and subject to change. Final treatment costs will be determined after clinical evaluation. We accept Cash, bKash, Nagad, Rocket, Visa, and Mastercard.',
                  bn: 'ওয়েবসাইটে তালিকাভুক্ত দাম আনুমানিক এবং পরিবর্তনযোগ্য। চূড়ান্ত চিকিৎসার খরচ ক্লিনিক্যাল মূল্যায়নের পর নির্ধারিত হবে। আমরা ক্যাশ, বিকাশ, নগদ, রকেট, ভিসা এবং মাস্টারকার্ড গ্রহণ করি।',
                })}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-bold text-navy mb-3">
                {t({ en: '6. Contact', bn: '৬. যোগাযোগ' })}
              </h2>
              <p>
                {t({
                  en: `For questions about these Terms, contact us at ${CONTACT.phone} or ${CONTACT.email}.`,
                  bn: `এই শর্তাবলী সম্পর্কে প্রশ্নের জন্য আমাদের সাথে যোগাযোগ করুন ${CONTACT.phone} বা ${CONTACT.email}।`,
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

export default TermsPage;
