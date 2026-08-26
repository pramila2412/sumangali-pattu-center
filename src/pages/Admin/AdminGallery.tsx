import React, { useState } from 'react';
import { GalleryData } from '../../data/GalleryData';
import ImagePickerModal from '../../components/Admin/ImagePickerModal';
import { useToast } from '../../components/Toast/ToastProvider';

interface GalleryCategory {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  images: string[];
}

export const AdminGallery: React.FC = () => {
  const { showToast } = useToast();

  const [categories, setCategories] = useState<GalleryCategory[]>([...GalleryData.categories]);
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | null>(null);

  // Collection Modal States
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<GalleryCategory | null>(null);
  const [collectionForm, setCollectionForm] = useState({
    id: '',
    title: '',
    coverImage: GalleryData.categories[0]?.coverImage || '',
    description: ''
  });

  // Photo Modal States
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState<'collectionCover' | 'newPhoto'>('collectionCover');

  // Delete State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'collection' | 'photo';
    categoryId: string;
    photoIndex?: number;
    title: string;
  } | null>(null);

  // Lightbox preview inside admin
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // 1. Collection Actions
  const handleOpenAddCollection = () => {
    setEditingCollection(null);
    setCollectionForm({
      id: '',
      title: '',
      coverImage: GalleryData.categories[0]?.coverImage || '',
      description: ''
    });
    setIsCollectionModalOpen(true);
  };

  const handleOpenEditCollection = (cat: GalleryCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCollection(cat);
    setCollectionForm({
      id: cat.id,
      title: cat.title,
      coverImage: cat.coverImage,
      description: cat.description
    });
    setIsCollectionModalOpen(true);
  };

  const handleSaveCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectionForm.title.trim()) {
      showToast('Please enter a collection title.', 'error');
      return;
    }

    const finalId = collectionForm.id.trim() || slugify(collectionForm.title);

    if (editingCollection) {
      setCategories(prev =>
        prev.map(c =>
          c.id === editingCollection.id
            ? {
                ...c,
                id: finalId,
                title: collectionForm.title.trim(),
                coverImage: collectionForm.coverImage,
                description: collectionForm.description.trim()
              }
            : c
        )
      );
      if (selectedCategory && selectedCategory.id === editingCollection.id) {
        setSelectedCategory(prev => prev ? {
          ...prev,
          id: finalId,
          title: collectionForm.title.trim(),
          coverImage: collectionForm.coverImage,
          description: collectionForm.description.trim()
        } : null);
      }
      showToast('Collection updated successfully!', 'success');
    } else {
      if (categories.some(c => c.id === finalId)) {
        showToast('A collection with this ID already exists. Please choose another.', 'error');
        return;
      }
      const newCategory: GalleryCategory = {
        id: finalId,
        title: collectionForm.title.trim(),
        coverImage: collectionForm.coverImage,
        description: collectionForm.description.trim(),
        images: [collectionForm.coverImage] // start with cover image in photo list
      };
      setCategories(prev => [...prev, newCategory]);
      showToast('New gallery collection created!', 'success');
    }

    setIsCollectionModalOpen(false);
  };

  const handleDeleteCollection = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    if (selectedCategory && selectedCategory.id === categoryId) {
      setSelectedCategory(null);
    }
    setDeleteConfirm(null);
    showToast('Collection deleted successfully.', 'info');
  };

  // 2. Photo Actions inside Selected Collection
  const handleOpenAddPhoto = () => {
    setImagePickerTarget('newPhoto');
    setIsImagePickerOpen(true);
  };

  const handleAddPhotoToActiveCollection = (imageSrc: string) => {
    if (!selectedCategory) return;
    const categoryId = selectedCategory.id;

    setCategories(prev =>
      prev.map(cat => {
        if (cat.id === categoryId) {
          const updatedImages = [...cat.images, imageSrc];
          return { ...cat, images: updatedImages };
        }
        return cat;
      })
    );

    setSelectedCategory(prev => {
      if (!prev) return null;
      return { ...prev, images: [...prev.images, imageSrc] };
    });

    showToast('Photo added to collection!', 'success');
  };

  const handleDeletePhoto = (categoryId: string, photoIndex: number) => {
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id === categoryId) {
          const updatedImages = cat.images.filter((_, idx) => idx !== photoIndex);
          // If deleted photo was cover, update cover to next available or keep
          const nextCover = updatedImages.length > 0 ? updatedImages[0] : cat.coverImage;
          return { ...cat, images: updatedImages, coverImage: nextCover };
        }
        return cat;
      })
    );

    setSelectedCategory(prev => {
      if (!prev) return null;
      const updatedImages = prev.images.filter((_, idx) => idx !== photoIndex);
      return { ...prev, images: updatedImages };
    });

    setDeleteConfirm(null);
    showToast('Photo removed from collection.', 'info');
  };

  const handleSetCoverPhoto = (categoryId: string, photoSrc: string) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === categoryId ? { ...cat, coverImage: photoSrc } : cat))
    );
    setSelectedCategory(prev => (prev ? { ...prev, coverImage: photoSrc } : null));
    showToast('Cover photo updated for this collection!', 'success');
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Header Info Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A37E39] bg-[#FFF9E8] border border-[#E5D3A3] px-3 py-1 rounded-full inline-block mb-2">
            <i className="bx bxs-photo-album text-sm"></i>
            Collections & Photo Albums
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] text-[#1F1215]">
            Gallery Management
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            Organize high-resolution silk saree albums, upload individual showcase photos, set cover images, and manage collections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FCF9F4] hover:bg-[#FFF9E8] text-[#6A0F1F] border border-[#E5D3A3] text-xs font-bold transition-all shadow-xs"
          >
            <i className="bx bx-external-link text-base text-[#D9AD5B]"></i>
            <span>Preview Public Gallery</span>
          </a>

          {!selectedCategory && (
            <button
              type="button"
              onClick={handleOpenAddCollection}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6A0F1F] hover:bg-[#8C162B] text-white font-bold text-xs sm:text-sm transition-all shadow-md"
            >
              <i className="bx bx-plus-circle text-lg"></i>
              <span>Add Collection</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: Collections Overview List (when no collection is selected) */}
      {!selectedCategory && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#1F1215] font-['Playfair_Display']">
                All Saree Collections ({categories.length})
              </h3>
              <p className="text-xs text-stone-500">
                Click any collection to view and manage its individual photos
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-xl hover:border-[#D9AD5B] transition-all cursor-pointer flex flex-col group"
              >
                {/* Cover Image */}
                <div className="h-56 w-full relative overflow-hidden bg-stone-100">
                  <img
                    src={category.coverImage}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

                  <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                    <i className="bx bx-image text-sm text-[#D9AD5B]"></i>
                    <span>{category.images.length} Photos</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h4 className="text-xl font-bold font-['Playfair_Display'] leading-tight">
                      {category.title}
                    </h4>
                    <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="p-4 bg-white flex items-center justify-between border-t border-stone-100">
                  <span className="text-xs font-bold text-[#6A0F1F] flex items-center gap-1 group-hover:text-[#D9AD5B] transition-colors">
                    Manage Photos <i className="bx bx-right-arrow-alt text-base"></i>
                  </span>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditCollection(category, e)}
                      className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-[#6A0F1F] hover:text-white text-stone-700 flex items-center justify-center text-sm transition-colors"
                      title="Edit Collection Info"
                    >
                      <i className="bx bx-edit"></i>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm({
                          type: 'collection',
                          categoryId: category.id,
                          title: category.title
                        });
                      }}
                      className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-red-600 hover:text-white text-red-600 flex items-center justify-center text-sm transition-colors"
                      title="Delete Collection"
                    >
                      <i className="bx bx-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: Selected Collection & Individual Photos Manager */}
      {selectedCategory && (
        <div className="space-y-6">
          {/* Breadcrumb / Back Button Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-[#6A0F1F] hover:text-white text-stone-700 flex items-center justify-center text-xl transition-colors shrink-0"
                title="Back to All Collections"
              >
                <i className="bx bx-arrow-back"></i>
              </button>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-stone-400 font-semibold">
                  <span className="cursor-pointer hover:underline" onClick={() => setSelectedCategory(null)}>
                    Collections
                  </span>
                  <span>/</span>
                  <span className="text-[#6A0F1F] font-bold">{selectedCategory.title}</span>
                </div>
                <h3 className="text-xl font-bold font-['Playfair_Display'] text-[#1F1215]">
                  {selectedCategory.title} Photos ({selectedCategory.images.length})
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => handleOpenEditCollection(selectedCategory, e)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
              >
                <i className="bx bx-edit text-sm"></i>
                <span>Edit Collection Info</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAddPhoto}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6A0F1F] hover:bg-[#8C162B] text-white text-xs font-bold transition-colors shadow-sm"
              >
                <i className="bx bx-plus-circle text-base"></i>
                <span>Add Photo</span>
              </button>
            </div>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {selectedCategory.images.map((photoUrl, idx) => {
              const isCover = selectedCategory.coverImage === photoUrl;
              return (
                <div
                  key={idx}
                  className={`group relative rounded-2xl overflow-hidden border-2 bg-stone-100 shadow-xs hover:shadow-lg transition-all ${
                    isCover ? 'border-[#D9AD5B] ring-2 ring-[#D9AD5B]/30' : 'border-stone-200'
                  }`}
                >
                  <div className="aspect-square w-full overflow-hidden">
                    <img
                      src={photoUrl}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Cover Badge */}
                  {isCover && (
                    <div className="absolute top-2 left-2 bg-[#D9AD5B] text-[#1F1215] text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                      <i className="bx bxs-star text-xs"></i>
                      Cover
                    </div>
                  )}

                  {/* Number Badge */}
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    #{idx + 1}
                  </div>

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setPreviewPhoto(photoUrl)}
                        className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center text-base transition-colors"
                        title="Preview Full Size"
                      >
                        <i className="bx bx-expand"></i>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {!isCover && (
                        <button
                          type="button"
                          onClick={() => handleSetCoverPhoto(selectedCategory.id, photoUrl)}
                          className="w-full py-1.5 rounded-lg bg-[#D9AD5B] hover:bg-[#A37E39] text-[#1F1215] text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                        >
                          <i className="bx bx-star"></i> Set as Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteConfirm({
                            type: 'photo',
                            categoryId: selectedCategory.id,
                            photoIndex: idx,
                            title: `Photo #${idx + 1} from ${selectedCategory.title}`
                          })
                        }
                        className="w-full py-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <i className="bx bx-trash"></i> Delete Photo
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Quick Add Photo Card */}
            <div
              onClick={handleOpenAddPhoto}
              className="aspect-square rounded-2xl border-2 border-dashed border-stone-300 hover:border-[#6A0F1F] bg-stone-50 hover:bg-[#FFF9E8] transition-all flex flex-col items-center justify-center text-center p-4 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-white group-hover:bg-[#6A0F1F] text-stone-400 group-hover:text-white flex items-center justify-center text-2xl mb-2 transition-colors shadow-xs">
                <i className="bx bx-plus"></i>
              </div>
              <span className="text-xs font-bold text-stone-700 group-hover:text-[#6A0F1F]">
                Add Photo
              </span>
              <span className="text-[10px] text-stone-400 mt-0.5">Upload or Pick</span>
            </div>
          </div>
        </div>
      )}

      {/* Collection Add / Edit Modal */}
      {isCollectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#1F1215]">
                {editingCollection ? 'Edit Collection Details' : 'Add New Gallery Collection'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCollectionModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center"
              >
                <i className="bx bx-x text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSaveCollection} className="p-6 overflow-y-auto space-y-4">
              {/* Cover Preview & Change */}
              <div className="p-3 rounded-2xl border border-stone-200 bg-stone-50 flex items-center gap-3.5">
                <img
                  src={collectionForm.coverImage}
                  alt="Cover preview"
                  className="w-20 h-20 rounded-xl object-cover border border-stone-300 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1F1215]">Album Cover Picture</p>
                  <p className="text-[11px] text-stone-500">Thumbnail shown on gallery page</p>
                  <button
                    type="button"
                    onClick={() => {
                      setImagePickerTarget('collectionCover');
                      setIsImagePickerOpen(true);
                    }}
                    className="mt-1.5 px-3 py-1 bg-[#6A0F1F] hover:bg-[#8C162B] text-white text-[11px] font-bold rounded-lg transition-colors"
                  >
                    Select Cover Photo
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Collection Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={collectionForm.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setCollectionForm(prev => ({
                      ...prev,
                      title,
                      id: editingCollection ? prev.id : slugify(title)
                    }));
                  }}
                  placeholder="e.g. Vintage Patola Silk"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Collection ID / Slug
                </label>
                <input
                  type="text"
                  value={collectionForm.id}
                  onChange={(e) => setCollectionForm({ ...collectionForm, id: slugify(e.target.value) })}
                  placeholder="vintage-patola"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Description / Caption
                </label>
                <textarea
                  rows={3}
                  value={collectionForm.description}
                  onChange={(e) => setCollectionForm({ ...collectionForm, description: e.target.value })}
                  placeholder="Brief description about the weaves, origin, or craftsmanship in this album..."
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6A0F1F]"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCollectionModalOpen(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6A0F1F] hover:bg-[#8C162B] text-white rounded-xl text-xs font-bold transition-colors shadow-md"
                >
                  {editingCollection ? 'Update Collection' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Picker Modal for Collections & Photos */}
      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onSelectImage={(newSrc) => {
          if (imagePickerTarget === 'collectionCover') {
            setCollectionForm(prev => ({ ...prev, coverImage: newSrc }));
          } else {
            handleAddPhotoToActiveCollection(newSrc);
          }
        }}
        currentImage={imagePickerTarget === 'collectionCover' ? collectionForm.coverImage : undefined}
      />

      {/* Full Photo Lightbox Preview */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setPreviewPhoto(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewPhoto(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center text-3xl transition-colors"
          >
            <i className="bx bx-x"></i>
          </button>
          <div className="max-w-4xl max-h-[85vh] p-2" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewPhoto}
              alt="Full preview"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-md p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl mx-auto">
              <i className="bx bx-trash"></i>
            </div>
            <div>
              <h4 className="font-['Playfair_Display'] font-bold text-lg text-[#1F1215]">
                Confirm Deletion
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                Are you sure you want to delete <span className="font-bold text-stone-900">"{deleteConfirm.title}"</span>?
                {deleteConfirm.type === 'collection' && ' This will remove the entire collection and all its photos.'}
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
                onClick={() => {
                  if (deleteConfirm.type === 'collection') {
                    handleDeleteCollection(deleteConfirm.categoryId);
                  } else if (deleteConfirm.photoIndex !== undefined) {
                    handleDeletePhoto(deleteConfirm.categoryId, deleteConfirm.photoIndex);
                  }
                }}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
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

export default AdminGallery;
