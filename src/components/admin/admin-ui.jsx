import { cn } from "@/lib/utils";
import { SparklesIcon } from "@/components/ui/icons";

/** Page title + optional action slot for admin screens. */
export function AdminPageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/** KPI tile for the dashboard. */
export function StatCard({ icon: Icon, label, value, sub, tone = "primary" }) {
  const tones = {
    primary: "bg-primary-50 text-primary-600",
    accent: "bg-accent-100 text-accent-600",
    success: "bg-emerald-50 text-emerald-600",
    info: "bg-sky-50 text-sky-600",
  };
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/70 shadow-soft">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            tones[tone],
          )}
        >
          <Icon size={20} />
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

/** Rounded table container + styled table. */
export function Table({ head, children }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              {head.map((h) => (
                <th key={h} className="whitespace-nowrap px-5 py-3.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function Td({ className, children }) {
  return (
    <td className={cn("whitespace-nowrap px-5 py-4 text-slate-700", className)}>
      {children}
    </td>
  );
}

/** Notice about the current state of write actions on this admin screen. */
export function DemoBanner({ children }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-accent-100/60 px-4 py-3 text-sm text-accent-600 ring-1 ring-accent-200">
      <SparklesIcon size={18} className="mt-0.5 shrink-0" />
      <p>
        {children ?? (
          <>
            <span className="font-semibold">Demo mode.</span> This console is
            wired to mock data — create, edit, and delete are scaffolded and
            will be enabled once the Supabase backend is connected.
          </>
        )}
      </p>
    </div>
  );
}
