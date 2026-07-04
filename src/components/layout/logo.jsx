import Link from "next/link";
import { cn } from "@/lib/utils";
import { CarIcon } from "@/components/ui/icons";

/**
 * DriveLux wordmark + mark.
 * @param {{ href?: string, className?: string, tone?: "dark"|"light" }} props
 */
export function Logo({ href = "/", className, tone = "dark" }) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-soft transition-transform group-hover:scale-105">
        <CarIcon size={20} />
      </span>
      <span
        className={cn(
          "text-lg font-semibold tracking-tight",
          tone === "light" ? "text-white" : "text-slate-900",
        )}
      >
        Drive<span className="text-accent-500">Lux</span>
      </span>
    </Link>
  );
}
