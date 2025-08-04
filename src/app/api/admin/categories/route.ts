// Dosya Yolu: /src/app/api/admin/categories/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Tüm kategorileri listeler
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data, error } = await supabase.from('categories').select('*').order('id');
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Yeni bir kategori ekler
export async function POST(request: Request) {
  const { name } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data, error } = await supabase.from('categories').insert([{ name }]).select();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}