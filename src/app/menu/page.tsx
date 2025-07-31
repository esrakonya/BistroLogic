// Dosya Yolu: src/app/menu/page.tsx
'use client'; 

import { useState, useEffect, Fragment } from 'react';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react'; // Modal için
import { XMarkIcon } from '@heroicons/react/24/solid';
import MenuSkeleton from '@/components/skeletons/MenuSkeleton';
// --- Tip Tanımlamaları ---
interface Ingredient {
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  ingredients: Ingredient[];
}

interface Category {
  id: number;
  name: string;
  products: Product[];
}

interface ProductWithCategoryName extends Product {
  categoryName: string;
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  useEffect(() => {
    const getMenuData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/menu?v=${new Date().getTime()}`);
        if (!res.ok) {
          // Sunucudan gelen hata mesajını da alıp gösterelim.
          const errorData = await res.json();
          console.error("API'den gelen hata:", errorData);
          throw new Error(`Menü verisi alınamadı: ${errorData.error || res.statusText}`);
        }
        const data = await res.json();
        setCategories(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getMenuData();
  }, []); 

  const filteredProducts: ProductWithCategoryName[] = 
    selectedCategory === 'all'
      ? categories.flatMap(category => 
          category.products.map(product => ({
            ...product,
            categoryName: category.name
          }))
        )
      : (() => {
          const category = categories.find(c => c.id === selectedCategory);
          if (category && category.products) {
            return category.products.map(product => ({
              ...product,
              categoryName: category.name
            }));
          }
          return [];
        })();
  
  if (loading) return <MenuSkeleton />;
  if (error) return <div className="text-center py-20 text-red-500 font-poppins">Hata: {error}</div>;

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl md:text-5xl font-poppins font-bold text-center text-brand-dark mb-12">
        Lezzet Menümüz
      </h1>

      {/* ----- YENİ ve ŞIK KATEGORİ FİLTRELEME BÖLÜMÜ ----- */}
      <div className="flex justify-center mb-12">
        <div className="flex flex-wrap justify-center items-center bg-white p-1.5 rounded-full shadow-md border border-gray-200 gap-2">
          
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 text-sm md:text-base font-poppins font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-opacity-50 ${
              selectedCategory === 'all' 
              ? 'bg-brand-red text-white shadow-sm' 
              : 'text-brand-dark hover:bg-gray-100'
            }`}
          >
            Tümü
          </button>
          
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-5 py-2.5 text-sm md:text-base font-poppins font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-opacity-50 ${
                selectedCategory === category.id 
                ? 'bg-brand-red text-white shadow-sm' 
                : 'text-brand-dark hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      {/* --------------------------------------------------- */}
      
      {/* Filtrelenmiş Ürün Listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
            {product.image_url && (
              <div className="relative w-full h-56">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex-grow">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-xl font-poppins font-bold text-brand-dark">{product.name}</h3>
                  <p className="text-xl font-poppins font-semibold text-brand-red ml-4 whitespace-nowrap">
                    {product.price} TL
                  </p>
                </div>
                <p className="mt-2 text-gray-700">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Eğer filtre sonucu ürün yoksa gösterilecek mesaj */}
      {filteredProducts.length === 0 && !loading && (
        <p className="text-center text-gray-500 py-10 font-poppins">Bu kategoride gösterilecek ürün bulunmamaktadır.</p>
      )}

      {/* ----- YENİ EKLENEN ÜRÜN DETAY MODAL'I ----- */}
      <Transition appear show={selectedProduct !== null} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setSelectedProduct(null)}>
          {/* Arka plan karartması */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-60" />
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
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {selectedProduct && (
                    <>
                      {/* Kapatma Butonu */}
                      <button 
                        onClick={() => setSelectedProduct(null)} 
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>

                      {/* Modal İçeriği */}
                      {selectedProduct.image_url && (
                        <div className="relative w-full h-64 rounded-lg overflow-hidden">
                          <Image 
                            src={selectedProduct.image_url} 
                            alt={selectedProduct.name} 
                            fill 
                            style={{ objectFit: 'cover' }} 
                          />
                        </div>
                      )}
                      
                      <Dialog.Title as="h3" className="mt-4 text-2xl font-poppins font-bold leading-6 text-brand-dark">
                        {selectedProduct.name}
                      </Dialog.Title>
                      
                      <div className="mt-2">
                        <p className="text-lg text-brand-red font-semibold">
                          {selectedProduct.price} TL
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                          {selectedProduct.description}
                        </p>
                      </div>

                      {/* Malzemeler Bölümü */}
                      {selectedProduct.ingredients && selectedProduct.ingredients.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-poppins font-semibold text-brand-dark">İçindekiler:</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedProduct.ingredients.map((ingredient, index) => (
                              <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                {ingredient.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* ------------------------------------------- */}

    </div>
  );
}