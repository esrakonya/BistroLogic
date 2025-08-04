// Dosya Yolu: middleware.ts

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const { data: { session } } = await supabase.auth.getSession();

  // --- YENİ VE AKILLI KORUMA MANTIĞI ---

  // 1. KURAL: Kullanıcı giriş yapmamışsa...
  if (!session) {
    // A) ...ve bir API yoluna gitmeye çalışıyorsa (/api/admin/...)...
    if (req.nextUrl.pathname.startsWith('/api/admin')) {
      // ...ona bir HTML sayfası değil, bir JSON hatası döndür. Bu, frontend'in çökmesini engeller.
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // B) ...ve bir admin sayfasına gitmeye çalışıyorsa (/admin)...
    if (req.nextUrl.pathname.startsWith('/admin')) {
      // ...onu giriş sayfasına yönlendir.
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/login';
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 2. KURAL: Kullanıcı giriş yapmışsa ve /login sayfasına gitmeye çalışıyorsa...
  if (session && req.nextUrl.pathname.startsWith('/login')) {
    // ...onu zaten giriş yaptığı için admin paneline yönlendir.
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/admin';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Config'i, API yollarını da içerecek şekilde güncelliyoruz.
export const config = {
  matcher: ['/admin/:path*', '/login', '/api/admin/:path*'],
};