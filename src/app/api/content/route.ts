// Dosya Yolu: src/app/api/content/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  try {
    const { data, error } = await supabase.from('site_content').select('*');
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }
  
    const contentsToUpdate: { key: string; value: string }[] = await request.json();
  
    try {
      // Gelen her bir içerik parçası için ayrı bir 'update' işlemi oluşturuyoruz.
      const updatePromises = contentsToUpdate.map(content =>
        supabase
          .from('site_content')
          .update({ value: content.value })
          .eq('key', content.key)
      );
      
      // Tüm güncelleme işlemlerini paralel olarak çalıştırıyoruz.
      const results = await Promise.all(updatePromises);
      
      // Herhangi bir işlemde hata var mı diye kontrol ediyoruz.
      const firstErrorResult = results.find(result => result.error);
      if (firstErrorResult && firstErrorResult.error) {
        console.error("Supabase Update Error:", firstErrorResult.error);
        throw new Error(firstErrorResult.error.message);
      }
  
      revalidatePath('/', 'layout');
  
      return NextResponse.json({ message: 'İçerik başarıyla güncellendi.' });
  
    } catch (error: any) {
      console.error("API'de içerik güncellenirken hata:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
}