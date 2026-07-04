"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createReview, getReviewableBookings } from "@/services/reviews";

const initialState = { error: null, success: false };

export { initialState as reviewFormInitialState };

export async function submitReview(_prevState, formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Please sign in to submit a review.", success: false };

  const bookingId = String(formData.get("booking_id") || "").trim();
  const carId = String(formData.get("car_id") || "").trim();
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") || "").trim() || null;

  if (!bookingId || !carId) return { error: "Invalid booking.", success: false };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Please choose a rating from 1 to 5 stars.", success: false };
  }

  const reviewable = await getReviewableBookings(user.id);
  const booking = reviewable.find((b) => b.id === bookingId);

  if (!booking || booking.car_id !== carId) {
    return { error: "This trip cannot be reviewed (already reviewed or not finished).", success: false };
  }

  try {
    await createReview({
      user_id: user.id,
      car_id: carId,
      booking_id: bookingId,
      rating,
      comment,
    });

    revalidatePath("/reviews");
    revalidatePath("/reviews/write");
    revalidatePath("/profile");
    revalidatePath(`/cars/${carId}`);

    redirect("/reviews/write?submitted=1");
  } catch (err) {
    return {
      error: err?.message ?? "Could not save your review.",
      success: false,
    };
  }
}