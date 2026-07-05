/**
 * Join class names, dropping falsy values. Lightweight stand-in for `clsx`
 * (kept dependency-free since the project uses hand-built Tailwind components).
 * @param {...(string | false | null | undefined)} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/**
 * Format a number as USD, no cents (e.g. 89 -> "$89").
 * @param {number} amount
 */
export function formatCurrency(amount) {
  return currencyFormatter.format(amount ?? 0);
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

/**
 * Format an ISO date string or Date into "Jul 4, 2026".
 * @param {string | Date} value
 */
export function formatDate(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return dateFormatter.format(date);
}

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

/**
 * Format an ISO datetime into "Jul 6, 2026, 2:30 PM".
 * @param {string | Date} value
 */
export function formatDateTime(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return dateTimeFormatter.format(date);
}

/**
 * Inclusive day count between two dates (min 1). Used for rental totals.
 * @param {string | Date} start
 * @param {string | Date} end
 * @returns {number}
 */
export function daysBetween(start, end) {
  if (!start || !end) return 0;
  const a = new Date(start);
  const b = new Date(end);
  const ms = b.getTime() - a.getTime();
  if (Number.isNaN(ms) || ms < 0) return 0;
  return Math.max(1, Math.round(ms / 86_400_000));
}

/** Today's date as a yyyy-mm-dd string, for date input mins. */
export function todayISO() {
  return new Date().toISOString().split("T")[0];
}
