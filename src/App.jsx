import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen';
import AboutScreen from './pages/AboutScreen';
import ServicesScreen from './pages/ServicesScreen';
import ContactScreen from './pages/ContactScreen';
import GalleryScreen from './pages/GalleryScreen';
import PrivacyPolicyScreen from './pages/PrivacyPolicyScreen';
import TermsConditionsScreen from './pages/TermsConditionsScreen';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import FloatingIcons from './components/Layout/FloatingIcons';
import LoginScreen from './pages/Admin/LoginScreen';
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminAbout from './pages/Admin/AdminAbout';
import AdminServices from './pages/Admin/AdminServices';
import AdminGallery from './pages/Admin/AdminGallery';
import AdminContactSettings from './pages/Admin/AdminContactSettings';
import { ToastProvider } from './components/Toast/ToastProvider';
import { useCmsBootstrap } from './components/CmsBootstrap';

function AppContent() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');
  const cmsLoaded = useCmsBootstrap();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!cmsLoaded && !isAdminRoute) return <main className="min-h-screen bg-[#F7F5F0]" />;

  return (
    <>
      {!isAdminRoute && <Header />}
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<HomeScreen />} />
        <Route path="/about" element={<AboutScreen />} />
        <Route path="/services/*" element={<ServicesScreen />} />
        <Route path="/contact" element={<ContactScreen />} />
        <Route path="/gallery" element={<GalleryScreen />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyScreen />} />
        <Route path="/terms-conditions" element={<TermsConditionsScreen />} />

        {/* Admin Login Route (standalone full screen) */}
        <Route path="/admin/login" element={<LoginScreen />} />

        {/* Admin Portal Nested Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="about" element={<AdminAbout />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="contact-settings" element={<AdminContactSettings />} />
        </Route>
      </Routes>
      {!isAdminRoute && <><Footer /><FloatingIcons /></>}
    </>
  );
}

function App() {
  return (
    <Router>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </Router>
  );
}

export default App;
