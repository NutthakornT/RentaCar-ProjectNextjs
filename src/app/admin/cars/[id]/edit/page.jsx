import { notFound } from "next/navigation";
import { getCarById } from "@/services/cars";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { CarForm } from "@/components/admin/car-form";
import { editCar } from "../../actions";

export const metadata = { title: "Edit car · Admin" };

export default async function EditCarPage({ params }) {
  const { id } = await params;
  const car = await getCarById(id);
  if (!car) notFound();

  return (
    <>
      <AdminPageHeader
        title={`Edit ${car.brand} ${car.name}`}
        description="Update this vehicle's details — including availability. Changes go live immediately once saved."
      />
      <CarForm action={editCar} car={car} submitLabel="Save changes" pendingLabel="Saving…" />
    </>
  );
}
