// Dosya Yolu: /src/app/api/admin/products/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

/**
 * [Admin] Tüm ürünleri, kategori adlarıyla birlikte listeler (GET).
 */
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });

    const { data, error } = await supabase.from('products').select('*, categories(name)').order('id');
    if (error) throw error;

    const formattedData = data.map(p => ({ ...p, categoryName: p.categories?.name || null, categories: undefined }));
    return NextResponse.json(formattedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * [Admin] Yeni bir ürün ekler (POST).
 */
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });

    const productData = await request.json();
    const { data, error } = await supabase.from('products').insert([productData]).select();
    if (error) throw error;
    
    revalidatePath('/admin/products');
    revalidatePath('/menu');
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}