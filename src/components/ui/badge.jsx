import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-slate-100 text-slate-600",
  primary: "bg-primary-50 text-primary-700",
  accent: "bg-accent-100 text-accent-600",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-600",
  info: "bg-sky-50 text-sky-700",
};

/**
 * @param {{ tone?: keyof typeof tones, className?: string, children: React.ReactNode }} props
 */
export function Badge({ tone = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
