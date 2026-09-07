import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ihmxknvlewkhxksvscir.supabase.co';
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'sb_publishable_t8Ah0yClW4GCDnF32ewoOA_00WTwcFA';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient();
