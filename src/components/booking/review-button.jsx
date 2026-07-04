"use client";

import { useTransition } from "react";
import Swal from "sweetalert2";
import { buttonVariants } from "@/components/ui/button";

/**
 * "Leave a review" button on a customer's completed booking. Opens a
 * SweetAlert2 dialog with an interactive 1–5 star rating and a comment, then
 * calls a bound server action (`action` = `submitReview.bind(null, { carId,
 * bookingId })`).
 * @param {{ action: (details: { rating: number, comment: string }) => Promise<any>, carName?: string }} props
 */
export function ReviewButton({ action, carName = "car" }) {
  const [pending, startTransition] = useTransition();

  async function handleClick() {
    const { value, isConfirmed } = await Swal.fire({
      title: `Review your ${carName}`,
      html: `
        <div id="swal-stars" style="display:flex;gap:8px;justify-content:center;font-size:34px;line-height:1;margin:6px 0 10px">
          ${[1, 2, 3, 4, 5]
            .map(
              (n) =>
                `<span data-v="${n}" role="button" style="cursor:pointer;color:#cbd5e1">★</span>`,
            )
            .join("")}
        </div>
        <input id="swal-rating" type="hidden" value="0" />
        <textarea id="swal-comment" class="swal2-textarea" style="margin:0" placeholder="Tell others about your experience (optional)"></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Submit review",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2f6fb0",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
      didOpen: () => {
        const stars = Array.from(document.querySelectorAll("#swal-stars span"));
        const input = document.getElementById("swal-rating");
        const paint = (v) =>
          stars.forEach((s) => {
            s.style.color = Number(s.dataset.v) <= v ? "#f0a868" : "#cbd5e1";
          });
        stars.forEach((s) => {
          s.addEventListener("mouseenter", () => paint(Number(s.dataset.v)));
          s.addEventListener("click", () => {
            input.value = s.dataset.v;
            paint(Number(s.dataset.v));
          });
        });
        document
          .getElementById("swal-stars")
          .addEventListener("mouseleave", () => paint(Number(input.value)));
      },
      preConfirm: () => {
        const rating = Number(document.getElementById("swal-rating").value);
        if (!rating) {
          Swal.showValidationMessage("Please pick a star rating");
          return false;
        }
        return {
          rating,
          comment: document.getElementById("swal-comment").value,
        };
      },
    });
    if (!isConfirmed || !value) return;

    startTransition(async () => {
      const result = await action(value);
      if (result?.error) {
        Swal.fire({
          title: "Couldn't submit",
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
        title: "Thanks for your review!",
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
      {pending ? "Submitting…" : "Leave a review"}
    </button>
  );
}
