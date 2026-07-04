"use server";

import { revalidatePath } from "next/cache";
import { deleteBooking } from "@/services/bookings";

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
