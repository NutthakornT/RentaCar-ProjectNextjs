import { getAllCarIds } from "@/services/cars";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Sitemap for public, indexable routes. Auth-gated and admin routes are
 * intentionally excluded (also disallowed in robots).
 * @returns {import("next").MetadataRoute.Sitemap}
 */
export default async function sitemap() {
  const staticRoutes = ["", "/cars", "/login", "/signup"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/cars" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const carIds = await getAllCarIds();
  const carRoutes = carIds.map(({ id }) => ({
    url: `${baseUrl}/cars/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...carRoutes];
}
