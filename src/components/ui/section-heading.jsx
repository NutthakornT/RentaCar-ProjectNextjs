import { cn } from "@/lib/utils";

/**
 * Consistent section header (eyebrow + title + description).
 * @param {{ eyebrow?: string, title: string, description?: string, align?: "left"|"center", className?: string }} props
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base text-slate-500">{description}</p>
      )}
    </div>
  );
}
