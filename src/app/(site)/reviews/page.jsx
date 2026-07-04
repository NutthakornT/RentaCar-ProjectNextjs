import Link from "next/link";
import { getTestimonials } from "@/services/testimonials";
import { ReviewCard } from "@/components/reviews/review-card";
import { Rating } from "@/components/ui/rating";
import { buttonVariants } from "@/components/ui/button";
import { StarIcon, ArrowRightIcon } from "@/components/ui/icons";

export const metadata = {
  title: "Customer Reviews",
  description:
    "Read what DriveLux customers say about our fleet, booking experience, and support.",
  alternates: { canonical: "/reviews" },
};

function buildSummary(reviews) {
  const total = reviews.length;
  const average =
    total > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
      : 0;

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    return {
      stars,
      count,
      percent: total ? Math.round((count / total) * 100) : 0,
    };
  });

  return { total, average, distribution };
}

export default async function ReviewsPage() {
  const reviews = await getTestimonials();
  const { total, average, distribution } = buildSummary(reviews);

  return (
    <>
      {/* Header */}
      <section className="border-b border-slate-200/70 bg-white">
        <div className="container-page py-10 sm:py-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
            Customer stories
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Reviews from real drivers
          </h1>
          <p className="mt-2 max-w-2xl text-slate-500">
            Transparent feedback from people who booked with DriveLux — no
            filters, no fluff.
          </p>
        </div>
      </section>

      <div className="container-page py-10 sm:py-14">
        {/* Summary */}
        <div className="grid gap-8 rounded-2xl bg-white p-6 ring-1 ring-slate-200/70 shadow-soft sm:p-8 lg:grid-cols-[280px_1fr] lg:items-center">
          <div className="text-center lg:text-left">
            <p className="text-5xl font-bold text-slate-900">
              {average.toFixed(1)}
            </p>
            <Rating
              value={average}
              count={total}
              size={20}
              showValue={false}
              className="mt-3 justify-center lg:justify-start"
            />
            <p className="mt-2 text-sm text-slate-500">
              Based on {total} verified reviews
            </p>
          </div>

          <ul className="space-y-3">
            {distribution.map(({ stars, count, percent }) => (
              <li key={stars} className="flex items-center gap-3 text-sm">
                <span className="flex w-14 items-center gap-1 font-medium text-slate-700">
                  {stars}
                  <StarIcon size={14} filled className="text-accent-500" />
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-primary-500 transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-8 text-right text-slate-400">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Review grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 px-6 py-10 text-center text-white sm:px-10">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready for your own story?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-primary-100">
            Browse the fleet, pick your dates, and see why our rating stays
            high trip after trip.
          </p>
          <Link
            href="/cars"
            className={buttonVariants({
              variant: "secondary",
              size: "lg",
              className: "mt-6 bg-white text-primary-700 hover:bg-slate-50",
            })}
          >
            Browse cars
            <ArrowRightIcon size={18} />
          </Link>
        </div>
      </div>
    </>
  );
}