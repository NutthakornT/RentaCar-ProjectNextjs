import Link from "next/link";
import { Logo } from "./logo";
import { MapPinIcon, MailIcon, HeadsetIcon } from "@/components/ui/icons";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Browse cars", href: "/cars" },
      { label: "Electric fleet", href: "/cars?type=Electric" },
      { label: "SUVs", href: "/cars?type=SUV" },
      { label: "Luxury", href: "/cars?type=Luxury" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Why DriveLux", href: "/#why" },
      { label: "Reviews", href: "/#reviews" },
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/signup" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="footer" className="bg-primary-900 text-slate-300">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo tone="light" />
          <p className="max-w-xs text-sm text-slate-400">
            Premium car rental for people who care about the details.
            Transparent pricing, spotless cars, effortless booking.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-white">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-sm font-semibold text-white">Get in touch</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2.5">
              <MapPinIcon size={16} className="text-accent-400" />
              120 Riverside Ave, Suite 4
            </li>
            <li className="flex items-center gap-2.5">
              <MailIcon size={16} className="text-accent-400" />
              hello@drivelux.example
            </li>
            <li className="flex items-center gap-2.5">
              <HeadsetIcon size={16} className="text-accent-400" />
              24/7 roadside support
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-400 sm:flex-row">
          <p>© {year} DriveLux. All rights reserved.</p>
          <p className="flex gap-4">
            <Link href="/#" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/#" className="hover:text-white">
              Terms
            </Link>
            <Link href="/#" className="hover:text-white">
              Cookies
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
