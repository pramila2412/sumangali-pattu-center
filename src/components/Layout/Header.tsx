import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GlobalData } from '../../data/GlobalData';
import Logo from '../../assets/logo/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Top Header Bar */}
      <div className="bg-[var(--primary)] text-white/90 py-2 hidden md:block border-b border-white/10">
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center text-sm">
          <div className="flex space-x-6">
            <a href={`tel:${GlobalData.contactInfo.phone}`} className="hover:text-[var(--secondary)] transition-colors flex items-center">
              <i className="bx bxs-phone-call mr-2"></i> {GlobalData.contactInfo.phone}
            </a>
            <a href={`mailto:${GlobalData.contactInfo.email}`} className="hover:text-[var(--secondary)] transition-colors flex items-center">
              <i className="bx bxs-envelope mr-2"></i> {GlobalData.contactInfo.email}
            </a>
          </div>
          <div className="flex space-x-4">
            <a href={GlobalData.socialLinks.facebook} className="hover:text-[var(--secondary)] transition-colors"><i className="bx bxl-facebook text-lg"></i></a>
            <a href={GlobalData.socialLinks.twitter} className="hover:text-[var(--secondary)] transition-colors"><i className="bx bxl-twitter text-lg"></i></a>
            <a href={GlobalData.socialLinks.instagram} className="hover:text-[var(--secondary)] transition-colors"><i className="bx bxl-instagram text-lg"></i></a>
            <a href={GlobalData.socialLinks.linkedin} className="hover:text-[var(--secondary)] transition-colors"><i className="bx bxl-linkedin-square text-lg"></i></a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 lg:px-12 py-2 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Sumangali Pattu Center Logo" className="h-16 md:h-20 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8">
            {GlobalData.navLinks.map((link, idx) => (
              <div key={idx} className="relative group">
                <Link 
                  to={link.path} 
                  className={`font-semibold uppercase tracking-wide text-sm transition-colors py-2 flex items-center ${location.pathname === link.path ? 'text-[var(--primary)]' : 'text-[var(--heading)] hover:text-[var(--primary)]'}`}
                >
                  {link.name}
                  {link.dropdown && <i className="bx bx-chevron-down ml-1"></i>}
                </Link>
                
                {/* Dropdown menu */}
                {link.dropdown && (
                  <div className="absolute top-full left-0 mt-0 w-64 bg-white shadow-xl rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border-t-2 border-[var(--primary)]">
                    {link.dropdown.map((sublink, subIdx) => (
                      <Link 
                        key={subIdx} 
                        to={sublink.path} 
                        className="block px-6 py-3 text-sm font-medium text-[var(--paragraph)] hover:bg-[var(--background-maroon)] hover:text-[var(--primary)] transition-colors border-b border-gray-50 last:border-0"
                      >
                        {sublink.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Call to action button */}
          <div className="hidden lg:block">
            <a href={`tel:${GlobalData.contactInfo.phone}`} className="bg-[var(--secondary)] hover:bg-[var(--secondary-dark)] text-[var(--primary)] font-bold py-2.5 px-6 rounded-full transition-colors flex items-center shadow-md">
              <i className="bx bx-phone-call mr-2 text-xl"></i> Contact Us
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-3xl text-[var(--primary)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`bx ${isMenuOpen ? 'bx-x' : 'bx-menu'}`}></i>
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg">
            <div className="flex flex-col py-4 px-6 space-y-4">
              {GlobalData.navLinks.map((link, idx) => (
                <div key={idx}>
                  <Link 
                    to={link.path} 
                    className="block font-semibold text-[var(--heading)] hover:text-[var(--primary)]"
                    onClick={() => !link.dropdown && setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                  {link.dropdown && (
                    <div className="pl-4 mt-2 space-y-2 border-l-2 border-[var(--secondary-light)]">
                      {link.dropdown.map((sublink, subIdx) => (
                        <Link 
                          key={subIdx} 
                          to={sublink.path} 
                          className="block text-sm text-[var(--paragraph)] hover:text-[var(--primary)]"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {sublink.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-gray-100">
                <a href={`tel:${GlobalData.contactInfo.phone}`} className="w-full text-center inline-block bg-[var(--primary)] text-white font-bold py-3 px-6 rounded-lg">
                  Call Now
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
