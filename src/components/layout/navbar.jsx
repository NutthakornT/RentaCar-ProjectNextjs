"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { buttonVariants } from "@/components/ui/button";
import { MenuIcon, XIcon, UserIcon, LogOutIcon, ShieldIcon } from "@/components/ui/icons";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Cars", href: "/cars" },
  { label: "Why ChaoRoad", href: "/#why" },
  { label: "Reviews", href: "/#reviews" },
];

/**
 * Public site navigation. Auth-aware: shows sign-in/up when signed out,
 * profile + sign-out when signed in, and an Admin link for admin profiles.
 * Sign out uses the existing server action.
 * @param {{ user: { email?: string } | null, isAdmin?: boolean, signOut: () => void }} props
 */
export function Navbar({ user, isAdmin = false, signOut }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg">
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive(link.href) && link.href !== "/#why" && link.href !== "/#reviews"
                    ? "bg-primary-50 text-primary-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop auth actions */}
        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={buttonVariants({ variant: "secondary", size: "sm" })}
                >
                  <ShieldIcon size={16} />
                  Admin
                </Link>
              )}
              <Link
                href="/profile"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                <UserIcon size={16} />
                Profile
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className={buttonVariants({ variant: "secondary", size: "sm" })}
                >
                  <LogOutIcon size={16} />
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className={buttonVariants({ variant: "primary", size: "sm" })}
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <MenuIcon size={22} className="hidden" /> : null}
          {open ? <XIcon size={22} /> : <MenuIcon size={22} />}
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-slate-200/70 bg-white lg:hidden">
          <div className="container-page space-y-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-3">
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className={buttonVariants({ variant: "secondary", size: "md" })}
                    >
                      <ShieldIcon size={16} /> Admin
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className={buttonVariants({ variant: "secondary", size: "md" })}
                  >
                    <UserIcon size={16} /> Profile
                  </Link>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "md" }),
                        "w-full",
                      )}
                    >
                      <LogOutIcon size={16} /> Sign out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className={buttonVariants({ variant: "secondary", size: "md" })}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className={buttonVariants({ variant: "primary", size: "md" })}
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
