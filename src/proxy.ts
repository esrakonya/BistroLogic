// Dosya Yolu: middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware runs on the Edge Runtime to intercept requests
 * and enforce security policies before they reach the server/page.
 */
export async function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Refresh session if expired - crucial for maintaining auth state
  const { data: { session } } = await supabase.auth.getSession();

  const url = req.nextUrl.clone();

  // --- ACCESS CONTROL LOGIC ---

  // 1. SCENARIO: User is NOT authenticated
  if (!session) {
    // PROTECT API: Return a clean JSON error for admin API calls
    if (url.pathname.startsWith('/api/admin')) {
      return NextResponse.json(
        { error: 'Authentication required for administrative actions.' }, 
        { status: 401 }
      );
    }

    // PROTECT DASHBOARD: Redirect to login if trying to access any admin sub-page
    if (url.pathname.startsWith('/admin')) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // 2. SCENARIO: User IS authenticated
  if (session) {
    // PREVENT LOGIN ACCESS: If logged in, redirect away from the login page
    if (url.pathname.startsWith('/login')) {
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }

    /**
     * SENIOR TIP: In a multi-role system, you would check user metadata here:
     * if (session.user.user_metadata.role !== 'admin' && url.pathname.startsWith('/admin')) {
     *    url.pathname = '/'; // Redirect unauthorized users to home
     *    return NextResponse.redirect(url);
     * }
     */
  }

  return res;
}

/**
 * Optimized Matcher Config
 * Only runs the middleware on specific routes to save Edge resources.
 */
export const config = {
  matcher: [
    '/admin/:path*', 
    '/login', 
    '/api/admin/:path*'
  ],
};