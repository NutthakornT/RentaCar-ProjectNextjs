import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Data-access layer for reviews. Reviews are world-readable per RLS; the
 * reviewer's name is denormalized onto the row (profiles themselves are
 * private) so reviews can be shown to signed-out visitors.
 */

/**
 * Recent customer reviews for the landing page, newest first. Only reviews with
 * a written comment are surfaced. Uses the public anon client since reviews and
 * cars are readable by everyone.
 * @param {number} [limit]
 * @returns {Promise<import("@/types").Testimonial[]>}
 */
export async function getRecentReviews(limit = 6) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, comment, reviewer_name, cars(name, brand)")
    .not("comment", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    rating: r.rating,
    quote: r.comment,
    name: r.reviewer_name || "ChaoRoad customer",
    role: r.cars ? `Rented the ${r.cars.brand} ${r.cars.name}` : "Verified rental",
  }));
}

/**
 * Insert a review for the current customer's completed booking. Denormalizes
 * the reviewer's name so it can be shown publicly. RLS requires the booking to
 * belong to the reviewer; the unique(booking_id) constraint blocks duplicates.
 * @param {{ carId: string, bookingId: string, rating: number, comment?: string }} input
 */
export async function createReview({ carId, bookingId, rating, comment }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to leave a review.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .maybeSingle();
  const reviewerName =
    profile?.name ||
    user.user_metadata?.name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "ChaoRoad customer";

  const { error } = await supabase.from("reviews").insert({
    user_id: user.id,
    car_id: carId,
    booking_id: bookingId,
    rating,
    comment: comment?.trim() || null,
    reviewer_name: reviewerName,
  });
  if (error) throw error;
}
