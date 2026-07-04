import { AdminPageHeader } from "@/components/admin/admin-ui";
import { CarForm } from "@/components/admin/car-form";
import { addCar } from "../actions";

export const metadata = { title: "Add car · Admin" };

export default function NewCarPage() {
  return (
    <>
      <AdminPageHeader
        title="Add a car"
        description="Add a new vehicle to the fleet. It goes live immediately once saved."
      />
      <CarForm action={addCar} />
    </>
  );
}
