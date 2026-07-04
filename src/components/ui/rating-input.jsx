"use client";

import { cn } from "@/lib/utils";
import { StarIcon } from "./icons";

/**
 * Interactive star picker (1–5).
 * @param {{ name?: string, value?: number, onChange?: (v: number) => void, className?: string, size?: number }} props
 */
export function RatingInput({ name = "rating", value = 0, onChange, className, size = 28 }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <input type="hidden" name={name} value={value || ""} required />
      {Array.from({ length: 5 }).map((_, i) => {
        const star = i + 1;
        const filled = star <= value;
        return (
          <button
            key={star}
            type="button"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => onChange?.(star)}
            className="rounded-md p-0.5 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <StarIcon
              size={size}
              filled={filled}
              className={filled ? "text-accent-500" : "text-slate-300"}
            />
          </button>
        );
      })}
    </div>
  );
}