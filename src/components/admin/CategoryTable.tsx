// Dosya Yolu: /src/components/admin/CategoryTable.tsx
'use client';

import type { Category } from '@/lib/types';
import { PencilSquareIcon, TrashIcon, InboxIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDeleteSuccess: () => void;
}

export default function CategoryTable({ categories, onEdit, onDeleteSuccess }: CategoryTableProps) {
  
  const handleDelete = async (categoryId: number) => {
    // Kurumsal bir dille onay sorusu
    if (window.confirm('Are you sure you want to permanently delete this category? This action cannot be undone.')) {
      try {
        const res = await fetch(`/api/admin/categories/${categoryId}`, { 
          method: 'DELETE',
          credentials: 'include',
        });

        const responseData = await res.json();

        if (!res.ok) {
          throw new Error(responseData.error || `System Error: ${res.statusText}`);
        }

        toast.success(responseData.message || 'Category removed successfully.');
        onDeleteSuccess();

      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-neutral-200">
        <InboxIcon className="h-12 w-12 text-neutral-200 mb-4" />
        <p className="text-neutral-400 font-medium tracking-tight">No categories found in the system.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-neutral-50/50">
            <th className="px-8 py-5 text-left text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-100">
              ID
            </th>
            <th className="px-8 py-5 text-left text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-100">
              Category Name
            </th>
            <th className="px-8 py-5 text-right text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-100">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {categories.map((category) => (
            <tr 
              key={category.id} 
              className="group hover:bg-neutral-50/80 transition-all duration-200"
            >
              <td className="px-8 py-5 text-sm font-mono text-neutral-400">
                #{category.id}
              </td>
              <td className="px-8 py-5">
                <span className="text-sm font-semibold text-neutral-900 group-hover:text-black transition-colors">
                  {category.name}
                </span>
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onClick={() => onEdit(category)} 
                    title="Edit Category"
                    className="p-2.5 text-neutral-400 hover:text-neutral-900 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-neutral-100"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)} 
                    title="Delete Category"
                    className="p-2.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                  >
                    <TrashIcon className="h-5 w-5" />
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