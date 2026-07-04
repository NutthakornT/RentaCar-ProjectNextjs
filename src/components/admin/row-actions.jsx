import { PencilIcon, TrashIcon } from "@/components/ui/icons";

/**
 * Edit / delete controls for admin rows. Disabled scaffold — wired up once the
 * backend exists. Kept as real buttons so the intended UX is visible.
 */
export function RowActions() {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        disabled
        title="Enabled once the backend is connected"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 ring-1 ring-slate-200 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <PencilIcon size={15} />
      </button>
      <button
        type="button"
        disabled
        title="Enabled once the backend is connected"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 ring-1 ring-slate-200 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <TrashIcon size={15} />
      </button>
    </div>
  );
}
