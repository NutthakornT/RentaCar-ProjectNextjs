"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, Select } from "@/components/ui/field";
import { SearchIcon } from "@/components/ui/icons";

const carTypes = ["Sedan", "SUV", "Sports", "Luxury", "Electric", "Compact"];

/**
 * Hero search widget: pick a car type and jump to the filtered catalog. Kept
 * intentionally simple — the full filters (transmission, fuel, price, dates)
 * live on /cars and the booking step.
 * @param {{ className?: string, defaultType?: string }} props
 */
export function SearchForm({ className, defaultType = "" }) {
  const router = useRouter();
  const [type, setType] = useState(defaultType);

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    router.push(`/cars${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "mx-auto flex w-full max-w-xl flex-col gap-3 rounded-2xl bg-white p-4 shadow-lift ring-1 ring-slate-200/70 sm:flex-row sm:items-end",
        className,
      )}
    >
      <Field label="Car type" className="flex-1">
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

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        <SearchIcon size={18} />
        Search
      </Button>
    </form>
  );
}
