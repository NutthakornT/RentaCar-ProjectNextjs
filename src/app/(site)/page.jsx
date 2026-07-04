import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { FeaturedCars } from "@/components/home/featured-cars";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { Testimonials } from "@/components/home/testimonials";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";

export const metadata = {
  title: "Premium Car Rental",
  description:
    "Rent premium, meticulously maintained cars by the day. Transparent pricing, instant booking, and 24/7 support with DriveLux.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCars />
      <WhyChooseUs />
      <Testimonials />

      {/* Closing CTA */}
      <section className="container-page pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient px-8 py-14 text-center text-white sm:px-16 sm:py-20">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent-400/20 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to hit the road?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-slate-200">
              Browse the fleet and book your car in minutes. No hidden fees,
              instant confirmation, and support whenever you need it.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/cars"
                className={buttonVariants({ variant: "accent", size: "lg" })}
              >
                Browse the fleet
                <ArrowRightIcon size={18} />
              </Link>
              <Link
                href="/signup"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
