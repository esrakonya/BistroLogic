// Dosya Yolu: /src/app/api/admin/products/route.ts

import { NextResponse } from 'next/server';

// Bu satır, Next.js'e bu rotanın her zaman dinamik olarak çalıştırılmasını
// ve asla önbelleğe alınmamasını söyler. Bu çok önemli.
export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Supabase URL veya Key yapılandırılmamış.' }, { status: 500 });
  }

  // Supabase'in REST API'sini doğrudan 'fetch' ile çağırıyoruz.
  // Bu, bize önbellekleme üzerinde tam kontrol sağlar.
  const endpoint = `${supabaseUrl}/rest/v1/products?select=*,categories(name)&order=id`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      // DEĞİŞİKİK BURADA: Bu 'cache' ayarı, Next.js'in bu isteğin
      // sonucunu önbelleğe almasını engeller. Sorunun ana çözümü budur.
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Supabase\'den veri alınamadı.');
    }

    const data = await response.json();

    // Sizin kodunuzdaki aynı veri formatlama mantığını kullanıyoruz.
    const cleanData = data.map((p: any) => ({
      ...p,
      categoryName: p.categories?.name || null,
      categories: undefined, // Gereksiz alanı temizliyoruz
    }));

    return NextResponse.json(cleanData);

  } catch (error: any) {
    console.error("API Hatası: /api/admin/products", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}