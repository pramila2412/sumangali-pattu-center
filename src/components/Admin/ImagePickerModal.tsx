import React, { useState, useMemo, useRef } from 'react';
import saree1 from '../../assets/saree/saree1.jpg';
import saree2 from '../../assets/saree/saree2.jpg';
import saree3 from '../../assets/saree/saree3.jpg';
import saree4 from '../../assets/saree/saree4.webp';
import saree5 from '../../assets/saree/saree5.jpg';
import saree6 from '../../assets/saree/saree6.jpeg';
import saree7 from '../../assets/saree/saree7.jpeg';
import saree8 from '../../assets/saree/saree8.jpg';
import saree9 from '../../assets/saree/saree9.jpg';
import saree10 from '../../assets/saree/saree10.jpg';
import model1 from '../../assets/saree/model1.avif';
import model2 from '../../assets/saree/model2.avif';
import model3 from '../../assets/saree/model3.avif';

interface StockItem {
  id: string;
  name: string;
  category: 'saree' | 'model';
  tag: string;
  src: string;
}

const stockImages: StockItem[] = [
  { id: 's1', name: 'Kanchipuram Classic Silk', category: 'saree', tag: 'Traditional', src: saree1 },
  { id: 's2', name: 'Banarasi Gold Brocade', category: 'saree', tag: 'Brocade', src: saree2 },
  { id: 's3', name: 'Mysore Pure Crepe Silk', category: 'saree', tag: 'Pure Silk', src: saree3 },
  { id: 's4', name: 'Antique Zari Pallu Saree', category: 'saree', tag: 'Zari Work', src: saree4 },
  { id: 's5', name: 'Bridal Crimson Silk Saree', category: 'saree', tag: 'Bridal', src: saree5 },
  { id: 's6', name: 'Royal Gold Border Silk', category: 'saree', tag: 'Royal Gold', src: saree6 },
  { id: 's7', name: 'Traditional Temple Zari', category: 'saree', tag: 'Temple Border', src: saree7 },
  { id: 's8', name: 'Heritage Mustard Silk Saree', category: 'saree', tag: 'Heritage', src: saree8 },
  { id: 's9', name: 'Peacock Motif Crimson Silk', category: 'saree', tag: 'Motif Silk', src: saree9 },
  { id: 's10', name: 'Rich Maroon Silk Drape', category: 'saree', tag: 'Rich Silk', src: saree10 },
  { id: 'm1', name: 'Bridal Model Showcase 1', category: 'model', tag: 'Editorial', src: model1 },
  { id: 'm2', name: 'Traditional Model Showcase 2', category: 'model', tag: 'Editorial', src: model2 },
  { id: 'm3', name: 'Festive Model Showcase 3', category: 'model', tag: 'Editorial', src: model3 },
];

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageSrc: string) => void;
  currentImage?: string;
}

