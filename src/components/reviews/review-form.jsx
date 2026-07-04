"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/field";
import { RatingInput } from "@/components/ui/rating-input";
import { reviewFormInitialState } from "@/app/(site)/reviews/write/actions";

/**
 * @param {{ action: Function, booking: { id: string, car_id: string, car_name: string, pickup_date: string, return_date: string } }} props
 */
export function ReviewForm({ action, booking }) {
  const [state, formAction, pending] = useActionState(action, reviewFormInitialState);
  const [rating, setRating] = useState(0);

  return (
    <form action={formAction} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-soft">
      <input type="hidden" name="booking_id" value={booking.id} />
      <input type="hidden" name="car_id" value={booking.car_id} />

      <h3 className="text-lg font-semibold text-slate-900">{booking.car_name}</h3>
      <p className="mt-1 text-sm text-slate-500">
        Trip: {booking.pickup_date} → {booking.return_date}
      </p>

      <Field label="Your rating" className="mt-6">
        <RatingInput value={rating} onChange={setRating} />
      </Field>

      <Field label="Your review (optional)" htmlFor="comment" className="mt-4">
        <Textarea
          id="comment"
          name="comment"
          placeholder="How was the car? Pick-up, cleanliness, driving experience…"
          maxLength={1000}
        />
      </Field>

      {state?.error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" className="mt-6" disabled={pending || rating < 1}>
        {pending ? "Submitting…" : "Submit review"}
      </Button>
    </form>
  );
}