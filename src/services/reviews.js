import { createPublicClient } from "@/lib/supabase/public";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * @typedef {import("@/types").Review} Review
 */

function mapReviewRow(row) {
  const profile = row.profiles;
  const car = row.cars;
  return {
    id: row.id,
    user_id: row.user_id,
    car_id: row.car_id,
    booking_id: row.booking_id,
    rating: Number(row.rating),
    comment: row.comment,
    created_at: row.created_at,
    author_name: profile?.name ?? profile?.email ?? "Driver",
    car_name: car ? `${car.brand} ${car.name}` : row.car_id,
  };
}

/** รีวิวสาธารณะทั้งหมด (หน้า /reviews) */
export async function getPublicReviews(limit) {
  const supabase = createPublicClient();
  let query = supabase
    .from("reviews")
    .select("id, user_id, car_id, booking_id, rating, comment, created_at, profiles(name, email), cars(name, brand)")
    .order("created_at", { ascending: false });

  if (typeof limit === "number") query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapReviewRow);
}

/** booking ที่เช่าแล้วและยังไม่ได้รีวิว */
export async function getReviewableBookings(userId) {
  const supabase = await createServerSupabaseClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, car_id, pickup_date, return_date, status, cars(name, brand), reviews(id)",
    )
    .eq("user_id", userId)
    .neq("status", "cancelled")
    .lte("return_date", today)
    .order("return_date", { ascending: false });

  if (error) throw error;

  return (data ?? [])
    .filter((b) => !b.reviews?.length)
    .map((b) => ({
      id: b.id,
      car_id: b.car_id,
      car_name: b.cars ? `${b.cars.brand} ${b.cars.name}` : b.car_id,
      pickup_date: b.pickup_date,
      return_date: b.return_date,
      status: b.status,
    }));
}

/** รีวิวที่ user เคยเขียนแล้ว */
export async function getReviewsByUser(userId) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, user_id, car_id, booking_id, rating, comment, created_at, cars(name, brand)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapReviewRow);
}

/**
 * @param {{ user_id: string, car_id: string, booking_id: string, rating: number, comment?: string|null }} payload
 */
export async function createReview(payload) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("reviews")
    .insert(payload)
    .select("id, user_id, car_id, booking_id, rating, comment, created_at")
    .single();

  if (error) throw error;
  return {
    ...data,
    rating: Number(data.rating),
  };
}