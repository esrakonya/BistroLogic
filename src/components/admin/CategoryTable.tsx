// Dosya Yolu: /src/components/admin/CategoryTable.tsx
'use client';

import type { Category } from '@/lib/types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDeleteSuccess: () => void; // Bu prop geri geldi
}

export default function CategoryTable({ categories, onEdit, onDeleteSuccess }: CategoryTableProps) {
  
    const handleDelete = async (categoryId: number) => {
        if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
          try {
            const res = await fetch(`/api/admin/categories/${categoryId}`, { 
              // 1. Gönderilen metodun 'DELETE' olduğundan eminiz.
              method: 'DELETE',
              // 2. Kimlik doğrulama cookie'lerini isteğe dahil ediyoruz.
              credentials: 'include',
            });
    
            const responseData = await res.json();
    
            if (!res.ok) {
              // Bu, 404 dahil tüm HTTP hatalarını yakalar.
              throw new Error(responseData.error || `Bir hata oluştu: ${res.statusText}`);
            }
    
            toast.success(responseData.message || 'Kategori başarıyla silindi!');
            onDeleteSuccess();
    
          } catch (error: any) {
            // Eğer 'res.json()' başarısız olursa (örneğin HTML gelirse),
            // veya yukarıda bir hata fırlatırsak, bu blok çalışır.
            toast.error(error.message);
          }
        }
      };
  if (categories.length === 0) {
    return <p className="text-center text-gray-500 py-8">Gösterilecek kategori bulunmamaktadır.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Kategori Adı</th>
            <th className="relative px-6 py-3"><span className="sr-only">İşlemler</span></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-500">{category.id}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.name}</td>
              <td className="px-6 py-4 text-right text-sm space-x-4">
                <button onClick={() => onEdit(category)} className="text-gray-500 hover:text-brand-red p-1 rounded-full"><PencilIcon className="h-5 w-5"/></button>
                <button onClick={() => handleDelete(category.id)} className="text-gray-500 hover:text-red-600 p-1 rounded-full"><TrashIcon className="h-5 w-5"/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}