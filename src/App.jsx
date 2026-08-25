import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/about" element={<AboutScreen />} />
        <Route path="/services/*" element={<ServicesScreen />} />
        <Route path="/contact" element={<ContactScreen />} />
        <Route path="/gallery" element={<GalleryScreen />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyScreen />} />
        <Route path="/terms-conditions" element={<TermsConditionsScreen />} />
      </Routes>
      <Footer />
      <FloatingIcons />
    </Router>
  );
}

export default App;
