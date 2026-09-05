import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * The one place that knows whether a database is connected.
 *
 * Every unset key produces a stated "not connected" state elsewhere on this
 * site rather than a fabricated result (see `.env.example`), and this is
 * that same rule applied to the store: `data/store.ts` and `data/users.ts`
 * check `supabaseConfigured()` and fall back to the in-memory fixtures when
 * it is false, rather than throwing or silently pretending a database is
 * there.
 *
 * The service role key is used deliberately, not the anon key: the
 * application's own permission matrix (`domain/rbac.ts`) is the primary
 * gate and runs before any query reaches this client, exactly as it does
 * against the in-memory store today. Row level security in
 * `supabase/migrations/0002_rls.sql` mirrors that matrix as a second,
 * independent layer for any access path that does not go through this
 * server (a future client-side call, a direct psql session), which is why
 * it exists at all even though this client bypasses it.
 */
let client: SupabaseClient | null | undefined;

export function supabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function supabaseAdmin(): SupabaseClient | null {
  if (client !== undefined) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  client =
    url && key
      ? createClient(url, key, { auth: { persistSession: false } })
      : null;
  return client;
}

/** Test seam. Nothing in the application calls this. */
export function resetSupabaseClientForTests(): void {
  client = undefined;
}
