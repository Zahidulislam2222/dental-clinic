import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
import ProtectedRoute from './components/auth/ProtectedRoute'
import AnnouncementBar from './components/layout/AnnouncementBar'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import BackToTop from './components/ui/BackToTop'
import LoadingScreen from './components/ui/LoadingScreen'
import DemoNotice from './components/ui/DemoNotice'
import { Helmet } from 'react-helmet-async'
import { runtime } from './config/runtime'

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const FAQPage = lazy(() => import('./pages/FAQPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const AppointmentPage = lazy(() => import('./pages/AppointmentPage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const CommunityPage = lazy(() => import('./pages/CommunityPage'))
const ConferencesPage = lazy(() => import('./pages/ConferencesPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))

const DemoPage = lazy(() => import('./pages/DemoPage'))
const TrustPage = lazy(() => import('./pages/TrustPage'))

// Auth pages
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'))

// Protected pages
const PatientDashboard = lazy(() => import('./pages/PatientDashboard'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))

// Page loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-offwhite">
    <div className="text-center">
      <div className="flex items-end gap-1 justify-center mb-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-4 bg-teal rounded-sm animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
      <p className="text-gray text-sm font-medium">Loading...</p>
    </div>
  </div>
)

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const App = () => {
  const location = useLocation()

  // Lenis smooth scrolling
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(tick)
    }
  }, [])

  return (
    <>
      <Helmet><link rel="canonical" href={runtime.siteUrl + location.pathname} /><meta name="robots" content="noindex, nofollow" /></Helmet>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <LoadingScreen />
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <AnnouncementBar />
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-grow pt-[100px] md:pt-[116px]">
          <DemoNotice />
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/experience" element={<DemoPage />} />
                <Route path="/trust" element={<TrustPage />} />
                <Route path="/accessibility" element={<TrustPage />} />
                <Route path="*" element={<div className="review-page"><h1>Page not found</h1><a href="/">Return home</a></div>} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/:slug" element={<ServiceDetailPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/appointment" element={<AppointmentPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/conferences" element={<ConferencesPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />

                {/* Auth routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Protected routes */}
                <Route path="/dashboard/*" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
                <Route path="/admin/*" element={<ProtectedRoute requiredRoles={['admin', 'doctor', 'receptionist']}><AdminDashboard /></ProtectedRoute>} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>
        <Footer />
      </div>
      <BackToTop />

    </>
  )
}

export default App
