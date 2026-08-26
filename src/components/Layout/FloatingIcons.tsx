import React, { useState, useEffect } from 'react';
import { GlobalData } from '../../data/GlobalData';
import GoogleReview from '../../assets/logo/googlereview.webp';
const FloatingIcons = () => {
  const [isNearBottom, setIsNearBottom] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Keep the controls out of view until the visitor has moved 30% of a viewport.
      setIsVisible(window.scrollY >= window.innerHeight * 0.3);

      // Check if we are near the bottom of the page (within 300px)
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 300;
      
      setIsNearBottom(scrollPosition >= threshold && window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollClick = () => {
    if (isNearBottom) {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Scroll to bottom
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  // The primary contact number is managed in Admin > Contact Settings.
  // Accept both local Indian numbers and numbers entered with the +91 prefix.
  const primaryPhone = GlobalData.contactInfo.phone;
  const waNumber = primaryPhone.replace(/\D/g, '').replace(/^91/, '');
  const waLink = `https://wa.me/91${waNumber}`;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-center space-y-3 transition-all duration-300 ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      
      {/* Only channels added in Admin > Contact Settings are shown here. */}
      {(GlobalData.socialLinks.channels || []).map((social) => {
        const isGoogleReview = social.platform === 'Google Review';
        const background = social.platform === 'Facebook'
          ? 'bg-[#1877F2]'
          : social.platform === 'Instagram'
            ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'
            : 'bg-[var(--primary)]';

        return (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 ${isGoogleReview ? 'bg-white border border-gray-200 overflow-hidden' : `text-white ${background}`}`}
            title={isGoogleReview ? 'Review us on Google' : `Follow us on ${social.platform}`}
            aria-label={isGoogleReview ? 'Review Sumangali Pattu Center on Google' : `Visit us on ${social.platform}`}
          >
            {isGoogleReview ? (
              <img src={GoogleReview} alt="Google Review" className="w-full h-full object-contain p-1" />
            ) : (
              <i className={`bx ${social.icon} text-2xl`}></i>
            )}
          </a>
        );
      })}

      {/* WhatsApp */}
      <a 
        href={waLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-all duration-300 bg-[#25D366]"
        title="Chat on WhatsApp"
      >
        <i className="bx bxl-whatsapp text-3xl"></i>
      </a>

      {/* Phone */}
      <a 
        href={`tel:${primaryPhone}`}
        className="w-12 h-12 rounded-full flex items-center justify-center text-[var(--secondary)] shadow-lg transform hover:scale-110 transition-all duration-300 bg-[var(--primary)] border border-[var(--secondary)]/30"
        title="Call Us"
      >
        <i className="bx bxs-phone-call text-2xl"></i>
      </a>

      {/* Scroll Up/Down Button */}
      <button 
        onClick={handleScrollClick}
        className="w-12 h-12 rounded-full flex items-center justify-center text-[var(--primary-dark)] shadow-lg transform hover:scale-110 transition-all duration-300 bg-[var(--background-gold)] border border-[var(--border)] mt-2"
        title={isNearBottom ? "Scroll to Top" : "Scroll to Bottom"}
      >
        <i className={`bx ${isNearBottom ? 'bx-up-arrow-alt' : 'bx-down-arrow-alt'} text-2xl font-bold`}></i>
      </button>

    </div>
  );
};

export default FloatingIcons;
