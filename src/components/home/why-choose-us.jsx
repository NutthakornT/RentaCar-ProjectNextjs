import { SectionHeading } from "@/components/ui/section-heading";
import {
  ShieldIcon,
  TagIcon,
  ClockIcon,
  HeadsetIcon,
  SparklesIcon,
  RouteIcon,
} from "@/components/ui/icons";

const features = [
  {
    icon: ShieldIcon,
    title: "Fully insured",
    body: "Every rental includes comprehensive coverage and 24/7 roadside assistance. Drive with total peace of mind.",
  },
  {
    icon: TagIcon,
    title: "Transparent pricing",
    body: "The price you see is the price you pay. No hidden fees, no surprise charges at the counter — ever.",
  },
  {
    icon: SparklesIcon,
    title: "Spotless & maintained",
    body: "Each car is professionally detailed and inspected before every trip. It always feels brand new.",
  },
  {
    icon: ClockIcon,
    title: "Book in minutes",
    body: "A streamlined flow gets you from browsing to confirmed in under two minutes. Instant confirmation.",
  },
  {
    icon: RouteIcon,
    title: "Flexible pickup",
    body: "Choose the pickup location and time that suit you. Extend or adjust your booking with a tap.",
  },
  {
    icon: HeadsetIcon,
    title: "Real human support",
    body: "Our team answers fast, any hour of the day. Talk to a person, not a phone tree.",
  },
];

export function WhyChooseUs() {
  return (
    <section id="why" className="scroll-mt-20 bg-white py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Why DriveLux"
          title="Renting a car, finally done right"
          description="We rebuilt the rental experience around the things that actually matter to you."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group rounded-2xl border border-slate-100 bg-background p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary-100 hover:shadow-card"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                <Icon size={24} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
