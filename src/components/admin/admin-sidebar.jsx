"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import {
  DashboardIcon,
  CarIcon,
  ClipboardIcon,
  UsersIcon,
  ArrowRightIcon,
  MenuIcon,
  XIcon,
} from "@/components/ui/icons";

const links = [
  { label: "Dashboard", href: "/admin", icon: DashboardIcon },
  { label: "Cars", href: "/admin/cars", icon: CarIcon },
  { label: "Bookings", href: "/admin/bookings", icon: ClipboardIcon },
  { label: "Users", href: "/admin/users", icon: UsersIcon },
];

function NavLinks({ pathname, onNavigate }) {
  return (
    <nav className="space-y-1">
      {links.map(({ label, href, icon: Icon }) => {
        const active =
          href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary-600 text-white shadow-soft"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100"
          aria-label="Toggle admin menu"
          aria-expanded={open}
        >
          {open ? <XIcon size={22} /> : <MenuIcon size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-b border-slate-200 bg-white p-4 lg:hidden">
          <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-5 lg:flex">
        <div className="px-1.5">
          <Logo />
        </div>
        <p className="mt-1 px-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
          Admin console
        </p>

        <div className="mt-8 flex-1">
          <NavLinks pathname={pathname} />
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowRightIcon size={16} className="rotate-180" />
          Back to site
        </Link>
      </aside>
    </>
  );
}
