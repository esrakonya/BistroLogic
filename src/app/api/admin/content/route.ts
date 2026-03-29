// Dosya Yolu: /src/app/api/admin/content/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

/**
 * [Admin] Site içeriğini listeler (GET).
 */
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });

    const { data, error } = await supabase.from('site_content').select('*');
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * [Admin] Site içeriğini günceller (PUT).
 */
export async function PUT(request: Request) {
    const supabase = createRouteHandlerClient({ cookies });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
  
      const contentsToUpdate: { key: string; value: string }[] = await request.json();
      
      const updatePromises = contentsToUpdate.map(content =>
        supabase.from('site_content').update({ value: content.value }).eq('key', content.key)
      );
      
      const results = await Promise.all(updatePromises);
      const firstErrorResult = results.find(result => result.error);
      if (firstErrorResult && firstErrorResult.error) throw firstErrorResult.error;
  
      revalidatePath('/', 'layout');
      return NextResponse.json({ message: 'İçerik başarıyla güncellendi.' });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
}