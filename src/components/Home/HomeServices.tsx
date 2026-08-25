import React from 'react';
import { Link } from 'react-router-dom';
import { ServicesData } from '../../data/ServicesData';

const HomeServices = () => {
  return (
    <section className="py-20 lg:py-28 bg-[var(--background-gold)] relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[var(--primary)] font-bold tracking-wider uppercase text-sm mb-2 block">
            What We Buy
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-[var(--heading)] mb-6">
            Expert Saree Evaluation & Exchange
          </h2>
          <p className="text-[var(--paragraph)] text-lg">
            We offer the best market value for your authentic and vintage silk sarees. Explore the types of sarees we buy below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {ServicesData.servicesList.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[var(--border)] hover:shadow-2xl transition-all duration-300 group flex flex-col">
              
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)]/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow relative bg-white">
                <h3 className="text-xl font-bold text-[var(--heading)] mb-3 pr-8 leading-tight">
                  <Link to={`/services/${service.id}`} className="hover:text-[var(--primary)] transition-colors">
                    {service.title}
                  </Link>
                </h3>
                
                <p className="text-[var(--paragraph)] text-sm mb-6 flex-grow line-clamp-3">
                  {service.subtitle}
                </p>
                
                <Link 
                  to={`/services/${service.id}`}
                  className="inline-flex items-center font-bold text-[var(--primary)] hover:text-[var(--secondary)] transition-colors"
                >
                  View Details <i className="bx bx-right-arrow-alt ml-2 text-xl"></i>
                </Link>
              </div>
              
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/services" className="inline-block bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-md hover:shadow-xl">
            View All Services
          </Link>
        </div>
        
      </div>
    </section>
  );
};

export default HomeServices;
