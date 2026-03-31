// Dosya Yolu: /src/components/admin/CategoryModal.tsx
'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { XMarkIcon, TagIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
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
      const method = category ? 'PUT' : 'POST';
      const apiEndpoint = category 
        ? `/api/admin/categories/${category.id}` 
        : '/api/admin/categories';
      
      const res = await fetch(apiEndpoint, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong while saving.');
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
        {/* Backdrop: Buzlu cam efekti */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-[2.5rem] bg-white p-8 text-left align-middle shadow-2xl transition-all border border-neutral-100">
                
                {/* HEADER */}
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-neutral-400 mb-1">
                        <TagIcon className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Management</span>
                    </div>
                    <Dialog.Title as="h3" className="text-2xl font-serif font-bold text-neutral-900 leading-tight">
                      {category ? 'Edit Category' : 'Create Category'}
                    </Dialog.Title>
                  </div>
                  <button 
                    onClick={onClose} 
                    className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-all"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-1">
                        Category Name
                      </label>
                      <input 
                        type="text" 
                        id="name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Signature Dishes"
                        className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-neutral-800"
                        required 
                      />
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-xl border border-red-100 animate-pulse text-center">
                      {error}
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="pt-6 flex gap-3">
                     <button 
                       type="button" 
                       onClick={onClose} 
                       disabled={isSubmitting}
                       className="flex-1 px-6 py-4 rounded-2xl text-sm font-bold text-neutral-500 hover:bg-neutral-50 transition-colors"
                     >
                       Cancel
                     </button>
                     <button 
                       type="submit" 
                       disabled={isSubmitting}
                       className="flex-[2] bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-200 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-neutral-200 active:scale-95 flex items-center justify-center gap-2"
                     >
                       {isSubmitting ? (
                         <>
                           <ArrowPathIcon className="h-5 w-5 animate-spin" />
                           Saving...
                         </>
                       ) : (
                         category ? 'Update Category' : 'Save Category'
                       )}
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