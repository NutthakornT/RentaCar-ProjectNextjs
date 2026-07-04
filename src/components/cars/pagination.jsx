"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

/**
 * URL-preserving pagination. Renders <Link>s so pages stay shareable and
 * server-rendered.
 * @param {{ page: number, totalPages: number }} props
 */
export function Pagination({ page, totalPages }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const hrefFor = (p) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p <= 1) params.delete("page");
    else params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-1.5"
      aria-label="Pagination"
    >
      <PageLink
        href={hrefFor(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeftIcon size={18} />
      </PageLink>

      {pages.map((p) => (
        <PageLink key={p} href={hrefFor(p)} active={p === page}>
          {p}
        </PageLink>
      ))}

      <PageLink
        href={hrefFor(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRightIcon size={18} />
      </PageLink>
    </nav>
  );
}

function PageLink({ href, active, disabled, children, ...props }) {
  const className = cn(
    "inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-medium transition-colors",
    active
      ? "bg-primary-600 text-white shadow-soft"
      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
    disabled && "pointer-events-none opacity-40",
  );

  if (disabled) {
    return (
      <span className={className} aria-disabled="true" {...props}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={className} scroll={false} {...props}>
      {children}
    </Link>
  );
}
