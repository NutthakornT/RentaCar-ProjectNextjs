import { daysBetween, formatCurrency, formatDate } from "@/lib/utils";
import { SERVICE_FEE } from "@/lib/constants";
import { CarThumb } from "@/components/ui/car-thumb";
import { UsersIcon, GaugeIcon, FuelIcon } from "@/components/ui/icons";

/**
 * Order summary for the booking flow: the selected car, dates, and totals.
 * @param {{ car: import("@/types").Car, pickup?: string, returnDate?: string }} props
 */
export function BookingSummary({ car, pickup, returnDate }) {
  const days = daysBetween(pickup, returnDate);
  const subtotal = days * car.price_per_day;
  const total = days > 0 ? subtotal + SERVICE_FEE : 0;

  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-card">
      <h2 className="text-sm font-semibold text-slate-900">Your booking</h2>

      <div className="mt-4 flex gap-4">
        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl">
          <CarThumb car={car} iconSize={40} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-primary-600">
            {car.brand}
          </p>
          <p className="truncate font-semibold text-slate-900">{car.name}</p>
          <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
            <li className="flex items-center gap-1">
              <UsersIcon size={13} /> {car.seats}
            </li>
            <li className="flex items-center gap-1">
              <GaugeIcon size={13} /> {car.transmission}
            </li>
            <li className="flex items-center gap-1">
              <FuelIcon size={13} /> {car.fuel}
            </li>
          </ul>
        </div>
      </div>

      {/* Dates */}
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 text-sm">
        <div>
          <p className="text-xs text-slate-400">Pick-up</p>
          <p className="font-medium text-slate-900">
            {pickup ? formatDate(pickup) : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Return</p>
          <p className="font-medium text-slate-900">
            {returnDate ? formatDate(returnDate) : "—"}
          </p>
        </div>
      </div>

      {/* Price */}
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
    </div>
  );
}
