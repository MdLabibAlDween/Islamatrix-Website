import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Full-power server client (service_role, bypasses RLS).
 * Import ONLY from server code. The `server-only` import above crashes
 * the build if this ever leaks into a client bundle.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) {
    throw new Error("Supabase server env missing (URL / SUPABASE_SERVICE_ROLE_KEY).");
  }
  return createClient(url, serviceRole, { auth: { persistSession: false } });
}
