// Dosya Yolu: /src/app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * The Auth Callback route handles the redirection from Supabase Auth service.
 * It exchanges the temporary 'code' for a persistent user session.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore as any });
    
    try {
      /**
       * Exchange the temporary auth code for a session.
       * This sets the necessary cookies for authentication.
       */
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error("[Auth Callback Error]:", error.message);
        // If exchange fails, redirect back to login with an error flag
        return NextResponse.redirect(`${requestUrl.origin}/login?error=auth-callback-failed`);
      }
    } catch (err) {
      console.error("[Fatal Auth Callback Error]:", err);
      return NextResponse.redirect(`${requestUrl.origin}/login?error=server-error`);
    }
  }

  /**
   * After a successful session exchange, redirect the user 
   * to the administrative dashboard.
   */
  return NextResponse.redirect(`${requestUrl.origin}/admin`);
}