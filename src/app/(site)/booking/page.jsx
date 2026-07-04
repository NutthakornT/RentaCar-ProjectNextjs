import { getCarById } from "@/services/cars";
import { createClient } from "@/lib/supabase/server";
import { BookingFlow } from "@/components/booking/booking-flow";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { CarIcon } from "@/components/ui/icons";
import Link from "next/link";

export const metadata = {
  title: "Complete your booking",
  description: "Confirm your rental dates and driver details with DriveLux.",
  robots: { index: false },
};

export default async function BookingPage({ searchParams }) {
  const sp = await searchParams;
  const carId = typeof sp.car === "string" ? sp.car : undefined;
  const car = carId ? await getCarById(carId) : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="bg-background">
      <div className="container-page py-10 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Complete your booking
          </h1>
          <p className="mt-2 text-slate-500">
            Almost there — confirm your details and you&apos;re set. No payment
            now.
          </p>
        </div>

        {car ? (
          <BookingFlow
            car={car}
            initialPickup={typeof sp.pickup === "string" ? sp.pickup : ""}
            initialReturn={typeof sp.return === "string" ? sp.return : ""}
            userId={user?.id ?? ""}
            userEmail={user?.email ?? ""}
          />
        ) : (
          <EmptyState
            icon={<CarIcon size={26} />}
            title="Choose a car to get started"
            description="Pick a car from the fleet and select your dates to begin a booking."
            action={
              <Link
                href="/cars"
                className={buttonVariants({ variant: "primary", size: "md" })}
              >
                Browse cars
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
