// Dosya Yolu: src/components/admin/ProductModal.tsx
'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { CleanProduct, Category } from '@/lib/types';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

const initialState: {
    name: string;
    description: string;
    price: string;
    category_id: string;
    image_url: string | null;
} = { name: '', description: '', price: '', category_id: '', image_url: null };

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
        const res = await fetch(`/api/categories?v=${new Date().getTime()}`);
        if (res.ok) setCategories(await res.json());
      } catch (e) {
        console.error("Kategoriler çekilemedi:", e);
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

        if (uploadError) throw new Error(`Resim yüklenemedi: ${uploadError.message}`);
        
        finalImageUrl = supabase.storage.from('product-images').getPublicUrl(uploadData.path).data.publicUrl;
      }

      const body = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
        image_url: finalImageUrl,
      };

      const res = await fetch(product ? `/api/products/${product.id}` : '/api/products', {
        method: product ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Bir hata oluştu.');
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
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>
        
        <div className="fixed inset-0">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-2xl transform rounded-2xl bg-white text-left align-middle shadow-2xl transition-all flex flex-col max-h-[90vh] overflow-hidden">
                {/* Başlık (Header) - Sabit */}
                <div className="flex-shrink-0 p-6 flex justify-between items-center border-b">
                    <Dialog.Title as="h3" className="text-xl font-poppins font-bold text-gray-800">
                      {product ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                    </Dialog.Title>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <XMarkIcon className="h-6 w-6 text-gray-500"/>
                    </button>
                </div>
                
                {/* Form Alanı - Kaydırılabilir */}
                <div className="flex-grow overflow-y-auto p-6">
                  <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                    {/* Ürün Adı */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Ürün Adı</label>
                      <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red" required />
                    </div>
                    {/* Açıklama */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Açıklama</label>
                      <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} className="block w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red" />
                    </div>
                    {/* Resim Yükleme Alanı */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ürün Resmi</label>
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                          {(previewUrl) ? (
                            <Image src={previewUrl} alt="Önizleme" width={128} height={128} className="mx-auto h-32 w-32 object-cover rounded-lg"/>
                          ) : (
                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                          )}
                          <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label htmlFor="image" className="relative cursor-pointer rounded-md bg-white font-semibold text-brand-red focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-red focus-within:ring-offset-2 hover:text-red-500">
                              <span>Bir dosya yükle</span>
                              <input id="image" name="image" type="file" className="sr-only" onChange={handleImageChange} accept="image/*"/>
                            </label>
                            <p className="pl-1">veya sürükleyip bırak</p>
                          </div>
                          <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF en fazla 10MB</p>
                        </div>
                      </div>
                    </div>
                    {/* Fiyat ve Kategori */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-1">Fiyat (TL)</label>
                        <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red" required step="0.01" />
                      </div>
                      <div>
                        <label htmlFor="category_id" className="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
                        <select name="category_id" id="category_id" value={formData.category_id} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red" required>
                            <option value="" disabled>Seçiniz...</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                      </div>
                    </div>
                    {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
                  </form>
                </div>

                {/* Alt Kısım (Footer) - Sabit */}
                <div className="flex-shrink-0 p-6 flex justify-end gap-3 border-t">
                  <button type="button" className="px-5 py-2.5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition" onClick={onClose} disabled={isSubmitting}>
                    İptal
                  </button>
                  <button type="submit" form="product-form" className="px-5 py-2.5 bg-brand-red text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:bg-gray-400" disabled={isSubmitting}>
                    {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
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