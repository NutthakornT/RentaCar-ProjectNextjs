import { getTestimonials } from "@/services/testimonials";
import { SectionHeading } from "@/components/ui/section-heading";
import { ReviewCard } from "@/components/reviews/review-card";

export async function Testimonials() {
  const reviews = await getTestimonials(6);

  return (
    <section id="reviews" className="scroll-mt-20 py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Loved by drivers"
          title="Don't just take our word for it"
          description="Thousands of trips, and a rating we're genuinely proud of."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
