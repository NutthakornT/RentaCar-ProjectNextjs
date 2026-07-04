import { bookings } from "@/lib/mock/bookings";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Data-access layer for bookings.
 * @typedef {import("@/types").Booking} Booking
 */

/**
 * Flatten a joined bookings row into the shape the admin tables expect —
 * denormalized `customer_name` / `car_name` display fields — and cast the
 * numeric total (PostgREST returns `numeric` as a string) to a real number.
 */
function mapBookingRow(row) {
  const profile = row.profiles;
  const car = row.cars;
  return {
    id: row.id,
    user_id: row.user_id,
    car_id: row.car_id,
    customer_name: profile?.name ?? profile?.email ?? "Unknown customer",
    car_name: car ? `${car.brand} ${car.name}` : row.car_id,
    pickup_date: row.pickup_date,
    return_date: row.return_date,
    total_price: Number(row.total_price),
    status: row.status,
    pickup_location: row.pickup_location,
    phone: row.phone,
    notes: row.notes,
  };
}

/**
 * Every booking across all customers, newest pick-up first. Uses the
 * cookie-aware server client so RLS returns all rows for an admin session
 * (`bookings_select` grants a non-admin only their own bookings).
 * @returns {Promise<Booking[]>}
 */
export async function getAllBookings() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, user_id, car_id, pickup_date, return_date, total_price, status, pickup_location, phone, notes, profiles(name, email), cars(name, brand)",
    )
    .order("pickup_date", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapBookingRow);
}

/**
 * Insert a booking for the current session's user. RLS (`bookings_insert`)
 * requires `auth.uid() = user_id`, so this must run with the cookie-aware
 * server client — a signed-out or mismatched caller gets a rejected insert.
 * @param {{ user_id: string, car_id: string, pickup_date: string, return_date: string, total_price: number, pickup_location?: string, phone?: string, notes?: string|null }} payload
 * @returns {Promise<Booking>}
 */
export async function createBooking(payload) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("bookings")
    .insert({ ...payload, status: "confirmed" })
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    user_id: data.user_id,
    car_id: data.car_id,
    pickup_date: data.pickup_date,
    return_date: data.return_date,
    total_price: Number(data.total_price),
    status: data.status,
    pickup_location: data.pickup_location,
    phone: data.phone,
    notes: data.notes,
  };
}

/**
 * A single customer's bookings, newest pick-up first. Uses the cookie-aware
 * server client; RLS already restricts a non-admin to their own rows, and the
 * explicit `user_id` filter keeps the query correct for an admin session too.
 * @param {string} userId
 * @returns {Promise<Booking[]>}
 */
export async function getBookingsByUser(userId) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, user_id, car_id, pickup_date, return_date, total_price, status, pickup_location, phone, notes, cars(name, brand)",
    )
    .eq("user_id", userId)
    .order("pickup_date", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapBookingRow);
}

/** Aggregate booking stats for the admin dashboard. */
export async function getBookingStats() {
  const total = bookings.length;
  const active = bookings.filter((b) => b.status === "active").length;
  const upcoming = bookings.filter((b) => b.status === "confirmed").length;
  const revenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.total_price, 0);
  return { total, active, upcoming, revenue };
}
