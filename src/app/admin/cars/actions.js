"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createCar } from "@/services/cars";
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
 * Server Action backing the admin "add car" form. Validates input against the
 * same constraints as the `cars` table, derives a URL-safe slug id, and
 * inserts via the cars service. RLS on the `cars` table requires the caller
 * to be signed in with an admin profile — a non-admin gets a rejected insert,
 * surfaced here as a friendly error rather than a crash.
 * @param {{ error: string | null }} _prevState
 * @param {FormData} formData
 */
export async function addCar(_prevState, formData) {
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

  const id = slugify(`${brand}-${name}`);
  if (!id) return { error: "Could not derive an id from brand and name." };

  const features = featuresRaw
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);

  try {
    await createCar({
      id,
      name,
      brand,
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
      available: true,
    });
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
