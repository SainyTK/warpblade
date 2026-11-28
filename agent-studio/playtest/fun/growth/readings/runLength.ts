import type { MeasureReading } from "../../types";
import { MEASURE_IDS, SECONDS_PER_MINUTE } from "../constants";
import type { StagePlan } from "../types/model";
import { formatNumber } from "../utils/formatNumber";
import { median } from "../utils/median";

export function runLength(plans: readonly StagePlan[]): MeasureReading {
  const minutes = plans.map((plan) => plan.parSeconds / SECONDS_PER_MINUTE);
  return {
    id: MEASURE_IDS.runLength,
    raw: median(minutes),
    note: `par time over ${plans.length} stages runs from ${formatNumber(Math.min(...minutes))} to ${formatNumber(Math.max(...minutes))} min`,
  };
}
