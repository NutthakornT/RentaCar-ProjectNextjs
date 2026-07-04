import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2";

const variants = {
  primary:
    "bg-primary-600 text-white shadow-soft hover:bg-primary-700 hover:shadow-card active:scale-[.98] focus-visible:outline-primary-500",
  accent:
    "bg-accent-400 text-primary-900 shadow-soft hover:bg-accent-300 active:scale-[.98] focus-visible:outline-accent-500",
  secondary:
    "bg-white text-primary-700 ring-1 ring-primary-100 shadow-soft hover:ring-primary-200 hover:bg-primary-50 active:scale-[.98] focus-visible:outline-primary-500",
  outline:
    "border border-white/40 text-white hover:bg-white/10 focus-visible:outline-white",
  ghost:
    "text-primary-700 hover:bg-primary-50 focus-visible:outline-primary-500",
  danger:
    "bg-red-600 text-white shadow-soft hover:bg-red-700 active:scale-[.98] focus-visible:outline-red-500",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-[3.25rem] px-7 text-base",
  icon: "h-10 w-10",
};

/**
 * Compose button class names. Shared so `<Link>` / `<a>` can look like buttons.
 * @param {{ variant?: keyof typeof variants, size?: keyof typeof sizes, className?: string }} [opts]
 */
export function buttonVariants({ variant = "primary", size = "md", className } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

/**
 * @param {{ variant?: keyof typeof variants, size?: keyof typeof sizes } & React.ButtonHTMLAttributes<HTMLButtonElement>} props
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}
