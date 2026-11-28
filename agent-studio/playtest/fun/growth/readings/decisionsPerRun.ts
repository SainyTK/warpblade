import type { MeasureReading } from "../../types";
import { MEASURE_IDS, STAGE_CHOICES_PER_RUN } from "../constants";
import type { RunRecord } from "../types/model";
import { formatNumber } from "../utils/formatNumber";
import { median } from "../utils/median";

export function decisionsPerRun(randomRuns: readonly RunRecord[]): MeasureReading {
  const beforeFull = median(randomRuns.map((run) => run.picksBeforeFull));
  return {
    id: MEASURE_IDS.decisionsPerRun,
    raw: beforeFull === null ? null : beforeFull + STAGE_CHOICES_PER_RUN,
    note: `${formatNumber(beforeFull)} picks before the build is full of ${formatNumber(median(randomRuns.map((run) => run.picks)))} in a run, plus the stage choice`,
  };
}
