import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ServicesData } from '../../data/ServicesData';
import ImagePickerModal from '../../components/Admin/ImagePickerModal';
import { useToast } from '../../components/Toast/ToastProvider';

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description1: string;
  description2: string;
  points: string[];
  description3: string;
  image: string;
}

export const AdminServices: React.FC = () => {
  const { showToast } = useToast();

  const [services, setServices] = useState<ServiceItem[]>([...ServicesData.servicesList]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<ServiceItem>({
    id: '',
    title: '',
    subtitle: '',
    description1: '',
    description2: '',
    points: ['Free Home Pickup from Any Location', 'Expert Evaluation by Silk Specialists', 'Instant Cash or Online Payment'],
    description3: '',
    image: ServicesData.servicesList[0]?.image || ''
  });

  const [newPointInput, setNewPointInput] = useState('');

  // Delete State
  const [deleteConfirm, setDeleteConfirm] = useState<ServiceItem | null>(null);

  // Filtered Services
  const filteredServices = services.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleOpenAdd = () => {
    setEditingServiceId(null);
    setFormData({
      id: '',
      title: '',
      subtitle: '',
      description1: '',
      description2: '',
      points: [
        'Free Doorstep Pickup across major cities',
        'Transparent Zari Purity Evaluation',
        'Same-day Instant Cash / Bank Settlement',
        '100% Secure & Confidential Service'
      ],
      description3: '',
      image: ServicesData.servicesList[0]?.image || ''
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setFormData({
      id: service.id,
      title: service.title,
      subtitle: service.subtitle,
      description1: service.description1,
      description2: service.description2,
      points: [...service.points],
      description3: service.description3,
      image: service.image
    });
    setIsFormModalOpen(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      // Auto-generate slug if adding new service
      id: editingServiceId ? prev.id : slugify(title)
    }));
  };

  const handleAddPoint = () => {
    if (newPointInput.trim()) {
      setFormData(prev => ({
        ...prev,
        points: [...prev.points, newPointInput.trim()]
      }));
      setNewPointInput('');
    }
  };

  const handleRemovePoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      points: prev.points.filter((_, idx) => idx !== index)
    }));
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast('Please provide a service title.', 'error');
      return;
    }

    const finalId = formData.id.trim() || slugify(formData.title);

    if (editingServiceId) {
      // Update existing
      setServices(prev =>
        prev.map(s =>
          s.id === editingServiceId
            ? { ...formData, id: finalId }
            : s
        )
      );
      showToast(`Service "${formData.title}" updated successfully!`, 'success');
    } else {
      // Add new
      // Check slug uniqueness
      if (services.some(s => s.id === finalId)) {
        showToast('A service with this ID/slug already exists. Please customize the slug.', 'error');
        return;
      }
      setServices(prev => [...prev, { ...formData, id: finalId }]);
      showToast(`New service "${formData.title}" created with automatic Header & Footer!`, 'success');
    }

    setIsFormModalOpen(false);
  };

  const handleDeleteService = () => {
    if (!deleteConfirm) return;
    setServices(prev => prev.filter(s => s.id !== deleteConfirm.id));
    showToast(`Service "${deleteConfirm.title}" deleted.`, 'info');
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Header Info Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6A0F1F] bg-[#6A0F1F]/10 px-3 py-1 rounded-full inline-block mb-2">
            Service Catalog & Individual Pages
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] text-[#1F1215]">
            Services Management
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Add, update, or remove services. Every service automatically receives its own individual detail page (<code className="bg-stone-100 px-1 py-0.5 rounded text-[#6A0F1F]">/services/:id</code>) with Header and Footer integrated.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#6A0F1F] hover:bg-[#8C162B] text-white font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 self-start md:self-auto"
        >
          <i className="bx bx-plus-circle text-lg"></i>
          <span>Add New Service</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <i className="bx bx-search absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-lg"></i>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search services by title or subtitle..."
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
          <span>Showing {filteredServices.length} of {services.length} services</span>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-lg hover:border-[#D9AD5B]/50 transition-all flex flex-col group"
          >
            {/* Image & Title Header */}
            <div className="h-52 w-full relative overflow-hidden bg-stone-100">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
              
              <div className="absolute top-4 left-4">
                <span className="bg-[#D9AD5B] text-[#1F1215] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                  Slug: {service.id}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-bold font-['Playfair_Display'] leading-tight drop-shadow-md">
                  {service.title}
                </h3>
                <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                  {service.subtitle}
                </p>
              </div>
            </div>

            {/* Body Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {service.description1}
                </p>

                {/* Highlights */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Service Highlights ({service.points.length})
                  </p>
                  <ul className="space-y-1">
                    {service.points.slice(0, 3).map((pt, idx) => (
                      <li key={idx} className="flex items-start text-xs text-stone-700">
                        <i className="bx bx-check-circle text-[#6A0F1F] text-sm mr-1.5 shrink-0 mt-0.5"></i>
                        <span className="truncate">{pt}</span>
                      </li>
                    ))}
                    {service.points.length > 3 && (
                      <li className="text-[11px] font-semibold text-stone-400 pl-5">
                        +{service.points.length - 3} more highlights
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                <Link
                  to={`/services/${service.id}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#6A0F1F] hover:text-[#D9AD5B] transition-colors"
                >
                  <i className="bx bx-show text-base"></i> View Live Page
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(service)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-[#6A0F1F] hover:text-white text-stone-700 text-xs font-bold transition-colors"
                  >
                    <i className="bx bx-edit"></i> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(service)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-red-600 hover:text-white text-red-600 text-xs font-bold transition-colors"
                  >
                    <i className="bx bx-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center text-3xl mx-auto">
            <i className="bx bx-shopping-bag"></i>
          </div>
          <h3 className="font-['Playfair_Display'] font-bold text-lg text-stone-800">No Services Found</h3>
          <p className="text-xs text-stone-500">Try refining your search term or add a new service.</p>
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F1215]">
                  {editingServiceId ? 'Edit Saree Service' : 'Add New Saree Service'}
                </h3>
                <p className="text-xs text-stone-500">
                  Fill in the details to update this service across catalog and its individual page
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center"
              >
                <i className="bx bx-x text-xl"></i>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveService} className="p-6 overflow-y-auto flex-1 space-y-5">
              
              {/* Image Preview & Picker */}
              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-28 h-28 rounded-xl overflow-hidden bg-stone-200 border-2 border-[#D9AD5B] shrink-0">
                  <img
                    src={formData.image}
                    alt="Service thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <p className="text-xs font-bold text-[#1F1215]">Service Cover Photo</p>
                  <p className="text-[11px] text-stone-500">
                    Used on the service catalog cards and the individual service details showcase
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsImagePickerOpen(true)}
                    className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#6A0F1F] hover:bg-[#8C162B] text-white text-xs font-bold transition-colors"
                  >
                    <i className="bx bx-image-add text-sm"></i>
                    Change / Select Image
                  </button>
                </div>
              </div>

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Service Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. Old Tussar Silk Saree"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Page Slug (URL Identifier) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 bg-stone-200 border border-r-0 border-stone-300 rounded-l-xl text-xs text-stone-600 font-mono">
                      /services/
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: slugify(e.target.value) })}
                      placeholder="old-tussar-silk"
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-r-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                    />
                  </div>
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Catchy Subtitle / Pitch
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Get Top Market Cash Rates with Free Doorstep Evaluation"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                />
              </div>

              {/* Description 1 */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Description 1 (Introduction & Value)
                </label>
                <textarea
                  rows={3}
                  value={formData.description1}
                  onChange={(e) => setFormData({ ...formData, description1: e.target.value })}
                  placeholder="Introduce the silk type, heritage, and why clients should sell or exchange..."
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                />
              </div>

              {/* Description 2 */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Description 2 (Zari Testing & Trust)
                </label>
                <textarea
                  rows={2}
                  value={formData.description2}
                  onChange={(e) => setFormData({ ...formData, description2: e.target.value })}
                  placeholder="Explain our testing methods, fair evaluation, and payment guarantees..."
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                />
              </div>

              {/* Highlights (Bullet points) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Key Service Highlights (Bullet Points)
                </label>
                
                <div className="space-y-2">
                  {formData.points.map((pt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <i className="bx bx-check-circle text-[#6A0F1F] text-lg shrink-0"></i>
                      <input
                        type="text"
                        value={pt}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            points: prev.points.map((p, i) => i === idx ? val : p)
                          }));
                        }}
                        className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePoint(idx)}
                        className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-red-100 text-red-600 flex items-center justify-center text-sm shrink-0"
                      >
                        <i className="bx bx-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newPointInput}
                    onChange={(e) => setNewPointInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPoint();
                      }
                    }}
                    placeholder="Add another highlight point (e.g. Same-day UPI Payment)..."
                    className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                  />
                  <button
                    type="button"
                    onClick={handleAddPoint}
                    className="px-4 py-2 bg-stone-800 hover:bg-black text-white text-xs font-bold rounded-lg shrink-0 transition-colors"
                  >
                    + Add Point
                  </button>
                </div>
              </div>

              {/* Description 3 */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Description 3 (Bottom Call-to-Action Text)
                </label>
                <textarea
                  rows={2}
                  value={formData.description3}
                  onChange={(e) => setFormData({ ...formData, description3: e.target.value })}
                  placeholder="Closing note about sentimental value, respect, and seamless doorstep experience..."
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                />
              </div>

              {/* Footer Save Actions */}
              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#6A0F1F] hover:bg-[#8C162B] text-white rounded-xl text-xs font-bold transition-colors shadow-md flex items-center gap-2"
                >
                  <i className="bx bx-save"></i>
                  {editingServiceId ? 'Update Service' : 'Create Service'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Image Picker Modal */}
      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onSelectImage={(newSrc) => setFormData(prev => ({ ...prev, image: newSrc }))}
        currentImage={formData.image}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl mx-auto">
              <i className="bx bx-trash"></i>
            </div>
            <div>
              <h4 className="font-['Playfair_Display'] font-bold text-lg text-[#1F1215]">
                Delete Service
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                Are you sure you want to delete <span className="font-bold text-stone-900">"{deleteConfirm.title}"</span>?
                This will remove both its catalog entry and individual page (<code className="text-red-600 font-mono">/services/{deleteConfirm.id}</code>).
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteService}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
              >
                Yes, Delete Service
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminServices;
