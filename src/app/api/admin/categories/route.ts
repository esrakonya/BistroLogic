// Dosya Yolu: /src/app/api/admin/categories/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

/**
 * [Admin] Tüm kategorileri listeler (GET).
 */
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });

    const { data, error } = await supabase.from('categories').select('*').order('id');
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * [Admin] Yeni bir kategori ekler (POST).
 */
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });

    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: 'Kategori adı boş olamaz.' }, { status: 400 });

    const { data, error } = await supabase.from('categories').insert([{ name }]).select();
    if (error) throw error;
    
    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    
    // DEĞİŞİKLİK BURADA: Müşteri menüsünün önbelleğini de temizle.
    revalidatePath('/menu');

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}