type TabType = 'stock' | 'upload' | 'url';

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  currentImage
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('stock');
  const [customUrl, setCustomUrl] = useState('');
  const [urlStatus, setUrlStatus] = useState<'idle' | 'loading' | 'valid' | 'error'>('idle');
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'saree' | 'model'>('all');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered stock images
  const filteredStockImages = useMemo(() => {
    return stockImages.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.tag.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP, AVIF).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be 10MB or less.');
      return;
    }
    setUploadedFileName(file.name);
    const sizeInKB = (file.size / 1024).toFixed(1);
    setUploadedFileSize(file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${sizeInKB} KB`);

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleConfirmUpload = () => {
    if (uploadedPreview) {
      onSelectImage(uploadedPreview);
      onClose();
    }
  };

  const handleConfirmUrl = () => {
    if (customUrl.trim()) {
      onSelectImage(customUrl.trim());
      onClose();
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        setCustomUrl(text.trim());
        setUrlStatus('idle');
      }
    } catch {
      // Clipboard access not available or denied
    }
  };

  const tabsConfig: { id: TabType; label: string; icon: string; countBadge?: string; pillTag: string }[] = [
    {
      id: 'stock',
      label: 'Stock Library',
      icon: 'bx-grid-alt',
      countBadge: `${stockImages.length}`,
      pillTag: 'Curated'
    },
    {
      id: 'upload',
      label: 'Upload Photo',
      icon: 'bx-cloud-upload',
      pillTag: 'Local Device'
    },
    {
      id: 'url',
      label: 'Image URL',
      icon: 'bx-link-alt',
      pillTag: 'Web Asset'
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200/90 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-stone-200/80 flex items-center justify-between bg-gradient-to-r from-stone-50 via-stone-50 to-[#FCF9F4]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6A0F1F] to-[#8C162B] text-[#D9AD5B] flex items-center justify-center shadow-md shadow-[#6A0F1F]/15">
              <i className="bx bx-images text-xl"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Playfair_Display'] font-bold text-lg sm:text-xl text-[#1F1215]">
                  Select Image Asset
                </h3>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF9E8] text-[#A37E39] border border-[#E5D3A3]">
                  Media Studio
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5 font-normal">
                Choose from authentic silk library, upload local photo, or provide a web link
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-all cursor-pointer hover:rotate-90"
          >
            <i className="bx bx-x text-2xl"></i>
          </button>
        </div>

        {/* Segmented Pill Tabs Bar */}
        <div className="px-6 pt-4 pb-3 bg-stone-50/70 border-b border-stone-200/70">
          <div className="bg-stone-200/60 p-1.5 rounded-2xl flex items-center gap-1.5 shadow-inner">
            {tabsConfig.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none ${
                    isActive
                      ? 'bg-white text-[#6A0F1F] shadow-sm shadow-stone-900/5 ring-1 ring-stone-900/5 font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                  }`}
                >
                  <i className={`bx ${tab.icon} text-base sm:text-lg ${isActive ? 'text-[#6A0F1F]' : 'text-stone-400'}`}></i>
                  <span className="truncate">{tab.label}</span>
                  {tab.countBadge ? (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold transition-colors ${
                      isActive ? 'bg-[#6A0F1F]/10 text-[#6A0F1F]' : 'bg-stone-300/60 text-stone-600'
                    }`}>
                      {tab.countBadge}
                    </span>
                  ) : (
                    <span className="hidden md:inline-block text-[9px] px-1.5 py-0.5 rounded text-stone-400 font-medium">
                      {tab.pillTag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-white">
          
          {/* TAB 1: Stock Library */}
          {activeTab === 'stock' && (
            <div className="space-y-4">
              {/* Search & Category Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between pb-1">
                <div className="relative flex-1">
                  <i className="bx bx-search absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-base"></i>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search silk sarees by name, motif, or style..."
                    className="w-full pl-9.5 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]/20 focus:border-[#6A0F1F] transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      <i className="bx bx-x text-base"></i>
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      categoryFilter === 'all'
                        ? 'bg-[#6A0F1F] text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    All ({stockImages.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('saree')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      categoryFilter === 'saree'
                        ? 'bg-[#6A0F1F] text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    Sarees (10)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategoryFilter('model')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      categoryFilter === 'model'
                        ? 'bg-[#6A0F1F] text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    Editorial (3)
                  </button>
                </div>
              </div>

              {/* Grid List */}
              {filteredStockImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-3.5">
                  {filteredStockImages.map((img) => {
                    const isSelected = currentImage === img.src;
                    return (
                      <div
                        key={img.id}
                        onClick={() => {
                          onSelectImage(img.src);
                          onClose();
                        }}
                        className={`group relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg bg-stone-50 ${
                          isSelected
                            ? 'border-[#6A0F1F] ring-3 ring-[#6A0F1F]/20 shadow-md'
                            : 'border-stone-200 hover:border-[#D9AD5B]'
                        }`}
                      >
                        {/* Image Box */}
                        <div className="aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-stone-100 relative">
                          <img
                            src={img.src}
                            alt={img.name}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                            loading="lazy"
                          />
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                            <span className="text-[11px] font-bold text-white bg-[#6A0F1F]/90 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                              <i className="bx bx-check-circle"></i> Click to Apply
                            </span>
                          </div>

                          {/* Tag Chip */}
                          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-white/90 backdrop-blur-xs text-stone-700 shadow-xs">
                            {img.tag}
                          </span>

                          {/* Selected Active Check Badge */}
                          {isSelected && (
                            <span className="absolute top-2 right-2 bg-[#6A0F1F] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm shadow-md ring-2 ring-white">
                              <i className="bx bx-check"></i>
                            </span>
                          )}
                        </div>

                        {/* Card Footer */}
                        <div className="p-2 sm:p-2.5 bg-white border-t border-stone-100">
                          <p className="text-[11px] sm:text-xs font-semibold text-stone-800 truncate" title={img.name}>
                            {img.name}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-stone-400">
                  <i className="bx bx-search-alt text-4xl mb-2 text-stone-300"></i>
                  <p className="text-sm font-semibold text-stone-600">No images matched your search</p>
                  <p className="text-xs text-stone-400 mt-1">Try different search keywords or reset category filters</p>
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}
                    className="mt-3 px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Upload Photo */}
          {activeTab === 'upload' && (
            <div className="space-y-4 max-w-xl mx-auto py-2">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl sm:rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-[#6A0F1F] bg-[#FCF9F4] scale-[1.01] ring-4 ring-[#6A0F1F]/10'
                    : 'border-stone-300 hover:border-[#6A0F1F] bg-stone-50/60 hover:bg-[#FCF9F4]/70'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFF9E8] to-[#F7ECD0] border border-[#E5D3A3] text-[#A37E39] flex items-center justify-center text-3xl mb-3.5 shadow-sm group-hover:scale-110 transition-transform">
                  <i className="bx bx-cloud-upload"></i>
                </div>
                
                <span className="font-bold text-sm sm:text-base text-[#1F1215]">
                  Click to browse or drag & drop photo here
                </span>
                <span className="text-xs text-stone-500 mt-1 max-w-xs">
                  Supports high-resolution PNG, JPG, WEBP, or AVIF (Recommended up to 10MB)
                </span>

                <div className="mt-4 px-4 py-1.5 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-700 shadow-xs flex items-center gap-1.5">
                  <i className="bx bx-folder-open text-[#6A0F1F]"></i> Select Local File
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Uploaded Image Preview Box */}
              {uploadedPreview && (
                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/80 shadow-xs flex flex-col sm:flex-row items-center gap-4 animate-[fadeIn_0.2s_ease-out]">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-200 border border-stone-300 shrink-0 shadow-xs">
                    <img
                      src={uploadedPreview}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                      <p className="text-xs font-bold text-stone-800 truncate">
                        {uploadedFileName || 'Selected Photo'}
                      </p>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      File Size: {uploadedFileSize || 'Ready'}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium mt-1">
                      Ready to apply to your banner or catalog
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedPreview(null);
                        setUploadedFileName('');
                        setUploadedFileSize('');
                      }}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmUpload}
                      className="flex-1 sm:flex-none px-5 py-2 bg-[#6A0F1F] hover:bg-[#8C162B] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <i className="bx bx-check text-base"></i> Use This Photo
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Image URL */}
          {activeTab === 'url' && (
            <div className="space-y-4 max-w-xl mx-auto py-2">
              <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Direct Web Image URL
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <i className="bx bx-link absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-base"></i>
                    <input
                      type="url"
                      value={customUrl}
                      onChange={(e) => {
                        setCustomUrl(e.target.value);
                        setUrlStatus('idle');
                      }}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full pl-9.5 pr-20 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]/20 focus:border-[#6A0F1F] transition-all"
                    />
                    <button
                      type="button"
                      onClick={handlePasteClipboard}
                      title="Paste from clipboard"
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-md text-[10px] font-bold transition-colors"
                    >
                      Paste
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmUrl}
                    disabled={!customUrl.trim()}
                    className="px-5 py-2.5 bg-[#6A0F1F] hover:bg-[#8C162B] disabled:opacity-40 disabled:hover:bg-[#6A0F1F] text-white rounded-xl text-xs font-bold shadow-sm transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <i className="bx bx-check text-base"></i> Apply URL
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 mt-2">
                  Paste any public HTTPS image link from Unsplash, Cloudinary, AWS S3, or CDN.
                </p>
              </div>

              {/* URL Live Preview Card */}
              {customUrl.trim() && (
                <div className="p-4 rounded-2xl border border-stone-200 bg-white shadow-xs space-y-2.5 animate-[fadeIn_0.2s_ease-out]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                      <i className="bx bx-show text-[#6A0F1F]"></i> Live Web Preview
                    </span>
                    {urlStatus === 'error' && (
                      <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                        <i className="bx bx-error-circle"></i> Unable to load image from URL
                      </span>
                    )}
                  </div>

                  <div className="h-52 w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center relative">
                    <img
                      src={customUrl}
                      alt="URL preview"
                      className="w-full h-full object-contain"
                      onLoad={() => setUrlStatus('valid')}
                      onError={() => setUrlStatus('error')}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3.5 border-t border-stone-200/80 bg-stone-50/90 flex items-center justify-between">
          <div className="text-[11px] text-stone-500 hidden sm:flex items-center gap-1.5">
            <i className="bx bx-info-circle text-[#A37E39]"></i>
            <span>Selected image will be updated instantly across your store.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ImagePickerModal;

