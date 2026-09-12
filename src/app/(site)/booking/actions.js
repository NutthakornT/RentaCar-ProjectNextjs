"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCarById } from "@/services/cars";
import { createBooking } from "@/services/bookings";
import { SERVICE_FEE } from "@/lib/constants";
import { daysBetween } from "@/lib/utils";

/**
 * Server Action backing the booking confirmation step. Re-derives the total
 * from the car's current rate rather than trusting a client-computed number;
 * RLS is the real gate against signed-out inserts, not the client check.
 * @param {{ carId: string, pickup: string, returnDate: string, location?: string, phone: string, notes?: string }} input
 * @returns {Promise<{ booking: import("@/types").Booking } | { error: string }>}
 */
export async function confirmBooking({ carId, pickup, returnDate, location, phone, notes }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in to confirm your booking." };

  // Admins manage the fleet and must not create customer bookings (RLS would
  // otherwise allow it via is_admin()), so this is enforced here.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role === "admin") {
    return {
      error: "Admins can't book cars. Use a customer account to make a booking.",
    };
  }

  const car = await getCarById(carId);
  if (!car) return { error: "This car is no longer available." };

  const days = daysBetween(pickup, returnDate);
  if (!pickup || !returnDate || days <= 0) {
    return { error: "Choose a valid pick-up and return date." };
  }

  const trimmedPhone = String(phone || "").trim();
  if (!trimmedPhone) return { error: "A phone number is required." };

  try {
    const booking = await createBooking({
      user_id: user.id,
      car_id: car.id,
      pickup_date: pickup,
      return_date: returnDate,
      total_price: days * car.price_per_day + SERVICE_FEE,
      pickup_location: String(location || "").trim() || null,
      phone: trimmedPhone,
      notes: String(notes || "").trim() || null,
    });
    // Refresh the admin views that read live booking data.
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
    return { booking };
  } catch (err) {
    return { error: err?.message ?? "Could not confirm the booking." };
  }
}
