import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HomeAboutData, HomeProcessData, HomeCTAData } from '../../data/HomeData';
import { ServicesData } from '../../data/ServicesData';
import { GalleryData } from '../../data/GalleryData';
import { GlobalData } from '../../data/GlobalData';
import { useToast } from '../../components/Toast/ToastProvider';
import { loadCmsSection, saveCmsSection } from '../../lib/cms';
import ctaImg from '../../assets/saree/saree5.jpg';

interface AboutFeature {
  icon: string;
  title: string;
  description: string;
}

interface ProcessStep {
  id: number;
  icon: string;
  title: string;
  description: string;
}

const availableIcons = [
  { label: 'Check Shield / Trust', value: 'check-shield' },
  { label: 'Clock / Instant Time', value: 'time-five' },
  { label: 'Search / Inspection', value: 'search' },
  { label: 'Money / Cash', value: 'money' },
  { label: 'Car / Doorstep Pickup', value: 'car' },
  { label: 'Wallet / Instant Pay', value: 'wallet' },
  { label: 'Shopping Bag / Saree', value: 'shopping-bag' },
  { label: 'Exchange / Transfer', value: 'transfer' },
  { label: 'Star / Quality Rating', value: 'star' },
  { label: 'Award / Authenticity', value: 'award' },
  { label: 'Phone / Support', value: 'phone-call' },
  { label: 'Help / Consultation', value: 'help-circle' }
];

