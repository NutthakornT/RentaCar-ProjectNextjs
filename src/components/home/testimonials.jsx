import { getRecentReviews } from "@/services/reviews";
import { SectionHeading } from "@/components/ui/section-heading";
import { ReviewCard } from "@/components/reviews/review-card";
import { EmptyState } from "@/components/ui/empty-state";
import { StarIcon } from "@/components/ui/icons";

export async function Testimonials() {
  const reviews = await getRecentReviews(6);

  return (
    <section id="reviews" className="scroll-mt-20 py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Loved by drivers"
          title="Real reviews from customers"
          description=""
        />

        {reviews.length === 0 ? (
          <div className="mt-14">
            <EmptyState
              icon={<StarIcon size={24} />}
              title="No reviews yet"
              description="Be the first — leave a review from your account after your trip."
            />
          </div>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
