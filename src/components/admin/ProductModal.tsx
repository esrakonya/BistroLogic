// Dosya Yolu: src/components/admin/ProductModal.tsx
'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { CleanProduct, Category } from '@/lib/types';
import { XMarkIcon, PhotoIcon, ArrowPathIcon, SparklesIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const initialState = { 
  name: '', 
  description: '', 
  price: '', 
  category_id: '', 
  image_url: null as string | null, 
  is_featured: false 
};

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CleanProduct | null;
  onSaveSuccess: () => void;
}

export default function ProductModal({ isOpen, onClose, product, onSaveSuccess }: ProductModalProps) {
  const [formData, setFormData] = useState(initialState);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/admin/categories?v=${new Date().getTime()}`, { credentials: 'include' });
        if (res.ok) setCategories(await res.json());
      } catch (e) {
        console.error("Failed to fetch categories:", e);
      }
    };
    
    if (isOpen) {
        fetchCategories();
        if (product) {
          setFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price?.toString() || '',
            category_id: product.category_id?.toString() || '',
            image_url: product.image_url || null,
            is_featured: product.is_featured || false,
          });
          setPreviewUrl(product.image_url || null);
        } else {
          setFormData(initialState);
          setPreviewUrl(null);
        }
        setImageFile(null);
        setError(null);
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      let finalImageUrl = formData.image_url;

      if (imageFile) {
        const fileName = `${Date.now()}_${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile, { upsert: true });

        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
        
        finalImageUrl = supabase.storage.from('product-images').getPublicUrl(uploadData.path).data.publicUrl;
      }

      const body = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
        image_url: finalImageUrl,
        is_featured: formData.is_featured,
      };

      const apiEndpoint = product ? `/api/admin/products/${product.id}` : '/api/admin/products';
      const method = product ? 'PUT' : 'POST';

      const res = await fetch(apiEndpoint, {
        method,
        credentials: 'include', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'System error occurred while saving.');
      }
      
      onSaveSuccess();
      onClose();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md" />
        </Transition.Child>
        
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95 translate-y-8" enterTo="opacity-100 scale-100 translate-y-0" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100 translate-y-0" leaveTo="opacity-0 scale-95 translate-y-8">
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-[2.5rem] bg-white text-left align-middle shadow-2xl transition-all border border-neutral-100 flex flex-col max-h-[90vh]">
                
                {/* --- HEADER --- */}
                <div className="p-8 flex justify-between items-start border-b border-neutral-50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-neutral-400 mb-1">
                          <ShoppingBagIcon className="h-4 w-4" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Product Catalog</span>
                      </div>
                      <Dialog.Title as="h3" className="text-3xl font-serif font-bold text-neutral-900 leading-tight">
                        {product ? 'Refine Product' : 'New Product'}
                      </Dialog.Title>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-all">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                
                <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                  <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Basic Info */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-1">Product Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-neutral-800" placeholder="e.g. Signature Truffle Burger" required />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="description" className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-1">Description</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-neutral-800 leading-relaxed" placeholder="Describe the ingredients and taste..." />
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-1">Visual Representation</label>
                      <div className="relative group">
                        <div className={`mt-2 flex justify-center rounded-3xl border-2 border-dashed transition-all p-10 ${previewUrl ? 'border-neutral-900 bg-white' : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100'}`}>
                          <div className="text-center">
                            {previewUrl ? (
                              <div className="relative h-40 w-40 mx-auto shadow-2xl rounded-2xl overflow-hidden border-4 border-white">
                                <Image src={previewUrl} alt="Preview" fill className="object-cover"/>
                              </div>
                            ) : (
                              <PhotoIcon className="mx-auto h-12 w-12 text-neutral-300" aria-hidden="true" />
                            )}
                            <div className="mt-4 flex flex-col text-sm text-neutral-600">
                              <label htmlFor="image" className="relative cursor-pointer font-bold text-neutral-900 hover:underline">
                                <span>{previewUrl ? 'Change Artwork' : 'Upload Image'}</span>
                                <input id="image" name="image" type="file" className="sr-only" onChange={handleImageChange} accept="image/*"/>
                              </label>
                              <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-tighter">WebP, PNG or JPG (Max 10MB)</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price & Category Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="price" className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-1">Price (USD/TL)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">$</span>
                          <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="w-full pl-8 p-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-neutral-800 font-bold" required step="0.01" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="category_id" className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-1">Placement Category</label>
                        <select name="category_id" id="category_id" value={formData.category_id} onChange={handleChange} className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-neutral-800 font-medium appearance-none cursor-pointer" required>
                            <option value="" disabled>Select Category</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                      </div>
                    </div>
                    
                    {/* Featured Toggle */}
                    <div className="flex items-center p-4 bg-neutral-900 rounded-2xl text-white shadow-lg">
                      <div className="flex-1 flex items-center gap-3">
                         <div className="bg-white/20 p-2 rounded-lg">
                            <SparklesIcon className="h-5 w-5 text-yellow-400" />
                         </div>
                         <div>
                            <p className="text-sm font-bold">Feature on Landing Page</p>
                            <p className="text-[10px] text-white/50 uppercase tracking-widest">Mark as "Chef's Choice"</p>
                         </div>
                      </div>
                      <input
                        id="is_featured"
                        name="is_featured"
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={handleChange}
                        className="h-6 w-6 rounded-lg border-white/20 bg-white/10 text-white focus:ring-offset-neutral-900 focus:ring-white cursor-pointer"
                      />
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold text-center animate-shake">
                        {error}
                      </div>
                    )}
                  </form>
                </div>

                {/* --- ACTIONS --- */}
                <div className="p-8 flex justify-end gap-3 border-t border-neutral-50 bg-neutral-50/30">
                  <button type="button" className="px-8 py-4 text-neutral-500 font-bold hover:text-neutral-900 transition-colors uppercase tracking-widest text-xs" onClick={onClose} disabled={isSubmitting}>
                    Cancel
                  </button>
                  <button type="submit" form="product-form" className="flex items-center gap-2 px-12 py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-2xl transition-all shadow-xl active:scale-95 disabled:bg-neutral-200" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      product ? 'Update Details' : 'Publish Product'
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}