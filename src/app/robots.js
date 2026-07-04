const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Robots policy: index public marketing/browse pages, keep private and
 * transactional routes out of search.
 * @returns {import("next").MetadataRoute.Robots}
 */
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/profile", "/booking", "/auth"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
