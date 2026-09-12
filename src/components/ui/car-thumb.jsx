"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CarIcon, BoltIcon } from "./icons";

/** Renders car.image_url if set, falling back to a generated gradient placeholder. */

const palettes = [
  ["#0f4c81", "#0d3f6b", "#102c47"],
  ["#134e63", "#0e3a4a", "#0b2733"],
  ["#1e293b", "#0f172a", "#020617"],
  ["#3b3054", "#241d38", "#151022"],
  ["#0f4c81", "#175e8f", "#0b3a63"],
  ["#334155", "#1e293b", "#0f172a"],
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * @param {{ car: import("@/types").Car, frame?: number, className?: string, iconSize?: number }} props
 */
export function CarThumb({ car, frame = 0, className, iconSize = 88 }) {
  const [imgError, setImgError] = useState(false);
  const isElectric = car?.fuel === "Electric";

  if (car?.image_url && !imgError) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={car.image_url}
          alt={`${car?.brand ?? ""} ${car?.name ?? "car"}`}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
        {isElectric && (
          <span className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
            <BoltIcon size={12} /> Electric
          </span>
        )}
      </div>
    );
  }

  const seed = hash((car?.id ?? "car") + "-" + frame);
  const [a, b, c] = palettes[seed % palettes.length];
  const angle = 120 + (seed % 5) * 15;

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden",
        className,
      )}
      style={{
        backgroundImage: `radial-gradient(120% 120% at ${20 + (seed % 60)}% 0%, ${a} 0%, ${b} 55%, ${c} 100%)`,
      }}
      role="img"
      aria-label={`${car?.brand ?? ""} ${car?.name ?? "car"}`}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(${angle}deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)`,
        }}
      />
      <div className="absolute inset-x-6 bottom-5 h-6 rounded-[100%] bg-black/25 blur-md" />

      <CarIcon size={iconSize} className="relative z-10 text-white/85" />

      {isElectric && (
        <span className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
          <BoltIcon size={12} /> Electric
        </span>
      )}

      <div className="absolute bottom-3 left-4 z-10">
        <p className="text-[11px] font-medium uppercase tracking-wide text-white/60">
          {car?.brand}
        </p>
        <p className="text-sm font-semibold text-white/90">{car?.name}</p>
      </div>
    </div>
  );
}