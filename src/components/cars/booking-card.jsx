"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cn, daysBetween, formatCurrency, todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { CheckIcon, ShieldIcon } from "@/components/ui/icons";
import { SERVICE_FEE } from "@/lib/constants";

/**
 * Sticky booking widget on the car detail page. Picks dates, computes the
 * total, and forwards the selection to /booking.
 * @param {{ car: import("@/types").Car, defaultPickup?: string, defaultReturn?: string }} props
 */
export function BookingCard({ car, defaultPickup = "", defaultReturn = "" }) {
  const router = useRouter();
  const today = todayISO();
  const [pickup, setPickup] = useState(defaultPickup);
  const [returnDate, setReturnDate] = useState(defaultReturn);

  const days = useMemo(
    () => daysBetween(pickup, returnDate),
    [pickup, returnDate],
  );
  const subtotal = days * car.price_per_day;
  const total = days > 0 ? subtotal + SERVICE_FEE : 0;
  const ready = days > 0 && car.available;

  function handleContinue() {
    const params = new URLSearchParams({ car: car.id });
    if (pickup) params.set("pickup", pickup);
    if (returnDate) params.set("return", returnDate);
    router.push(`/booking?${params.toString()}`);
  }

  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-card">
      <div className="flex items-baseline justify-between">
        <p className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-slate-900">
            {formatCurrency(car.price_per_day)}
          </span>
          <span className="text-sm text-slate-400">/ day</span>
        </p>
        {car.available ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <CheckIcon size={14} /> Available
          </span>
        ) : (
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
            Currently booked
          </span>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Field label="Pick-up">
          <Input
            type="date"
            min={today}
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          />
        </Field>
        <Field label="Return">
          <Input
            type="date"
            min={pickup || today}
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </Field>
      </div>

      {/* Price breakdown */}
      <dl className="mt-5 space-y-2.5 border-t border-slate-100 pt-5 text-sm">
        <div className="flex justify-between text-slate-600">
          <dt>
            {formatCurrency(car.price_per_day)} × {days || 0}{" "}
            {days === 1 ? "day" : "days"}
          </dt>
          <dd className="font-medium text-slate-900">
            {formatCurrency(subtotal)}
          </dd>
        </div>
        <div className="flex justify-between text-slate-600">
          <dt>Service fee</dt>
          <dd className="font-medium text-slate-900">
            {formatCurrency(days > 0 ? SERVICE_FEE : 0)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
          <dt className="font-semibold text-slate-900">Total</dt>
          <dd className="font-bold text-slate-900">{formatCurrency(total)}</dd>
        </div>
      </dl>

      <Button
        onClick={handleContinue}
        disabled={!ready}
        size="lg"
        className={cn("mt-5 w-full")}
      >
        {car.available ? "Continue to booking" : "Unavailable"}
      </Button>

      {!car.available && (
        <p className="mt-2 text-center text-xs text-slate-400">
          This car is out on another trip. Check back soon.
        </p>
      )}
      {car.available && days === 0 && (
        <p className="mt-2 text-center text-xs text-slate-400">
          Select your pick-up and return dates to see the total.
        </p>
      )}

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <ShieldIcon size={14} className="text-primary-500" />
        Free cancellation up to 24h before pick-up
      </p>
    </div>
  );
}
