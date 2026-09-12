"use server";

import { revalidatePath } from "next/cache";
import { requestReturn } from "@/services/returns";
import { createReview } from "@/services/reviews";

/**
 * Server Action for a customer requesting to return a car. Bound via
 * `.bind()` from ReturnButton, so it returns `{ error }` rather than throwing.
 * @param {string} bookingId
 * @param {string} scheduledReturnAt datetime-local value (YYYY-MM-DDTHH:mm)
 * @returns {Promise<{ error: string } | void>}
 */
export async function submitReturnRequest(bookingId, scheduledReturnAt) {
  const when = new Date(scheduledReturnAt);
  if (!scheduledReturnAt || Number.isNaN(when.getTime())) {
    return { error: "Please choose when you'll return the car." };
  }
  try {
    await requestReturn(bookingId, when.toISOString());
  } catch (err) {
    if (err?.code === "23505") {
      return { error: "You've already requested a return for this booking." };
    }
    return { error: err?.message ?? "Could not request the return." };
  }
  revalidatePath("/profile");
  revalidatePath("/admin/bookings");
}

/**
 * Server Action for a customer leaving a review on a completed rental. The
 * `{ carId, bookingId }` context is bound via `.bind()`; `details` carries the
 * star rating and comment from the review dialog.
 * @param {{ carId: string, bookingId: string }} context
 * @param {{ rating: number, comment?: string }} details
 * @returns {Promise<{ error: string } | void>}
 */
export async function submitReview({ carId, bookingId }, { rating, comment }) {
  const stars = Number(rating);
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    return { error: "Please choose a rating from 1 to 5 stars." };
  }
  try {
    await createReview({ carId, bookingId, rating: stars, comment });
  } catch (err) {
    if (err?.code === "23505") {
      return { error: "You've already reviewed this rental." };
    }
    return { error: err?.message ?? "Could not submit your review." };
  }
  // Refresh the customer's list, the landing testimonials, and the car's
  // rating (kept in sync by a DB trigger) on the catalog/detail pages.
  revalidatePath("/profile");
  revalidatePath("/");
  revalidatePath("/cars");
  revalidatePath(`/cars/${carId}`);
}
