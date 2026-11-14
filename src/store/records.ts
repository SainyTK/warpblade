import { loadRecords, saveRecords } from "../services/recordsStorage";
import type { RunRecords, WaveClear } from "../types/records";
import { bestClear, parseRecords, withClear } from "../utils/records";

/** The one owner of the solo run records: the fastest time to clear each wave. Every change is saved here. */
let records: RunRecords = parseRecords(loadRecords());

/** the most waves cleared and the fastest time to clear that many */
export const bestRun = (): WaveClear | null => bestClear(records);

/** the fastest time to clear a wave, or null when it was never cleared */
export const bestSplit = (wave: number): number | null => records.splits[wave - 1] ?? null;

/** keep a wave cleared at this run time; true when it is the fastest clear of that wave yet */
export function recordClear(wave: number, seconds: number): boolean {
  const next = withClear(records, wave, seconds);
  if (next === records) return false;
  records = next;
  saveRecords(records);
  return true;
}