export const AdminDashboard: React.FC = () => {
  const { showToast } = useToast();

  // Active Management Section Tab
  const [activeTab, setActiveTab] = useState<'all' | 'about' | 'process' | 'cta'>('all');

  // --- Home About State ---
  const [aboutGeneral, setAboutGeneral] = useState({
    experience: HomeAboutData.experience,
    title: HomeAboutData.title,
    description: HomeAboutData.description,
    statsNumber: HomeAboutData.stats.number,
    statsText: HomeAboutData.stats.text
  });
  const [aboutFeatures, setAboutFeatures] = useState<AboutFeature[]>([
    ...HomeAboutData.features.map(f => ({
      ...f,
      icon: f.icon === 'flaticon-practice' ? 'check-shield' : f.icon === 'flaticon-help' ? 'time-five' : f.icon
    }))
  ]);

  // --- Home Process State ---
  const [processGeneral, setProcessGeneral] = useState({
    tagline: HomeProcessData.tagline,
    title: HomeProcessData.title
  });
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([
    ...HomeProcessData.steps
  ]);

  // --- Home CTA State ---
  const [ctaData, setCtaData] = useState({
    badge: HomeCTAData.badge,
    title: HomeCTAData.title,
    description: HomeCTAData.description,
    primaryBtnText: HomeCTAData.primaryBtnText,
    primaryBtnLink: HomeCTAData.primaryBtnLink || '/contact',
    phone: HomeCTAData.phone || GlobalData.contactInfo.phone
  });

  // --- Modals State ---
  // About Feature Modal
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(null);
  const [featureForm, setFeatureForm] = useState<AboutFeature>({
    icon: 'check-shield',
    title: '',
    description: ''
  });

  // Process Step Modal
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [stepForm, setStepForm] = useState<{ id: number; icon: string; title: string; description: string }>({
    id: 1,
    icon: 'search',
    title: '',
    description: ''
  });

  // Delete Confirmation Modal
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'feature' | 'step';
    index: number;
    title: string;
  } | null>(null);
  const [cmsReady, setCmsReady] = useState(false);

  useEffect(() => {
    loadCmsSection<{ aboutGeneral: typeof aboutGeneral; aboutFeatures: AboutFeature[]; processGeneral: typeof processGeneral; processSteps: ProcessStep[]; ctaData: typeof ctaData }>('dashboard')
      .then((saved) => {
        if (!saved) return;
        setAboutGeneral(saved.aboutGeneral ?? aboutGeneral);
        setAboutFeatures(saved.aboutFeatures ?? aboutFeatures);
        setProcessGeneral(saved.processGeneral ?? processGeneral);
        setProcessSteps(saved.processSteps ?? processSteps);
        setCtaData(saved.ctaData ?? ctaData);
      })
      .catch(() => showToast('Saved home-page content could not be loaded.', 'error'))
      .finally(() => setCmsReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!cmsReady) return;
    const timer = window.setTimeout(() => {
      saveCmsSection('dashboard', { aboutGeneral, aboutFeatures, processGeneral, processSteps, ctaData })
        .catch((error) => showToast(error.message, 'error'));
    }, 350);
    return () => window.clearTimeout(timer);
  }, [aboutGeneral, aboutFeatures, processGeneral, processSteps, ctaData, cmsReady, showToast]);

  // --- Handlers: Home About ---
  const handleSaveAboutGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    HomeAboutData.experience = aboutGeneral.experience;
    HomeAboutData.title = aboutGeneral.title;
    HomeAboutData.description = aboutGeneral.description;
    HomeAboutData.stats.number = aboutGeneral.statsNumber;
    HomeAboutData.stats.text = aboutGeneral.statsText;
    showToast('Home About section updated successfully!', 'success');
  };

  const handleOpenAddFeature = () => {
    setEditingFeatureIndex(null);
    setFeatureForm({ icon: 'check-shield', title: '', description: '' });
    setIsFeatureModalOpen(true);
  };

  const handleOpenEditFeature = (feature: AboutFeature, index: number) => {
    setEditingFeatureIndex(index);
    setFeatureForm({ ...feature });
    setIsFeatureModalOpen(true);
  };

  const handleSaveFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureForm.title.trim() || !featureForm.description.trim()) {
      showToast('Please enter both title and description.', 'error');
      return;
    }

    if (editingFeatureIndex !== null) {
      const updated = [...aboutFeatures];
      updated[editingFeatureIndex] = { ...featureForm };
      setAboutFeatures(updated);
      HomeAboutData.features = updated;
      showToast('About feature card updated!', 'success');
    } else {
      const updated = [...aboutFeatures, { ...featureForm }];
      setAboutFeatures(updated);
      HomeAboutData.features = updated;
      showToast('New about feature card added!', 'success');
    }
    setIsFeatureModalOpen(false);
  };

  const handleDeleteFeature = (index: number) => {
    const updated = aboutFeatures.filter((_, idx) => idx !== index);
    setAboutFeatures(updated);
    HomeAboutData.features = updated;
    setDeleteConfirm(null);
    showToast('Feature card deleted successfully.', 'info');
  };

  // --- Handlers: Home Process ---
  const handleSaveProcessGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    HomeProcessData.tagline = processGeneral.tagline;
    HomeProcessData.title = processGeneral.title;
    showToast('Home Process header details updated!', 'success');
  };

  const handleOpenAddStep = () => {
    setEditingStepIndex(null);
    setStepForm({
      id: processSteps.length + 1,
      icon: 'search',
      title: `Step ${processSteps.length + 1}: `,
      description: ''
    });
    setIsStepModalOpen(true);
  };

  const handleOpenEditStep = (step: ProcessStep, index: number) => {
    setEditingStepIndex(index);
    setStepForm({ ...step });
    setIsStepModalOpen(true);
  };

  const handleSaveStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepForm.title.trim() || !stepForm.description.trim()) {
      showToast('Please fill in both step title and description.', 'error');
      return;
    }

    if (editingStepIndex !== null) {
      const updated = [...processSteps];
      updated[editingStepIndex] = { ...stepForm };
      setProcessSteps(updated);
      HomeProcessData.steps = updated;
      showToast('Working process step updated!', 'success');
    } else {
      const newStep = {
        ...stepForm,
        id: processSteps.length + 1
      };
      const updated = [...processSteps, newStep];
      setProcessSteps(updated);
      HomeProcessData.steps = updated;
      showToast('New process step added!', 'success');
    }
    setIsStepModalOpen(false);
  };

  const handleDeleteStep = (index: number) => {
    const filtered = processSteps.filter((_, idx) => idx !== index);
    // Renumber steps
    const renumbered = filtered.map((s, idx) => ({ ...s, id: idx + 1 }));
    setProcessSteps(renumbered);
    HomeProcessData.steps = renumbered;
    setDeleteConfirm(null);
    showToast('Process step deleted.', 'info');
  };

  // --- Handlers: Home CTA ---
  const handleSaveCTA = (e: React.FormEvent) => {
    e.preventDefault();
    HomeCTAData.badge = ctaData.badge;
    HomeCTAData.title = ctaData.title;
    HomeCTAData.description = ctaData.description;
    HomeCTAData.primaryBtnText = ctaData.primaryBtnText;
    HomeCTAData.primaryBtnLink = ctaData.primaryBtnLink;
    HomeCTAData.phone = ctaData.phone;
    showToast('Home CTA Banner content updated successfully!', 'success');
  };

  // Stats Card Calculations
  const totalServices = ServicesData.servicesList.length;
  const totalCollections = GalleryData.categories.length;
  const totalAboutFeatures = aboutFeatures.length;
  const totalProcessSteps = processSteps.length;

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1F1215] via-[#3A141D] to-[#6A0F1F] text-white p-6 sm:p-8 lg:p-10 shadow-xl border border-[#D9AD5B]/20">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9AD5B]/20 border border-[#D9AD5B]/30 text-[#D9AD5B] text-xs font-bold tracking-wide uppercase">
            <i className="bx bxs-shield-check text-sm"></i>
            Sumangali Store Control Center
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-['Playfair_Display'] text-white">
            Homepage & Store Management Dashboard
          </h2>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed">
            Quickly customize and manage homepage sections including <strong>Home About (&lt;HomeAbout /&gt;)</strong>, <strong>Home Process (&lt;HomeProcess /&gt;)</strong>, and <strong>Home CTA (&lt;HomeCTA /&gt;)</strong> with full Add, Edit, and Delete controls.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('about')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                activeTab === 'about'
                  ? 'bg-[#D9AD5B] text-[#1F1215]'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <i className="bx bx-info-circle text-base"></i>
              Manage Home About
            </button>
            <button
              onClick={() => setActiveTab('process')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                activeTab === 'process'
                  ? 'bg-[#D9AD5B] text-[#1F1215]'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <i className="bx bx-git-commit text-base"></i>
              Manage Home Process
            </button>
            <button
              onClick={() => setActiveTab('cta')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                activeTab === 'cta'
                  ? 'bg-[#D9AD5B] text-[#1F1215]'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <i className="bx bx-phone-call text-base"></i>
              Manage Home CTA
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                activeTab === 'all'
                  ? 'bg-[#D9AD5B] text-[#1F1215]'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <i className="bx bx-grid-alt text-base"></i>
              View All
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#D9AD5B]/10 to-transparent pointer-events-none"></div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-[#D9AD5B]/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Home About Stats Card */}
        <div 
          onClick={() => setActiveTab('about')}
          className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-stone-200 hover:shadow-md hover:border-[#6A0F1F] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Home About</span>
              <div className="w-11 h-11 rounded-xl bg-[#6A0F1F]/10 text-[#6A0F1F] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <i className="bx bxs-badge-check"></i>
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#1F1215] font-['Playfair_Display']">
              {totalAboutFeatures} Features
            </div>
            <p className="text-xs text-stone-500 mt-1 font-medium truncate">
              {aboutGeneral.experience}
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#6A0F1F]">
            <span>Edit Section & Features</span>
            <i className="bx bx-right-arrow-alt text-base"></i>
          </div>
        </div>

        {/* Home Process Stats Card */}
        <div 
          onClick={() => setActiveTab('process')}
          className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-stone-200 hover:shadow-md hover:border-[#D9AD5B] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Home Process</span>
              <div className="w-11 h-11 rounded-xl bg-[#D9AD5B]/15 text-[#A37E39] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <i className="bx bxs-hourglass"></i>
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#1F1215] font-['Playfair_Display']">
              {totalProcessSteps} Steps
            </div>
            <p className="text-xs text-stone-500 mt-1 font-medium truncate">
              {processGeneral.tagline}
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#A37E39]">
            <span>Edit Working Steps</span>
            <i className="bx bx-right-arrow-alt text-base"></i>
          </div>
        </div>

        {/* Home CTA Stats Card */}
        <div 
          onClick={() => setActiveTab('cta')}
          className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-stone-200 hover:shadow-md hover:border-[#2E7D32] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Home CTA Banner</span>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#2E7D32] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <i className="bx bxs-megaphone"></i>
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#1F1215] font-['Playfair_Display']">
              Active
            </div>
            <p className="text-xs text-stone-500 mt-1 font-medium truncate">
              {ctaData.primaryBtnText} ({ctaData.phone})
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#2E7D32]">
            <span>Edit Call to Action</span>
            <i className="bx bx-right-arrow-alt text-base"></i>
          </div>
        </div>

        {/* Services & Gallery Quick Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-stone-200 hover:shadow-md hover:border-[#2B4C7E] transition-all group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Other Modules</span>
              <div className="w-11 h-11 rounded-xl bg-[#2B4C7E]/10 text-[#2B4C7E] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                <i className="bx bxs-layer"></i>
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#1F1215] font-['Playfair_Display']">
              {totalServices} Services
            </div>
            <p className="text-xs text-stone-500 mt-1 font-medium">
              {totalCollections} Gallery albums
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
            <Link to="/admin/services" className="text-xs font-bold text-[#2B4C7E] hover:underline flex items-center gap-1">
              Services <i className="bx bx-right-arrow-alt text-base"></i>
            </Link>
            <Link to="/admin/gallery" className="text-xs font-bold text-[#D9AD5B] hover:underline flex items-center gap-1">
              Gallery <i className="bx bx-right-arrow-alt text-base"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION 1: HOME ABOUT SECTION (<HomeAbout />) */}
      {(activeTab === 'all' || activeTab === 'about') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#6A0F1F]/10 text-[#6A0F1F] text-xs font-bold uppercase tracking-wider mb-2">
                <i className="bx bxs-badge-check"></i> &lt;HomeAbout /&gt; Section
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#1F1215]">
                Home About Us &amp; Features Manager
              </h3>
              <p className="text-xs sm:text-sm text-stone-500">
                Edit the main experience badge, heading, description, trust metrics, and manage feature cards with Add, Edit, and Delete.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddFeature}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6A0F1F] hover:bg-[#8C162B] text-white text-xs sm:text-sm font-bold transition-all shadow-sm shrink-0"
            >
              <i className="bx bx-plus-circle text-lg"></i>
              Add New Feature Card
            </button>
          </div>

          {/* About General Form */}
          <form onSubmit={handleSaveAboutGeneral} className="bg-stone-50/75 rounded-2xl p-5 sm:p-6 border border-stone-200 space-y-4">
            <h4 className="text-sm font-bold text-[#1F1215] uppercase tracking-wider flex items-center gap-2">
              <i className="bx bx-edit text-[#6A0F1F]"></i> Main Content &amp; Story
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Experience Tagline Badge
                </label>
                <input
                  type="text"
                  value={aboutGeneral.experience}
                  onChange={(e) => setAboutGeneral({ ...aboutGeneral, experience: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-[#1F1215] focus:outline-none focus:border-[#6A0F1F] focus:ring-1 focus:ring-[#6A0F1F]"
                  placeholder="15+ Years of Experience"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Main Section Title
                </label>
                <input
                  type="text"
                  value={aboutGeneral.title}
                  onChange={(e) => setAboutGeneral({ ...aboutGeneral, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-[#1F1215] focus:outline-none focus:border-[#6A0F1F] focus:ring-1 focus:ring-[#6A0F1F]"
                  placeholder="Most Trusted Buyer for Old Silk & Pattu Sarees"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Description Paragraph
                </label>
                <textarea
                  rows={3}
                  value={aboutGeneral.description}
                  onChange={(e) => setAboutGeneral({ ...aboutGeneral, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-[#1F1215] focus:outline-none focus:border-[#6A0F1F] focus:ring-1 focus:ring-[#6A0F1F]"
                  placeholder="Sumangali Pattu Center has been buying old silk sarees..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Floating Stats Number (Highlight Metric)
                </label>
                <input
                  type="text"
                  value={aboutGeneral.statsNumber}
                  onChange={(e) => setAboutGeneral({ ...aboutGeneral, statsNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-[#1F1215] focus:outline-none focus:border-[#6A0F1F] focus:ring-1 focus:ring-[#6A0F1F]"
                  placeholder="4,500+"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Floating Stats Label
                </label>
                <input
                  type="text"
                  value={aboutGeneral.statsText}
                  onChange={(e) => setAboutGeneral({ ...aboutGeneral, statsText: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-[#1F1215] focus:outline-none focus:border-[#6A0F1F] focus:ring-1 focus:ring-[#6A0F1F]"
                  placeholder="Happy Saree Sellers Served"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#D9AD5B] hover:bg-[#A37E39] text-[#1F1215] font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-1.5"
              >
                <i className="bx bx-save text-base"></i> Save About Details
              </button>
            </div>
          </form>

          {/* About Features List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-[#1F1215] uppercase tracking-wider flex items-center gap-2">
                <i className="bx bx-grid-alt text-[#6A0F1F]"></i> Feature Highlights ({aboutFeatures.length})
              </h4>
              <span className="text-xs text-stone-500">Shown in 2-column cards on home page</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aboutFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-stone-200 bg-white hover:border-[#6A0F1F] shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-11 h-11 rounded-xl bg-[#D9AD5B]/15 text-[#A37E39] flex items-center justify-center text-2xl">
                        <i className={`bx bx-${feature.icon}`}></i>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                        Card #{idx + 1}
                      </span>
                    </div>

                    <h5 className="font-bold text-sm text-[#1F1215] mb-1">
                      {feature.title}
                    </h5>
                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {feature.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditFeature(feature, idx)}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-[#6A0F1F] hover:text-white text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <i className="bx bx-pencil text-sm"></i> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm({ type: 'feature', index: idx, title: feature.title })}
                      className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <i className="bx bx-trash text-sm"></i> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: HOME PROCESS SECTION (<HomeProcess />) */}
      {(activeTab === 'all' || activeTab === 'process') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#D9AD5B]/20 text-[#A37E39] text-xs font-bold uppercase tracking-wider mb-2">
                <i className="bx bxs-hourglass"></i> &lt;HomeProcess /&gt; Section
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#1F1215]">
                Home Working Process &amp; Steps Manager
              </h3>
              <p className="text-xs sm:text-sm text-stone-500">
                Manage the step-by-step workflow shown to saree sellers (Inspection, Instant Quote, Doorstep Pickup, Immediate Payment).
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddStep}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6A0F1F] hover:bg-[#8C162B] text-white text-xs sm:text-sm font-bold transition-all shadow-sm shrink-0"
            >
              <i className="bx bx-plus-circle text-lg"></i>
              Add New Process Step
            </button>
          </div>

          {/* Process Header Form */}
          <form onSubmit={handleSaveProcessGeneral} className="bg-stone-50/75 rounded-2xl p-5 sm:p-6 border border-stone-200 space-y-4">
            <h4 className="text-sm font-bold text-[#1F1215] uppercase tracking-wider flex items-center gap-2">
              <i className="bx bx-heading text-[#6A0F1F]"></i> Process Section Header
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Tagline Label
                </label>
                <input
                  type="text"
                  value={processGeneral.tagline}
                  onChange={(e) => setProcessGeneral({ ...processGeneral, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-[#1F1215] focus:outline-none focus:border-[#6A0F1F] focus:ring-1 focus:ring-[#6A0F1F]"
                  placeholder="Our Working Process"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Main Header Heading
                </label>
                <input
                  type="text"
                  value={processGeneral.title}
                  onChange={(e) => setProcessGeneral({ ...processGeneral, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-[#1F1215] focus:outline-none focus:border-[#6A0F1F] focus:ring-1 focus:ring-[#6A0F1F]"
                  placeholder="How We Make Selling Your Silk Sarees Simple & Stress-Free"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#D9AD5B] hover:bg-[#A37E39] text-[#1F1215] font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-1.5"
              >
                <i className="bx bx-save text-base"></i> Save Process Header
              </button>
            </div>
          </form>

          {/* Process Steps Cards List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-[#1F1215] uppercase tracking-wider flex items-center gap-2">
                <i className="bx bx-list-ol text-[#6A0F1F]"></i> Workflow Steps ({processSteps.length})
              </h4>
              <span className="text-xs text-stone-500">Numbered step cards with connector on home page</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {processSteps.map((step, idx) => (
                <div
                  key={step.id || idx}
                  className="p-5 rounded-2xl border border-stone-200 bg-white hover:border-[#6A0F1F] shadow-xs transition-all flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-[#6A0F1F] text-white flex items-center justify-center text-xs font-bold shadow-md">
                    0{step.id}
                  </div>

                  <div>
                    <div className="w-12 h-12 rounded-full bg-[#D9AD5B]/15 text-[#A37E39] flex items-center justify-center text-2xl mb-4 border border-[#D9AD5B]/30">
                      <i className={`bx bx-${step.icon}`}></i>
                    </div>

                    <h5 className="font-bold text-sm text-[#1F1215] mb-1.5">
                      {step.title}
                    </h5>
                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-4">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditStep(step, idx)}
                      className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-[#6A0F1F] hover:text-white text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <i className="bx bx-pencil text-sm"></i> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm({ type: 'step', index: idx, title: step.title })}
                      className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <i className="bx bx-trash text-sm"></i> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: HOME CTA BANNER SECTION (<HomeCTA />) */}
      {(activeTab === 'all' || activeTab === 'cta') && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 space-y-6">
          <div className="pb-5 border-b border-stone-100">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-[#2E7D32] text-xs font-bold uppercase tracking-wider mb-2">
              <i className="bx bxs-megaphone"></i> &lt;HomeCTA /&gt; Section
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-['Playfair_Display'] text-[#1F1215]">
              Home Call to Action (CTA) Banner Manager
            </h3>
            <p className="text-xs sm:text-sm text-stone-500">
              Update the high-converting banner at the bottom of the home screen, configure button actions, phone link, and see a live real-time preview.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* CTA Editor Form (7 cols) */}
            <form onSubmit={handleSaveCTA} className="lg:col-span-7 bg-stone-50/75 rounded-2xl p-5 sm:p-6 border border-stone-200 space-y-4">
              <h4 className="text-sm font-bold text-[#1F1215] uppercase tracking-wider flex items-center gap-2">
                <i className="bx bx-slider-alt text-[#6A0F1F]"></i> Banner Content &amp; Direct Actions
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Top Highlight Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    value={ctaData.badge}
                    onChange={(e) => setCtaData({ ...ctaData, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-[#1F1215] focus:outline-none focus:border-[#6A0F1F] focus:ring-1 focus:ring-[#6A0F1F]"
                    placeholder="We Help You Sell Your Old Silk Sarees"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Main Callout Headline
                  </label>
                  <input
                    type="text"
                    value={ctaData.title}
                    onChange={(e) => setCtaData({ ...ctaData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-[#1F1215] focus:outline-none focus:border-[#6A0F1F] focus:ring-1 focus:ring-[#6A0F1F]"
                    placeholder="Sell Your Sarees Hassle-Free with the Best Market Value"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Description Text
                  </label>
                  <textarea
                    rows={3}
                    value={ctaData.description}
                    onChange={(e) => setCtaData({ ...ctaData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-[#1F1215] focus:outline-none focus:border-[#6A0F1F] focus:ring-1 focus:ring-[#6A0F1F]"
                    placeholder="Get Instant Cash for Your Old Kanchipuram, Banarasi & Mysore Sarees..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Primary Button Label
                    </label>
                    <input
                      type="text"
                      value={ctaData.primaryBtnText}
                      onChange={(e) => setCtaData({ ...ctaData, primaryBtnText: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-[#1F1215] focus:outline-none focus:border-[#6A0F1F] focus:ring-1 focus:ring-[#6A0F1F]"
                      placeholder="Contact Us Now"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Primary Destination Route
                    </label>
                    <input
                      type="text"
                      value={ctaData.primaryBtnLink}
                      onChange={(e) => setCtaData({ ...ctaData, primaryBtnLink: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-[#1F1215] focus:outline-none focus:border-[#6A0F1F] focus:ring-1 focus:ring-[#6A0F1F]"
                      placeholder="/contact"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Quick Call Phone Number
                    </label>
                    <input
                      type="text"
                      value={ctaData.phone}
                      onChange={(e) => setCtaData({ ...ctaData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-[#1F1215] focus:outline-none focus:border-[#6A0F1F] focus:ring-1 focus:ring-[#6A0F1F]"
                      placeholder="9944118349"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#D9AD5B] hover:bg-[#A37E39] text-[#1F1215] font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-1.5"
                >
                  <i className="bx bx-save text-base"></i> Save CTA Settings
                </button>
              </div>
            </form>

            {/* Live CTA Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#1F1215] uppercase tracking-wider flex items-center gap-2">
                  <i className="bx bx-show text-[#6A0F1F]"></i> Live Section Preview
                </h4>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Real-time
                </span>
              </div>

              <div className="rounded-2xl bg-[#6A0F1F] p-6 text-white shadow-lg overflow-hidden relative border border-[#D9AD5B]/30 flex flex-col justify-between min-h-[320px]">
                <div className="space-y-3 relative z-10">
                  <span className="text-[#D9AD5B] font-bold uppercase tracking-wider text-[11px]">
                    {ctaData.badge || 'We Help You Sell Your Old Silk Sarees'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-['Playfair_Display'] leading-snug">
                    {ctaData.title || 'Sell Your Sarees Hassle-Free'}
                  </h3>
                  <p className="text-white/80 text-xs leading-relaxed line-clamp-3">
                    {ctaData.description}
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap gap-2.5 items-center relative z-10">
                  <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#D9AD5B] text-[#1F1215] font-bold text-xs shadow-md">
                    {ctaData.primaryBtnText} <i className="bx bx-chevron-right text-sm"></i>
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-white/10 text-white font-semibold text-xs border border-white/20">
                    <i className="bx bx-phone-call text-xs text-[#D9AD5B]"></i> {ctaData.phone}
                  </span>
                </div>

                {/* Thumbnail background image overlay */}
                <div className="absolute right-0 bottom-0 w-32 h-32 opacity-20 pointer-events-none rounded-tl-full overflow-hidden">
                  <img src={ctaImg} alt="CTA preview" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* QUICK LINKS SECTION: Active Services & Store Details */}
      {activeTab === 'all' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Active Saree Services Quick Access (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
                <div>
                  <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#1F1215]">
                    Active Saree Services
                  </h3>
                  <p className="text-xs text-stone-500">
                    All services automatically mapped to live routes and navigation
                  </p>
                </div>
                <Link
                  to="/admin/services"
                  className="text-xs font-bold text-[#6A0F1F] hover:text-[#D9AD5B] flex items-center gap-1 transition-colors"
                >
                  Manage All <i className="bx bx-chevron-right text-base"></i>
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
                  <p className="text-xs text-stone-500">Synced across Header &amp; Footer</p>
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
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100">
              <Link
                to="/admin/contact-settings"
                className="w-full py-2 rounded-xl bg-[#FCF9F4] hover:bg-[#FFF9E8] border border-[#E5D3A3] text-[#6A0F1F] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <i className="bx bx-cog"></i> Configure Store &amp; Contact Info
              </Link>
            </div>
          </div>

        </div>
      )}

      {/* MODAL 1: ADD / EDIT ABOUT FEATURE */}
      {isFeatureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-[scaleUp_0.2s_ease-out]">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
              <h3 className="text-lg sm:text-xl font-bold font-['Playfair_Display'] text-[#1F1215]">
                {editingFeatureIndex !== null ? 'Edit Feature Highlight Card' : 'Add New Feature Highlight Card'}
              </h3>
              <button
                type="button"
                onClick={() => setIsFeatureModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
              >
                <i className="bx bx-x text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSaveFeature} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Feature Icon
                </label>
                <select
                  value={featureForm.icon}
                  onChange={(e) => setFeatureForm({ ...featureForm, icon: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-[#1F1215] focus:outline-none focus:border-[#6A0F1F]"
                >
                  {availableIcons.map((icon) => (
                    <option key={icon.value} value={icon.value}>
                      {icon.label} (bx-{icon.value})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Feature Card Title *
                </label>
                <input
                  type="text"
                  value={featureForm.title}
                  onChange={(e) => setFeatureForm({ ...featureForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-[#1F1215] focus:outline-none focus:border-[#6A0F1F]"
                  placeholder="e.g., Fair & Transparent Evaluation"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Feature Description *
                </label>
                <textarea
                  rows={3}
                  value={featureForm.description}
                  onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-[#1F1215] focus:outline-none focus:border-[#6A0F1F]"
                  placeholder="e.g., We offer honest pricing with expert assessment..."
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsFeatureModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6A0F1F] hover:bg-[#8C162B] text-white text-xs font-bold transition-colors shadow-sm"
                >
                  {editingFeatureIndex !== null ? 'Update Feature' : 'Save Feature'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT PROCESS STEP */}
      {isStepModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-[scaleUp_0.2s_ease-out]">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
              <h3 className="text-lg sm:text-xl font-bold font-['Playfair_Display'] text-[#1F1215]">
                {editingStepIndex !== null ? `Edit Step ${stepForm.id}` : `Add New Step (${stepForm.id})`}
              </h3>
              <button
                type="button"
                onClick={() => setIsStepModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
              >
                <i className="bx bx-x text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSaveStep} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Step Icon
                </label>
                <select
                  value={stepForm.icon}
                  onChange={(e) => setStepForm({ ...stepForm, icon: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-[#1F1215] focus:outline-none focus:border-[#6A0F1F]"
                >
                  {availableIcons.map((icon) => (
                    <option key={icon.value} value={icon.value}>
                      {icon.label} (bx-{icon.value})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Step Title *
                </label>
                <input
                  type="text"
                  value={stepForm.title}
                  onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-[#1F1215] focus:outline-none focus:border-[#6A0F1F]"
                  placeholder="e.g., Step 1: Contact & Inspection"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Step Description *
                </label>
                <textarea
                  rows={3}
                  value={stepForm.description}
                  onChange={(e) => setStepForm({ ...stepForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-[#1F1215] focus:outline-none focus:border-[#6A0F1F]"
                  placeholder="e.g., Call or WhatsApp us to get started. Share saree images..."
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsStepModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#6A0F1F] hover:bg-[#8C162B] text-white text-xs font-bold transition-colors shadow-sm"
                >
                  {editingStepIndex !== null ? 'Update Step' : 'Save Step'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-stone-200 animate-[scaleUp_0.2s_ease-out]">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl mx-auto mb-4">
              <i className="bx bx-trash"></i>
            </div>
            <h3 className="text-lg font-bold text-[#1F1215] font-['Playfair_Display'] mb-2">
              Confirm Deletion
            </h3>
            <p className="text-xs text-stone-600 mb-6">
              Are you sure you want to remove <strong>"{deleteConfirm.title}"</strong>? This will delete it from the {deleteConfirm.type === 'feature' ? 'Home About' : 'Home Process'} section.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteConfirm.type === 'feature') {
                    handleDeleteFeature(deleteConfirm.index);
                  } else {
                    handleDeleteStep(deleteConfirm.index);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
