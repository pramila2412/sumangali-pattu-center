import React from 'react';
import { Link } from 'react-router-dom';
import ctaImg from '../../assets/saree/saree5.jpg';

const HomeCTA = () => {
  return (
    <div className="py-20 lg:py-28 bg-[var(--background-gold)] relative overflow-hidden">
      {/* Abstract Background shapes */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-[var(--secondary)] fill-current">
          <path d="M0 100 C 20 0 50 0 100 100 Z"></path>
        </svg>
      </div>
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="bg-[var(--primary)] rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center">
          <div className="lg:w-7/12 p-10 lg:p-16 space-y-6">
            <span className="text-[var(--secondary)] font-bold uppercase tracking-wider text-sm">
              We Help You Sell Your Old Silk Sarees
            </span>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight">
              Sell Your Sarees Hassle-Free with the Best Market Value
            </h2>
            <p className="text-white/80 text-lg max-w-xl">
              Get Instant Cash for Your Old Kanchipuram, Banarasi & Mysore Sarees! Reach out to our experts for a quick and free evaluation.
            </p>
            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <Link to="/contact" className="inline-flex items-center bg-[var(--gold-button)] hover:bg-[var(--gold-button-hover)] text-[var(--gold-button-text)] font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                Contact Us Now <i className="bx bx-chevron-right ml-1 text-xl"></i>
              </Link>
              <a href="tel:9944118349" className="inline-flex items-center bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20">
                <i className="bx bx-phone-call mr-2 text-xl text-[var(--secondary)]"></i> Call: 9944118349
              </a>
            </div>
          </div>
          
          <div className="lg:w-5/12 w-full h-64 lg:h-auto self-stretch">
            <img 
              src={ctaImg} 
              alt="Silk Fabric" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCTA;
