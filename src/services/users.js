import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Data-access layer for user profiles, backed by Supabase. Profiles are
 * gated by RLS (a user sees only their own row, admins see all), so these
 * reads use the cookie-aware server client to carry the caller's session.
 * @typedef {import("@/types").UserProfile} UserProfile
 */

/** @returns {Promise<UserProfile[]>} */
export async function getAllUsers() {
  const supabase = await createServerSupabaseClient();
  // `bookings(count)` embeds a per-profile aggregate: [{ count: n }].
  const { data, error } = await supabase
    .from("profiles")
    .select("*, bookings(count)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    joined: u.created_at,
    bookings_count: u.bookings?.[0]?.count ?? 0,
  }));
}

/**
 * @param {string} id
 * @returns {Promise<UserProfile | null>}
 */
export async function getUserById(id) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    joined: data.created_at,
  };
}
