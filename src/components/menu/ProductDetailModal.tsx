// Dosya Yolu: /src/components/menu/ProductDetailModal.tsx
'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
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
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {/* 
                DEĞİŞİKLİK 1: Modal Boyutu ve Çerçevesi
                - max-w-lg: Masaüstündeki maksimum genişliği düşürdük. Artık daha kompakt ve dikey.
                - border-2 border-brand-red: İstediğiniz gibi, doğrudan kırmızı bir çerçeve eklendi.
              */}
              <Dialog.Panel 
                className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-brand-surface text-left align-middle shadow-xl transition-all border-2 border-brand-red"
              >
                {/* 
                  DEĞİŞİKLİK 2: Kapatma Butonu
                  - Buton artık panelin İÇ sağ üst köşesinde. 'p-4' ile panele boşluk verip,
                    butonu 'top-4 right-4' ile o boşluğun içine yerleştirdik.
                  - Bu, hem şık durur hem de içeriğe müdahale etmez.
                */}
                 <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 z-20 p-1 rounded-full text-brand-dark/50 hover:text-brand-dark hover:bg-black/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-dark"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
                
                {/* 
                  DEĞİŞİKLİK 3: İçerik Düzeni
                  - Artık web veya mobilde iki sütunlu bir yapı yok.
                  - Tek sütunlu, dikey bir akış var. Bu, 'max-w-lg' ile birleşince
                    hem mobilde hem de webde tutarlı ve dikey bir görünüm sağlar.
                  - 'grid' yapısı kaldırıldı, yerine 'flex flex-col' geldi.
                */}
                <div className="flex flex-col">
                  {/* Resim Bölümü */}
                  <div className="relative h-64 w-full">
                    {product.image_url ? (
                      <Image 
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover" // Köşeleri yuvarlaklaştırmaya gerek kalmadı
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100">
                        <p className="font-sans text-sm text-brand-muted">Fotoğraf Yok</p>
                      </div>
                    )}
                  </div>

                  {/* İçerik Bölümü */}
                  <div className="flex flex-col p-6">
                    {product.categoryName && (
                       <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-red">
                         {product.categoryName}
                       </p>
                    )}
                    
                    <Dialog.Title
                      as="h3"
                      className="mt-2 font-serif text-3xl font-bold leading-tight text-brand-dark"
                    >
                      {product.name}
                    </Dialog.Title>

                    <p className="mt-4 text-base text-brand-muted">
                      {product.description}
                    </p>

                    {product.ingredients && product.ingredients.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-sans text-base font-semibold text-brand-dark">İçindekiler:</h4>
                        <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-brand-muted">
                          {product.ingredients.map(ing => <li key={ing.name}>{ing.name}</li>)}
                        </ul>
                      </div>
                    )}
                    
                    <div className="mt-8 flex-grow flex items-end justify-between">
                       <p className="font-serif text-3xl font-bold text-brand-dark">
                         {product.price.toFixed(2)} TL
                       </p>
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