import Link from "next/link";
import { Logo } from "@/components/layout/logo";

/**
 * Centered card shell shared by the login and signup screens.
 * @param {{ title: string, subtitle?: string, children: React.ReactNode, footer?: React.ReactNode }} props
 */
export function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-2xl bg-white p-8 ring-1 ring-slate-200/70 shadow-card">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
          <div className="mt-7">{children}</div>
        </div>
        {footer && (
          <p className="mt-6 text-center text-sm text-slate-500">{footer}</p>
        )}
      </div>
    </div>
  );
}

/** "or" divider used between OAuth and email auth. */
export function AuthDivider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <span className="h-px flex-1 bg-slate-200" />
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
        or
      </span>
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

export { Link };
