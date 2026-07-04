"use server";

import { revalidatePath } from "next/cache";
import { deleteBooking } from "@/services/bookings";
import { confirmReturn } from "@/services/returns";

/**
 * Server Action to delete a booking. The id is bound via `.bind()` and invoked
 * from the delete button's event handler, so it returns `{ error }` on failure
 * instead of throwing. RLS on `bookings` requires an admin session.
 * @param {string} id
 * @returns {Promise<{ error: string } | void>}
 */
export async function removeBooking(id) {
  try {
    await deleteBooking(id);
  } catch (err) {
    return { error: err?.message ?? "Could not delete the booking." };
  }
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}

/**
 * Server Action for an admin confirming a car return. The booking id is bound
 * via `.bind()`; `details` carries the actual return date and condition notes.
 * Returns the computed late fee so the caller can report it. RLS requires an
 * admin session.
 * @param {string} bookingId
 * @param {{ returnedAt: string, conditionNotes?: string }} details
 * @returns {Promise<{ ok: true, lateDays: number, lateFee: number } | { error: string }>}
 */
export async function confirmReturnAction(bookingId, details) {
  try {
    const { lateDays, lateFee } = await confirmReturn(bookingId, details);
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
    revalidatePath("/profile");
    return { ok: true, lateDays, lateFee };
  } catch (err) {
    return { error: err?.message ?? "Could not confirm the return." };
  }
}
