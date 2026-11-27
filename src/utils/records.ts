import type { RunRecords } from "../types/records";

const isTime = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value > 0;

/** records from a save, keeping splits only up to the first one that is missing or broken */
export function parseRecords(saved: unknown): RunRecords {
  const raw = (saved as { splits?: unknown } | null)?.splits;
  if (!Array.isArray(raw)) return { splits: [] };
  const end = raw.findIndex((s) => !isTime(s));
  return { splits: (end < 0 ? raw : raw.slice(0, end)) as number[] };
}

/** the records with a clear of `wave` at `seconds` added, or the same records when it beats nothing */
export function withClear(records: RunRecords, wave: number, seconds: number): RunRecords {
  const i = wave - 1;
  if (i < 0 || i > records.splits.length) return records;
  const kept = records.splits[i];
  if (kept !== undefined && kept <= seconds) return records;
  const splits = [...records.splits];
  splits[i] = seconds;
  return { splits };
}
