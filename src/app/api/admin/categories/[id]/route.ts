// Dosya Yolu: /src/app/api/admin/categories/[id]/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Belirli bir kategoriyi günceller
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { name } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data, error } = await supabase.from('categories').update({ name }).eq('id', id).select();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Belirli bir kategoriyi siler
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const supabase = createRouteHandlerClient({ cookies });
    try {
      const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', id);
  
      if (countError) {
        return NextResponse.json({ error: "Veritabanı hatası: Ürünler kontrol edilemedi." }, { status: 500 });
      }
  
      if (count !== null && count > 0) {
        return NextResponse.json(
          { error: `Bu kategori silinemez çünkü içinde ${count} adet ürün bulunmaktadır. Önce bu ürünleri silin veya başka bir kategoriye taşıyın.` },
          { status: 409 }
        );
      }
  
      const { error: deleteError } = await supabase.from('categories').delete().eq('id', id);
  
      if (deleteError) {
        return NextResponse.json({ error: "Veritabanı hatası: Kategori silinemedi." }, { status: 500 });
      }
  
      return NextResponse.json({ message: 'Kategori başarıyla silindi' });
    } catch (error: any) {
      return NextResponse.json({ error: "Beklenmedik bir sunucu hatası oluştu." }, { status: 500 });
    }
  }