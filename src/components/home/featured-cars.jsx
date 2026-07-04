import Link from "next/link";
import { getFeaturedCars } from "@/services/cars";
import { CarCard } from "@/components/cars/car-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icons";

export async function FeaturedCars() {
  const cars = await getFeaturedCars(6);
  if (cars.length === 0) return null;

  return (
    <section className="container-page py-20 sm:py-24">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeading
          align="left"
          eyebrow="The fleet"
          title="Featured cars"
          description="A rotating selection of our most-loved rides — from efficient EVs to weekend performance."
          className="max-w-xl"
        />
        <Link
          href="/cars"
          className={buttonVariants({ variant: "secondary", size: "md" })}
        >
          View all cars
          <ArrowRightIcon size={18} />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </section>
  );
}
