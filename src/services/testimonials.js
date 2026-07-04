import { testimonials } from "@/lib/mock/testimonials";

/**
 * @typedef {import("@/types").Testimonial} Testimonial
 * @param {number} [limit]
 * @returns {Promise<Testimonial[]>}
 */
export async function getTestimonials(limit) {
  return typeof limit === "number" ? testimonials.slice(0, limit) : testimonials;
}
