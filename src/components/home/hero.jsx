import Link from "next/link";
import { SearchForm } from "./search-form";
import { buttonVariants } from "@/components/ui/button";
import { SparklesIcon, ArrowRightIcon, StarIcon } from "@/components/ui/icons";

const stats = [
  { value: "4.9/5", label: "Average rating" },
  { value: "12k+", label: "Trips completed" },
  { value: "24/7", label: "Roadside support" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient pb-28 pt-16 text-white sm:pt-24">
      {/* decorative glow */}
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-primary-400/20 blur-3xl" />

      <div className="container-page relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/15 backdrop-blur">
            <SparklesIcon size={16} className="text-accent-400" />
            Premium cars, effortless booking
          </span>

          <h1 className="animate-fade-up mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
            Drive something
            <span className="text-gradient-gold"> exceptional</span>
          </h1>

          <p className="animate-fade-up mx-auto mt-5 max-w-xl text-lg text-slate-200">
            รถยนต์ที่มีคุณภาพสูง นำเข้ามาอย่างดี ดูแลอย่างละเอียด
            พร้อมให้เช่ารายวัน ราคาที่ชัดเจน ยืนยันการเช่าได้ทันที
            ไม่มีค่าใช้จ่ายเพิ่มเติมใดๆ
          </p>

          <div className="animate-fade-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/cars"
              className={buttonVariants({ variant: "accent", size: "lg" })}
            >
              Browse the fleet
              <ArrowRightIcon size={18} />
            </Link>
            <Link
              href="/#why"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              How it works
            </Link>
          </div>

          {/* Trust stats
          <dl className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <dt className="text-2xl font-bold text-white sm:text-3xl">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs text-slate-300 sm:text-sm">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl> */}

          {/* <div className="mt-6 flex items-center justify-center gap-1 text-accent-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} size={16} filled />
            ))}
            <span className="ml-2 text-sm text-slate-300">
              Rated excellent by 12,000+ drivers
            </span>
          </div> */}
        </div>
      </div>

      {/* Search widget */}
      <div className="container-page relative z-10 mt-14">
        <SearchForm />
      </div>
    </section>
  );
}
