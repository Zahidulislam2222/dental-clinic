import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  Calendar,
  ArrowRight,
  ArrowLeft,
  User,
  Tag,
  CalendarPlus,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageTransition from '../components/ui/PageTransition';
import Button from '../components/ui/Button';

/* ------------------------------------------------------------------ */
/*  ARTICLES DATA                                                      */
/* ------------------------------------------------------------------ */

const articles = [
  {
    id: 1,
    slug: 'why-root-canals-no-longer-painful',
    title: {
      en: 'Why Root Canals Are No Longer Painful — The Truth in 2026',
      bn: 'কেন রুট ক্যানাল আর বেদনাদায়ক নয় — ২০২৬ এর সত্য',
    },
    category: { en: 'Endodontics', bn: 'এন্ডোডন্টিক্স' },
    readTime: '5 min',
    date: 'March 15, 2026',
    gradient: 'from-teal-400 to-teal-600',
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1600&q=80&fit=crop',
    tags: [
      { en: 'Root Canal', bn: 'রুট ক্যানাল' },
      { en: 'Pain-Free', bn: 'ব্যথামুক্ত' },
      { en: 'Endodontics', bn: 'এন্ডোডন্টিক্স' },
    ],
    content: {
      en: `<p>Root canal treatment has long been one of the most feared dental procedures, but in 2026, the reality could not be more different from the myths. Thanks to revolutionary advances in technology and anaesthesia, modern root canal therapy is virtually painless — and often no more uncomfortable than getting a simple filling.</p>

<h2>What Actually Happens During a Root Canal?</h2>
<p>A root canal becomes necessary when the soft tissue inside your tooth — called the pulp — becomes infected or inflamed. This can happen due to deep decay, repeated dental procedures on the same tooth, cracks, or chips. During treatment, your dentist removes the infected pulp, carefully cleans and shapes the inside of the root canal, then fills and seals the space to prevent further infection.</p>

<h2>The Role of Modern Rotary Technology</h2>
<p>One of the biggest game-changers in endodontics is the adoption of nickel-titanium rotary instruments. Unlike the manual stainless steel files used decades ago, rotary files are flexible, precise, and work significantly faster. They follow the natural curve of the root canal with minimal risk of perforation or breakage. At Everyday Dental Surgery, we use the latest generation of rotary systems that can complete the cleaning and shaping process in a fraction of the time it once took.</p>

<h2>Advanced Anaesthesia Makes All the Difference</h2>
<p>Modern local anaesthetics are more effective and longer-lasting than ever before. Techniques such as supplemental intraligamentary injections and the use of articaine-based anaesthetics ensure complete numbness of the affected tooth. Many patients report feeling nothing more than a slight pressure during the entire procedure. For anxious patients, we also offer sedation options that make the experience even more comfortable.</p>

<h2>Digital Imaging for Precision</h2>
<p>Digital periapical X-rays and 3D CBCT scans allow us to see the exact anatomy of your tooth roots before we begin. This means fewer surprises, more accurate treatment, and better outcomes. We can identify hidden canals, measure exact working lengths, and plan the procedure with surgical precision.</p>

<h2>Single-Visit Root Canals</h2>
<p>In many cases, root canal treatment can now be completed in a single appointment lasting 45 to 90 minutes. Gone are the days of multiple painful visits spread across weeks. With modern techniques, you can walk in with a toothache and walk out with a saved tooth — all in one sitting.</p>

<h2>What About After the Procedure?</h2>
<p>Post-treatment discomfort is typically mild and manageable with over-the-counter pain relievers. Most patients return to their normal activities the very next day. The tooth will need a crown to protect it long-term, which we can plan during your follow-up visit. With proper care, a root canal-treated tooth can last a lifetime.</p>

<p>If you have been putting off dental treatment because you are afraid of a root canal, we encourage you to reconsider. The procedure has come a long way, and at Everyday Dental Surgery, your comfort is always our top priority.</p>`,

      bn: `<p>রুট ক্যানাল চিকিৎসা দীর্ঘদিন ধরে সবচেয়ে ভয়ের দন্ত চিকিৎসাগুলোর মধ্যে একটি ছিল, কিন্তু ২০২৬ সালে বাস্তবতা পুরোপুরি ভিন্ন। প্রযুক্তি এবং অ্যানেসথেসিয়ায় বিপ্লবী অগ্রগতির কারণে, আধুনিক রুট ক্যানাল থেরাপি কার্যত ব্যথামুক্ত — এবং প্রায়ই একটি সাধারণ ফিলিংয়ের চেয়ে বেশি অস্বস্তিকর নয়।</p>

<h2>রুট ক্যানালের সময় আসলে কী হয়?</h2>
<p>রুট ক্যানাল প্রয়োজন হয় যখন আপনার দাঁতের ভেতরের নরম টিস্যু — যাকে পাল্প বলা হয় — সংক্রমিত বা প্রদাহিত হয়। এটি গভীর ক্ষয়, একই দাঁতে বারবার চিকিৎসা, ফাটল বা চিপের কারণে হতে পারে। চিকিৎসার সময়, আপনার ডেন্টিস্ট সংক্রমিত পাল্প অপসারণ করেন, যত্নসহকারে রুট ক্যানালের ভেতর পরিষ্কার ও আকৃতি দেন, তারপর আরও সংক্রমণ রোধ করতে স্থানটি ভরাট ও সিল করেন।</p>

<h2>আধুনিক রোটারি প্রযুক্তির ভূমিকা</h2>
<p>এন্ডোডন্টিক্সে সবচেয়ে বড় পরিবর্তনকারী হলো নিকেল-টাইটানিয়াম রোটারি যন্ত্রের ব্যবহার। দশক আগে ব্যবহৃত ম্যানুয়াল স্টেইনলেস স্টিল ফাইলের বিপরীতে, রোটারি ফাইল নমনীয়, সুনির্দিষ্ট এবং উল্লেখযোগ্যভাবে দ্রুত কাজ করে। এভরিডে ডেন্টাল সার্জারিতে, আমরা সর্বশেষ প্রজন্মের রোটারি সিস্টেম ব্যবহার করি।</p>

<h2>উন্নত অ্যানেসথেসিয়া সব পার্থক্য তৈরি করে</h2>
<p>আধুনিক স্থানীয় অ্যানেসথেটিক আগের চেয়ে বেশি কার্যকর এবং দীর্ঘস্থায়ী। আর্টিকেইন-ভিত্তিক অ্যানেসথেটিকের ব্যবহার আক্রান্ত দাঁতের সম্পূর্ণ অসাড়তা নিশ্চিত করে। অনেক রোগী পুরো পদ্ধতির সময় সামান্য চাপ ছাড়া আর কিছু অনুভব করেন না।</p>

<h2>নির্ভুলতার জন্য ডিজিটাল ইমেজিং</h2>
<p>ডিজিটাল পেরিয়াপিকাল এক্স-রে এবং 3D CBCT স্ক্যান আমাদের শুরু করার আগে আপনার দাঁতের শিকড়ের সঠিক গঠন দেখতে দেয়। এর মানে কম আশ্চর্য, আরও নির্ভুল চিকিৎসা এবং ভালো ফলাফল।</p>

<h2>একক ভিজিটে রুট ক্যানাল</h2>
<p>অনেক ক্ষেত্রে, রুট ক্যানাল চিকিৎসা এখন ৪৫ থেকে ৯০ মিনিটের একটি একক অ্যাপয়েন্টমেন্টে সম্পন্ন করা যায়। সপ্তাহ জুড়ে একাধিক বেদনাদায়ক ভিজিটের দিন শেষ।</p>

<p>আপনি যদি রুট ক্যানালের ভয়ে দন্ত চিকিৎসা এড়িয়ে যাচ্ছেন, আমরা আপনাকে পুনরায় ভাবতে উৎসাহিত করি। এভরিডে ডেন্টাল সার্জারিতে, আপনার আরাম সবসময় আমাদের সর্বোচ্চ অগ্রাধিকার।</p>`,
    },
  },
  {
    id: 2,
    slug: 'dental-implants-vs-dentures',
    title: {
      en: 'Dental Implants vs Dentures: Which is Right for You?',
      bn: 'ডেন্টাল ইমপ্লান্ট বনাম ডেনচার: আপনার জন্য কোনটি সঠিক?',
    },
    category: { en: 'Implants', bn: 'ইমপ্লান্ট' },
    readTime: '7 min',
    date: 'March 8, 2026',
    gradient: 'from-blue-400 to-blue-600',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&q=80&fit=crop',
    tags: [
      { en: 'Dental Implants', bn: 'ডেন্টাল ইমপ্লান্ট' },
      { en: 'Dentures', bn: 'ডেনচার' },
      { en: 'Tooth Replacement', bn: 'দাঁত প্রতিস্থাপন' },
    ],
    content: {
      en: `<p>Losing one or more teeth is a common experience, and choosing the right replacement option is one of the most important dental decisions you will make. The two primary options — dental implants and dentures — each have their own strengths and considerations. Understanding the differences can help you make an informed choice that suits your health, lifestyle, and budget.</p>

<h2>Understanding Dental Implants</h2>
<p>Dental implants are small titanium posts that are surgically placed into the jawbone, where they serve as artificial tooth roots. Over a period of three to six months, the implant fuses with your natural bone through a process called osseointegration. Once healed, a custom-made crown is attached to the implant, creating a permanent replacement tooth that looks, feels, and functions just like a natural tooth.</p>
<p>Implants can replace a single tooth, multiple teeth, or even support a full arch of teeth. They preserve jawbone density, prevent adjacent teeth from shifting, and with proper care can last 25 years or more — often a lifetime.</p>

<h2>Understanding Dentures</h2>
<p>Dentures are removable prosthetic devices designed to replace missing teeth. Full dentures replace all teeth in an arch, while partial dentures fill in gaps when some natural teeth remain. Modern dentures are made from high-quality acrylic and are custom-fitted to your mouth for improved comfort and appearance compared to dentures of the past.</p>
<p>Dentures rest on the gums and are held in place by suction, adhesive, or clasps that attach to remaining teeth. They need to be removed nightly for cleaning and to allow gum tissue to rest.</p>

<h2>Cost Comparison</h2>
<p>Dentures are significantly less expensive upfront — a full set typically costs a fraction of what implants require. However, dentures need to be relined every few years and completely replaced every 5 to 8 years as your jawbone gradually changes shape. Implants have a higher initial investment but rarely need replacement, making them more cost-effective over a lifetime.</p>

<h2>Comfort and Function</h2>
<p>Implants are the clear winner in terms of comfort. Because they are anchored in bone, they do not slip, click, or cause sore spots on gums. You can eat all your favourite foods — from corn on the cob to steak — without worry. Dentures, while much improved, can still shift during eating and speaking, and certain hard or sticky foods may need to be avoided.</p>

<h2>Bone Health</h2>
<p>One of the most significant advantages of dental implants is that they stimulate the jawbone, preventing the bone loss that naturally occurs after tooth extraction. Dentures sit on top of the gums and do not provide this stimulation, which means the jawbone continues to shrink over time. This can change the shape of your face and affect how well dentures fit.</p>

<h2>Which Is Right for You?</h2>
<p>The best choice depends on your individual situation. Implants are ideal if you have adequate bone density, are in good general health, and want a permanent, low-maintenance solution. Dentures may be better suited if you have significant bone loss, certain medical conditions, or need a more affordable immediate solution. During your consultation at Everyday Dental Surgery, Dr. Arman Hossain will evaluate your oral health, discuss your goals, and recommend the option that is truly best for you.</p>`,

      bn: `<p>এক বা একাধিক দাঁত হারানো একটি সাধারণ অভিজ্ঞতা, এবং সঠিক প্রতিস্থাপন বিকল্প বেছে নেওয়া আপনার সবচেয়ে গুরুত্বপূর্ণ দন্ত সিদ্ধান্তগুলোর একটি। দুটি প্রাথমিক বিকল্প — ডেন্টাল ইমপ্লান্ট এবং ডেনচার — প্রতিটির নিজস্ব শক্তি এবং বিবেচনা রয়েছে।</p>

<h2>ডেন্টাল ইমপ্লান্ট বোঝা</h2>
<p>ডেন্টাল ইমপ্লান্ট হলো ছোট টাইটানিয়াম পোস্ট যা চোয়ালের হাড়ে অস্ত্রোপচারের মাধ্যমে স্থাপন করা হয়, যেখানে তারা কৃত্রিম দাঁতের শিকড় হিসেবে কাজ করে। তিন থেকে ছয় মাসের মধ্যে, ইমপ্লান্ট আপনার প্রাকৃতিক হাড়ের সাথে মিশে যায়। একবার সেরে গেলে, একটি কাস্টম-মেড ক্রাউন ইমপ্লান্টের সাথে সংযুক্ত করা হয়।</p>

<h2>ডেনচার বোঝা</h2>
<p>ডেনচার হলো অপসারণযোগ্য কৃত্রিম ডিভাইস যা হারানো দাঁত প্রতিস্থাপন করতে ডিজাইন করা হয়। সম্পূর্ণ ডেনচার একটি আর্চের সমস্ত দাঁত প্রতিস্থাপন করে, আংশিক ডেনচার ফাঁক পূরণ করে। আধুনিক ডেনচার উচ্চ-মানের অ্যাক্রিলিক থেকে তৈরি।</p>

<h2>খরচ তুলনা</h2>
<p>ডেনচার প্রাথমিকভাবে উল্লেখযোগ্যভাবে কম ব্যয়বহুল। তবে, ডেনচার প্রতি কয়েক বছর পুনরায় সংস্কার করতে হয় এবং প্রতি ৫ থেকে ৮ বছরে সম্পূর্ণ প্রতিস্থাপন করতে হয়। ইমপ্লান্টের প্রাথমিক বিনিয়োগ বেশি কিন্তু খুব কমই প্রতিস্থাপন প্রয়োজন হয়।</p>

<h2>আরাম এবং কার্যকারিতা</h2>
<p>ইমপ্লান্ট আরামের দিক থেকে স্পষ্ট বিজয়ী। হাড়ে নোঙর করা থাকায়, তারা পিছলে যায় না বা ক্লিক করে না। আপনি চিন্তা ছাড়াই আপনার প্রিয় খাবার খেতে পারেন।</p>

<h2>হাড়ের স্বাস্থ্য</h2>
<p>ডেন্টাল ইমপ্লান্টের সবচেয়ে গুরুত্বপূর্ণ সুবিধা হলো তারা চোয়ালের হাড়কে উদ্দীপিত করে, দাঁত তোলার পর যে হাড় ক্ষয় হয় তা প্রতিরোধ করে।</p>

<h2>আপনার জন্য কোনটি সঠিক?</h2>
<p>সর্বোত্তম পছন্দ আপনার ব্যক্তিগত পরিস্থিতির উপর নির্ভর করে। এভরিডে ডেন্টাল সার্জারিতে আপনার পরামর্শের সময়, ডা. আরমান হোসেন আপনার মৌখিক স্বাস্থ্য মূল্যায়ন করবেন এবং আপনার জন্য সত্যিই সেরা বিকল্পটি সুপারিশ করবেন।</p>`,
    },
  },
  {
    id: 3,
    slug: 'how-often-visit-dentist',
    title: {
      en: 'How Often Should You Really Visit the Dentist?',
      bn: 'আসলে কতবার ডেন্টিস্টের কাছে যাওয়া উচিত?',
    },
    category: { en: 'Preventive Care', bn: 'প্রতিরোধমূলক যত্ন' },
    readTime: '4 min',
    date: 'February 28, 2026',
    gradient: 'from-green-400 to-green-600',
    image: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=1600&q=80&fit=crop',
    tags: [
      { en: 'Preventive Care', bn: 'প্রতিরোধমূলক যত্ন' },
      { en: 'Dental Checkup', bn: 'ডেন্টাল চেকআপ' },
      { en: 'Oral Hygiene', bn: 'মৌখিক স্বাস্থ্যবিধি' },
    ],
    content: {
      en: `<p>One of the most common questions patients ask is how frequently they should visit their dentist. The simple answer that has been repeated for decades is "every six months," but the reality is more nuanced than a one-size-fits-all recommendation. Your ideal visit frequency depends on your individual oral health status, risk factors, and habits.</p>

<h2>The Six-Month Rule — Where Did It Come From?</h2>
<p>The twice-a-year dental visit recommendation has been around since the 1950s and was popularized by toothpaste advertisements rather than clinical research. While it serves as a reasonable baseline for most adults, modern dentistry recognizes that some people need more frequent visits while others may safely extend their intervals.</p>

<h2>Who Should Visit Every 3-4 Months?</h2>
<p>Certain patients benefit significantly from more frequent dental visits. These include people with active gum disease (periodontitis), as plaque and tartar can re-accumulate quickly and worsen the condition. Diabetic patients are at higher risk for gum infections and slower healing. Smokers and tobacco users face elevated risks for gum disease and oral cancer. Patients undergoing orthodontic treatment need regular monitoring to prevent decay around brackets and wires. Pregnant women experience hormonal changes that can increase gum inflammation and bleeding.</p>

<h2>Who Might Visit Less Frequently?</h2>
<p>If you have excellent oral hygiene, no history of cavities or gum disease, do not smoke, eat a balanced diet low in sugar, and have no chronic health conditions affecting your mouth — you may be fine with annual checkups. However, this should be a decision made in consultation with your dentist, not on your own.</p>

<h2>What Happens During a Routine Visit?</h2>
<p>A comprehensive dental checkup involves much more than just looking at your teeth. Your dentist examines your gums, tongue, throat, and the soft tissues of your mouth for signs of disease, including oral cancer screening. Digital X-rays detect problems invisible to the naked eye — cavities between teeth, bone loss, impacted teeth, and infections. Professional cleaning removes hardened tartar that cannot be eliminated by brushing alone, no matter how diligent you are.</p>

<h2>The Cost of Skipping Visits</h2>
<p>Preventive dental care is one of the best investments in your health. A routine checkup and cleaning costs a fraction of what a root canal, crown, or implant would cost. Early detection of a small cavity means a simple filling; ignored, that same cavity can progress to infection, pain, and eventual tooth loss. Studies show that patients who maintain regular dental visits spend significantly less on dental care over their lifetimes.</p>

<h2>Our Recommendation</h2>
<p>At Everyday Dental Surgery, we recommend that most patients visit at least twice a year. During your first visit, Dr. Arman Hossain will assess your individual risk factors and create a personalized schedule that keeps your oral health on track. Prevention is always better — and cheaper — than cure.</p>`,

      bn: `<p>রোগীদের সবচেয়ে সাধারণ প্রশ্নগুলোর একটি হলো কত ঘন ঘন তাদের ডেন্টিস্টের কাছে যাওয়া উচিত। দশকের পর দশক ধরে পুনরাবৃত্তি করা সরল উত্তর হলো "প্রতি ছয় মাসে," কিন্তু বাস্তবতা একটি সর্বজনীন সুপারিশের চেয়ে বেশি সূক্ষ্ম।</p>

<h2>ছয় মাসের নিয়ম — এটি কোথা থেকে এসেছে?</h2>
<p>বছরে দুইবার ডেন্টাল ভিজিটের সুপারিশ ১৯৫০-এর দশক থেকে আছে এবং ক্লিনিক্যাল গবেষণার পরিবর্তে টুথপেস্ট বিজ্ঞাপন দ্বারা জনপ্রিয় হয়েছিল। আধুনিক দন্তচিকিৎসা স্বীকার করে যে কিছু মানুষের আরও ঘন ঘন ভিজিট প্রয়োজন।</p>

<h2>কার প্রতি ৩-৪ মাসে যাওয়া উচিত?</h2>
<p>সক্রিয় মাড়ির রোগ (পেরিওডন্টাইটিস) থাকা রোগীরা, ডায়াবেটিক রোগীরা, ধূমপায়ীরা, অর্থোডন্টিক চিকিৎসাধীন রোগীরা এবং গর্ভবতী মহিলারা আরও ঘন ঘন ডেন্টাল ভিজিট থেকে উল্লেখযোগ্যভাবে উপকৃত হন।</p>

<h2>রুটিন ভিজিটের সময় কী হয়?</h2>
<p>একটি ব্যাপক ডেন্টাল চেকআপে শুধু দাঁত দেখার চেয়ে অনেক বেশি কিছু জড়িত। আপনার ডেন্টিস্ট মাড়ি, জিভ, গলা এবং মুখের নরম টিস্যু পরীক্ষা করেন। ডিজিটাল এক্স-রে খালি চোখে অদৃশ্য সমস্যা সনাক্ত করে।</p>

<h2>ভিজিট এড়িয়ে যাওয়ার খরচ</h2>
<p>প্রতিরোধমূলক দন্ত যত্ন আপনার স্বাস্থ্যে সেরা বিনিয়োগগুলোর একটি। একটি রুটিন চেকআপ এবং ক্লিনিংয়ের খরচ রুট ক্যানাল, ক্রাউন বা ইমপ্লান্টের খরচের একটি ভগ্নাংশ।</p>

<h2>আমাদের সুপারিশ</h2>
<p>এভরিডে ডেন্টাল সার্জারিতে, আমরা সুপারিশ করি যে বেশিরভাগ রোগী বছরে কমপক্ষে দুইবার ভিজিট করুন। ডা. আরমান হোসেন আপনার ব্যক্তিগত ঝুঁকির কারণগুলো মূল্যায়ন করবেন এবং একটি ব্যক্তিগতকৃত সময়সূচি তৈরি করবেন। প্রতিরোধ সবসময় নিরাময়ের চেয়ে ভালো — এবং সস্তা।</p>`,
    },
  },
  {
    id: 4,
    slug: 'clear-aligners-vs-metal-braces',
    title: {
      en: 'Clear Aligners vs Metal Braces: A Complete Comparison',
      bn: 'ক্লিয়ার অ্যালাইনার বনাম মেটাল ব্রেসেস: সম্পূর্ণ তুলনা',
    },
    category: { en: 'Orthodontics', bn: 'অর্থোডন্টিক্স' },
    readTime: '6 min',
    date: 'February 20, 2026',
    gradient: 'from-purple-400 to-purple-600',
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1600&q=80&fit=crop',
    tags: [
      { en: 'Orthodontics', bn: 'অর্থোডন্টিক্স' },
      { en: 'Braces', bn: 'ব্রেসেস' },
      { en: 'Clear Aligners', bn: 'ক্লিয়ার অ্যালাইনার' },
    ],
    content: {
      en: `<p>Straightening your teeth is one of the most impactful things you can do for both your oral health and your confidence. But with today's options — traditional metal braces and clear aligners like Invisalign — how do you decide which is right for you? This comprehensive comparison will help you understand the key differences.</p>

<h2>How Metal Braces Work</h2>
<p>Traditional metal braces consist of stainless steel brackets bonded to each tooth, connected by archwires that apply continuous gentle pressure to move teeth into their desired positions. Elastic bands (ligatures) hold the wire to each bracket, and these are adjusted every 4 to 6 weeks. Modern metal braces are smaller, more comfortable, and more efficient than their predecessors. They remain the gold standard for treating complex orthodontic cases including severe crowding, significant bite problems, and rotations.</p>

<h2>How Clear Aligners Work</h2>
<p>Clear aligners are a series of custom-made, transparent plastic trays that fit snugly over your teeth. Each set of aligners is worn for one to two weeks before being replaced by the next set in the series, gradually shifting teeth into alignment. They are virtually invisible when worn, removable for eating and brushing, and generally more comfortable than braces since there are no wires or brackets to irritate cheeks and gums.</p>

<h2>Aesthetics</h2>
<p>Clear aligners are the obvious winner for those concerned about appearance. They are nearly invisible, making them popular among adults and professionals who want to straighten their teeth discreetly. Metal braces are more visible, although modern options with smaller brackets and tooth-coloured wires have made them less conspicuous than before. Ceramic braces offer a middle ground with tooth-coloured brackets, but they are more fragile and expensive than metal.</p>

<h2>Treatment Complexity</h2>
<p>Metal braces can handle virtually any orthodontic problem — from simple spacing issues to complex malocclusions requiring jaw surgery. Clear aligners have improved dramatically and can now treat many moderate cases effectively, but they still have limitations with severe rotations, vertical tooth movements, and complex bite corrections. Your orthodontist can determine which option is suitable for your specific case.</p>

<h2>Comfort and Convenience</h2>
<p>Clear aligners are generally more comfortable — no metal to poke or irritate soft tissues. They are removable, so you can eat anything you want and maintain normal brushing and flossing routines. However, they require discipline: aligners must be worn 20 to 22 hours per day to be effective. Metal braces require no compliance effort since they are fixed in place, but you must avoid certain foods (hard, sticky, crunchy items) and spend more time on oral hygiene around the brackets.</p>

<h2>Treatment Duration</h2>
<p>Treatment time varies by individual case. Simple alignment issues may take 6 to 12 months with either option. More complex cases typically take 18 to 24 months with braces, while clear aligners may take slightly longer for moderate cases. Metal braces often achieve faster results for complex movements because they provide more precise control.</p>

<h2>Cost</h2>
<p>Metal braces are generally less expensive than clear aligners, though prices vary depending on treatment complexity and duration. At Everyday Dental Surgery, we offer flexible payment plans for both options to make orthodontic treatment accessible to everyone.</p>

<h2>Making Your Decision</h2>
<p>The best orthodontic treatment is the one that addresses your specific needs. Schedule a consultation with Dr. Arman Hossain, who will examine your teeth, take digital impressions, and recommend the most effective and practical approach for your smile goals.</p>`,

      bn: `<p>দাঁত সোজা করা আপনার মৌখিক স্বাস্থ্য এবং আত্মবিশ্বাস উভয়ের জন্যই সবচেয়ে প্রভাবশালী কাজগুলোর একটি। কিন্তু আজকের বিকল্পগুলো — ঐতিহ্যবাহী মেটাল ব্রেসেস এবং ইনভিজালাইনের মতো ক্লিয়ার অ্যালাইনার — দিয়ে কীভাবে সিদ্ধান্ত নেবেন?</p>

<h2>মেটাল ব্রেসেস কীভাবে কাজ করে</h2>
<p>ঐতিহ্যবাহী মেটাল ব্রেসেস স্টেইনলেস স্টিলের ব্র্যাকেট নিয়ে গঠিত যা প্রতিটি দাঁতে বন্ধন করা হয়, আর্চওয়্যার দ্বারা সংযুক্ত যা দাঁতকে পছন্দসই অবস্থানে নিয়ে যেতে ক্রমাগত মৃদু চাপ প্রয়োগ করে। এগুলো প্রতি ৪ থেকে ৬ সপ্তাহে সামঞ্জস্য করা হয়।</p>

<h2>ক্লিয়ার অ্যালাইনার কীভাবে কাজ করে</h2>
<p>ক্লিয়ার অ্যালাইনার হলো কাস্টম-মেড, স্বচ্ছ প্লাস্টিক ট্রে যা আপনার দাঁতের উপর শক্তভাবে ফিট হয়। প্রতিটি সেট এক থেকে দুই সপ্তাহ পরিধান করা হয়, ধীরে ধীরে দাঁত সারিবদ্ধ করে।</p>

<h2>নান্দনিকতা</h2>
<p>ক্লিয়ার অ্যালাইনার চেহারা নিয়ে উদ্বিগ্নদের জন্য স্পষ্ট বিজয়ী। এগুলো প্রায় অদৃশ্য, যা প্রাপ্তবয়স্ক এবং পেশাদারদের মধ্যে জনপ্রিয়।</p>

<h2>চিকিৎসার জটিলতা</h2>
<p>মেটাল ব্রেসেস কার্যত যেকোনো অর্থোডন্টিক সমস্যা সামলাতে পারে। ক্লিয়ার অ্যালাইনার নাটকীয়ভাবে উন্নত হয়েছে তবে গুরুতর ক্ষেত্রে এখনও সীমাবদ্ধতা রয়েছে।</p>

<h2>আরাম এবং সুবিধা</h2>
<p>ক্লিয়ার অ্যালাইনার সাধারণত বেশি আরামদায়ক। তবে, কার্যকর হতে দিনে ২০ থেকে ২২ ঘন্টা পরতে হবে। মেটাল ব্রেসেসে কোনো সম্মতি প্রচেষ্টা প্রয়োজন নেই তবে কিছু খাবার এড়াতে হবে।</p>

<h2>খরচ</h2>
<p>মেটাল ব্রেসেস সাধারণত ক্লিয়ার অ্যালাইনারের চেয়ে কম ব্যয়বহুল। এভরিডে ডেন্টাল সার্জারিতে, আমরা উভয় বিকল্পের জন্য নমনীয় পেমেন্ট প্ল্যান অফার করি।</p>

<h2>আপনার সিদ্ধান্ত নেওয়া</h2>
<p>সেরা অর্থোডন্টিক চিকিৎসা হলো যেটি আপনার নির্দিষ্ট চাহিদা পূরণ করে। ডা. আরমানের সাথে একটি পরামর্শ নির্ধারণ করুন।</p>`,
    },
  },
  {
    id: 5,
    slug: '10-foods-destroying-your-teeth',
    title: {
      en: '10 Foods That Are Secretly Destroying Your Teeth',
      bn: '১০টি খাবার যা গোপনে আপনার দাঁত ধ্বংস করছে',
    },
    category: { en: 'Oral Health', bn: 'মৌখিক স্বাস্থ্য' },
    readTime: '5 min',
    date: 'February 10, 2026',
    gradient: 'from-orange-400 to-orange-600',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1600&q=80&fit=crop',
    tags: [
      { en: 'Diet', bn: 'খাদ্যাভ্যাস' },
      { en: 'Enamel', bn: 'এনামেল' },
      { en: 'Oral Health', bn: 'মৌখিক স্বাস্থ্য' },
    ],
    content: {
      en: `<p>You brush twice a day, floss regularly, and visit your dentist on schedule — but your teeth are still developing problems. The culprit might be hiding in your diet. Many foods and beverages that seem harmless, or even healthy, can be quietly damaging your tooth enamel, promoting decay, and weakening your teeth over time.</p>

<h2>1. Citrus Fruits and Juices</h2>
<p>Oranges, lemons, grapefruits, and their juices are packed with vitamin C, but they are also highly acidic. Frequent exposure to citric acid erodes tooth enamel — the hard protective outer layer of your teeth. Once enamel is worn away, it does not grow back. Enjoy citrus in moderation, drink juice through a straw, and rinse your mouth with water afterward. Wait at least 30 minutes before brushing, as brushing acid-softened enamel can cause more damage.</p>

<h2>2. Sports and Energy Drinks</h2>
<p>These beverages are a double threat — they are both highly acidic and loaded with sugar. The acid attacks enamel while sugar feeds the bacteria that cause cavities. Research shows that sports drinks can be more damaging to teeth than cola. If you exercise intensely, water is the best hydration choice for both your body and your teeth.</p>

<h2>3. Dried Fruits</h2>
<p>Raisins, dried apricots, and cranberries are often considered healthy snacks, but their sticky texture means they cling to teeth and between teeth for hours. Their concentrated sugar content feeds cavity-causing bacteria long after you have finished eating. Fresh fruits are a much better option — they contain water that helps dilute their natural sugars.</p>

<h2>4. Hard Candies</h2>
<p>Hard candies dissolve slowly in your mouth, bathing your teeth in sugar for extended periods. Worse, biting down on hard candy can crack or chip teeth. Sugar-free varieties are slightly better but can still be acidic.</p>

<h2>5. Ice</h2>
<p>Chewing ice might seem harmless since it is just frozen water, but the hardness and cold temperature can crack tooth enamel, damage existing dental work, and irritate the soft tissue inside your teeth. If you crave chewing ice, it might indicate an iron deficiency — talk to your doctor.</p>

<h2>6. White Bread and Crackers</h2>
<p>Refined starches like white bread break down into simple sugars almost immediately in your mouth. The soft, pasty texture sticks to teeth and between teeth, creating the perfect environment for bacterial growth. Whole grain options are slightly better as they contain more complex carbohydrates that break down more slowly.</p>

<h2>7. Pickles and Vinegar-Based Foods</h2>
<p>The vinegar used in pickling is highly acidic and can erode enamel with frequent consumption. While occasional pickle consumption is fine, eating highly acidic foods daily can contribute to significant enamel wear over time.</p>

<h2>8. Coffee and Tea</h2>
<p>Beyond staining your teeth, coffee and tea (especially when sweetened) create an acidic environment in your mouth. Adding sugar makes them even more harmful. If you cannot give up your morning cup, drink water alongside it and avoid sipping slowly over long periods — this prolongs the acid exposure.</p>

<h2>9. Alcohol</h2>
<p>Alcohol dries out your mouth by reducing saliva production. Saliva is your mouth's natural defence system — it washes away food particles, neutralizes acids, and contains minerals that help repair early enamel damage. A dry mouth is a breeding ground for bacteria and decay.</p>

<h2>10. Flavoured Yoghurt</h2>
<p>Plain yoghurt is actually good for teeth due to its calcium and probiotics. But flavoured yoghurts can contain as much sugar as a candy bar. The sugar negates the benefits. Choose plain, unsweetened yoghurt and add fresh fruit if you want flavour.</p>

<h2>Protecting Your Teeth</h2>
<p>You do not have to eliminate all these foods, but being aware of their effects helps you make smarter choices. Rinse with water after acidic foods, wait before brushing, limit sugary snacks between meals, and maintain regular dental checkups at Everyday Dental Surgery.</p>`,

      bn: `<p>আপনি দিনে দুইবার ব্রাশ করেন, নিয়মিত ফ্লস করেন এবং সময়মতো ডেন্টিস্টের কাছে যান — তবুও আপনার দাঁতে সমস্যা দেখা দিচ্ছে। অপরাধী হয়তো আপনার খাদ্যাভ্যাসে লুকিয়ে আছে।</p>

<h2>১. সাইট্রাস ফল এবং জুস</h2>
<p>কমলা, লেবু এবং তাদের জুস ভিটামিন সি সমৃদ্ধ, কিন্তু অত্যন্ত অম্লীয়ও। ঘন ঘন সাইট্রিক অ্যাসিডের সংস্পর্শ দাঁতের এনামেল ক্ষয় করে। পরিমিতভাবে উপভোগ করুন এবং পরে জল দিয়ে মুখ ধুয়ে নিন।</p>

<h2>২. স্পোর্টস এবং এনার্জি ড্রিংক</h2>
<p>এই পানীয়গুলো দ্বৈত হুমকি — অত্যন্ত অম্লীয় এবং চিনিতে ভরপুর। গবেষণা দেখায় স্পোর্টস ড্রিংক কোলার চেয়ে দাঁতের জন্য বেশি ক্ষতিকর হতে পারে।</p>

<h2>৩. শুকনো ফল</h2>
<p>কিশমিশ এবং শুকনো ফলের আঠালো গঠন মানে তারা ঘন্টার পর ঘন্টা দাঁতে লেগে থাকে। তাজা ফল অনেক ভালো বিকল্প।</p>

<h2>৪. হার্ড ক্যান্ডি</h2>
<p>হার্ড ক্যান্ডি মুখে ধীরে ধীরে গলে, দীর্ঘ সময় ধরে দাঁতকে চিনিতে ভিজিয়ে রাখে।</p>

<h2>৫. বরফ</h2>
<p>বরফ চিবানো নিরীহ মনে হতে পারে কিন্তু কঠিনতা এবং ঠান্ডা তাপমাত্রা দাঁতের এনামেল ফাটাতে পারে।</p>

<h2>৬. সাদা রুটি এবং ক্র্যাকার</h2>
<p>পরিশোধিত স্টার্চ মুখে প্রায় সাথে সাথে সরল শর্করায় ভেঙে যায়, ব্যাকটেরিয়া বৃদ্ধির আদর্শ পরিবেশ তৈরি করে।</p>

<h2>৭. আচার এবং ভিনেগার-ভিত্তিক খাবার</h2>
<p>আচারে ব্যবহৃত ভিনেগার অত্যন্ত অম্লীয় এবং ঘন ঘন খেলে এনামেল ক্ষয় করতে পারে।</p>

<h2>৮. কফি এবং চা</h2>
<p>দাঁতে দাগ ফেলার পাশাপাশি, কফি এবং চা মুখে অম্লীয় পরিবেশ তৈরি করে। চিনি যোগ করলে আরও ক্ষতিকর হয়।</p>

<h2>৯. অ্যালকোহল</h2>
<p>অ্যালকোহল লালা উৎপাদন কমিয়ে মুখ শুকিয়ে দেয়। শুষ্ক মুখ ব্যাকটেরিয়া এবং ক্ষয়ের প্রজননক্ষেত্র।</p>

<h2>১০. ফ্লেভারড দই</h2>
<p>সাধারণ দই ক্যালসিয়ামের কারণে দাঁতের জন্য ভালো। কিন্তু ফ্লেভারড দইতে ক্যান্ডি বারের সমান চিনি থাকতে পারে।</p>

<h2>আপনার দাঁত রক্ষা করা</h2>
<p>এই সব খাবার বাদ দিতে হবে না, কিন্তু তাদের প্রভাব সম্পর্কে সচেতন হলে আরও বুদ্ধিমান পছন্দ করতে পারবেন। এভরিডে ডেন্টাল সার্জারিতে নিয়মিত চেকআপ বজায় রাখুন।</p>`,
    },
  },
  {
    id: 6,
    slug: 'first-dental-implant-consultation',
    title: {
      en: 'What to Expect During Your First Dental Implant Consultation',
      bn: 'আপনার প্রথম ডেন্টাল ইমপ্লান্ট পরামর্শে কী আশা করবেন',
    },
    category: { en: 'Implants', bn: 'ইমপ্লান্ট' },
    readTime: '8 min',
    date: 'January 30, 2026',
    gradient: 'from-pink-400 to-pink-600',
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1600&q=80&fit=crop',
    tags: [
      { en: 'Dental Implants', bn: 'ডেন্টাল ইমপ্লান্ট' },
      { en: 'Consultation', bn: 'পরামর্শ' },
      { en: 'Treatment Planning', bn: 'চিকিৎসা পরিকল্পনা' },
    ],
    content: {
      en: `<p>The decision to get dental implants is a significant one, and it is perfectly normal to feel a mix of excitement and nervousness before your first consultation. Understanding what to expect can ease your anxiety and help you get the most out of your appointment. Here is a detailed, step-by-step guide to your first dental implant consultation at Everyday Dental Surgery.</p>

<h2>Step 1: Medical and Dental History Review</h2>
<p>Your consultation begins with a thorough review of your medical and dental history. Dr. Arman Hossain will ask about your current medications, any chronic conditions (such as diabetes, heart disease, or osteoporosis), previous surgeries, allergies, and habits like smoking or teeth grinding. These factors can affect implant success rates and may influence your treatment plan. Certain medications like blood thinners or bisphosphonates require special consideration. Be completely honest — there are no wrong answers, and this information helps ensure your safety and the best possible outcome.</p>

<h2>Step 2: Clinical Examination</h2>
<p>Next comes a comprehensive oral examination. The doctor will assess the health of your remaining teeth, gums, and soft tissues. He will check your bite alignment, evaluate the space available for the implant, and examine the area where the missing tooth used to be. The condition of your gums is particularly important — healthy gums are essential for successful implant integration.</p>

<h2>Step 3: Advanced Imaging</h2>
<p>This is where modern technology truly shines. You will have digital periapical X-rays taken of the implant area, along with a panoramic OPG image for a complete view of both jaws. In many cases, a 3D CBCT (Cone Beam Computed Tomography) scan is performed. This three-dimensional image provides incredibly detailed information about your bone density, bone volume, the location of nerves and sinuses, and the precise anatomy of the area. This data is essential for planning implant placement with millimetre-level accuracy.</p>

<h2>Step 4: Treatment Plan Discussion</h2>
<p>Based on the examination and imaging results, Dr. Das will explain whether you are a good candidate for implants and outline your personalized treatment plan. This discussion covers the type of implant recommended (single tooth, multiple teeth, or full arch), whether bone grafting is needed to build up insufficient bone, the number of appointments required, the estimated timeline from placement to final restoration, and the expected success rate for your specific case.</p>

<h2>Step 5: Cost and Payment Options</h2>
<p>Transparency about costs is a priority at Everyday Dental Surgery. You will receive a detailed breakdown of all costs involved — implant placement, the abutment, the final crown, any additional procedures like bone grafting, and follow-up visits. We offer flexible payment plans and can discuss financing options to make your treatment affordable.</p>

<h2>Step 6: Questions and Concerns</h2>
<p>Your consultation is a two-way conversation. Do not hesitate to ask questions about pain management, recovery time, dietary restrictions during healing, success rates, potential complications, and how to care for your implant long-term. No question is too small or too basic — your understanding and comfort are what matter most.</p>

<h2>How to Prepare for Your Consultation</h2>
<p>Bring a list of all medications and supplements you take. If you have recent dental X-rays from another clinic, bring those along. Write down any questions you want to ask. If possible, bring a family member or friend for support — they can help you remember details discussed during the appointment. Eat a light meal before your visit, especially if you tend to feel lightheaded during dental appointments.</p>

<h2>What Happens After the Consultation?</h2>
<p>There is absolutely no pressure to commit to treatment during your first visit. Take time to consider the information, discuss it with your family, and reach out with any additional questions. When you are ready, our team will schedule your implant placement and guide you through every step of the journey toward a complete, confident smile.</p>`,

      bn: `<p>ডেন্টাল ইমপ্লান্ট করার সিদ্ধান্ত একটি গুরুত্বপূর্ণ, এবং প্রথম পরামর্শের আগে উত্তেজনা ও নার্ভাসনেসের মিশ্রণ অনুভব করা সম্পূর্ণ স্বাভাবিক। কী আশা করবেন তা বোঝা আপনার উদ্বেগ কমাতে পারে।</p>

<h2>ধাপ ১: চিকিৎসা ও দন্ত ইতিহাস পর্যালোচনা</h2>
<p>আপনার পরামর্শ শুরু হয় আপনার চিকিৎসা এবং দন্ত ইতিহাসের পুঙ্খানুপুঙ্খ পর্যালোচনা দিয়ে। ডা. আরমান হোসেন আপনার বর্তমান ওষুধ, দীর্ঘস্থায়ী অবস্থা, পূর্ববর্তী সার্জারি, অ্যালার্জি এবং অভ্যাস সম্পর্কে জিজ্ঞাসা করবেন। সম্পূর্ণ সৎ থাকুন।</p>

<h2>ধাপ ২: ক্লিনিক্যাল পরীক্ষা</h2>
<p>এরপর আসে একটি ব্যাপক মৌখিক পরীক্ষা। ডাক্তার আপনার অবশিষ্ট দাঁত, মাড়ি এবং নরম টিস্যুর স্বাস্থ্য মূল্যায়ন করবেন। আপনার কামড়ের সারিবদ্ধতা পরীক্ষা করবেন।</p>

<h2>ধাপ ৩: উন্নত ইমেজিং</h2>
<p>আপনার ডিজিটাল পেরিয়াপিকাল এক্স-রে, প্যানোরামিক OPG এবং 3D CBCT স্ক্যান হবে। এই ত্রিমাত্রিক চিত্র আপনার হাড়ের ঘনত্ব, আয়তন, স্নায়ু এবং সাইনাসের অবস্থান সম্পর্কে অবিশ্বাস্যভাবে বিস্তারিত তথ্য প্রদান করে।</p>

<h2>ধাপ ৪: চিকিৎসা পরিকল্পনা আলোচনা</h2>
<p>পরীক্ষা এবং ইমেজিং ফলাফলের উপর ভিত্তি করে, ডা. দাস ব্যাখ্যা করবেন আপনি ইমপ্লান্টের জন্য ভালো প্রার্থী কিনা এবং আপনার ব্যক্তিগতকৃত চিকিৎসা পরিকল্পনা রূপরেখা দেবেন।</p>

<h2>ধাপ ৫: খরচ এবং পেমেন্ট বিকল্প</h2>
<p>খরচ সম্পর্কে স্বচ্ছতা এভরিডে ডেন্টাল সার্জারিতে অগ্রাধিকার। আপনি সমস্ত খরচের বিস্তারিত ভাঙ্গন পাবেন। আমরা নমনীয় পেমেন্ট প্ল্যান অফার করি।</p>

<h2>ধাপ ৬: প্রশ্ন এবং উদ্বেগ</h2>
<p>আপনার পরামর্শ একটি দ্বিমুখী কথোপকথন। ব্যথা ব্যবস্থাপনা, পুনরুদ্ধারের সময়, সাফল্যের হার সম্পর্কে প্রশ্ন করতে দ্বিধা করবেন না।</p>

<h2>পরামর্শের পরে কী হয়?</h2>
<p>প্রথম ভিজিটে চিকিৎসায় প্রতিশ্রুতি দেওয়ার কোনো চাপ নেই। তথ্য বিবেচনা করুন, পরিবারের সাথে আলোচনা করুন। আপনি প্রস্তুত হলে, আমাদের টিম আপনার ইমপ্লান্ট স্থাপন নির্ধারণ করবে।</p>`,
    },
  },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const article = articles.find((a) => a.slug === slug);

  useEffect(() => {
    if (!article) {
      navigate('/blog', { replace: true });
    }
  }, [article, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) return null;

  const relatedArticles = articles.filter((a) => a.id !== article.id).slice(0, 2);

  return (
    <PageTransition>
      <Helmet>
        <title>
          {t(article.title)} | Everyday Dental Surgery
        </title>
        <meta
          name="description"
          content={t(article.content).replace(/<[^>]+>/g, '').slice(0, 160)}
        />
        <meta property="og:title" content={`${t(article.title)} | Everyday Dental Surgery`} />
        <link rel="canonical" href={`https://example-dental.com/blog/${article.slug}`} />
      </Helmet>

      {/* ========================= HERO ================================= */}
      <section className="relative overflow-hidden min-h-[50vh] flex items-end">
        <img
          src={article.image}
          alt={t(article.title)}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/60 to-navy/30" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              {t(article.category)}
            </span>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {t(article.title)}
            </h1>
            <div className="flex items-center justify-center gap-4 text-white/80 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <User size={14} className="text-white" />
                </div>
                <span>Dr. Arman Hossain</span>
              </div>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {article.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {article.readTime} {t({ en: 'read', bn: 'পড়া' })}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================= ARTICLE BODY ========================= */}
      <section className="py-12 md:py-20 bg-offwhite">
        <div className="container mx-auto px-4">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 lg:p-14"
          >
            <div
              className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-navy prose-headings:font-bold prose-h2:text-xl prose-h2:md:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4"
              dangerouslySetInnerHTML={{ __html: t(article.content) }}
            />

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag size={16} className="text-gray-400" />
                {article.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {t(tag)}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>

          {/* ========================= AUTHOR BIO ========================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
          >
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                <User size={28} className="text-white" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-navy text-lg">
                  {t({ en: 'About the Author', bn: 'লেখক সম্পর্কে' })}
                </h3>
                <p className="font-heading font-semibold text-teal text-sm mt-1">
                  Dr. Arman Hossain (Rafi), BDS, FCPS
                </p>
                <p className="text-gray text-sm leading-relaxed mt-2">
                  {t({
                    en: 'Dr. Arman Hossain is the founder and chief dental surgeon at Everyday Dental Surgery, Rangpur. With extensive training in oral and maxillofacial surgery including UCLA-trained implant expertise, he is dedicated to providing world-class dental care with a compassionate, patient-first approach.',
                    bn: 'ডা. আরমান হোসেন রংপুরের এভরিডে ডেন্টাল সার্জারির প্রতিষ্ঠাতা ও প্রধান দন্ত শল্যচিকিৎসক। UCLA-প্রশিক্ষিত ইমপ্লান্ট দক্ষতাসহ ওরাল ও ম্যাক্সিলোফেসিয়াল সার্জারিতে ব্যাপক প্রশিক্ষণের সাথে, তিনি সহানুভূতিশীল, রোগী-প্রথম পদ্ধতিতে বিশ্বমানের দন্ত চিকিৎসা প্রদানে নিবেদিত।',
                  })}
                </p>
              </div>
            </div>
          </motion.div>

          {/* ========================= CTA ================================ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto mt-8 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-6 md:p-10 text-center text-white"
          >
            <CalendarPlus size={40} className="mx-auto mb-4 text-white/80" />
            <h3 className="font-heading text-2xl md:text-3xl font-bold mb-3">
              {t({
                en: 'Have Questions? Book a Consultation',
                bn: 'প্রশ্ন আছে? পরামর্শ বুক করুন',
              })}
            </h3>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">
              {t({
                en: 'Dr. Arman Hossain is here to answer all your dental health questions and create a personalized treatment plan.',
                bn: 'ডা. আরমান হোসেন আপনার সমস্ত দন্ত স্বাস্থ্য প্রশ্নের উত্তর দিতে এবং ব্যক্তিগতকৃত চিকিৎসা পরিকল্পনা তৈরি করতে এখানে আছেন।',
              })}
            </p>
            <Button to="/appointment" variant="white" size="lg" iconRight={ArrowRight}>
              {t({ en: 'Book Appointment', bn: 'অ্যাপয়েন্টমেন্ট বুক করুন' })}
            </Button>
          </motion.div>

          {/* ========================= RELATED ARTICLES =================== */}
          <div className="max-w-3xl mx-auto mt-12">
            <h3 className="font-heading text-2xl font-bold text-navy mb-6">
              {t({ en: 'Related Articles', bn: 'সম্পর্কিত নিবন্ধ' })}
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {relatedArticles.map((related) => (
                <motion.div
                  key={related.id}
                  whileHover={{ y: -4, boxShadow: '0 15px 40px -10px rgba(0,0,0,0.1)' }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                >
                  <div className={`h-32 bg-gradient-to-br ${related.gradient}`} />
                  <div className="p-5">
                    <span className="bg-teal text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {t(related.category)}
                    </span>
                    <h4 className="font-heading font-bold text-navy text-sm mt-2 mb-2 leading-snug line-clamp-2">
                      {t(related.title)}
                    </h4>
                    <Link
                      to={`/blog/${related.slug}`}
                      className="inline-flex items-center gap-1 text-teal text-sm font-semibold group"
                    >
                      {t({ en: 'Read More', bn: 'আরও পড়ুন' })}
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Back to blog */}
          <div className="max-w-3xl mx-auto mt-8 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-gray hover:text-teal font-heading font-semibold transition-colors"
            >
              <ArrowLeft size={18} />
              {t({ en: 'Back to Blog', bn: 'ব্লগে ফিরে যান' })}
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default BlogPostPage;
