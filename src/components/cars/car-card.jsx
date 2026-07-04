import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { CarThumb } from "@/components/ui/car-thumb";
import { buttonVariants } from "@/components/ui/button";
import { UsersIcon, GaugeIcon, FuelIcon, ArrowRightIcon } from "@/components/ui/icons";

/**
 * Car listing card: image, name, type, transmission, fuel, seats, price/day,
 * rating, and a CTA. Used on the landing "Featured" grid and the /cars listing.
 * @param {{ car: import("@/types").Car, className?: string }} props
 */
export function CarCard({ car, className }) {
  return (
    <Card
      hover
      className={cn("group flex flex-col overflow-hidden", className)}
    >
      <Link
        href={`/cars/${car.id}`}
        className="relative block aspect-[16/10] overflow-hidden"
      >
        <CarThumb
          car={car}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge tone="primary" className="bg-white/90 backdrop-blur">
            {car.type}
          </Badge>
          {!car.available && (
            <Badge tone="danger" className="bg-white/90 backdrop-blur">
              Booked
            </Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-primary-600">
              {car.brand}
            </p>
            <h3 className="truncate text-base font-semibold text-slate-900">
              <Link href={`/cars/${car.id}`} className="hover:underline">
                {car.name}
              </Link>
            </h3>
          </div>
          <Rating value={car.rating} size={14} showValue />
        </div>

        {/* Specs */}
        <ul className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-600">
          <li className="flex items-center gap-1.5">
            <UsersIcon size={15} className="text-slate-400" />
            {car.seats} seats
          </li>
          <li className="flex items-center gap-1.5">
            <GaugeIcon size={15} className="text-slate-400" />
            {car.transmission === "Automatic" ? "Auto" : "Manual"}
          </li>
          <li className="flex items-center gap-1.5">
            <FuelIcon size={15} className="text-slate-400" />
            {car.fuel}
          </li>
        </ul>

        <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
          <p className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900">
              {formatCurrency(car.price_per_day)}
            </span>
            <span className="text-sm text-slate-400">/ day</span>
          </p>
          <Link
            href={`/cars/${car.id}`}
            className={buttonVariants({ variant: "primary", size: "sm" })}
          >
            Details
            <ArrowRightIcon size={16} />
          </Link>
        </div>
      </div>
    </Card>
  );
}
