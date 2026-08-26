import React from 'react';
import { Link } from 'react-router-dom';
import { ServicesData } from '../../data/ServicesData';
import { GalleryData } from '../../data/GalleryData';
import { AboutData } from '../../data/AboutData';
import { GlobalData } from '../../data/GlobalData';

export const AdminDashboard: React.FC = () => {
  const totalServices = ServicesData.servicesList.length;
  const totalCollections = GalleryData.categories.length;
  const totalPhotos = GalleryData.categories.reduce((acc, cat) => acc + cat.images.length, 0);
  const totalFaqs = AboutData.faq.questions.length;
  const totalCounters = AboutData.stats.counters.length;

  const statsCards = [
    {
      title: 'Active Services',
      value: totalServices,
      subtitle: 'Dynamic service pages',
      icon: 'bxs-shopping-bag',
      color: 'from-[#6A0F1F] to-[#91182D]',
      textColor: 'text-[#6A0F1F]',
      bgColor: 'bg-[#6A0F1F]/10',
      link: '/admin/services',
      actionText: 'Manage Services'
    },
    {
      title: 'Gallery Collections',
      value: totalCollections,
      subtitle: `${totalPhotos} photos total`,
      icon: 'bxs-photo-album',
      color: 'from-[#A37E39] to-[#D9AD5B]',
      textColor: 'text-[#A37E39]',
      bgColor: 'bg-[#D9AD5B]/15',
      link: '/admin/gallery',
      actionText: 'Manage Gallery'
    },
    {
      title: 'FAQs & Story Items',
      value: totalFaqs,
      subtitle: `${totalCounters} business counters`,
      icon: 'bxs-help-circle',
      color: 'from-[#2B4C7E] to-[#4A7BB0]',
      textColor: 'text-[#2B4C7E]',
      bgColor: 'bg-[#2B4C7E]/10',
      link: '/admin/about',
      actionText: 'Edit About Us'
    },
    {
      title: 'Contact & Socials',
      value: 'Synced',
      subtitle: 'Header & Footer common info',
      icon: 'bxs-phone-call',
      color: 'from-[#2E7D32] to-[#43A047]',
      textColor: 'text-[#2E7D32]',
      bgColor: 'bg-emerald-50',
      link: '/admin/contact-settings',
      actionText: 'Edit Contact Space'
    }
  ];

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1F1215] via-[#3A141D] to-[#6A0F1F] text-white p-6 sm:p-8 lg:p-10 shadow-xl border border-[#D9AD5B]/20">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9AD5B]/20 border border-[#D9AD5B]/30 text-[#D9AD5B] text-xs font-bold tracking-wide uppercase">
            <i className="bx bxs-shield-check text-sm"></i>
            Sumangali Admin Dashboard
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-['Playfair_Display'] text-white">
            Welcome to the Store Control Center
          </h2>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed">
            Manage your service offerings, showcase silk saree gallery collections, update about us content, and maintain common store contact & social media channels.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/admin/services"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D9AD5B] hover:bg-[#A37E39] text-[#1F1215] font-bold text-xs sm:text-sm transition-all shadow-md"
            >
              <i className="bx bx-plus-circle text-lg"></i>
              Add New Service
            </Link>
            <Link
              to="/admin/gallery"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-all border border-white/20"
            >
              <i className="bx bx-images text-lg"></i>
              Manage Collections
            </Link>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#D9AD5B]/10 to-transparent pointer-events-none"></div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-[#D9AD5B]/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-stone-200 hover:shadow-md hover:border-[#D9AD5B]/50 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  {card.title}
                </span>
                <div className={`w-11 h-11 rounded-xl ${card.bgColor} ${card.textColor} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  <i className={`bx ${card.icon}`}></i>
                </div>
              </div>
              <div className="text-3xl font-extrabold text-[#1F1215] font-['Playfair_Display']">
                {card.value}
              </div>
              <p className="text-xs text-stone-500 mt-1 font-medium">
                {card.subtitle}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
              <Link
                to={card.link}
                className={`text-xs font-bold ${card.textColor} hover:underline flex items-center gap-1`}
              >
                {card.actionText} <i className="bx bx-right-arrow-alt text-base"></i>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Two Columns: Recent Services & Quick Contact Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Services List (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
              <div>
                <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#1F1215]">
                  Active Saree Services
                </h3>
                <p className="text-xs text-stone-500">
                  All services automatically include Header, Footer, and dedicated route
                </p>
              </div>
              <Link
                to="/admin/services"
                className="text-xs font-bold text-[#6A0F1F] hover:text-[#D9AD5B] flex items-center gap-1 transition-colors"
              >
                View All <i className="bx bx-chevron-right text-base"></i>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ServicesData.servicesList.slice(0, 4).map((service) => (
                <div
                  key={service.id}
                  className="rounded-2xl border border-stone-200 p-4 hover:border-[#6A0F1F] transition-all bg-stone-50/50 hover:bg-[#FCF9F4] group flex gap-3.5"
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-16 h-16 rounded-xl object-cover border border-stone-200 group-hover:scale-105 transition-transform shrink-0"
                  />
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#1F1215] truncate">
                        {service.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">
                        {service.subtitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#6A0F1F]/10 text-[#6A0F1F]">
                        {service.points.length} Highlights
                      </span>
                      <Link
                        to={`/services/${service.id}`}
                        target="_blank"
                        className="text-[11px] font-bold text-stone-500 hover:text-[#6A0F1F] ml-auto flex items-center gap-0.5"
                      >
                        Live <i className="bx bx-external-link"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">
              Total {totalServices} services live on website
            </span>
            <Link
              to="/admin/services"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6A0F1F] hover:bg-[#8C162B] text-white text-xs font-bold transition-colors"
            >
              <i className="bx bx-plus"></i> Add Service
            </Link>
          </div>
        </div>

        {/* Common Contact & Social Overview (1 col) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
              <div>
                <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#1F1215]">
                  Store Details
                </h3>
                <p className="text-xs text-stone-500">Synced across Header & Footer</p>
              </div>
              <Link
                to="/admin/contact-settings"
                className="text-xs font-bold text-[#6A0F1F] hover:text-[#D9AD5B] flex items-center gap-1 transition-colors"
              >
                Edit <i className="bx bx-pencil text-sm"></i>
              </Link>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div className="w-9 h-9 rounded-lg bg-[#6A0F1F]/10 text-[#6A0F1F] flex items-center justify-center text-lg shrink-0">
                  <i className="bx bxs-phone-call"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Phone</p>
                  <p className="text-xs font-bold text-[#1F1215] truncate">{GlobalData.contactInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div className="w-9 h-9 rounded-lg bg-[#6A0F1F]/10 text-[#6A0F1F] flex items-center justify-center text-lg shrink-0">
                  <i className="bx bxs-envelope"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Email</p>
                  <p className="text-xs font-bold text-[#1F1215] truncate">{GlobalData.contactInfo.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div className="w-9 h-9 rounded-lg bg-[#6A0F1F]/10 text-[#6A0F1F] flex items-center justify-center text-lg shrink-0">
                  <i className="bx bxs-map"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Store Location</p>
                  <p className="text-xs text-stone-700 leading-snug line-clamp-2">{GlobalData.contactInfo.address}</p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">Connected Socials</p>
                <div className="flex gap-2">
                  {Object.entries(GlobalData.socialLinks).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-[#6A0F1F] hover:text-white text-stone-600 flex items-center justify-center text-base transition-colors"
                      title={platform}
                    >
                      <i className={`bx bxl-${platform}`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100">
            <Link
              to="/admin/contact-settings"
              className="w-full py-2 rounded-xl bg-[#FCF9F4] hover:bg-[#FFF9E8] border border-[#E5D3A3] text-[#6A0F1F] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <i className="bx bx-cog"></i> Configure Global & Contact Info
            </Link>
          </div>
        </div>

      </div>

      {/* Gallery Snapshot */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
          <div>
            <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#1F1215]">
              Featured Gallery Collections
            </h3>
            <p className="text-xs text-stone-500">
              Manage albums, add photos, set cover pictures and descriptions
            </p>
          </div>
          <Link
            to="/admin/gallery"
            className="text-xs font-bold text-[#6A0F1F] hover:text-[#D9AD5B] flex items-center gap-1 transition-colors"
          >
            Manage Albums <i className="bx bx-chevron-right text-base"></i>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {GalleryData.categories.map((category) => (
            <Link
              key={category.id}
              to="/admin/gallery"
              className="group rounded-2xl overflow-hidden border border-stone-200 hover:border-[#D9AD5B] shadow-xs hover:shadow-md transition-all bg-stone-50 flex flex-col"
            >
              <div className="aspect-square relative overflow-hidden bg-stone-100">
                <img
                  src={category.coverImage}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                  {category.images.length} Photos
                </span>
              </div>
              <div className="p-2.5 text-center">
                <p className="text-xs font-bold text-[#1F1215] truncate group-hover:text-[#6A0F1F] transition-colors">
                  {category.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
