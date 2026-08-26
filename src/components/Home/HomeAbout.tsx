import React from 'react';
import { HomeAboutData } from '../../data/HomeData';
import FadeContent from '../ReactBits/FadeContent';
import SplitText from '../ReactBits/SplitText';
import model1 from '../../assets/saree/model1.avif';
import model2 from '../../assets/saree/model2.avif';
import model3 from '../../assets/saree/model3.avif';

const HomeAbout = () => {
  return (
    <div className="py-20 lg:py-28 bg-[var(--background)]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* Content Left */}
          <div className="lg:w-1/2 space-y-6">
            <FadeContent blur duration={800}>
              <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--background-maroon)] border border-[var(--primary-light)] text-[var(--primary)] font-semibold text-sm mb-2">
                {HomeAboutData.experience}
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight text-[var(--heading)] mb-4 mt-2">
                <SplitText text={HomeAboutData.title} delay={50} />
              </h2>
              
              <p className="text-lg text-[var(--paragraph)] leading-relaxed">
                {HomeAboutData.description}
              </p>
            </FadeContent>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              {HomeAboutData.features.map((feature, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--border)] hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--background-gold)] text-[var(--secondary)] mb-4 text-2xl">
                    <i className={`bx ${feature.icon === 'flaticon-practice' ? 'bx-check-shield' : 'bx-time-five'}`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--heading)] mb-2">{feature.title}</h3>
                  <p className="text-[var(--paragraph)] text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Images Right - Collage */}
          <div className="lg:w-1/2 w-full mt-16 lg:mt-0">
            <div className="grid grid-cols-2 gap-4 lg:gap-6 relative">
              {/* Left Column of Collage */}
              <div className="space-y-4 lg:space-y-6 pt-12">
                <img 
                  src={model2} 
                  alt="Silk Saree Model" 
                  className="w-full h-48 md:h-64 object-cover rounded-3xl shadow-lg border-2 border-[var(--background-gold)] hover:scale-105 transition-transform duration-500" 
                />
                <img 
                  src={model3} 
                  alt="Silk Saree Details" 
                  className="w-full h-40 md:h-56 object-cover rounded-3xl shadow-lg border-2 border-[var(--background-gold)] hover:scale-105 transition-transform duration-500" 
                />
              </div>
              
              {/* Right Column of Collage */}
              <div className="space-y-4 lg:space-y-6">
                <img 
                  src={model1} 
                  alt="Elegant Pattu Saree" 
                  className="w-full h-64 md:h-80 object-cover rounded-3xl shadow-2xl border-4 border-[var(--primary)] hover:scale-105 transition-transform duration-500" 
                />
                
                {/* Stats Badge */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-[var(--primary)] flex flex-col items-center justify-center -ml-8 md:-ml-12 relative z-10 animate-bounce-slow">
                  <h3 className="text-3xl lg:text-4xl font-extrabold text-[var(--primary)] mb-1">{HomeAboutData.stats.number}</h3>
                  <span className="text-xs md:text-sm font-semibold text-[var(--muted)] text-center">{HomeAboutData.stats.text}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default HomeAbout;
