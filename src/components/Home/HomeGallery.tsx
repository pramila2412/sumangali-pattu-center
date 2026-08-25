import React from 'react';
import { Link } from 'react-router-dom';
import { GalleryData } from '../../data/GalleryData';

const HomeGallery = () => {
  return (
    <section className="py-20 lg:py-28 bg-[var(--background)] relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[var(--primary)] font-bold tracking-wider uppercase text-sm mb-2 block">
            {GalleryData.sectionInfo.tagline}
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[var(--heading)] mb-6">
            {GalleryData.sectionInfo.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GalleryData.categories.slice(0, 3).map((category) => (
            <Link 
              key={category.id} 
              to="/gallery"
              className="group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative border border-[var(--border)] block bg-white"
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
                  <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/gallery" className="inline-block bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-md hover:shadow-xl">
            View Full Gallery
          </Link>
        </div>
        
      </div>
    </section>
  );
};

export default HomeGallery;
