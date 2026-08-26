import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AboutData } from '../data/AboutData';
import HomeAbout from '../components/Home/HomeAbout';
import HomeServices from '../components/Home/HomeServices';
import HomeProcess from '../components/Home/HomeProcess';
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
          <h1 className="mb-4 font-['Playfair_Display'] text-4xl font-extrabold leading-tight [text-shadow:0_2px_14px_rgba(0,0,0,0.65)] md:text-5xl">{AboutData.header.title}</h1>
          <ul className="flex items-center justify-center space-x-2 font-medium [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]">
            <li>
              <Link to="/" className="hover:text-[var(--secondary)] transition-colors">Home</Link>
            </li>
            <li><i className="bx bx-chevrons-right text-[var(--secondary)]"></i></li>
            <li className="text-[var(--secondary)]">{AboutData.header.breadcrumb}</li>
          </ul>
        </div>
      </section>

      {/* About Section from Home */}
      <HomeAbout />

      {/* Marquee */}
      <div className="bg-[var(--primary)] text-white py-4 border-y-4 border-[var(--secondary)] font-bold text-lg md:text-xl overflow-hidden whitespace-nowrap">
        <marquee behavior="scroll" direction="left" scrollamount="8">
          <strong className="text-[var(--secondary)] mr-2">Address:</strong>  
          No.13 4th Main Road Nanganallur Chennai-6000061 
        </marquee>
      </div>

      {/* Counter Area */}
      <section className="py-20 lg:py-28 bg-[var(--background-maroon)] relative">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[var(--primary)] font-semibold tracking-wider uppercase text-sm mb-2 block">
              {AboutData.stats.title}
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--heading)] mb-6">
              {AboutData.stats.subtitle}
            </h2>
            <p className="text-[var(--paragraph)] text-lg">
              {AboutData.stats.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {AboutData.stats.counters.map((counter) => (
              <div key={counter.id} className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--border)] text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-20 h-20 mx-auto bg-[var(--background-gold)] rounded-full flex items-center justify-center text-[var(--secondary)] text-4xl mb-6 shadow-inner group-hover:bg-[var(--primary)] group-hover:text-white transition-colors duration-300">
                  <i className={`bx bx-${counter.icon}`}></i>
                </div>
                <h3 className="text-4xl font-extrabold text-[var(--primary)] mb-2">{counter.number}</h3>
                <span className="font-semibold text-[var(--heading)]">{counter.text}</span>
              </div>
            ))}
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
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--heading)] mb-6">
              {AboutData.faq.title}
            </h2>
            <p className="text-[var(--paragraph)] text-lg">
              {AboutData.faq.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Left Column (First Half of FAQs) */}
            <div className="space-y-4">
              {AboutData.faq.questions.slice(0, 4).map((faq, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
                  <button 
                    className="w-full text-left px-6 py-5 font-bold text-[var(--heading)] flex justify-between items-center hover:bg-[var(--background-gold)] transition-colors focus:outline-none"
                    onClick={() => toggleFaq(idx)}
                  >
                    {faq.question}
                    <i className={`bx ${openFaq === idx ? 'bx-minus' : 'bx-plus'} text-2xl text-[var(--primary)]`}></i>
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
                      {faq.question}
                      <i className={`bx ${openFaq === globalIdx ? 'bx-minus' : 'bx-plus'} text-2xl text-[var(--primary)]`}></i>
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
