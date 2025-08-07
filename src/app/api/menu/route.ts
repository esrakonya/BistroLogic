// Dosya Yolu: /src/app/api/menu/route.ts

// DEĞİŞİKLİK: 'createClient' yerine, Next.js için özel olarak tasarlanmış
// 'createRouteHandlerClient' ve 'cookies' import edildi.
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // DEĞİŞİKLİK: Artık Supabase istemcisini bu güvenli yöntemle oluşturuyoruz.
  // Bu, .env'deki anonim anahtarı otomatik olarak kullanır ve RLS kurallarına uyar.
  // Artık manuel olarak URL ve KEY kontrolü yapmamıza gerek yok.
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        products (
          id,
          name,
          description,
          price,
          is_available,
          image_url,
          product_ingredients (
            ingredients ( name )
          )
        )
      `)
      // 'display_order' sütununuz varsa bu satırı aktif bırakın, yoksa silebilirsiniz.
      // Eğer hata veriyorsa, .order('id', { ascending: true }) olarak değiştirin.
      .order('display_order', { ascending: true });

    if (error) {
      console.error("Supabase API Hatası (/api/menu):", error);
      // Hata mesajını daha anlaşılır hale getirdik.
      throw new Error(error.message);
    }

    // Veri temizleme işlemi aynı kalıyor, bu kısım zaten doğruydu.
    const cleanedData = data.map(category => ({
      id: category.id,
      name: category.name,
      products: category.products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        is_available: product.is_available,
        image_url: product.image_url,
        ingredients: product.product_ingredients.map((pi: any) => pi.ingredients.name)
      }))
    }));

    return NextResponse.json(cleanedData);

  } catch (err: any) {
    console.error("API rotasında (/api/menu) genel bir hata oluştu:", err);
    return NextResponse.json({ error: 'Menü verisi alınırken bir hata oluştu.' }, { status: 500 });
  }
}