import type { MeasureReading } from "../../types";
import { MEASURE_IDS, PERCENT } from "../constants";
import type { RunRecord } from "../types/model";
import { formatNumber } from "../utils/formatNumber";
import { median } from "../utils/median";

export function growthRunway(randomRuns: readonly RunRecord[]): MeasureReading {
  const raw = median(randomRuns.map((run) => ((run.fullAtSeconds ?? run.parSeconds) / run.parSeconds) * PERCENT));
  const neverFull = randomRuns.filter((run) => run.fullAtSeconds === null).length / Math.max(1, randomRuns.length);
  return {
    id: MEASURE_IDS.growthRunway,
    raw,
    note: `${formatNumber(neverFull * PERCENT)} percent of runs never fill the build and count as 100`,
  };
}
