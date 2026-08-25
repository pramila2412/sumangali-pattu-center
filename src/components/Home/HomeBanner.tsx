import React, { useState, useEffect } from 'react';
import vid1 from '../../assets/videos/vid1.mp4';
import vid2 from '../../assets/videos/vid2.mp4';
import vid3 from '../../assets/videos/vid3.mp4';
import { HomeBannerData } from '../../data/HomeData';

const HomeBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const vids = [vid1, vid2, vid3];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HomeBannerData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Videos with Crossfade */}
      {HomeBannerData.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'
          }`}
        >
          <video
            src={vids[index]}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
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
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight whitespace-pre-line text-white">
            {HomeBannerData[currentSlide].title}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl leading-relaxed max-w-2xl text-white/90">
            {HomeBannerData[currentSlide].description}
          </p>

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

   
    </div>
  );
};

export default HomeBanner;
