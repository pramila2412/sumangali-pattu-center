import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AboutData } from '../data/AboutData';
import { GlobalData } from '../data/GlobalData';
import HomeAbout from '../components/Home/HomeAbout';
import HomeServices from '../components/Home/HomeServices';
import HomeProcess from '../components/Home/HomeProcess';
import BlurText from '../components/ReactBits/BlurText';
import FadeContent from '../components/ReactBits/FadeContent';
import bannerVid from '../assets/videos/vid1.mp4';

const AboutScreen = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <main>
      {/* Inner Banner */}
      <section className="relative isolate flex min-h-[320px] items-center justify-center overflow-hidden bg-black py-24 text-center text-white sm:min-h-[380px] sm:py-32 lg:min-h-[460px] lg:py-40">
        <video
          src={bannerVid}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 -z-10 bg-black/55 pointer-events-none"></div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--primary)]/60 via-black/35 to-black/65 pointer-events-none"></div>
        
        <div className="container relative z-10 mx-auto px-6">
          <h1 className="mb-4 font-['Playfair_Display'] text-4xl font-extrabold leading-tight [text-shadow:0_2px_14px_rgba(0,0,0,0.65)] md:text-5xl">
            <BlurText text={AboutData.header.title} delay={40} />
          </h1>
          <FadeContent delay={300}>
            <ul className="flex items-center justify-center space-x-2 font-medium [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]">
              <li>
                <Link to="/" className="hover:text-[var(--secondary)] transition-colors">Home</Link>
              </li>
              <li><i className="bx bx-chevrons-right text-[var(--secondary)]"></i></li>
              <li className="text-[var(--secondary)]">{AboutData.header.breadcrumb}</li>
            </ul>
          </FadeContent>
        </div>
      </section>

      {/* About Section from Home */}
      <HomeAbout />

      {/* Marquee */}
      <div className="bg-[var(--primary)] text-white py-4 border-y-4 border-[var(--secondary)] font-bold text-lg md:text-xl overflow-hidden whitespace-nowrap">
        <marquee behavior="scroll" direction="left" scrollamount="8">
          <strong className="text-[var(--secondary)] mr-2">Address:</strong>  
          {GlobalData.contactInfo.address}
        </marquee>
      </div>

      {/* Counter Area */}
      <section className="py-20 lg:py-28 bg-[var(--background-maroon)] relative">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <FadeContent blur className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[var(--primary)] font-semibold tracking-wider uppercase text-sm mb-2 block">
              {AboutData.stats.title}
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--heading)] mb-6">
              {AboutData.stats.subtitle}
            </h2>
            <p className="text-[var(--paragraph)] text-lg">
              {AboutData.stats.description}
            </p>
          </FadeContent>

          <div className="overflow-hidden w-full relative -mx-4 px-4 sm:mx-0 sm:px-0">
            {/* Gradient masks for smooth fade effect at edges */}
            <div className="absolute inset-y-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-[var(--background-maroon)] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-[var(--background-maroon)] to-transparent z-10 pointer-events-none"></div>
            
            <div className="animate-carousel gap-6 sm:gap-8 pr-6 sm:pr-8 py-4">
              {[...AboutData.stats.counters, ...AboutData.stats.counters, ...AboutData.stats.counters, ...AboutData.stats.counters].map((counter, idx) => (
                <div key={`${counter.id}-${idx}`} className="w-[280px] sm:w-[320px] shrink-0 bg-white rounded-2xl p-8 shadow-sm border border-[var(--border)] text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="w-20 h-20 mx-auto bg-[var(--background-gold)] rounded-full flex items-center justify-center text-[var(--secondary)] text-4xl mb-6 shadow-inner group-hover:bg-[var(--primary)] group-hover:text-white transition-colors duration-300">
                    <i className={`bx bx-${counter.icon}`}></i>
                  </div>
                  <h3 className="text-4xl font-extrabold text-[var(--primary)] mb-2">{counter.number}</h3>
                  <span className="font-semibold text-[var(--heading)]">{counter.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section from Home */}
      <HomeServices />

      {/* Working Process from Home */}
      <HomeProcess />

      {/* FAQ Section */}
      <section className="py-20 lg:py-28 bg-[var(--background)]">
        <div className="container mx-auto px-6 lg:px-12">
          <FadeContent blur className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--heading)] mb-6">
              {AboutData.faq.title}
            </h2>
            <p className="text-[var(--paragraph)] text-lg">
              {AboutData.faq.subtitle}
            </p>
          </FadeContent>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Left Column (First Half of FAQs) */}
            <div className="space-y-4">
              {AboutData.faq.questions.slice(0, 4).map((faq, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
                  <button 
                    className="w-full text-left px-6 py-5 font-bold text-[var(--heading)] flex justify-between items-center hover:bg-[var(--background-gold)] transition-colors focus:outline-none"
                    onClick={() => toggleFaq(idx)}
                  >
                    <span>{faq.question}</span>
                    <span className={`ml-4 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--background-gold)] text-[var(--primary)] transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} aria-hidden="true">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-96 py-5 border-t border-[var(--border)]' : 'max-h-0'}`}
                  >
                    <p className="text-[var(--paragraph)]">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column (Second Half of FAQs) */}
            <div className="space-y-4">
              {AboutData.faq.questions.slice(4).map((faq, idx) => {
                const globalIdx = idx + 4;
                return (
                  <div key={globalIdx} className="bg-white rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
                    <button 
                      className="w-full text-left px-6 py-5 font-bold text-[var(--heading)] flex justify-between items-center hover:bg-[var(--background-gold)] transition-colors focus:outline-none"
                      onClick={() => toggleFaq(globalIdx)}
                    >
                      <span>{faq.question}</span>
                      <span className={`ml-4 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--background-gold)] text-[var(--primary)] transition-transform duration-300 ${openFaq === globalIdx ? 'rotate-180' : ''}`} aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </span>
                    </button>
                    <div 
                      className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === globalIdx ? 'max-h-96 py-5 border-t border-[var(--border)]' : 'max-h-0'}`}
                    >
                      <p className="text-[var(--paragraph)]">{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default AboutScreen;
