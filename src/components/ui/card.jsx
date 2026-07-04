import { cn } from "@/lib/utils";

/**
 * Surface card. `hover` adds the lift-on-hover interaction used by car cards.
 * @param {{ hover?: boolean, className?: string, children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>} props
 */
export function Card({ hover = false, className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-surface ring-1 ring-slate-200/70 shadow-soft",
        hover &&
          "transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:ring-primary-100",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
