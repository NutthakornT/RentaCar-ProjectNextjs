import { getCars, getFilterOptions } from "@/services/cars";
import { CarCard } from "@/components/cars/car-card";
import { FilterSidebar } from "@/components/cars/filter-sidebar";
import { Pagination } from "@/components/cars/pagination";
import { SortSelect } from "@/components/cars/sort-select";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchIcon } from "@/components/ui/icons";

export const metadata = {
  title: "Browse Cars",
  description:
    "Explore the DriveLux fleet — sedans, SUVs, sports cars, luxury, and EVs. Filter by type, transmission, fuel, and price.",
  alternates: { canonical: "/cars" },
};

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) && value !== "" && value != null ? n : undefined;
}

export default async function CarsPage({ searchParams }) {
  const sp = await searchParams;
  const options = await getFilterOptions();

  const { items, total, page, totalPages } = await getCars({
    q: sp.q,
    type: sp.type,
    transmission: sp.transmission,
    fuel: sp.fuel,
    maxPrice: toNumber(sp.maxPrice),
    seats: toNumber(sp.seats),
    sort: sp.sort,
    page: toNumber(sp.page) ?? 1,
    perPage: 6,
  });

  return (
    <>
      {/* Page header */}
      <section className="border-b border-slate-200/70 bg-white">
        <div className="container-page py-10 sm:py-12">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Browse our fleet
          </h1>
          <p className="mt-2 max-w-2xl text-slate-500">
            {total} cars ready to book. Filter to find the perfect match for
            your trip.
          </p>
        </div>
      </section>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <FilterSidebar options={options} />
        </aside>

        {/* Results */}
        <div>
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-900">{items.length}</span>{" "}
              of {total}
            </p>
            <SortSelect />
          </div>

          {items.length === 0 ? (
            <EmptyState
              icon={<SearchIcon size={26} />}
              title="No cars match your filters"
              description="Try widening your price range or clearing a filter to see more of the fleet."
            />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
