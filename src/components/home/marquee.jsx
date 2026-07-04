import { StarIcon } from "@/components/ui/icons";

/** One repeating group of "Bangkok only" phrases (two of these tile the track). */
function MarqueeGroup({ hidden = false }) {
  return (
    <div
      className="flex shrink-0 items-center"
      aria-hidden={hidden || undefined}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-6 pr-6">
          <span className="text-2xl font-bold uppercase tracking-tight sm:text-3xl">
            Bangkok only
          </span>
          <StarIcon size={16} filled className="text-accent-400" />
        </div>
      ))}
    </div>
  );
}

/**
 * Full-width band with an infinitely sliding "Bangkok only" marquee. Pure CSS
 * animation (see `.animate-marquee` in globals.css) — no client JS.
 */
export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-white/10 bg-primary-900 py-4 text-white">
      <div className="flex w-max animate-marquee">
        <MarqueeGroup />
        <MarqueeGroup hidden />
      </div>
    </div>
  );
}
