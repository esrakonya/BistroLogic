// Dosya Yolu: src/components/admin/ProductsTable.tsx
'use client'; 

import Link from 'next/link'; // Artık Link'e ihtiyacımız olmayabilir ama kalsın
import type { CleanProduct } from '@/lib/types';

// Bileşenin alacağı propların tipini tanımlıyoruz.
interface ProductsTableProps {
  products: CleanProduct[];
  onEdit: (product: CleanProduct) => void;
  onDeleteSuccess: () => void;
}

export default function ProductsTable({ products, onEdit, onDeleteSuccess }: ProductsTableProps) {
  
  // handleDelete fonksiyonu artık doğrudan API isteği gönderiyor ve başarılı olursa
  // ana bileşene (ProductsPage) haber veriyor.
  const handleDelete = async (productId: number) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onDeleteSuccess(); // "İşlem bitti, veriyi yenileyebilirsin" diye haber ver.
      } else {
        alert('Ürün silinemedi.');
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün Resmi</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün Adı</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-12 w-12 rounded-md object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-500">Resim Yok</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.categoryName || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price} TL</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => onEdit(product)} className="text-indigo-600 hover:text-indigo-900">
                  Düzenle
                </button>
                <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900 ml-4">
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}