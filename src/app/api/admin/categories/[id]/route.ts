// Dosya Yolu: /src/app/api/admin/categories/[id]/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

type Params = Promise<{ id: string }>;

/**
 * [Admin] Updates a specific category (PUT).
 */
export async function PUT(request: Request, { params }: { params: Params }) {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    const { id } = await params;
    const { name } = await request.json();

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Category name is required.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('categories')
      .update({ name: name.trim() })
      .eq('id', id)
      .select();

    if (error) throw error;

    // Clear cache to reflect changes globally
    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    revalidatePath('/menu');

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * [Admin] Deletes a specific category (DELETE).
 * Prevents deletion if products are linked to this category.
 */
export async function DELETE(request: Request, { params }: { params: Params }) {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }
    
    const { id } = await params;

    // Check if any products are associated with this category
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id);

    if (countError) throw countError;

    if (count !== null && count > 0) {
      return NextResponse.json({ 
        error: `Cannot delete category. It currently contains ${count} products.` 
      }, { status: 409 }); // 409 Conflict is semantically correct here
    }

    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;
    
    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    revalidatePath('/menu');

    return NextResponse.json({ message: 'Category successfully deleted.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}