// Dosya Yolu: src/app/admin/content/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';

// site_content tablosundaki bir satırın tipini tanımlıyoruz.
interface SiteContent {
  id: number;
  key: string;
  value: string;
  description: string;
}

export default function ContentPage() {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content', { cache: 'no-store' });
      if (!res.ok) throw new Error('İçerik verisi alınamadı.');
      const data = await res.json();
      setContents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Formdaki bir alan değiştiğinde state'i güncelleyen fonksiyon.
  const handleInputChange = (key: string, value: string) => {
    setContents(currentContents =>
      currentContents.map(c => (c.key === key ? { ...c, value } : c))
    );
  };

  // Form gönderildiğinde çalışacak fonksiyon.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // DEĞİŞİKLİK BURADA: Artık tüm 'contents' dizisini gönderiyoruz.
    const res = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contents), // 'phoneNumberContent' yerine 'contents'
    });

    if (res.ok) {
      setSuccess('Değişiklikler başarıyla kaydedildi!');
      setTimeout(() => setSuccess(null), 3000);
    } else {
      const data = await res.json();
      setError(data.error || 'Bir hata oluştu.');
    }
  };

  if (loading) return <div>İçerikler yükleniyor...</div>;

  return (
    <div>
      <h1 className="text-3xl font-poppins font-bold mb-8">Site İçerik Yönetimi</h1>
      
      {/* Başarı veya Hata Mesajları için Modern "Toast" Benzeri Bildirimler */}
      {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert"><p>{success}</p></div>}
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert"><p>{error}</p></div>}
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        {contents.map(content => (
          <div key={content.key}>
            <label htmlFor={content.key} className="block text-gray-700 font-bold mb-2">
              {content.description || content.key}
            </label>
            {/* 'value' sütununda çok satırlı metin (textarea) veya tek satırlı (input) olmasına göre karar verelim. */}
            {content.value.includes('\n') || content.key.includes('text') ? (
              <textarea
                id={content.key}
                value={content.value}
                onChange={e => handleInputChange(content.key, e.target.value)}
                rows={5}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />
            ) : (
              <input
                type="text"
                id={content.key}
                value={content.value}
                onChange={e => handleInputChange(content.key, e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />
            )}
          </div>
        ))}
        
        <div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors duration-300">
            Tüm Değişiklikleri Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}