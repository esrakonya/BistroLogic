// Dosya Yolu: /src/components/menu/ProductDetailModal.tsx
'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ShoppingBagIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  ingredients: { name: string }[];
  categoryName?: string;
}

interface ProductDetailModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailModal({ isOpen, product, onClose }: ProductDetailModalProps) {
  if (!product) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        
        {/* --- BACKDROP: High-end Blur Effect --- */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-900/70 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-10"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-10"
            >
              <Dialog.Panel 
                className="w-full max-w-lg transform overflow-hidden rounded-[2.5rem] bg-white text-left align-middle shadow-2xl transition-all border border-neutral-100"
              >
                {/* CLOSE BUTTON */}
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 z-30 p-2 rounded-full bg-white/80 backdrop-blur-md text-neutral-900 shadow-xl hover:scale-110 transition-all active:scale-95"
                >
                  <XMarkIcon className="h-5 w-5 stroke-2" />
                </button>
                
                <div className="flex flex-col">
                  {/* --- IMAGE SECTION --- */}
                  <div className="relative h-80 w-full overflow-hidden">
                    {product.image_url ? (
                      <Image 
                        src={product.image_url}
                        alt={product.name}
                        fill
                        priority
                        className="object-cover transition-transform duration-1000 hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-neutral-300">
                        <ShoppingBagIcon className="h-12 w-12 opacity-20" />
                      </div>
                    )}
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* --- CONTENT SECTION --- */}
                  <div className="p-8 md:p-10 space-y-6">
                    
                    {/* Category & Badge */}
                    <div className="flex items-center justify-between">
                       <span className="px-4 py-1 rounded-full bg-neutral-100 text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                         {product.categoryName || 'Signature'}
                       </span>
                       <div className="flex items-center gap-1 text-yellow-500">
                          <SparklesIcon className="h-4 w-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Premium Choice</span>
                       </div>
                    </div>
                    
                    {/* Title & Description */}
                    <div className="space-y-3">
                        <Dialog.Title as="h3" className="font-serif text-4xl font-bold text-neutral-900 leading-tight">
                        {product.name}
                        </Dialog.Title>
                        <p className="text-neutral-500 font-light leading-relaxed text-lg">
                        {product.description || 'Experience the perfect harmony of flavors, meticulously crafted by our chefs using only the finest seasonal ingredients.'}
                        </p>
                    </div>

                    {/* --- INGREDIENTS: Modern Pill Style --- */}
                    {product.ingredients && product.ingredients.length > 0 && (
                      <div className="pt-4">
                        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4">Key Ingredients</h4>
                        <div className="flex flex-wrap gap-2">
                          {product.ingredients.map(ing => (
                            <span key={ing.name} className="px-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-sm font-medium text-neutral-700">
                                {ing.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* --- FOOTER: Price --- */}
                    <div className="mt-10 pt-8 border-t border-neutral-100 flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Price per serving</span>
                          <p className="font-serif text-4xl font-black text-neutral-900 mt-1">
                            ${product.price.toFixed(2)}
                          </p>
                       </div>
                       
                       <button 
                         onClick={onClose}
                         className="bg-neutral-900 hover:bg-neutral-800 text-white px-10 py-4 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-neutral-200 active:scale-95"
                       >
                         CLOSE
                       </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}