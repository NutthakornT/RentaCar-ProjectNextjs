"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createCar, updateCar, deleteCar } from "@/services/cars";
import { CAR_TYPES, TRANSMISSIONS, FUELS } from "@/lib/constants";

/** Turn "BMW" + "X5 xDrive40i" into the slug id "bmw-x5-xdrive40i". */
function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Validate and normalize the shared car form fields (add + edit use the same
 * form). Returns `{ error }` on the first invalid field, otherwise `{ values }`
 * shaped for the `cars` service functions.
 */
function parseCarForm(formData) {
  const brand = String(formData.get("brand") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const type = String(formData.get("type") || "");
  const transmission = String(formData.get("transmission") || "");
  const fuel = String(formData.get("fuel") || "");
  const pricePerDay = Number(formData.get("price_per_day"));
  const seats = Number(formData.get("seats"));
  const doorsRaw = String(formData.get("doors") || "").trim();
  const yearRaw = String(formData.get("year") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;
  const tagline = String(formData.get("tagline") || "").trim() || null;
  const imageUrl = String(formData.get("image_url") || "").trim() || null;
  const featuresRaw = String(formData.get("features") || "");
  const available = formData.get("available") !== "false";

  if (!brand) return { error: "Brand is required." };
  if (!name) return { error: "Model name is required." };
  if (!CAR_TYPES.includes(type)) return { error: "Choose a valid car type." };
  if (!TRANSMISSIONS.includes(transmission))
    return { error: "Choose a valid transmission." };
  if (!FUELS.includes(fuel)) return { error: "Choose a valid fuel type." };
  if (!Number.isFinite(pricePerDay) || pricePerDay < 0)
    return { error: "Enter a valid price per day." };
  if (!Number.isInteger(seats) || seats < 1)
    return { error: "Enter a valid seat count (whole number, at least 1)." };

  const features = featuresRaw
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);

  return {
    values: {
      brand,
      name,
      type,
      transmission,
      fuel,
      price_per_day: pricePerDay,
      seats,
      doors: doorsRaw ? Number(doorsRaw) : null,
      year: yearRaw ? Number(yearRaw) : null,
      description,
      tagline,
      image_url: imageUrl,
      features,
      available,
    },
  };
}

/**
 * Server Action backing the admin "add car" form. Validates input against the
 * same constraints as the `cars` table, derives a URL-safe slug id, and
 * inserts via the cars service. RLS on the `cars` table requires the caller
 * to be signed in with an admin profile — a non-admin gets a rejected insert,
 * surfaced here as a friendly error rather than a crash.
 * @param {{ error: string | null }} _prevState
 * @param {FormData} formData
 */
export async function addCar(_prevState, formData) {
  const parsed = parseCarForm(formData);
  if (parsed.error) return parsed;

  const { values } = parsed;
  const id = slugify(`${values.brand}-${values.name}`);
  if (!id) return { error: "Could not derive an id from brand and name." };

  try {
    await createCar({ id, ...values });
  } catch (err) {
    if (err?.code === "23505") {
      return {
        error: `A car with the id "${id}" already exists. Try a different brand/name combination.`,
      };
    }
    return {
      error:
        err?.message ??
        "Could not create the car. Make sure you're signed in with an admin account.",
    };
  }

  revalidatePath("/admin/cars");
  revalidatePath("/cars");
  revalidatePath("/");
  redirect("/admin/cars");
}

/**
 * Server Action backing the admin "edit car" form. The id (URL slug) is
 * immutable once created — bookings and car detail links reference it — so
 * only the fields validated by `parseCarForm` are updated.
 * @param {{ error: string | null }} _prevState
 * @param {FormData} formData
 */
export async function editCar(_prevState, formData) {
  const id = String(formData.get("id") || "");
  if (!id) return { error: "Missing car id." };

  const parsed = parseCarForm(formData);
  if (parsed.error) return parsed;

  try {
    await updateCar(id, parsed.values);
  } catch (err) {
    return {
      error:
        err?.message ??
        "Could not update the car. Make sure you're signed in with an admin account.",
    };
  }

  revalidatePath("/admin/cars");
  revalidatePath(`/cars/${id}`);
  revalidatePath("/cars");
  revalidatePath("/");
  redirect("/admin/cars");
}

/**
 * Server Action to delete a car. The id is bound via `.bind()` and invoked
 * from the delete button's event handler (not a form), so it returns
 * `{ error }` on failure instead of throwing — including the common case of a
 * car that still has bookings (FK `on delete restrict`, Postgres code 23503).
 * @param {string} id
 * @returns {Promise<{ error: string } | void>}
 */
export async function removeCar(id) {
  try {
    await deleteCar(id);
  } catch (err) {
    if (err?.code === "23503") {
      return {
        error:
          "This car has bookings and can't be deleted. Mark it out of stock instead.",
      };
    }
    return { error: err?.message ?? "Could not delete the car." };
  }
  revalidatePath("/admin/cars");
  revalidatePath("/cars");
  revalidatePath("/");
}
