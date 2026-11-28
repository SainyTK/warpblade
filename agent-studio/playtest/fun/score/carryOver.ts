import type { MeasureReading } from "../types";
import type { Ledger } from "./types";

export interface CarriedInputs {
  readings: MeasureReading[];
  rubric: Record<string, number[]>;
  carried: string[];
}

export function withCarryOver(
  ledger: Ledger,
  version: number,
  readings: readonly MeasureReading[],
  rubric: Record<string, number[]>,
): CarriedInputs {
  const fresh = new Map(readings.filter((r) => r.raw !== null).map((r) => [r.id, r]));
  const freshRubric = { ...rubric };
  const carried: string[] = [];
  const entries = ledger.entries.filter((entry) => entry.definitionVersion === version).reverse();
  for (const entry of entries) {
    for (const [id, raw] of Object.entries(entry.readings ?? {})) {
      if (!fresh.has(id) && raw !== null) {
        fresh.set(id, { id, raw, note: `carried over from ${entry.build}` });
        carried.push(id);
      }
    }
    for (const [id, levels] of Object.entries(entry.rubric ?? {})) {
      if (!freshRubric[id]?.length && levels.length) {
        freshRubric[id] = levels;
        carried.push(id);
      }
    }
  }
  return { readings: [...fresh.values()], rubric: freshRubric, carried };
}
