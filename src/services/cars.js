import { createPublicClient } from "@/lib/supabase/public";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Cars data-access layer. Reads use the public client (RLS allows anyone);
 * writes use the server client so RLS can verify the caller is an admin.
 * @typedef {import("@/types").Car} Car
 * @typedef {import("@/types").CarFilters} CarFilters
 */

/** Postgres `numeric` columns arrive as strings from PostgREST; cast to numbers. */
function mapCarRow(row) {
  if (!row) return row;
  return {
    ...row,
    price_per_day: Number(row.price_per_day),
    rating: row.rating == null ? 0 : Number(row.rating),
  };
}

/** Strip characters that are structural delimiters in PostgREST's `.or()` filter syntax. */
function sanitizeSearchTerm(value) {
  return value.replace(/[,()]/g, "");
}

/** @returns {Promise<Car[]>} */
export async function getAllCars() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapCarRow);
}

function applyCarFilters(query, { q, type, transmission, fuel, minPrice, maxPrice, seats }) {
  if (q) {
    const term = sanitizeSearchTerm(q);
    query = query.or(`name.ilike.%${term}%,brand.ilike.%${term}%,type.ilike.%${term}%`);
  }
  if (type) query = query.eq("type", type);
  if (transmission) query = query.eq("transmission", transmission);
  if (fuel) query = query.eq("fuel", fuel);
  if (typeof minPrice === "number") query = query.gte("price_per_day", minPrice);
  if (typeof maxPrice === "number") query = query.lte("price_per_day", maxPrice);
  if (typeof seats === "number") query = query.gte("seats", seats);
  return query;
}

/**
 * Filter, sort, and paginate the catalog.
 * @param {CarFilters & { page?: number, perPage?: number }} [opts]
 * @returns {Promise<{ items: Car[], total: number, page: number, perPage: number, totalPages: number }>}
 */
export async function getCars(opts = {}) {
  const { sort = "recommended", page = 1, perPage = 6, ...filters } = opts;
  const supabase = createPublicClient();

  // Count first so the page can be clamped before fetching the actual range.
  const { count, error: countError } = await applyCarFilters(
    supabase.from("cars").select("id", { count: "exact", head: true }),
    filters,
  );
  if (countError) throw countError;

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const from = (safePage - 1) * perPage;
  const to = from + perPage - 1;

  let dataQuery = applyCarFilters(supabase.from("cars").select("*"), filters);
  switch (sort) {
    case "price-asc":
      dataQuery = dataQuery.order("price_per_day", { ascending: true });
      break;
    case "price-desc":
      dataQuery = dataQuery.order("price_per_day", { ascending: false });
      break;
    case "rating":
      dataQuery = dataQuery.order("rating", { ascending: false });
      break;
    default:
      dataQuery = dataQuery
        .order("available", { ascending: false })
        .order("rating", { ascending: false });
  }

  const { data, error } = await dataQuery.range(from, to);
  if (error) throw error;

  return {
    items: (data ?? []).map(mapCarRow),
    total,
    page: safePage,
    perPage,
    totalPages,
  };
}

/**
 * @param {string} id
 * @returns {Promise<Car | null>}
 */
export async function getCarById(id) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return mapCarRow(data);
}

/**
 * Highest-rated available cars for the landing page.
 * @param {number} [limit]
 * @returns {Promise<Car[]>}
 */
export async function getFeaturedCars(limit = 6) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("available", true)
    .order("rating", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(mapCarRow);
}

/**
 * Cars of the same type (excluding the current one) for the detail page.
 * @param {string} id
 * @param {number} [limit]
 * @returns {Promise<Car[]>}
 */
export async function getRelatedCars(id, limit = 3) {
  const supabase = createPublicClient();
  const current = await getCarById(id);
  if (!current) return [];

  const { data: sameType, error: sameTypeError } = await supabase
    .from("cars")
    .select("*")
    .eq("type", current.type)
    .neq("id", id)
    .limit(limit);
  if (sameTypeError) throw sameTypeError;

  const results = (sameType ?? []).map(mapCarRow);
  if (results.length >= limit) return results;

  const { data: fill, error: fillError } = await supabase
    .from("cars")
    .select("*")
    .neq("type", current.type)
    .neq("id", id)
    .limit(limit - results.length);
  if (fillError) throw fillError;

  return [...results, ...(fill ?? []).map(mapCarRow)];
}

/** Distinct filter options derived from the catalog. */
export async function getFilterOptions() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("cars")
    .select("type, transmission, fuel, price_per_day");
  if (error) throw error;

  const rows = data ?? [];
  const distinct = (field) => [...new Set(rows.map((r) => r[field]))].sort();
  const prices = rows.map((r) => Number(r.price_per_day));

  return {
    types: distinct("type"),
    transmissions: distinct("transmission"),
    fuels: distinct("fuel"),
    priceRange: {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
    },
  };
}

/** Static params for pre-rendering every car detail page. */
export async function getAllCarIds() {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("cars").select("id");
  if (error) throw error;
  return (data ?? []).map((c) => ({ id: c.id }));
}

/**
 * Insert a new car. Requires an admin session — RLS rejects it otherwise.
 * @param {Omit<Car, "rating"|"reviews_count">} payload
 * @returns {Promise<Car>}
 */
export async function createCar(payload) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("cars")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return mapCarRow(data);
}

/**
 * Update an existing car. Requires an admin session — RLS rejects it otherwise.
 * @param {string} id
 * @param {Partial<Omit<Car, "id"|"rating"|"reviews_count">>} payload
 * @returns {Promise<Car>}
 */
export async function updateCar(id, payload) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("cars")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapCarRow(data);
}

/**
 * Delete a car. Requires an admin session (RLS). `bookings.car_id` is
 * `on delete restrict`, so deleting a car with bookings throws.
 * @param {string} id
 */
export async function deleteCar(id) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("cars").delete().eq("id", id);
  if (error) throw error;
}
