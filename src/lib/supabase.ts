import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Browser client (admin login session). Use in client components. */
export function getSupabaseBrowser() {
  return createBrowserClient(url, anon);
}

/** Public read client (no session needed — RLS allows public SELECT). Use in server components. */
export function getSupabasePublic() {
  return createClient(url, anon, { auth: { persistSession: false } });
}
