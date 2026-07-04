import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { getBookingsByUser } from "@/services/bookings";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BookingStatusBadge } from "@/components/booking/status-badge";
import { ReturnButton } from "@/components/booking/return-button";
import { ReviewButton } from "@/components/booking/review-button";
import { submitReturnRequest, submitReview } from "./actions";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  CalendarIcon,
  ClipboardIcon,
  LogOutIcon,
  CarIcon,
} from "@/components/ui/icons";

export const metadata = {
  title: "My account",
  description: "Manage your ChaoRoad profile and view your bookings.",
  robots: { index: false },
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const bookings = user ? await getBookingsByUser(user.id) : [];

  const name =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Driver";
  const initial = name.charAt(0).toUpperCase();
  const memberSince = user?.created_at ? formatDate(user.created_at) : "—";

  const upcoming = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "active",
  ).length;

  return (
    <div className="bg-background">
      {/* Header band */}
      <section className="bg-brand-gradient text-white">
        <div className="container-page flex flex-col items-start gap-5 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold backdrop-blur">
              {initial}
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight capitalize">
                {name}
              </h1>
              <p className="text-sm text-slate-200">{user?.email}</p>
              <p className="mt-0.5 text-xs text-slate-300">
                Member since {memberSince}
              </p>
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-medium text-white ring-1 ring-white/20 transition-colors hover:bg-white/20"
            >
              <LogOutIcon size={16} />
              Sign out
            </button>
          </form>
        </div>
      </section>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[280px_1fr]">
        {/* Sidebar stats */}
        <aside className="space-y-4">
          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Overview
            </p>
            <dl className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-sm text-slate-600">
                  <ClipboardIcon size={16} className="text-primary-500" />
                  Total trips
                </dt>
                <dd className="font-semibold text-slate-900">
                  {bookings.length}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-sm text-slate-600">
                  <CalendarIcon size={16} className="text-primary-500" />
                  Upcoming
                </dt>
                <dd className="font-semibold text-slate-900">{upcoming}</dd>
              </div>
            </dl>
          </div>
          <Link
            href="/cars"
            className={buttonVariants({
              variant: "primary",
              size: "md",
              className: "w-full",
            })}
          >
            Book another car
          </Link>
        </aside>

        {/* Bookings */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Your bookings</h2>
          <p className="text-sm text-slate-500">
            Trips you&apos;ve booked with ChaoRoad.
          </p>

          <div className="mt-5 space-y-4">
            {bookings.length === 0 ? (
              <EmptyState
                icon={<CarIcon size={24} />}
                title="No bookings yet"
                description="When you book a car, it'll show up here."
                action={
                  <Link
                    href="/cars"
                    className={buttonVariants({ variant: "primary", size: "md" })}
                  >
                    Browse cars
                  </Link>
                }
              />
            ) : (
              bookings.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 shadow-soft sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900">
                        {b.car_name}
                      </p>
                      <BookingStatusBadge status={b.status} />
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatDate(b.pickup_date)} → {formatDate(b.return_date)}
                    </p>
                    <p className="mt-0.5 text-xs uppercase text-slate-400">
                      Ref {b.id.slice(0, 8)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <p className="text-lg font-bold text-slate-900">
                      {formatCurrency(b.total_price)}
                    </p>
                    {b.status === "completed" || b.return_status === "completed" ? (
                      <>
                        <span className="text-sm font-medium text-emerald-600">
                          Returned
                          {b.late_fee > 0 && ` · $${b.late_fee} late fee`}
                        </span>
                        {b.reviewed ? (
                          <span className="text-sm text-slate-400">
                            ★ Reviewed
                          </span>
                        ) : (
                          <ReviewButton
                            action={submitReview.bind(null, {
                              carId: b.car_id,
                              bookingId: b.id,
                            })}
                            carName={b.car_name}
                          />
                        )}
                      </>
                    ) : b.return_status === "requested" ? (
                      <span className="text-sm font-medium text-amber-600">
                        Return requested
                      </span>
                    ) : b.status !== "cancelled" ? (
                      <ReturnButton
                        action={submitReturnRequest.bind(null, b.id)}
                        carName={b.car_name}
                      />
                    ) : null}
                    <Link
                      href={`/cars/${b.car_id}`}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      View car
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
