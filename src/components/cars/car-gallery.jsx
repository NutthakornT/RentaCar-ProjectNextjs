"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CarThumb } from "@/components/ui/car-thumb";

/**
 * Car detail gallery: a large frame plus selectable thumbnails. Frames are
 * generated placeholders (varied by index) until real photography is added.
 * @param {{ car: import("@/types").Car }} props
 */
export function CarGallery({ car }) {
  const frames = Math.max(1, car.gallery ?? 4);
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-slate-200/70 shadow-card">
        <CarThumb car={car} frame={active} iconSize={128} />
      </div>

      {frames > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {Array.from({ length: frames }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View angle ${i + 1}`}
              className={cn(
                "aspect-[4/3] overflow-hidden rounded-xl ring-2 transition-all",
                active === i
                  ? "ring-primary-500"
                  : "ring-transparent opacity-70 hover:opacity-100",
              )}
            >
              <CarThumb car={car} frame={i} iconSize={40} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
