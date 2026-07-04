import Link from "next/link";
import { cn } from "@/lib/utils";
import { PencilIcon, TrashIcon } from "@/components/ui/icons";

const iconButtonClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-slate-200 transition-colors disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Edit / delete controls for admin rows. Pass `editHref` to make the edit
 * button a real link (used by the cars table); omit it, as the bookings and
 * users tables still do, to keep the disabled scaffold. Delete stays
 * disabled everywhere until wired up.
 */
export function RowActions({ editHref }) {
  return (
    <div className="flex items-center gap-1.5">
      {editHref ? (
        <Link
          href={editHref}
          title="Edit"
          className={cn(iconButtonClass, "text-slate-500 hover:bg-slate-50")}
        >
          <PencilIcon size={15} />
        </Link>
      ) : (
        <button
          type="button"
          disabled
          title="Enabled once the backend is connected"
          className={cn(iconButtonClass, "text-slate-500 hover:bg-slate-50")}
        >
          <PencilIcon size={15} />
        </button>
      )}
      <button
        type="button"
        disabled
        title="Enabled once the backend is connected"
        className={cn(iconButtonClass, "text-red-500 hover:bg-red-50")}
      >
        <TrashIcon size={15} />
      </button>
    </div>
  );
}
