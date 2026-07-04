import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "./icons";

const controlBase =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100 disabled:opacity-60";

/**
 * Labelled field wrapper.
 * @param {{ label?: string, htmlFor?: string, hint?: string, icon?: React.ReactNode, className?: string, children: React.ReactNode }} props
 */
export function Field({ label, htmlFor, hint, className, children }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-xs font-medium text-slate-600"
        >
          {label}
        </label>
      )}
      {children}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

/** @param {{ icon?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>} props */
export function Input({ className, icon, ...props }) {
  if (icon) {
    return (
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          className={cn(controlBase, "h-11 pl-10", className)}
          {...props}
        />
      </div>
    );
  }
  return <input className={cn(controlBase, "h-11", className)} {...props} />;
}

/** @param {React.TextareaHTMLAttributes<HTMLTextAreaElement>} props */
export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(controlBase, "min-h-24 resize-y py-2.5", className)}
      {...props}
    />
  );
}

/** @param {React.SelectHTMLAttributes<HTMLSelectElement>} props */
export function Select({ className, children, ...props }) {
  return (
    <div className="relative">
      <select
        className={cn(
          controlBase,
          "h-11 appearance-none pr-10",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon
        size={18}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}
