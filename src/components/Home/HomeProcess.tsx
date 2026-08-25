import React from 'react';
import { HomeProcessData } from '../../data/HomeData';

const HomeProcess = () => {
  return (
    <section className="py-20 lg:py-28 bg-[var(--background-maroon)] relative">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[var(--primary)] font-bold tracking-wider uppercase text-sm mb-2 block">
            {HomeProcessData.tagline}
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[var(--heading)]">
            {HomeProcessData.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {HomeProcessData.steps.map((step, idx) => (
            <div key={step.id} className="relative group h-full">
              {/* Connector Line (hidden on mobile) */}
              {idx !== HomeProcessData.steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-[2px] bg-[var(--border)] -z-10 group-hover:bg-[var(--secondary)] transition-colors duration-500"></div>
              )}
              
              <div className="h-full flex flex-col bg-white rounded-2xl p-8 shadow-sm border border-[var(--border)] hover:shadow-xl transition-all duration-300 text-center relative z-10 transform hover:-translate-y-2">
                <div className="w-20 h-20 mx-auto bg-[var(--background-gold)] rounded-full flex items-center justify-center text-[var(--secondary)] text-3xl mb-6 shadow-inner border border-[var(--gold-border)]">
                  <i className={`bx bx-${step.icon}`}></i>
                </div>
                
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-[var(--primary)] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                  0{step.id}
                </div>
                
                <h3 className="text-xl font-bold text-[var(--heading)] mb-4">{step.title}</h3>
                <p className="text-[var(--paragraph)]">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeProcess;
