const DAY_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** "4 November 2026" from a YYYY-MM-DD day */
export function formatDay(day: string): string {
  return DAY_FORMAT.format(new Date(`${day}T00:00:00Z`));
}

const STAMP_FORMAT = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeStyle: "short" });

/** the full local date and time of an ISO timestamp */
export function formatStamp(iso: string): string {
  return STAMP_FORMAT.format(new Date(iso));
}

const RELATIVE = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

/** "3 days ago" or "yesterday"; anything under a minute is "just now" */
export function formatRelative(iso: string, now: number): string {
  const seconds = (new Date(iso).getTime() - now) / 1000;
  for (const [unit, size] of STEPS) {
    if (Math.abs(seconds) >= size) return RELATIVE.format(Math.round(seconds / size), unit);
  }
  return "just now";
}
