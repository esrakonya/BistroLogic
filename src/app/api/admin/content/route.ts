// Dosya Yolu: /src/app/api/admin/content/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

/**
 * [Admin] Lists all site content configurations (GET).
 */
export async function GET() {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    // Sorting by key ensures a consistent order in the admin dashboard
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('key', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * [Admin] Bulk updates site content (PUT).
 */
export async function PUT(request: Request) {
  const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
      }
  
      const contentsToUpdate: { key: string; value: string }[] = await request.json();
      
      if (!Array.isArray(contentsToUpdate)) {
        return NextResponse.json({ error: 'Invalid data format. Expected an array.' }, { status: 400 });
      }
  
      // Performing updates in parallel for better performance
      const updatePromises = contentsToUpdate.map(content =>
        supabase
          .from('site_content')
          .update({ value: content.value })
          .eq('key', content.key)
      );
      
      const results = await Promise.all(updatePromises);
      
      // Check if any of the promises failed
      const errorResult = results.find(result => result.error);
      if (errorResult && errorResult.error) throw errorResult.error;
  
      /**
       * Crucial: Revalidating the root layout ensures that global components 
       * (Header, Footer, Metadata) reflect the changes immediately across the site.
       */
      revalidatePath('/', 'layout');
      
      return NextResponse.json({ message: 'Site content successfully updated.' });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
}