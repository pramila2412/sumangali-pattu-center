import React, { useState } from 'react';
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

const stockImages = [
  { name: 'Kanchipuram Classic', src: saree1 },
  { name: 'Banarasi Gold Brocade', src: saree2 },
  { name: 'Mysore Pure Crepe', src: saree3 },
  { name: 'Antique Zari Pallu', src: saree4 },
  { name: 'Bridal Crimson Silk', src: saree5 },
  { name: 'Royal Gold Border', src: saree6 },
  { name: 'Traditional Temple Zari', src: saree7 },
  { name: 'Heritage Mustard Silk', src: saree8 },
  { name: 'Peacock Motif Silk', src: saree9 },
  { name: 'Rich Maroon Silk', src: saree10 },
];

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageSrc: string) => void;
  currentImage?: string;
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  currentImage
}) => {
  const [activeTab, setActiveTab] = useState<'stock' | 'upload' | 'url'>('stock');
  const [customUrl, setCustomUrl] = useState('');
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setUploadedPreview(result);
      };
      reader.readAsDataURL(file);
    }
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-[fadeIn_0.2s_ease-out]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F1215]">
              Select or Upload Image
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Choose from high-resolution saree assets or upload your own photo
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors"
          >
            <i className="bx bx-x text-xl"></i>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 px-6 pt-3 gap-4 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('stock')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'stock'
                ? 'border-[#6A0F1F] text-[#6A0F1F]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <i className="bx bx-images text-lg"></i>
            Stock Saree Library
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'border-[#6A0F1F] text-[#6A0F1F]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <i className="bx bx-cloud-upload text-lg"></i>
            Upload Local Photo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'url'
                ? 'border-[#6A0F1F] text-[#6A0F1F]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <i className="bx bx-link text-lg"></i>
            Image URL
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'stock' && (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {stockImages.map((img, idx) => {
                  const isSelected = currentImage === img.src;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        onSelectImage(img.src);
                        onClose();
                      }}
                      className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-[1.02] shadow-xs ${
                        isSelected ? 'border-[#6A0F1F] ring-2 ring-[#6A0F1F]/30' : 'border-stone-200 hover:border-[#D9AD5B]'
                      }`}
                    >
                      <div className="aspect-square w-full overflow-hidden bg-stone-100">
                        <img src={img.src} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="p-2 bg-white text-[11px] font-semibold text-stone-700 truncate text-center">
                        {img.name}
                      </div>
                      {isSelected && (
                        <span className="absolute top-2 right-2 bg-[#6A0F1F] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs shadow-md">
                          <i className="bx bx-check"></i>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4">
              <label className="border-2 border-dashed border-stone-300 hover:border-[#6A0F1F] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-stone-50/50 hover:bg-[#FCF9F4]">
                <div className="w-14 h-14 rounded-full bg-[#FFF9E8] border border-[#E5D3A3] text-[#A37E39] flex items-center justify-center text-3xl mb-3">
                  <i className="bx bx-cloud-upload"></i>
                </div>
                <span className="font-bold text-sm text-[#1F1215]">Click to choose an image from device</span>
                <span className="text-xs text-stone-500 mt-1">PNG, JPG, WEBP, or AVIF up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadedPreview && (
                <div className="mt-4 p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-center gap-4">
                  <img
                    src={uploadedPreview}
                    alt="Uploaded preview"
                    className="w-20 h-20 object-cover rounded-lg border border-stone-300"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-800">Preview Ready</p>
                    <p className="text-[11px] text-stone-500 truncate">Image loaded successfully from device</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleConfirmUpload}
                    className="px-4 py-2 bg-[#6A0F1F] hover:bg-[#8C162B] text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Apply Image
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Direct Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/saree-image.jpg"
                    className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleConfirmUrl}
                    disabled={!customUrl.trim()}
                    className="px-5 py-2.5 bg-[#6A0F1F] hover:bg-[#8C162B] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
                  >
                    Use URL
                  </button>
                </div>
              </div>

              {customUrl.trim() && (
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                  <p className="text-xs font-bold text-stone-700 mb-2">Live URL Preview:</p>
                  <div className="h-44 w-full rounded-lg overflow-hidden bg-stone-200 flex items-center justify-center">
                    <img
                      src={customUrl}
                      alt="URL preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default ImagePickerModal;
