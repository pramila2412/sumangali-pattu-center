import React from 'react';
import { Link } from 'react-router-dom';
import { GlobalData } from '../../data/GlobalData';
import Logo from '../../assets/logo/logo.png';

const Footer = () => {
  return (
    <footer className="bg-[var(--black)] pt-20 pb-6 text-white/80">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* About Widget */}
          <div>
            <div className="mb-6">
              <img src={Logo} alt="Sumangali Pattu Center Logo" className="h-24 w-auto object-contain" />
            </div>
            <p className="mb-6 leading-relaxed">
              {GlobalData.footer.about}
            </p>
            <div className="flex space-x-4">
              <a href={GlobalData.socialLinks.facebook} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--secondary)] hover:text-[var(--primary)] transition-all">
                <i className="bx bxl-facebook text-xl"></i>
              </a>
              <a href={GlobalData.socialLinks.instagram} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--secondary)] hover:text-[var(--primary)] transition-all">
                <i className="bx bxl-instagram text-xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 font-['Playfair_Display'] border-b border-white/20 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-3">
              {GlobalData.navLinks.filter(l => !l.dropdown).map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="hover:text-[var(--secondary)] transition-colors flex items-center">
                    <i className="bx bx-chevron-right text-[var(--secondary)] mr-2"></i> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 font-['Playfair_Display'] border-b border-white/20 pb-2 inline-block">Our Services</h3>
            <ul className="space-y-3">
              {GlobalData.navLinks.find(l => l.name === 'Services')?.dropdown?.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="hover:text-[var(--secondary)] transition-colors flex items-center">
                    <i className="bx bx-chevron-right text-[var(--secondary)] mr-2"></i> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 font-['Playfair_Display'] border-b border-white/20 pb-2 inline-block">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <i className="bx bx-map text-[var(--secondary)] text-2xl mr-3 mt-1"></i>
                <span>{GlobalData.contactInfo.address}</span>
              </li>
              <li className="flex items-center">
                <i className="bx bx-phone-call text-[var(--secondary)] text-2xl mr-3"></i>
                <a href={`tel:${GlobalData.contactInfo.phone}`} className="hover:text-[var(--secondary)] transition-colors">{GlobalData.contactInfo.phone}</a>
              </li>
              <li className="flex items-center">
                <i className="bx bx-envelope text-[var(--secondary)] text-2xl mr-3"></i>
                <a href={`mailto:${GlobalData.contactInfo.email}`} className="hover:text-[var(--secondary)] transition-colors">{GlobalData.contactInfo.email}</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 text-center text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>{GlobalData.footer.copyright}</p>
          <div className="flex space-x-6 text-white/60">
            <Link to="/privacy-policy" className="hover:text-[var(--secondary)] transition-colors">Privacy Policy</Link>
            <Link to="/terms-conditions" className="hover:text-[var(--secondary)] transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
