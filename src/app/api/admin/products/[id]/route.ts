// Dosya Yolu: /src/app/api/admin/products/[id]/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * [Admin] Belirli bir ürünü günceller (PUT).
 */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });

    const { id } = params;
    const productData = await request.json();
    const { error } = await supabase.from('products').update(productData).eq('id', id);
    if (error) throw error;

    revalidatePath('/admin/products');
    revalidatePath('/menu');
    return NextResponse.json({ message: 'Ürün başarıyla güncellendi.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * [Admin] Belirli bir ürünü siler (DELETE).
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });

    const { id } = params;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/admin/products');
    revalidatePath('/menu');
    return NextResponse.json({ message: 'Ürün başarıyla silindi.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}