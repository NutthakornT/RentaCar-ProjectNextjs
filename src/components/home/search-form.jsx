"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn, todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { MapPinIcon, SearchIcon } from "@/components/ui/icons";

const carTypes = ["Sedan", "SUV", "Sports", "Luxury", "Electric", "Compact"];

/**
 * Booking search widget. Composes a query string and routes to /cars.
 * Location + dates are captured for the booking step; type filters the list.
 * @param {{ className?: string, defaultType?: string }} props
 */
export function SearchForm({ className, defaultType = "" }) {
  const router = useRouter();
  const today = todayISO();
  const [type, setType] = useState(defaultType);
  const [pickup, setPickup] = useState("");
  const [returnDate, setReturnDate] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (pickup) params.set("pickup", pickup);
    if (returnDate) params.set("return", returnDate);
    router.push(`/cars${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "grid gap-3 rounded-2xl bg-white p-4 shadow-lift ring-1 ring-slate-200/70 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_auto] lg:items-end",
        className,
      )}
    >
      <Field label="Pick-up location">
        <Input
          icon={<MapPinIcon size={18} />}
          placeholder="City or airport"
          defaultValue="Riverside Downtown"
          aria-label="Pick-up location"
        />
      </Field>

      <Field label="Pick-up date">
        <Input
          type="date"
          min={today}
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          aria-label="Pick-up date"
        />
      </Field>

      <Field label="Return date">
        <Input
          type="date"
          min={pickup || today}
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          aria-label="Return date"
        />
      </Field>

      <Field label="Car type">
        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label="Car type"
        >
          <option value="">All types</option>
          {carTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </Field>

      <Button type="submit" size="lg" className="w-full lg:w-auto">
        <SearchIcon size={18} />
        Search
      </Button>
    </form>
  );
}
