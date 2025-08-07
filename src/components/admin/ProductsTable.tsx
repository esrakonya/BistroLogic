// Dosya Yolu: src/components/admin/ProductsTable.tsx
'use client'; 

import type { CleanProduct } from '@/lib/types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface ProductsTableProps {
  products: CleanProduct[];
  onEdit: (product: CleanProduct) => void;
  onDeleteSuccess: () => void;
}

export default function ProductsTable({ products, onEdit, onDeleteSuccess }: ProductsTableProps) {
  
  const handleDelete = async (productId: number) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      try {
        const res = await fetch(`/api/admin/products/${productId}`, { 
          method: 'DELETE',
          credentials: 'include' // Bu, kimlik doğrulama için kritik öneme sahiptir.
        });
        if (!res.ok) throw new Error('Ürün silinemedi.');
        onDeleteSuccess();
      } catch (error) {
        console.error(error);
        alert('Bir hata oluştu. Ürün silinemedi.');
      }
    }
  };
  
  if (products.length === 0) {
    return <p className="text-center text-gray-500 py-8">Gösterilecek ürün bulunmamaktadır.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ürün</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fiyat</th>
            <th scope="col" className="relative px-6 py-3"><span className="sr-only">İşlemler</span></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 h-12 w-12 relative">
                    {product.image_url ? (
                      <Image 
                      src={product.image_url} 
                      alt={product.name} 
                      fill 
                      sizes="48px"
                      className="rounded-md object-cover" 
                    />
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-400">Resim Yok</div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">ID: {product.id}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.categoryName || 'Belirtilmemiş'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{product.price?.toFixed(2)} TL</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                <button onClick={() => onEdit(product)} className="text-gray-500 hover:text-brand-red transition-colors p-1 rounded-full">
                  <PencilIcon className="h-5 w-5"/>
                </button>
                <button onClick={() => handleDelete(product.id)} className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full">
                  <TrashIcon className="h-5 w-5"/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}