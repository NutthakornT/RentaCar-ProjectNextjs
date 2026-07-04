import { createClient } from "@supabase/supabase-js";

let client;

/**
 * Shared anon-key Supabase client for public, read-only data (cars, car
 * images). These rows are readable by everyone per RLS, so no session/cookies
 * are needed — safe to use in Server Components, generateStaticParams (build
 * time, no request context), and Client Components alike.
 */
export function createPublicClient() {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  }
  return client;
}
