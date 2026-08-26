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
            <a href={GlobalData.socialLinks.instagram} className="hover:text-[var(--secondary)] transition-colors"><i className="bx bxl-instagram text-lg"></i></a>
            <a href={GlobalData.socialLinks.linkedin} className="hover:text-[var(--secondary)] transition-colors"><i className="bx bxl-linkedin-square text-lg"></i></a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-2 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
            <img src={Logo} alt="Sumangali Pattu Center Logo" className="h-14 md:h-20 w-auto object-contain" />
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

          {/* Mobile actions */}
          <div className="lg:hidden flex items-center gap-2">
            <a
              href={`tel:${GlobalData.contactInfo.phone}`}
              className="h-10 px-3 rounded-full bg-[var(--primary)] text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
              aria-label="Call Sumangali Pattu Center"
            >
              <i className="bx bxs-phone-call text-base"></i>
              Call
            </a>
            <button
              type="button"
              className="h-10 w-10 rounded-full bg-[var(--background-gold)] border border-[var(--gold-border)] text-[var(--primary)] flex items-center justify-center text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
            >
              <i className={`bx ${isMenuOpen ? 'bx-x' : 'bx-menu'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full inset-x-0 bg-[var(--background)] border-t border-[var(--gold-border)] shadow-xl">
            <div className="max-h-[calc(100vh-72px)] overflow-y-auto px-4 py-5">
              <p className="px-2 mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--secondary-dark)]">Explore Sumangali</p>
              <div className="grid grid-cols-2 gap-2">
              {GlobalData.navLinks.filter((link) => !link.dropdown).map((link, idx) => (
                <Link
                  key={idx}
                  to={link.path}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${location.pathname === link.path ? 'bg-[var(--primary)] text-white' : 'bg-white text-[var(--heading)] border border-[var(--border)]'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              </div>

              {GlobalData.navLinks.filter((link) => link.dropdown).map((link, idx) => (
                <div key={idx} className="mt-4 rounded-xl bg-white border border-[var(--border)] overflow-hidden">
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="font-semibold text-[var(--heading)]">{link.name}</span>
                    <i className="bx bx-chevron-down text-xl text-[var(--primary)]"></i>
                  </div>
                  <div className="border-t border-[var(--border)] px-2 py-2">
                  {link.dropdown && (
                    <div className="grid grid-cols-2 gap-1">
                      {link.dropdown.map((sublink, subIdx) => (
                        <Link
                          key={subIdx}
                          to={sublink.path}
                          className="rounded-lg px-2 py-2 text-xs leading-snug font-medium text-[var(--paragraph)] hover:bg-[var(--background-maroon)] hover:text-[var(--primary)] transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {sublink.name.replace('Old ', '')}
                        </Link>
                      ))}
                    </div>
                  )}
                  </div>
                </div>
              ))}

              <div className="mt-5 rounded-xl bg-[var(--primary)] p-4 text-white">
                <p className="text-xs text-white/75">Need a quick valuation?</p>
                <a href={`tel:${GlobalData.contactInfo.phone}`} className="mt-1 flex items-center justify-between font-bold" onClick={() => setIsMenuOpen(false)}>
                  <span>Call {GlobalData.contactInfo.phone}</span>
                  <i className="bx bx-right-arrow-alt text-2xl"></i>
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
