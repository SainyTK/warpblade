import type { RunRecords, WaveClear } from "../types/records";
import { minutesSeconds } from "./runReport";

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

/** the most waves cleared and the fastest time to clear that many, or null before any wave is cleared */
export function bestClear(records: RunRecords): WaveClear | null {
  const waves = records.splits.length;
  return waves ? { waves, seconds: records.splits[waves - 1] } : null;
}

/** a number of waves cleared and its time, as every record line reads it */
export const clearText = (clear: WaveClear): string =>
  `${clear.waves} ${clear.waves === 1 ? "wave" : "waves"} cleared in ${minutesSeconds(clear.seconds)}`;
