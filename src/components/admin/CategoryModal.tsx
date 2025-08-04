// Dosya Yolu: /src/components/admin/CategoryModal.tsx
'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import type { Category } from '@/lib/types';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSaveSuccess: () => void;
}

export default function CategoryModal({ isOpen, onClose, category, onSaveSuccess }: CategoryModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(category ? category.name : '');
      setError(null);
    }
  }, [category, isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const apiEndpoint = category ? `/api/admin/categories/${category.id}` : '/api/admin/categories';
      const method = category ? 'PUT' : 'POST';
      
      const res = await fetch(apiEndpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
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
        {/* ... Modal'ın genel yapısı (overlay, panel vb.) ProductModal ile aynı ... */}
        {/* Sadece içerik farklı */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
               <div className="flex justify-between items-center pb-3 border-b">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {category ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}
                  </Dialog.Title>
                  <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><XMarkIcon className="h-5 w-5"/></button>
               </div>
               <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Kategori Adı</label>
                      <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" 
                        required 
                      />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <div className="pt-4 flex justify-end gap-2">
                     <button type="button" onClick={onClose} disabled={isSubmitting}>İptal</button>
                     <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}</button>
                  </div>
               </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}