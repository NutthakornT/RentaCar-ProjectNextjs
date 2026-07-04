import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCarById,
  getRelatedCars,
  getAllCarIds,
} from "@/services/cars";
import { formatCurrency } from "@/lib/utils";
import { CarGallery } from "@/components/cars/car-gallery";
import { BookingCard } from "@/components/cars/booking-card";
import { CarCard } from "@/components/cars/car-card";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  UsersIcon,
  GaugeIcon,
  FuelIcon,
  DoorIcon,
  CarIcon,
  CalendarIcon,
  StarIcon,
  CheckIcon,
  ChevronRightIcon,
  ShieldIcon,
  ClockIcon,
  RouteIcon,
} from "@/components/ui/icons";

/** Pre-render a detail page for every car. */
export async function generateStaticParams() {
  return getAllCarIds();
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const car = await getCarById(id);
  if (!car) return { title: "Car not found" };

  const title = `${car.brand} ${car.name}`;
  return {
    title,
    description: `Rent the ${title} from ${formatCurrency(car.price_per_day)}/day. ${car.description}`,
    alternates: { canonical: `/cars/${car.id}` },
    openGraph: {
      title: `${title} · ChaoRoad`,
      description: car.tagline ?? car.description,
    },
  };
}

const policies = [
  {
    icon: UsersIcon,
    title: "Driver requirements",
    body: "Minimum age 21. A valid driver's license and a credit card in the renter's name are required at pick-up.",
  },
  {
    icon: RouteIcon,
    title: "Mileage",
    body: "200 miles included per day. Additional miles billed at $0.25/mile. Unlimited mileage available on request.",
  },
  {
    icon: FuelIcon,
    title: "Fuel & charging",
    body: "Return with the same fuel/charge level as pick-up to avoid a refill fee. EVs are delivered fully charged.",
  },
  {
    icon: ClockIcon,
    title: "Cancellation",
    body: "Free cancellation up to 24 hours before pick-up. After that, the first day's rate is charged.",
  },
];

export default async function CarDetailPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const car = await getCarById(id);

  if (!car) notFound();

  const related = await getRelatedCars(id, 3);

  const specs = [
    { icon: CarIcon, label: "Type", value: car.type },
    { icon: UsersIcon, label: "Seats", value: `${car.seats}` },
    { icon: DoorIcon, label: "Doors", value: `${car.doors ?? "—"}` },
    { icon: GaugeIcon, label: "Transmission", value: car.transmission },
    { icon: FuelIcon, label: "Fuel", value: car.fuel },
    { icon: CalendarIcon, label: "Year", value: `${car.year ?? "—"}` },
    { icon: StarIcon, label: "Rating", value: `${car.rating?.toFixed(1) ?? "—"}` },
    { icon: CarIcon, label: "Brand", value: car.brand },
  ];

  return (
    <div className="bg-background">
      {/* Breadcrumb */}
      <div className="container-page pt-6">
        <nav className="flex items-center gap-1.5 text-sm text-slate-500">
          <Link href="/" className="hover:text-primary-600">
            Home
          </Link>
          <ChevronRightIcon size={14} />
          <Link href="/cars" className="hover:text-primary-600">
            Cars
          </Link>
          <ChevronRightIcon size={14} />
          <span className="font-medium text-slate-700">{car.name}</span>
        </nav>
      </div>

      <div className="container-page grid gap-10 py-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Left: gallery + details */}
        <div>
          <CarGallery car={car} />

          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="primary">{car.type}</Badge>
              {car.tagline && <Badge tone="accent">{car.tagline}</Badge>}
            </div>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-primary-600">
                  {car.brand}
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {car.name}
                </h1>
              </div>
              <Rating value={car.rating} count={car.reviews_count} size={18} />
            </div>
          </div>

          {/* Specifications */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Specifications
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {specs.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-xl bg-white p-4 ring-1 ring-slate-200/70"
                >
                  <Icon size={20} className="text-primary-500" />
                  <dt className="mt-2 text-xs text-slate-400">{label}</dt>
                  <dd className="text-sm font-semibold text-slate-900">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Description */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">
              About this car
            </h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              {car.description}
            </p>
          </section>

          {/* Features */}
          {car.features?.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">
                Features
              </h2>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {car.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-sm text-slate-700"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                      <CheckIcon size={14} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Rental policy */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Rental policy
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {policies.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-xl bg-white p-5 ring-1 ring-slate-200/70"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={20} className="text-primary-500" />
                    <h3 className="text-sm font-semibold text-slate-900">
                      {title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: sticky booking card */}
        <div className="lg:relative">
          <div className="lg:sticky lg:top-24">
            <BookingCard
              car={car}
              defaultPickup={typeof sp.pickup === "string" ? sp.pickup : ""}
              defaultReturn={typeof sp.return === "string" ? sp.return : ""}
            />
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary-50 p-4 text-sm text-primary-700">
              <ShieldIcon size={18} />
              Insured & inspected before every trip.
            </div>
          </div>
        </div>
      </div>

      {/* Related cars */}
      {related.length > 0 && (
        <section className="border-t border-slate-200/70 bg-white py-16">
          <div className="container-page">
            <SectionHeading
              align="left"
              eyebrow="You might also like"
              title="Related cars"
              className="max-w-xl"
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <CarCard key={c.id} car={c} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
