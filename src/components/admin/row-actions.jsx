import Link from "next/link";
import { cn } from "@/lib/utils";
import { PencilIcon, TrashIcon } from "@/components/ui/icons";
import { DeleteButton } from "./delete-button";

const iconButtonClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-slate-200 transition-colors disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Edit / delete controls for admin rows. Each control is disabled unless its
 * prop is supplied: `editHref` enables edit, `deleteAction` enables delete.
 * @param {{ editHref?: string, deleteAction?: () => Promise<any>, deleteConfirm?: string }} props
 */
export function RowActions({ editHref, deleteAction, deleteConfirm }) {
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
          title="Editing isn't available here"
          className={cn(iconButtonClass, "text-slate-500 hover:bg-slate-50")}
        >
          <PencilIcon size={15} />
        </button>
      )}
      {deleteAction ? (
        <DeleteButton action={deleteAction} confirmMessage={deleteConfirm} />
      ) : (
        <button
          type="button"
          disabled
          title="Enabled once the backend is connected"
          className={cn(iconButtonClass, "text-red-500 hover:bg-red-50")}
        >
          <TrashIcon size={15} />
        </button>
      )}
    </div>
  );
}
