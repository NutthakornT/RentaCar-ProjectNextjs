import Link from "next/link";
import { getAllCars } from "@/services/cars";
import { formatCurrency } from "@/lib/utils";
import {
  AdminPageHeader,
  Table,
  Td,
  DemoBanner,
} from "@/components/admin/admin-ui";
import { RowActions } from "@/components/admin/row-actions";
import { removeCar } from "./actions";
import { Badge } from "@/components/ui/badge";
import { CarThumb } from "@/components/ui/car-thumb";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PlusIcon, CarIcon } from "@/components/ui/icons";

export const metadata = { title: "Cars · Admin" };

export default async function AdminCarsPage() {
  const cars = await getAllCars();

  return (
    <>
      <AdminPageHeader
        title="Cars"
        description={`${cars.length} vehicles in your fleet.`}
        action={
          <Link
            href="/admin/cars/new"
            className={buttonVariants({ variant: "primary", size: "md" })}
          >
            <PlusIcon size={16} />
            Add car
          </Link>
        }
      />
      <DemoBanner>
        <span className="font-semibold">Live data.</span> Cars are stored in
        Supabase — add, edit, and delete all update the public site
        immediately.
      </DemoBanner>

      {cars.length === 0 ? (
        <EmptyState
          icon={<CarIcon size={24} />}
          title="No cars yet"
          description="Your fleet is empty. Add your first car to get it listed on the site."
          action={
            <Link
              href="/admin/cars/new"
              className={buttonVariants({ variant: "primary", size: "md" })}
            >
              <PlusIcon size={16} />
              Add car
            </Link>
          }
        />
      ) : (
        <Table head={["Car", "Type", "Transmission", "Fuel", "Price / day", "Status", ""]}>
          {cars.map((car) => (
            <tr key={car.id} className="hover:bg-slate-50/60">
              <Td>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-16 shrink-0 overflow-hidden rounded-lg">
                    <CarThumb car={car} iconSize={26} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{car.name}</p>
                    <p className="text-xs text-slate-400">{car.brand}</p>
                  </div>
                </div>
              </Td>
              <Td>
                <Badge tone="primary">{car.type}</Badge>
              </Td>
              <Td className="text-slate-500">{car.transmission}</Td>
              <Td className="text-slate-500">{car.fuel}</Td>
              <Td className="font-semibold text-slate-900">
                {formatCurrency(car.price_per_day)}
              </Td>
              <Td>
                {car.available ? (
                  <Badge tone="success">Available</Badge>
                ) : (
                  <Badge tone="danger">Booked</Badge>
                )}
              </Td>
              <Td>
                <RowActions
                  editHref={`/admin/cars/${car.id}/edit`}
                  deleteAction={removeCar.bind(null, car.id)}
                  deleteConfirm={`Delete ${car.brand} ${car.name}? This can't be undone.`}
                />
              </Td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
