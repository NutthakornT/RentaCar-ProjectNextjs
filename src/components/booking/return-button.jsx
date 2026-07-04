"use client";

import { useTransition } from "react";
import Swal from "sweetalert2";
import { buttonVariants } from "@/components/ui/button";

/**
 * "Return car" button on a customer's booking. Confirms with SweetAlert2, then
 * calls a bound server action (`action` = `submitReturnRequest.bind(null, id)`)
 * that files a return request for an admin to confirm.
 * @param {{ action: () => Promise<{ error?: string } | void>, carName?: string }} props
 */
export function ReturnButton({ action, carName = "car" }) {
  const [pending, startTransition] = useTransition();

  async function handleClick() {
    const res = await Swal.fire({
      title: "Return this car?",
      text: `Let us know you're returning the ${carName}. An admin will confirm it after checking the car.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, return it",
      cancelButtonText: "Not yet",
      confirmButtonColor: "#2f6fb0",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });
    if (!res.isConfirmed) return;

    startTransition(async () => {
      const result = await action();
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
