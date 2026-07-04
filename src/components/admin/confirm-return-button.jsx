"use client";

import { useTransition } from "react";
import Swal from "sweetalert2";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@/components/ui/icons";

/**
 * Admin "confirm return" button on a booking row. Opens a SweetAlert2 dialog to
 * capture the actual return date (defaults to today) and optional condition
 * notes, then calls a bound server action (`action` =
 * `confirmReturnAction.bind(null, bookingId)`). Reports the computed late fee.
 * @param {{ action: (details: { returnedAt: string, conditionNotes: string }) => Promise<any>, dueDate: string, highlighted?: boolean }} props
 */
export function ConfirmReturnButton({ action, dueDate, highlighted = false }) {
  const [pending, startTransition] = useTransition();
  const today = new Date().toISOString().split("T")[0];

  async function handleClick() {
    const { value, isConfirmed } = await Swal.fire({
      title: "Confirm return",
      html: `
        <p style="margin:0 0 12px;font-size:14px;color:#475569">Due back: <b>${dueDate}</b></p>
        <input id="swal-returned" type="date" class="swal2-input" style="margin:0 0 10px" value="${today}" max="${today}" />
        <textarea id="swal-notes" class="swal2-textarea" style="margin:0" placeholder="Condition notes (optional)"></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Mark returned",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2f6fb0",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
      preConfirm: () => {
        const returnedAt = document.getElementById("swal-returned").value;
        if (!returnedAt) {
          Swal.showValidationMessage("Please pick the return date");
          return false;
        }
        return {
          returnedAt,
          conditionNotes: document.getElementById("swal-notes").value,
        };
      },
    });
    if (!isConfirmed || !value) return;

    startTransition(async () => {
      const res = await action(value);
      if (res?.error) {
        Swal.fire({
          title: "Couldn't confirm",
          text: res.error,
          icon: "error",
          confirmButtonColor: "#2f6fb0",
        });
        return;
      }
      Swal.fire({
        title: "Return confirmed",
        text:
          res.lateFee > 0
            ? `Returned ${res.lateDays} day(s) late — a $${res.lateFee} late fee was applied.`
            : "Returned on time — no late fee.",
        icon: "success",
        confirmButtonColor: "#2f6fb0",
      });
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      title="Confirm the car has been returned"
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        highlighted
          ? "bg-emerald-600 hover:bg-emerald-700"
          : "bg-slate-600 hover:bg-slate-700",
      )}
    >
      <CheckIcon size={14} />
      {pending ? "Saving…" : "Return"}
    </button>
  );
}
