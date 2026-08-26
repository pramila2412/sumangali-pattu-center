import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HomeBannerData } from '../../data/HomeData';
import BlurText from '../ReactBits/BlurText';
import FadeContent from '../ReactBits/FadeContent';

const HomeBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HomeBannerData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = HomeBannerData[currentSlide];

  return (
    <section className="relative isolate h-[100svh] min-h-[36rem] w-full overflow-hidden bg-black">
      {/* Full-cover landscape images with crossfade */}
      {HomeBannerData.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={s.image}
            alt="Sumangali Pattu Center silk saree collection"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Dark Overlay for Text Legibility */}
          <div className="home-banner__overlay absolute inset-0" />
        </div>
      ))}

      {/* Main Content Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-center">
        <div className="max-w-3xl space-y-8 animate-fadeIn">
          
          {/* Pill Tagline */}
          <div className="inline-block px-6 py-2 rounded-full shadow-lg bg-white/10 backdrop-blur-sm border border-white/20">
            <p className="font-semibold text-sm md:text-base text-white">
              {slide.tagline}
            </p>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white mb-2">
            <BlurText 
              key={`title-${currentSlide}`} 
              text={slide.title.replace(/\n/g, ' ')} 
              delay={30} 
            />
          </h1>

          {/* Description */}
          <div key={`desc-${currentSlide}`}>
            <FadeContent delay={300}>
              <p className="text-lg md:text-xl leading-relaxed max-w-2xl text-white/90">
                {slide.description}
              </p>
            </FadeContent>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            {slide.primaryLink.startsWith('/') ? (
              <Link 
                to={slide.primaryLink}
                className="inline-flex items-center justify-center font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 bg-[var(--gold-button)] hover:bg-[var(--gold-button-hover)] text-[var(--gold-button-text)] shadow-lg"
              >
                {slide.primaryBtn} <i className="bx bx-chevron-right ml-1 text-xl"></i>
              </Link>
            ) : (
              <a 
                href={slide.primaryLink}
                className="inline-flex items-center justify-center font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 bg-[var(--gold-button)] hover:bg-[var(--gold-button-hover)] text-[var(--gold-button-text)] shadow-lg"
              >
                {slide.primaryBtn} <i className="bx bx-chevron-right ml-1 text-xl"></i>
              </a>
            )}

            {slide.secondaryLink.startsWith('/') ? (
              <Link 
                to={slide.secondaryLink}
                className="inline-flex items-center justify-center font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white"
              >
                {slide.secondaryBtn}
              </Link>
            ) : (
              <a 
                href={slide.secondaryLink}
                className="inline-flex items-center justify-center font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white"
              >
                <i className="bx bx-phone-call mr-2 text-xl text-[var(--secondary)]"></i> {slide.secondaryBtn}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
