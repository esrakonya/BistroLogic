// Dosya Yolu: src/app/api/products/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // 1. Güvenlik Kontrolü: Giriş yapmış bir kullanıcı var mı?
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  // RLS'i atlamak için SERVICE_ROLE_KEY ile yeni bir "Süper Admin" istemcisi oluşturuyoruz.
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 2. Formdan gelen veriyi al.
  const productData = await request.json();

  // 3. Veriyi Supabase'e ekle.
  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category_id: productData.category_id,
        image_url: productData.image_url,
      },
    ]);
    //.select(); // Eklenen veriyi geri döndür

  if (error) {
    console.error('Supabase insert error:', error);
    return NextResponse.json({ error: 'Ürün eklenirken bir hata oluştu.' }, { status: 500 });
  }

  revalidatePath('/admin/products');
  revalidatePath('/menu');

  // 4. Başarılı yanıtı döndür.
  return NextResponse.json(data);
}