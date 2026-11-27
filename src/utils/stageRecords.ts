import type { CampaignRecordKey, CampaignRecords, CampaignRun } from "../types/records";
import type { StageGrade } from "../types/run";

const GRADES: readonly StageGrade[] = ["E", "D", "C", "B", "A", "S"];

export const EMPTY_CAMPAIGN_RECORDS: CampaignRecords = {
  mostSealed: 0,
  fastestClear: null,
  bestGrade: null,
  mostDamage: 0,
  highestLevel: 0,
};

const isGrade = (value: unknown): value is StageGrade => GRADES.includes(value as StageGrade);
const count = (value: unknown): number => (typeof value === "number" && value >= 0 ? value : 0);

export function parseCampaignRecords(raw: unknown): CampaignRecords {
  if (!raw || typeof raw !== "object") return EMPTY_CAMPAIGN_RECORDS;
  const r = raw as Record<string, unknown>;
  return {
    mostSealed: count(r.mostSealed),
    fastestClear: typeof r.fastestClear === "number" && r.fastestClear > 0 ? r.fastestClear : null,
    bestGrade: isGrade(r.bestGrade) ? r.bestGrade : null,
    mostDamage: count(r.mostDamage),
    highestLevel: count(r.highestLevel),
  };
}

const betterGrade = (a: StageGrade, b: StageGrade | null): boolean =>
  b === null || GRADES.indexOf(a) > GRADES.indexOf(b);

export function withCampaignRun(
  records: CampaignRecords,
  run: CampaignRun,
): { records: CampaignRecords; beaten: CampaignRecordKey[] } {
  const next = { ...records };
  const beaten: CampaignRecordKey[] = [];
  if (run.sealed > records.mostSealed) {
    next.mostSealed = run.sealed;
    beaten.push("mostSealed");
  }
  if (run.cleared && (records.fastestClear === null || run.seconds < records.fastestClear)) {
    next.fastestClear = run.seconds;
    beaten.push("fastestClear");
  }
  if (betterGrade(run.grade, records.bestGrade)) {
    next.bestGrade = run.grade;
    beaten.push("bestGrade");
  }
  if (run.damage > records.mostDamage) {
    next.mostDamage = run.damage;
    beaten.push("mostDamage");
  }
  if (run.level > records.highestLevel) {
    next.highestLevel = run.level;
    beaten.push("highestLevel");
  }
  return { records: next, beaten };
}
