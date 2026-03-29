// Dosya Yolu: /src/app/api/admin/categories/[id]/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * [Admin] Belirli bir kategoriyi günceller (PUT).
 */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });

    const { id } = params;
    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: 'Kategori adı boş olamaz.' }, { status: 400 });

    const { data, error } = await supabase.from('categories').update({ name }).eq('id', id).select();
    if (error) throw error;

    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    revalidatePath('/menu');
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * [Admin] Belirli bir kategoriyi siler (DELETE).
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    
    const { id } = params;
    const { count, error: countError } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('category_id', id);

    if (countError) throw countError;
    if (count !== null && count > 0) {
      return NextResponse.json({ error: `Bu kategori silinemez çünkü içinde ${count} adet ürün var.` }, { status: 409 });
    }

    const { error: deleteError } = await supabase.from('categories').delete().eq('id', id);
    if (deleteError) throw deleteError;
    
    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    revalidatePath('/menu');
    return NextResponse.json({ message: 'Kategori başarıyla silindi' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}