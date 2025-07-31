// Dosya Yolu: middleware.ts

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Bu fonksiyon, bir kullanıcı bir sayfaya girmeye çalıştığında otomatik olarak çalışır.
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Supabase istemcisini middleware için özel bir yöntemle oluşturuyoruz.
  const supabase = createMiddlewareClient({ req, res });
  
  // Kullanıcının o anki oturum (session) bilgisini alıyoruz.
  const { data: { session } } = await supabase.auth.getSession();

  // EĞER KULLANICI GİRİŞ YAPMAMIŞSA (session yoksa)
  // VE gitmek istediği sayfa /admin ile başlıyorsa
  if (!session && req.nextUrl.pathname.startsWith('/admin')) {
    // Onu ana sayfaya yönlendir (veya doğrudan /login'e de yönlendirebiliriz).
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  // EĞER KULLANICI GİRİŞ YAPMIŞSA (session varsa)
  // VE gitmek istediği sayfa /login ise
  if (session && req.nextUrl.pathname.startsWith('/login')) {
    // Onu zaten giriş yaptığı için admin paneline yönlendir.
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/admin';
    return NextResponse.redirect(redirectUrl);
  }

  // Diğer tüm durumlarda, kullanıcının gitmek istediği yere gitmesine izin ver.
  return res;
}

// Bu config, middleware'in hangi sayfalarda çalışacağını belirtir.
// "matcher" ile sadece /admin ve altındaki sayfaları izlemesini söylüyoruz.
export const config = {
  matcher: ['/admin/:path*', '/login'],
};