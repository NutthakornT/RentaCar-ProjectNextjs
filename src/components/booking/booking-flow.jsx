"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { daysBetween, formatCurrency, formatDate, todayISO } from "@/lib/utils";
import { SERVICE_FEE } from "@/lib/constants";
import { confirmBooking } from "@/app/(site)/booking/actions";
import { BookingSummary } from "./booking-summary";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { CheckIcon, ClockIcon, MailIcon, CalendarIcon } from "@/components/ui/icons";

/**
 * Client booking flow: renter details → confirmation. Confirming inserts a
 * real row via the `confirmBooking` server action, persisting the pick-up
 * location, phone, and notes alongside the dates and total. (Name/email stay
 * with the customer's profile, so they're collected for display only.)
 * @param {{ car: import("@/types").Car, initialPickup?: string, initialReturn?: string, userId?: string, userEmail?: string }} props
 */
export function BookingFlow({ car, initialPickup = "", initialReturn = "", userId = "", userEmail = "" }) {
  const router = useRouter();
  const today = todayISO();
  const [form, setForm] = useState({
    name: "",
    email: userEmail,
    phone: "",
    location: "",
    pickup: initialPickup,
    returnDate: initialReturn,
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const days = daysBetween(form.pickup, form.returnDate);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.email.trim()) next.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (!form.phone.trim()) next.phone = "Please enter your phone number.";
    if (!form.location.trim()) next.location = "Please enter a pick-up location.";
    if (!form.pickup) next.pickup = "Choose a pick-up date.";
    if (!form.returnDate) next.returnDate = "Choose a return date.";
    else if (days <= 0) next.returnDate = "Return must be after pick-up.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  /** Where to send the browser back to after login, dates and car preserved. */
  function bookingReturnUrl() {
    const params = new URLSearchParams({ car: car.id });
    if (form.pickup) params.set("pickup", form.pickup);
    if (form.returnDate) params.set("return", form.returnDate);
    return `/booking?${params.toString()}`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    if (!userId) {
      router.push(`/login?next=${encodeURIComponent(bookingReturnUrl())}`);
      return;
    }

    const confirm = await Swal.fire({
      title: "Heads up",
      text: "Returning the car late will incur a $50 fine per day. Do you want to confirm this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm booking",
      cancelButtonText: "Go back",
      confirmButtonColor: "#0F4C81",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });
    if (!confirm.isConfirmed) return;

    setSubmitting(true);
    setSubmitError("");
    const result = await confirmBooking({
      carId: car.id,
      pickup: form.pickup,
      returnDate: form.returnDate,
      location: form.location,
      phone: form.phone,
      notes: form.notes,
    });
    setSubmitting(false);

    if (result.error) {
      setSubmitError(result.error);
      return;
    }

    setConfirmed({
      ref: "DL-" + result.booking.id.replace(/-/g, "").slice(0, 6).toUpperCase(),
      ...form,
    });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (confirmed) {
    return (
      <ConfirmationView car={car} booking={confirmed} days={days} />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      {/* Details form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-900">
            Driver details
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" hint={errors.name}>
              <Input
                value={form.name}
                onChange={set("name")}
                placeholder="Alex Morgan"
                aria-invalid={Boolean(errors.name)}
              />
            </Field>
            <Field label="Email" hint={errors.email}>
              <Input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@example.com"
                icon={<MailIcon size={18} />}
                aria-invalid={Boolean(errors.email)}
              />
            </Field>
            <Field label="Phone" hint={errors.phone}>
              <Input
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="+1 555 000 1234"
                aria-invalid={Boolean(errors.phone)}
              />
            </Field>
            <Field label="Pick-up location" hint={errors.location}>
              <Input
                value={form.location}
                onChange={set("location")}
                placeholder="Airport terminal, hotel address, city…"
                aria-invalid={Boolean(errors.location)}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-soft">
          <h2 className="text-lg font-semibold text-slate-900">Rental dates</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Pick-up date" hint={errors.pickup}>
              <Input
                type="date"
                min={today}
                value={form.pickup}
                onChange={set("pickup")}
              />
            </Field>
            <Field label="Return date" hint={errors.returnDate}>
              <Input
                type="date"
                min={form.pickup || today}
                value={form.returnDate}
                onChange={set("returnDate")}
              />
            </Field>
          </div>
          <Field label="Notes for the team (optional)" className="mt-4">
            <Textarea
              value={form.notes}
              onChange={set("notes")}
              placeholder="Child seat, additional driver, arrival time…"
            />
          </Field>
        </section>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ClockIcon size={14} />
          No payment required now — you&apos;ll pay at pick-up. Free
          cancellation up to 24h before.
        </div>

        {submitError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {submitError}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          {submitting ? "Confirming…" : "Confirm booking"}
        </Button>
      </form>

      {/* Summary */}
      <div className="lg:sticky lg:top-24 lg:h-fit">
        <BookingSummary
          car={car}
          pickup={form.pickup}
          returnDate={form.returnDate}
        />
      </div>
    </div>
  );
}

function ConfirmationView({ car, booking, days }) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-slate-200/70 shadow-card sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckIcon size={32} />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Booking confirmed
        </h1>
        <p className="mt-2 text-slate-500">
          We&apos;ve reserved your {car.brand} {car.name}. A confirmation is on
          its
          way to {booking.email}.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700">
          Reference {booking.ref}
        </div>

        <dl className="mt-8 grid gap-px overflow-hidden rounded-2xl bg-slate-200/70 text-left sm:grid-cols-2">
          <Detail icon={CalendarIcon} label="Pick-up" value={`${formatDate(booking.pickup)} · ${booking.location}`} />
          <Detail icon={CalendarIcon} label="Return" value={formatDate(booking.returnDate)} />
          <Detail icon={ClockIcon} label="Duration" value={`${days} ${days === 1 ? "day" : "days"}`} />
          <Detail icon={CheckIcon} label="Total (pay at pick-up)" value={formatCurrency(days * car.price_per_day + SERVICE_FEE)} />
        </dl>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/profile" className={buttonVariants({ variant: "primary", size: "md" })}>
            View my bookings
          </Link>
          <Link href="/cars" className={buttonVariants({ variant: "secondary", size: "md" })}>
            Browse more cars
          </Link>
        </div>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="bg-white p-4">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Icon size={14} />
        {label}
      </div>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}
