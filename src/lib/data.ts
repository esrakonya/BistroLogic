// Dosya Yolu: /src/lib/data.ts

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cache } from 'react';
import type { SiteContent } from './types'; 

/**
 * Fetches all global site configuration from the 'site_content' table.
 * Wrapped in React 'cache' to ensure Request Memoization.
 * This prevents redundant database queries during a single render cycle.
 */
export const getSiteContent = cache(async (): Promise<SiteContent[]> => {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any });
  
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    // Senior Touch: Always order your metadata for a predictable UI experience
    .order('id', { ascending: true });

  if (error) {
    // Professional error logging with context
    console.error('[Data Fetch Error - SiteContent]:', error.message);
    return [];
  }

  return (data as SiteContent[]) || [];
});