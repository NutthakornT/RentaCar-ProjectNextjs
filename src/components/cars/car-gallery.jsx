import { CarThumb } from "@/components/ui/car-thumb";

/**
 * Car detail image: a single large frame. Generated placeholder until real
 * photography is added (swap CarThumb for the real <Image src={car.image_url}/>).
 * @param {{ car: import("@/types").Car }} props
 */
export function CarGallery({ car }) {
  return (
    <div className="aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-slate-200/70 shadow-card">
      <CarThumb car={car} iconSize={128} />
    </div>
  );
}
