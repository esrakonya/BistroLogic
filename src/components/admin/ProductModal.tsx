// Dosya Yolu: src/components/admin/ProductModal.tsx
'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
// Merkezi tip tanımlamalarımızı import ediyoruz.
import type { CleanProduct, Category } from '@/lib/types';

// Modal'ın alacağı props'ların (parametrelerin) tipini tanımlıyoruz.
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CleanProduct | null; // Düzenlenecek ürün (yeni ise null)
  onSaveSuccess: () => void; // Kaydetme başarılı olduğunda ana bileşeni haberdar edecek fonksiyon
}

export default function ProductModal({ isOpen, onClose, product, onSaveSuccess }: ProductModalProps) {
  // Formun içindeki verileri tutan state
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category_id: '', image_url: null as string | null });
  // Kategori dropdown'ı için kategorileri tutan state
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClientComponentClient();

  // Bu useEffect, modal açıldığında veya düzenlenecek ürün değiştiğinde çalışır.
  useEffect(() => {
    // Kategorileri çekme fonksiyonu
    const fetchCategories = async () => {
      const res = await fetch(`/api/categories?v=${new Date().getTime()}`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    };
    
    // Sadece modal açıkken kategorileri çekiyoruz (performans için).
    if (isOpen) {
        fetchCategories();
    }

    // Eğer 'product' prop'u varsa (Düzenleme modu), formu o ürünün bilgileriyle doldur.
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category_id: product.category_id?.toString() || '',
        image_url: product.image_url || null,
      });
    } else {
      // Yoksa (Yeni Ürün modu), formu temizle.
      setFormData({ name: '', description: '', price: '', category_id: '', image_url: null });
    }
    // Formu doldurduktan sonra, önceki resim seçimini de sıfırlıyoruz.
    setImageFile(null);
    setError(null);
  }, [product, isOpen]);

  // Formdaki input alanları değiştikçe state'i güncelleyen fonksiyon.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Resim dosyası seçildiğinde state'i güncelleyen fonksiyon.
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  // Form gönderildiğinde (Kaydet butonuna basıldığında) çalışacak ana fonksiyon.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    let finalImageUrl = product?.image_url || null;

    // 1. Yeni bir resim seçilmişse, onu Supabase Storage'a yükle.
    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        setError(`Resim yüklenemedi: ${uploadError.message}`);
        setIsSubmitting(false);
        return;
      }
      
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(uploadData.path);
      
      finalImageUrl = urlData.publicUrl;
    }

    // 2. API'ye gönderilecek olan nihai veriyi hazırla.
    const body = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category_id: parseInt(formData.category_id),
      image_url: finalImageUrl,
    };

    const apiEndpoint = product ? `/api/products/${product.id}` : '/api/products';
    const method = product ? 'PUT' : 'POST';

    try {
      const res = await fetch(apiEndpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        onSaveSuccess(); // Ana bileşene "İşlem başarılı, listeyi yenile" diye haber ver.
        onClose(); // Ve kendini kapat.
      } else {
        const data = await res.json();
        setError(data.error || 'Bir hata oluştu.');
      }
    } catch (err) {
      setError('İstek gönderilirken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-60" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-gray-50 p-8 text-left align-middle shadow-2xl transition-all">
                <Dialog.Title as="h3" className="text-2xl font-poppins font-bold leading-6 text-brand-dark border-b pb-4">
                  {product ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                </Dialog.Title>
                
                <form onSubmit={handleSubmit} className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
                      <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring focus:ring-brand-red focus:ring-opacity-50" required />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                      <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring focus:ring-brand-red focus:ring-opacity-50" />
                    </div>
                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Ürün Resmi</label>
                      <input type="file" name="image" id="image" onChange={handleImageChange} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                      {product && formData.image_url && !imageFile && (
                        <div className="mt-2">
                          <img src={formData.image_url} alt={product.name} className="h-20 w-20 object-cover rounded-md"/>
                          <p className="text-xs text-gray-500 mt-1">Mevcut resim. Değiştirmek için yeni bir resim seçin.</p>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Fiyat (TL)</label>
                            <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring focus:ring-brand-red focus:ring-opacity-50" required step="0.01" />
                        </div>
                        <div>
                            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                            <select name="category_id" id="category_id" value={formData.category_id} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring focus:ring-brand-red focus:ring-opacity-50" required>
                                <option value="" disabled>Seçiniz...</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                    </div>
                  </div>
                  
                  {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

                  <div className="mt-8 pt-4 border-t flex justify-end space-x-3">
                    <button type="button" className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={onClose} disabled={isSubmitting}>
                      İptal
                    </button>
                    <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-brand-red px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:bg-gray-400" disabled={isSubmitting}>
                      {isSubmitting ? 'Kaydediliyor...' : (product ? 'Değişiklikleri Kaydet' : 'Ürünü Kaydet')}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}