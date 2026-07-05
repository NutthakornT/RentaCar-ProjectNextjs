"use client";

import { useTransition } from "react";
import Swal from "sweetalert2";
import { buttonVariants } from "@/components/ui/button";

/**
 * Local `YYYY-MM-DDTHH:mm` string for a `datetime-local` input value/min. */
function toLocalInput(date) {
  const d = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return d.toISOString().slice(0, 16);
}

/**
 * "Return car" button on a customer's booking. Confirms with SweetAlert2 and
 * asks the customer when they'll bring the car back, then calls a bound server
 * action (`action` = `submitReturnRequest.bind(null, id)`) with that datetime,
 * filing a return request for an admin to confirm.
 * @param {{ action: (scheduledReturnAt: string) => Promise<{ error?: string } | void>, carName?: string, dueDate?: string }} props
 */
export function ReturnButton({ action, carName = "car", dueDate }) {
  const [pending, startTransition] = useTransition();

  async function handleClick() {
    const now = new Date();
    // Default to the booking's due date at 10:00, unless that's already past.
    const due = dueDate ? new Date(`${dueDate}T10:00`) : null;
    const defaultAt = toLocalInput(due && due > now ? due : now);
    const minAt = toLocalInput(now);

    const res = await Swal.fire({
      title: "Return this car?",
      html: `
        <p style="margin:0 0 14px;font-size:14px;color:#475569;line-height:1.5">
          When will you bring the ${carName} back? An admin will confirm it after checking the car.
        </p>
        <label for="swal-return-at" style="display:block;text-align:left;margin:0 0 6px;font-size:13px;font-weight:600;color:#334155">
          Return date &amp; time
        </label>
        <input id="swal-return-at" type="datetime-local" class="swal2-input" style="margin:0"
          value="${defaultAt}" min="${minAt}" />
      `,
      icon: "question",
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Yes, return it",
      cancelButtonText: "Not yet",
      confirmButtonColor: "#2f6fb0",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
      preConfirm: () => {
        const value = document.getElementById("swal-return-at").value;
        if (!value) {
          Swal.showValidationMessage("Please choose when you'll return the car.");
          return false;
        }
        return value;
      },
    });
    if (!res.isConfirmed || !res.value) return;

    startTransition(async () => {
      const result = await action(res.value);
      if (result?.error) {
        Swal.fire({
          title: "Something went wrong",
          text: result.error,
          icon: "error",
          confirmButtonColor: "#2f6fb0",
        });
        return;
      }
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Return requested",
        text: "We'll confirm it shortly.",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={buttonVariants({ variant: "secondary", size: "sm" })}
    >
      {pending ? "Requesting…" : "Return car"}
    </button>
  );
}
