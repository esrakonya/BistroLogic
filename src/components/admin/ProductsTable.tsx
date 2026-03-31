// Dosya Yolu: src/components/admin/ProductsTable.tsx
'use client'; 

import type { CleanProduct } from '@/lib/types';
import { PencilSquareIcon, TrashIcon, InboxIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { toast } from 'react-toastify';

interface ProductsTableProps {
  products: CleanProduct[];
  onEdit: (product: CleanProduct) => void;
  onDeleteSuccess: () => void;
}

export default function ProductsTable({ products, onEdit, onDeleteSuccess }: ProductsTableProps) {
  
  const handleDelete = async (productId: number) => {
    if (window.confirm('Are you sure you want to remove this product? This action is permanent.')) {
      try {
        const res = await fetch(`/api/admin/products/${productId}`, { 
          method: 'DELETE',
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to delete product.');
        
        toast.success('Product removed from inventory.');
        onDeleteSuccess();
      } catch (error) {
        console.error(error);
        toast.error('An error occurred while deleting.');
      }
    }
  };
  
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <InboxIcon className="h-16 w-16 text-neutral-200 mb-4" />
        <h3 className="text-lg font-bold text-neutral-900">No Products Found</h3>
        <p className="text-neutral-400 font-light">Your inventory is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-neutral-50/50">
            <th className="px-8 py-5 text-left text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-100">
              Product Details
            </th>
            <th className="px-8 py-5 text-left text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-100">
              Category
            </th>
            <th className="px-8 py-5 text-left text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-100">
              Price
            </th>
            <th className="px-8 py-5 text-right text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-100">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {products.map((product) => (
            <tr key={product.id} className="group hover:bg-neutral-50/50 transition-all duration-200">
              {/* Product Info */}
              <td className="px-8 py-5 whitespace-nowrap">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 flex-shrink-0">
                    {product.image_url ? (
                      <Image 
                        src={product.image_url} 
                        alt={product.name} 
                        fill 
                        sizes="56px"
                        className="rounded-2xl object-cover shadow-sm border border-neutral-100" 
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-2xl bg-neutral-100 flex items-center justify-center border border-neutral-200">
                        <PhotoIcon className="h-6 w-6 text-neutral-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-900 leading-none mb-1">
                      {product.name}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-tighter">
                      SKU-00{product.id}
                    </span>
                  </div>
                </div>
              </td>

              {/* Category Badge */}
              <td className="px-8 py-5 whitespace-nowrap">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-bold uppercase tracking-wider">
                  {product.categoryName || 'General'}
                </span>
              </td>

              {/* Price */}
              <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-neutral-900">
                ${product.price?.toFixed(2)}
              </td>

              {/* Actions: Sadece hover anında görünür */}
              <td className="px-8 py-5 whitespace-nowrap text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <button 
                    onClick={() => onEdit(product)} 
                    title="Refine Product"
                    className="p-2.5 text-neutral-400 hover:text-neutral-900 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-neutral-100"
                  >
                    <PencilSquareIcon className="h-5 w-5 stroke-2" />
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)} 
                    title="Remove Product"
                    className="p-2.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                  >
                    <TrashIcon className="h-5 w-5 stroke-2" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}