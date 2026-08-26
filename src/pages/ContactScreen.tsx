import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ContactData } from '../data/ContactData';
import bannerVid from '../assets/videos/vid2.mp4';

const ContactScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle API submission here
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after a delay
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    }, 5000);
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
          <h1 className="mb-4 font-['Playfair_Display'] text-4xl font-extrabold leading-tight [text-shadow:0_2px_14px_rgba(0,0,0,0.65)] md:text-5xl">{ContactData.header.title}</h1>
          <ul className="flex items-center justify-center space-x-2 font-medium [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]">
            <li>
              <Link to="/" className="hover:text-[var(--secondary)] transition-colors">Home</Link>
            </li>
            <li><i className="bx bx-chevrons-right text-[var(--secondary)]"></i></li>
            <li className="text-[var(--secondary)]">{ContactData.header.breadcrumb}</li>
          </ul>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-[var(--background)]">
        <div className="container mx-auto px-6 lg:px-12">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[var(--heading)] mb-6">
              {ContactData.form.title}
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Side: Contact Info */}
            <div className="lg:w-1/3 space-y-8">
              <div>
                <span className="text-[var(--primary)] font-bold tracking-wider uppercase text-sm mb-2 block">
                  Contact Info
                </span>
                <h3 className="text-3xl font-bold text-[var(--heading)] mb-4">
                  {ContactData.sectionInfo.title}
                </h3>
                <p className="text-[var(--paragraph)] mb-8">
                  {ContactData.sectionInfo.description}
                </p>
              </div>

              <div className="space-y-6">
                {ContactData.contactDetails.map((detail) => (
                  <div key={detail.id} className="flex items-start bg-white p-6 rounded-xl shadow-sm border border-[var(--border)] hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-[var(--background-gold)] rounded-full flex items-center justify-center text-[var(--primary)] text-2xl shrink-0 mr-4">
                      <i className={`bx bx${detail.icon === 'map' ? 's' : ''}-${detail.icon}`}></i>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[var(--heading)] mb-2">{detail.title}</h4>
                      {detail.link ? (
                        <a href={detail.link} className="text-[var(--paragraph)] hover:text-[var(--primary)] transition-colors font-medium break-all">
                          {detail.value}
                        </a>
                      ) : (
                        <span className="text-[var(--paragraph)] leading-relaxed">
                          {detail.value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Contact Form */}
            <div className="lg:w-2/3">
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-[var(--border)]">
                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-8 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                    <i className="bx bx-check-circle text-6xl text-green-500 mb-4"></i>
                    <h3 className="text-2xl font-bold mb-2">Message Sent Successfully!</h3>
                    <p className="text-lg">{ContactData.form.successMessage}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-bold text-[var(--heading)] mb-2">Your Name <span className="text-[var(--primary)]">*</span></label>
                        <input 
                          type="text" 
                          id="name" 
                          name="name" 
                          value={formData.name}
                          onChange={handleChange}
                          required 
                          className="w-full px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      {/* Phone */}
                      <div>
                        <label htmlFor="phone" className="block text-sm font-bold text-[var(--heading)] mb-2">Phone Number <span className="text-[var(--primary)]">*</span></label>
                        <input 
                          type="tel" 
                          id="phone" 
                          name="phone" 
                          value={formData.phone}
                          onChange={handleChange}
                          required 
                          className="w-full px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                          placeholder="+91 98765 43210"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-bold text-[var(--heading)] mb-2">Your Email <span className="text-[var(--primary)]">*</span></label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          value={formData.email}
                          onChange={handleChange}
                          required 
                          className="w-full px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                          placeholder="johndoe@example.com"
                        />
                      </div>

                      {/* Subject */}
                      <div>
                        <label htmlFor="subject" className="block text-sm font-bold text-[var(--heading)] mb-2">Your Subject <span className="text-[var(--primary)]">*</span></label>
                        <input 
                          type="text" 
                          id="subject" 
                          name="subject" 
                          value={formData.subject}
                          onChange={handleChange}
                          required 
                          className="w-full px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                          placeholder="Saree Evaluation"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-bold text-[var(--heading)] mb-2">Your Message <span className="text-[var(--primary)]">*</span></label>
                      <textarea 
                        id="message" 
                        name="message" 
                        value={formData.message}
                        onChange={handleChange}
                        required 
                        rows={6}
                        className="w-full px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all resize-none"
                        placeholder="Please provide details about the sarees you wish to sell..."
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center pt-4">
                      <button 
                        type="submit" 
                        className="inline-flex items-center justify-center bg-[var(--secondary)] hover:bg-[var(--secondary-dark)] text-[var(--primary)] font-bold text-lg py-4 px-10 rounded-full transition-all transform hover:-translate-y-1 shadow-lg w-full md:w-auto"
                      >
                        {ContactData.form.buttonText} <i className="bx bx-chevron-right ml-2 text-2xl -mr-2"></i>
                      </button>
                    </div>

                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactScreen;
