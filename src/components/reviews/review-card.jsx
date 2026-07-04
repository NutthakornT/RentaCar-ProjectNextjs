import { cn } from "@/lib/utils";
import { Rating } from "@/components/ui/rating";

/** Initials avatar derived from a name. */
function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
      {initials}
    </span>
  );
}

/**
 * @param {{ review: import("@/types").Testimonial, className?: string }} props
 */
export function ReviewCard({ review, className }) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-soft",
        className,
      )}
    >
      <Rating value={review.rating} size={16} showValue={false} />
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">
        “{review.quote}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
        <Avatar name={review.name} />
        <div>
          <p className="text-sm font-semibold text-slate-900">{review.name}</p>
          <p className="text-xs text-slate-500">{review.role}</p>
        </div>
      </figcaption>
    </figure>
  );
}
