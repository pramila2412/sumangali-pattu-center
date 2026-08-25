import React, { useEffect } from 'react';
import { Link, Routes, Route, useParams, useLocation } from 'react-router-dom';
import { ServicesData } from '../data/ServicesData';
import HomeServices from '../components/Home/HomeServices';
import bannerVid from '../assets/videos/vid2.mp4';

// Inner Banner Component
const ServicesBanner = ({ title, breadcrumb }: { title: string, breadcrumb: string }) => (
  <div className="relative py-32 md:py-44 text-center text-white overflow-hidden bg-black flex flex-col justify-center min-h-[350px] lg:min-h-[450px]">
    <video
      src={bannerVid}
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black/60 pointer-events-none z-10"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/40 to-transparent pointer-events-none z-10"></div>
    <div className="container mx-auto px-6 relative z-10">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-['Playfair_Display']">{title}</h1>
      <ul className="flex justify-center items-center space-x-2 font-medium">
        <li>
          <Link to="/" className="hover:text-[var(--secondary)] transition-colors">Home</Link>
        </li>
        <li><i className="bx bx-chevrons-right text-[var(--secondary)]"></i></li>
        <li className="text-[var(--secondary)]">{breadcrumb}</li>
      </ul>
    </div>
  </div>
);

// Detail Component
const ServiceDetail = () => {
  const { id } = useParams();
  const service = ServicesData.servicesList.find(s => s.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!service) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold text-[var(--heading)]">Service Not Found</h2>
        <Link to="/services" className="mt-4 inline-block text-[var(--primary)] hover:underline">Back to Services</Link>
      </div>
    );
  }

  return (
    <div>
      <ServicesBanner title={service.title} breadcrumb={service.title} />
      
      <section className="py-20 lg:py-28 bg-[var(--background)]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="mb-8">
                <span className="inline-block bg-[var(--background-gold)] text-[var(--secondary-dark)] font-semibold px-4 py-1.5 rounded-full text-sm mb-4 border border-[var(--gold-border)]">
                  {service.title}
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-[var(--heading)] leading-tight">
                  {service.subtitle}
                </h2>
              </div>
              
              <div className="space-y-4 text-lg text-[var(--paragraph)] leading-relaxed">
                <p>{service.description1}</p>
                <p>{service.description2}</p>
              </div>
              
              <ul className="mt-8 space-y-3">
                {service.points.map((point, idx) => (
                  <li key={idx} className="flex items-start text-[var(--paragraph)] font-medium">
                    <i className="bx bx-check-circle text-[var(--primary)] text-xl mr-3 mt-0.5"></i>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[var(--background-maroon)]">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <p className="text-[var(--paragraph)] text-lg leading-relaxed">
              {service.description3}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

// Index Component
const ServicesIndex = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <ServicesBanner title={ServicesData.header.title} breadcrumb={ServicesData.header.breadcrumb} />
      
      <div className="py-20 lg:py-28 bg-[var(--background)]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {ServicesData.servicesList.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[var(--border)] group flex flex-col h-full">
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-dark)]/80 to-transparent"></div>
                  <h3 className="absolute bottom-6 left-6 text-2xl font-bold text-white z-10">{service.title}</h3>
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <p className="text-[var(--paragraph)] mb-6 flex-grow">{service.description1.substring(0, 150)}...</p>
                  <Link 
                    to={`/services/${service.id}`} 
                    className="inline-flex items-center text-[var(--primary)] font-bold hover:text-[var(--secondary)] transition-colors"
                  >
                    Read More <i className="bx bx-right-arrow-alt ml-2 text-xl"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Include the generic 4-column services area */}
      <HomeServices />
    </div>
  );
};

const ServicesScreen = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<ServicesIndex />} />
        <Route path="/:id" element={<ServiceDetail />} />
      </Routes>
    </main>
  );
};

export default ServicesScreen;
