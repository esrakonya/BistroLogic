// Dosya Yolu: /src/app/api/admin/categories/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

/**
 * [Admin] Lists all categories (GET).
 */
export async function GET() {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    // Ordering by display_order first, then ID for a better admin experience
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })
      .order('id', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * [Admin] Adds a new category (POST).
 */
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: name.trim() }])
      .select();

    if (error) throw error;
    
    // Invalidate cache to ensure UI sync
    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    revalidatePath('/menu');

    return NextResponse.json(data, { status: 201 }); // 201 Created is more appropriate for POST
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}