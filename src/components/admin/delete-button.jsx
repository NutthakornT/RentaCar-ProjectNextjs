"use client";

import { useTransition } from "react";
import Swal from "sweetalert2";
import { cn } from "@/lib/utils";
import { TrashIcon } from "@/components/ui/icons";

/**
 * Trash button for admin rows. Confirms with a SweetAlert2 dialog, then calls a
 * bound server action (`action` = `serverAction.bind(null, id)`). On failure
 * (e.g. a car that still has bookings) the returned error is shown in an error
 * modal; on success a toast confirms and the action's revalidatePath removes
 * the row.
 * @param {{ action: () => Promise<{ error?: string } | void>, confirmMessage?: string }} props
 */
export function DeleteButton({
  action,
  confirmMessage = "This can't be undone.",
}) {
  const [pending, startTransition] = useTransition();

  async function handleClick() {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: confirmMessage,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;

    startTransition(async () => {
      const res = await action();
      if (res?.error) {
        Swal.fire({
          title: "Couldn't delete",
          text: res.error,
          icon: "error",
          confirmButtonColor: "#0F4C81",
        });
        return;
      }
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Deleted",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      title="Delete"
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 ring-1 ring-slate-200 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      <TrashIcon size={15} />
    </button>
  );
}
