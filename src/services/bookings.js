import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Data-access layer for bookings.
 * @typedef {import("@/types").Booking} Booking
 */

/** Flatten a joined bookings row: add display fields, cast numeric strings to numbers. */
function mapBookingRow(row) {
  const profile = row.profiles;
  const car = row.cars;
  // Reverse embeds of the one-to-one car_returns / reviews may arrive as arrays.
  const ret = Array.isArray(row.car_returns) ? row.car_returns[0] : row.car_returns;
  const review = Array.isArray(row.reviews) ? row.reviews[0] : row.reviews;
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
    return_status: ret?.status ?? null,
    scheduled_return_at: ret?.scheduled_return_at ?? null,
    returned_at: ret?.returned_at ?? null,
    late_days: ret?.late_days ?? 0,
    late_fee: ret ? Number(ret.late_fee) : 0,
    reviewed: !!review,
    review_rating: review?.rating ?? null,
  };
}

/**
 * Every booking across all customers, newest pick-up first. Needs an admin
 * session — `bookings_select` RLS limits non-admins to their own rows.
 * @returns {Promise<Booking[]>}
 */
export async function getAllBookings() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, user_id, car_id, pickup_date, return_date, total_price, status, pickup_location, phone, notes, profiles(name, email), cars(name, brand), car_returns(status, scheduled_return_at, returned_at, late_days, late_fee)",
    )
    .order("pickup_date", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapBookingRow);
}

/**
 * Insert a booking for the current session's user. `bookings_insert` RLS
 * requires `auth.uid() = user_id`, so a signed-out caller is rejected.
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
 * Delete a booking. Requires an admin session (RLS). A linked review's
 * `booking_id` is set null (`on delete set null`), not cascade-deleted.
 * @param {string} id
 */
export async function deleteBooking(id) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) throw error;
}

/**
 * A single customer's bookings, newest pick-up first. The explicit `user_id`
 * filter keeps this correct for an admin session too, not just RLS.
 * @param {string} userId
 * @returns {Promise<Booking[]>}
 */
export async function getBookingsByUser(userId) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, user_id, car_id, pickup_date, return_date, total_price, status, pickup_location, phone, notes, cars(name, brand), car_returns(status, scheduled_return_at, returned_at, late_days, late_fee), reviews(id, rating)",
    )
    .eq("user_id", userId)
    .order("pickup_date", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapBookingRow);
}

/** Aggregate booking stats for the admin dashboard. Requires an admin session. */
export async function getBookingStats() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("status, total_price");
  if (error) throw error;

  const rows = data ?? [];
  const total = rows.length;
  const active = rows.filter((b) => b.status === "active").length;
  const upcoming = rows.filter((b) => b.status === "confirmed").length;
  const revenue = rows
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + Number(b.total_price), 0);
  return { total, active, upcoming, revenue };
}
