import React, { useState, useEffect } from 'react';

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

  return (
    <section className="relative isolate h-[100svh] min-h-[36rem] w-full overflow-hidden bg-black">
      {/* Full-cover landscape images with crossfade */}
      {HomeBannerData.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
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
              {HomeBannerData[currentSlide].tagline}
            </p>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white mb-2">
            <BlurText 
              key={`title-${currentSlide}`} 
              text={HomeBannerData[currentSlide].title.replace(/\n/g, ' ')} 
              delay={30} 
            />
          </h1>

          {/* Description */}
          <div key={`desc-${currentSlide}`}>
            <FadeContent delay={300}>
              <p className="text-lg md:text-xl leading-relaxed max-w-2xl text-white/90">
                {HomeBannerData[currentSlide].description}
              </p>
            </FadeContent>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 bg-[var(--gold-button)] hover:bg-[var(--gold-button-hover)] text-[var(--gold-button-text)]">
              {HomeBannerData[currentSlide].primaryBtn}
            </button>
            <button className="font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white">
              {HomeBannerData[currentSlide].secondaryBtn}
            </button>
          </div>
        </div>
      </div>

   
    </section>
  );
};

export default HomeBanner;
