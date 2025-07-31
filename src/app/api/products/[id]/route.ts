// Dosya Yolu: src/app/api/products/[id]/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // 1. Güvenlik Kontrolü
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 2. Gerekli verileri al
  const productId = params.id;
  const productData = await request.json();

  // 3. Supabase'e güncelleme komutunu gönder
  const { error } = await supabaseAdmin
    .from('products')
    .update({...productData})
    .eq('id', productId);

  if (error) {
    console.error('Supabase update error:', error);
    return NextResponse.json({ error: 'Ürün güncellenirken bir hata oluştu.' }, { status: 500 });
  }

  revalidatePath('/admin/products');
  revalidatePath('/menu');

  // 4. Başarılı yanıtı döndür
  return NextResponse.json({ message: 'Ürün başarıyla güncellendi.' });
}

// DELETE metodu için bir fonksiyon
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // 1. Güvenlik Kontrolü: Giriş yapmış bir kullanıcı var mı?
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 2. URL'den gelen ürün ID'sini al.
  const productId = params.id;

  // 3. Supabase'e silme komutunu gönder.
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId); // Sadece ID'si eşleşen ürünü sil

  if (error) {
    console.error('Supabase delete error:', error);
    return NextResponse.json({ error: 'Ürün silinirken bir hata oluştu.' }, { status: 500 });
  }

  revalidatePath('/admin/products');
  revalidatePath('/menu');


  // 4. Başarılı yanıtı boş bir body ile döndür (204 No Content).
  return new NextResponse(null, { status: 204 });
}