import { STAGE_ORDER } from "../constants/stageGraph";
import { isPlaytestSession } from "../services/playtestStart";
import { loadStageRecords, saveStageRecords } from "../services/stageRecordsStorage";
import type { StageId } from "../types/campaign";
import type { StageBest, StageRecordKey, StageRecords, StageRun } from "../types/records";
import { parseStageRecords, withStageRun } from "../utils/stageRecords";
import { stageKey } from "../utils/trackedStats";

const KEYS = STAGE_ORDER.flatMap((stage) => [stageKey(stage), stageKey(stage, true)]);

let records: StageRecords = parseStageRecords(loadStageRecords(), KEYS);

export const stageBest = (stage: StageId, hyper = false): StageBest | null => records[stageKey(stage, hyper)] ?? null;

export const stagesCleared = (): number => STAGE_ORDER.filter((stage) => (stageBest(stage)?.clears ?? 0) > 0).length;

export function recordStageRun(run: StageRun): StageRecordKey[] {
  if (isPlaytestSession()) return [];
  const result = withStageRun(records, run);
  records = result.records;
  saveStageRecords(records);
  return result.beaten;
}
