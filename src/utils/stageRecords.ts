import type { StageBest, StageRecordKey, StageRecords, StageRun } from "../types/records";
import type { StageGrade } from "../types/run";
import { isRecord } from "./saveFields";

const GRADES: readonly StageGrade[] = ["E", "D", "C", "B", "A", "S"];

export const EMPTY_STAGE_BEST: StageBest = {
  clears: 0,
  fastestClear: null,
  bestGrade: null,
  mostDamage: 0,
  highestLevel: 0,
};

const isGrade = (value: unknown): value is StageGrade => GRADES.includes(value as StageGrade);
const count = (value: unknown): number => (typeof value === "number" && value >= 0 ? value : 0);

function parseBest(raw: unknown): StageBest {
  if (!isRecord(raw)) return EMPTY_STAGE_BEST;
  return {
    clears: Math.floor(count(raw.clears)),
    fastestClear: typeof raw.fastestClear === "number" && raw.fastestClear > 0 ? raw.fastestClear : null,
    bestGrade: isGrade(raw.bestGrade) ? raw.bestGrade : null,
    mostDamage: count(raw.mostDamage),
    highestLevel: count(raw.highestLevel),
  };
}

export function parseStageRecords(raw: unknown, keys: readonly string[]): StageRecords {
  if (!isRecord(raw)) return {};
  return Object.fromEntries(keys.filter((key) => key in raw).map((key) => [key, parseBest(raw[key])]));
}

const betterGrade = (a: StageGrade, b: StageGrade | null): boolean =>
  b === null || GRADES.indexOf(a) > GRADES.indexOf(b);

export function withStageRun(
  records: StageRecords,
  run: StageRun,
): { records: StageRecords; beaten: StageRecordKey[] } {
  const was = records[run.key] ?? EMPTY_STAGE_BEST;
  const next: StageBest = { ...was, clears: was.clears + (run.cleared ? 1 : 0) };
  const beaten: StageRecordKey[] = [];
  if (run.cleared && (was.fastestClear === null || run.seconds < was.fastestClear)) {
    next.fastestClear = run.seconds;
    beaten.push("fastestClear");
  }
  if (betterGrade(run.grade, was.bestGrade)) {
    next.bestGrade = run.grade;
    beaten.push("bestGrade");
  }
  if (run.damage > was.mostDamage) {
    next.mostDamage = run.damage;
    beaten.push("mostDamage");
  }
  if (run.level > was.highestLevel) {
    next.highestLevel = run.level;
    beaten.push("highestLevel");
  }
  return { records: { ...records, [run.key]: next }, beaten };
}
