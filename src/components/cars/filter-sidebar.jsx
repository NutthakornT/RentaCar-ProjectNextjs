"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { FilterIcon, XIcon, ChevronDownIcon } from "@/components/ui/icons";

const priceBrackets = [
  { label: "Any price", value: "" },
  { label: "Up to $75", value: "75" },
  { label: "Up to $100", value: "100" },
  { label: "Up to $150", value: "150" },
  { label: "Up to $250", value: "250" },
];

const seatOptions = [
  { label: "Any", value: "" },
  { label: "2+", value: "2" },
  { label: "4+", value: "4" },
  { label: "5+", value: "5" },
];

/**
 * URL-driven filter controls for the /cars listing. Every change rewrites the
 * query string (resetting to page 1); the server page re-reads it and filters.
 * @param {{ options: { types: string[], transmissions: string[], fuels: string[] } }} props
 */
export function FilterSidebar({ options }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const current = useCallback(
    (key) => searchParams.get(key) ?? "",
    [searchParams],
  );

  const setParam = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page"); // any filter change returns to page 1
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  // Toggle: clicking the active value clears it.
  const toggleParam = (key, value) =>
    setParam(key, current(key) === value ? "" : value);

  const hasFilters = ["type", "transmission", "fuel", "maxPrice", "seats", "q"].some(
    (k) => current(k),
  );

  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 shadow-soft">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-900 lg:pointer-events-none"
          aria-expanded={open}
        >
          <FilterIcon size={18} className="text-primary-600" />
          Filters
          <ChevronDownIcon
            size={16}
            className={cn(
              "text-slate-400 transition-transform lg:hidden",
              open && "rotate-180",
            )}
          />
        </button>
        {hasFilters && (
          <button
            type="button"
            onClick={() => router.push(pathname, { scroll: false })}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-primary-600"
          >
            <XIcon size={14} />
            Clear all
          </button>
        )}
      </div>

      <div className={cn(open ? "block" : "hidden", "lg:block")}>
      <FilterGroup label="Type">
        <PillRow>
          {options.types.map((t) => (
            <Pill
              key={t}
              active={current("type") === t}
              onClick={() => toggleParam("type", t)}
            >
              {t}
            </Pill>
          ))}
        </PillRow>
      </FilterGroup>

      <FilterGroup label="Transmission">
        <PillRow>
          {options.transmissions.map((t) => (
            <Pill
              key={t}
              active={current("transmission") === t}
              onClick={() => toggleParam("transmission", t)}
            >
              {t}
            </Pill>
          ))}
        </PillRow>
      </FilterGroup>

      <FilterGroup label="Fuel">
        <PillRow>
          {options.fuels.map((f) => (
            <Pill
              key={f}
              active={current("fuel") === f}
              onClick={() => toggleParam("fuel", f)}
            >
              {f}
            </Pill>
          ))}
        </PillRow>
      </FilterGroup>

      <FilterGroup label="Max price / day">
        <div className="flex flex-col gap-1.5">
          {priceBrackets.map((b) => (
            <RadioRow
              key={b.value}
              name="maxPrice"
              checked={current("maxPrice") === b.value}
              onChange={() => setParam("maxPrice", b.value)}
            >
              {b.label}
            </RadioRow>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Seats">
        <PillRow>
          {seatOptions.map((s) => (
            <Pill
              key={s.label}
              active={current("seats") === s.value}
              onClick={() => setParam("seats", s.value)}
            >
              {s.label}
            </Pill>
          ))}
        </PillRow>
      </FilterGroup>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div className="mt-5 border-t border-slate-100 pt-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      {children}
    </div>
  );
}

function PillRow({ children }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary-600 text-white shadow-soft"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200",
      )}
    >
      {children}
    </button>
  );
}

function RadioRow({ name, checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-primary-600"
      />
      {children}
    </label>
  );
}
