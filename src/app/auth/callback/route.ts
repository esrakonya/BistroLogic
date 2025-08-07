// Dosya Yolu: /src/app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    // Supabase'e gelen kodu, kalıcı bir oturum (session) ile değiştir.
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Oturum oluşturulduktan sonra, kullanıcıyı admin paneline yönlendir.
  return NextResponse.redirect(`${requestUrl.origin}/admin`);
}