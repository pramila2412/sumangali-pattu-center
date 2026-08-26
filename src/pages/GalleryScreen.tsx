import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { GalleryData } from '../data/GalleryData';
import BlurText from '../components/ReactBits/BlurText';
import FadeContent from '../components/ReactBits/FadeContent';
import bannerVid from '../assets/videos/vid1.mp4';

const GalleryScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<typeof GalleryData.categories[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle keyboard navigation for Lightbox
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedCategory) return;
    
    if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    } else if (e.key === 'Escape') {
      closeLightbox();
    }
  }, [selectedCategory, currentImageIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Disable scrolling when lightbox is open
  useEffect(() => {
    if (selectedCategory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedCategory]);

  const openLightbox = (category: typeof GalleryData.categories[0]) => {
    setSelectedCategory(category);
    setCurrentImageIndex(0);
  };

  const closeLightbox = () => {
    setSelectedCategory(null);
  };

  const nextImage = () => {
    if (selectedCategory) {
      setCurrentImageIndex((prev) => (prev === selectedCategory.images.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (selectedCategory) {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedCategory.images.length - 1 : prev - 1));
    }
  };

  return (
    <main>
      {/* Inner Banner Component */}
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
            <BlurText text={GalleryData.header.title} delay={40} />
          </h1>
          <FadeContent delay={300}>
            <ul className="flex items-center justify-center space-x-2 font-medium [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]">
              <li>
                <Link to="/" className="hover:text-[var(--secondary)] transition-colors">Home</Link>
              </li>
              <li><i className="bx bx-chevrons-right text-[var(--secondary)]"></i></li>
              <li className="text-[var(--secondary)]">{GalleryData.header.breadcrumb}</li>
            </ul>
          </FadeContent>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 lg:py-28 bg-[var(--background)]">
        <div className="container mx-auto px-6 lg:px-12">
          
          <FadeContent blur className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[var(--primary)] font-bold tracking-wider uppercase text-sm mb-2 block">
              {GalleryData.sectionInfo.tagline}
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--heading)] mb-6">
              {GalleryData.sectionInfo.title}
            </h2>
          </FadeContent>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {GalleryData.categories.map((category, idx) => (
              <FadeContent key={category.id} delay={idx * 150} duration={800}>
                <div 
                  onClick={() => openLightbox(category)}
                  className="group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative border border-[var(--border)] cursor-pointer bg-white"
                >
                  <div className="h-72 w-full overflow-hidden relative">
                    <img 
                      src={category.coverImage} 
                      alt={category.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--black)]/90 via-[var(--black)]/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Category Info Overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="bg-[var(--secondary)] text-[var(--primary-dark)] text-xs font-bold px-3 py-1 rounded-full inline-block mb-3 shadow-md">
                        {category.images.length} Photos
                      </div>
                      <h3 className="text-2xl font-bold font-['Playfair_Display'] mb-1">{category.title}</h3>
                      <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeContent>
            ))}
          </div>

        </div>
      </section>

      {/* Lightbox / Slider Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
          {/* Top Bar */}
          <div className="absolute top-0 left-0 w-full p-4 lg:p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/90 to-transparent">
            <div className="text-white ml-4">
              <h3 className="text-2xl lg:text-3xl font-bold font-['Playfair_Display'] text-[var(--secondary)] drop-shadow-md">{selectedCategory.title}</h3>
              <p className="text-sm font-medium tracking-widest text-white/80 uppercase mt-1">
                Image {currentImageIndex + 1} of {selectedCategory.images.length}
              </p>
            </div>
            <button 
              onClick={closeLightbox}
              className="flex items-center justify-center w-12 h-12 bg-white/10 hover:bg-[var(--primary)] text-white rounded-full transition-colors duration-200 backdrop-blur-md mr-4 focus:outline-none"
            >
              <i className="bx bx-x text-3xl"></i>
            </button>
          </div>

          {/* Previous Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 bg-white hover:bg-[var(--primary)] text-[var(--primary)] hover:text-white w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none z-50 shadow-lg"
          >
            <i className="bx bx-chevron-left text-4xl"></i>
          </button>

          {/* Current Image Viewer */}
          <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center p-6 lg:p-16" onClick={closeLightbox}>
            <div 
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                key={currentImageIndex} 
                src={selectedCategory.images[currentImageIndex]} 
                alt={`${selectedCategory.title} - ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-[fadeIn_0.4s_ease-out] ring-1 ring-white/10"
              />
            </div>
          </div>

          {/* Next Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 bg-white hover:bg-[var(--primary)] text-[var(--primary)] hover:text-white w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none z-50 shadow-lg"
          >
            <i className="bx bx-chevron-right text-4xl"></i>
          </button>

          {/* Thumbnail Strip (Bottom) */}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent hidden md:flex justify-center">
            <div className="flex space-x-2 overflow-x-auto py-2 px-4 scrollbar-hide">
              {selectedCategory.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                  className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 transition-all duration-300 focus:outline-none ${currentImageIndex === idx ? 'border-2 border-[var(--secondary)] scale-110 z-10' : 'opacity-50 hover:opacity-100 border border-transparent'}`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </main>
  );
};

export default GalleryScreen;
