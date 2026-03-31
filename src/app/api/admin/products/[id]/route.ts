// Dosya Yolu: /src/app/api/admin/products/[id]/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

type Params = Promise<{ id: string }>;

/**
 * [Admin] Updates a specific product detail (PUT).
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
    const productData = await request.json();

    if (!productData || Object.keys(productData).length === 0) {
      return NextResponse.json({ error: 'No data provided for update.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id);

    if (error) throw error;

    // Refresh cache for both admin and customer views
    revalidatePath('/admin/products');
    revalidatePath('/menu');

    return NextResponse.json({ message: 'Product successfully updated.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * [Admin] Deletes a specific product from the inventory (DELETE).
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

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Invalidate paths to reflect deletion in real-time
    revalidatePath('/admin/products');
    revalidatePath('/menu');

    return NextResponse.json({ message: 'Product successfully deleted from inventory.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}