import { cn } from "@/lib/utils";
import { StarIcon } from "./icons";

/**
 * Star rating display. Shows 5 stars with the numeric value; not interactive.
 * @param {{ value?: number, count?: number, size?: number, className?: string, showValue?: boolean }} props
 */
export function Rating({
  value = 0,
  count,
  size = 16,
  className,
  showValue = true,
}) {
  const rounded = Math.round(value);
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center text-accent-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} size={size} filled={i < rounded} />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-slate-700">
          {value.toFixed(1)}
        </span>
      )}
      {typeof count === "number" && (
        <span className="text-sm text-slate-400">({count})</span>
      )}
    </div>
  );
}
