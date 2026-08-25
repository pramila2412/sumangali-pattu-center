import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen';
import AboutScreen from './pages/AboutScreen';
import ServicesScreen from './pages/ServicesScreen';
import ContactScreen from './pages/ContactScreen';
import GalleryScreen from './pages/GalleryScreen';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

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
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
