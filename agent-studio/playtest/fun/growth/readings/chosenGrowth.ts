import type { MeasureReading } from "../../types";
import { MEASURE_IDS, PERCENT } from "../constants";
import type { RunRecord } from "../types/model";
import { formatNumber } from "../utils/formatNumber";
import { median } from "../utils/median";

export function chosenGrowth(randomRuns: readonly RunRecord[]): MeasureReading {
  const share = (run: RunRecord): number =>
    (run.picks / (run.picks + run.chestUpgrades + run.chestEvolutions)) * PERCENT;
  return {
    id: MEASURE_IDS.chosenGrowth,
    raw: median(randomRuns.map(share)),
    note: `${formatNumber(median(randomRuns.map((run) => run.picks)))} picks against ${formatNumber(median(randomRuns.map((run) => run.chestUpgrades + run.chestEvolutions)))} chest upgrades from ${formatNumber(median(randomRuns.map((run) => run.chests)))} chests (medians)`,
  };
}
