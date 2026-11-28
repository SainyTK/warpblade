import type { MeasureReading } from "../../types";
import { MEASURE_IDS } from "../constants";
import type { StageNovelty } from "../types/model";
import { formatNumber } from "../utils/formatNumber";

export function noveltyRate(stages: readonly StageNovelty[]): MeasureReading {
  if (stages.length === 0) {
    return { id: MEASURE_IDS.noveltyRate, raw: null, note: "no stages" };
  }
  const rates = stages.map((stage) => stage.perTenMinutes);
  const mean = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
  const bossAttacks = stages.reduce((sum, stage) => sum + stage.world.bossAttack, 0) / stages.length;
  return {
    id: MEASURE_IDS.noveltyRate,
    raw: mean,
    note: `stages range ${formatNumber(Math.min(...rates))} to ${formatNumber(Math.max(...rates))}; ${formatNumber(bossAttacks)} boss attacks a stage in the second half; areas not counted as places`,
  };
}
