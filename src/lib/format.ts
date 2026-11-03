/**
 * The prototype runs off a fixed "today" so the sample data never drifts.
 */
export const TODAY = new Date(2026, 10, 2); // November 2, 2026
export const ANNUAL_HOURS = 2080;

const MS_DAY = 1000 * 60 * 60 * 24;

export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toIso(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

export function todayIso(): string {
  return toIso(TODAY);
}

export function isoDaysAgo(days: number): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - days);
  return toIso(d);
}

export function isoDaysAhead(days: number): string {
  return isoDaysAgo(-days);
}

export function fmtDate(iso: string): string {
  const d = parseDate(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtDateShort(iso: string): string {
  const d = parseDate(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function daysUntil(iso: string): number {
  return Math.round((parseDate(iso).getTime() - TODAY.getTime()) / MS_DAY);
}

export function daysSince(iso: string): number {
  return -daysUntil(iso);
}

export function fmtMoney(n: number, opts: { cents?: boolean } = {}): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: opts.cents ? 2 : 0,
    maximumFractionDigits: opts.cents ? 2 : 0,
  });
}

export function fmtRate(n: number): string {
  return `$${n.toFixed(2)}/hr`;
}

export function firstYearPay(hourly: number): number {
  return Math.round(hourly * ANNUAL_HOURS);
}

export function feeRange(hourly: number, lowPct = 15, highPct = 20) {
  const base = firstYearPay(hourly);
  return {
    base,
    low: Math.round((base * lowPct) / 100),
    high: Math.round((base * highPct) / 100),
  };
}

export function plural(n: number, one: string, many?: string): string {
  return n === 1 ? one : many ?? `${one}s`;
}

/** "an industrial contractor", "a commercial contractor", "self employed". */
export function employerLine(employerType: string): string {
  if (employerType.startsWith("self employed")) return "Currently self employed";
  const article = /^[aeiou]/i.test(employerType) ? "an" : "a";
  return `Currently at ${article} ${employerType}`;
}
