import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Data-access layer for car returns (the `car_returns` table). A customer
 * requests a return; an admin confirms it, recording the actual return date,
 * condition, and any late fee, then closing out the booking.
 */

/**
 * Customer requests to return the car for one of their bookings. Inserts a
 * `car_returns` row (status 'requested'). RLS ensures the booking belongs to
 * the caller, and the unique(booking_id) constraint blocks duplicate requests.
 * @param {string} bookingId
 */
export async function requestReturn(bookingId) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("car_returns")
    .insert({ booking_id: bookingId });
  if (error) throw error;
}

/**
 * Admin confirms a car has been returned: records the actual return date and
 * condition, computes any late fee ($50/day past the booking's return_date),
 * marks the return 'completed', and closes the booking. Upserts on booking_id
 * so it works whether or not the customer filed a request first. Admin-only via
 * RLS.
 * @param {string} bookingId
 * @param {{ returnedAt: string, conditionNotes?: string }} details
 * @returns {Promise<{ lateDays: number, lateFee: number }>}
 */
export async function confirmReturn(bookingId, { returnedAt, conditionNotes }) {
  const supabase = await createServerSupabaseClient();

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("id, return_date")
    .eq("id", bookingId)
    .single();
  if (bookingError) throw bookingError;

  // Both are calendar dates (YYYY-MM-DD); compare at UTC midnight.
  const due = new Date(`${booking.return_date}T00:00:00Z`);
  const actual = new Date(`${returnedAt}T00:00:00Z`);
  const lateDays = Math.max(0, Math.round((actual - due) / 86_400_000));
  const lateFee = lateDays * 50; // $50/day, matches the booking-confirm warning

  const { error: returnError } = await supabase.from("car_returns").upsert(
    {
      booking_id: bookingId,
      status: "completed",
      returned_at: returnedAt,
      condition_notes: conditionNotes?.trim() || null,
      late_days: lateDays,
      late_fee: lateFee,
    },
    { onConflict: "booking_id" },
  );
  if (returnError) throw returnError;

  const { error: statusError } = await supabase
    .from("bookings")
    .update({ status: "completed" })
    .eq("id", bookingId);
  if (statusError) throw statusError;

  return { lateDays, lateFee };
}
