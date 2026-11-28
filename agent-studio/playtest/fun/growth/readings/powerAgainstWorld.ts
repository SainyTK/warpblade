import type { MeasureReading } from "../../types";
import { FOES_IN_REACH, FOES_IN_REACH_HIGH, FOES_IN_REACH_LOW, MEASURE_IDS } from "../constants";
import type { RunRecord } from "../types/model";
import { formatNumber } from "../utils/formatNumber";
import { median } from "../utils/median";

export function powerAgainstWorld(randomRuns: readonly RunRecord[]): MeasureReading {
  const ratio = (growth: (run: RunRecord) => number): number | null =>
    median(randomRuns.map((run) => growth(run) / run.foeHpGrowth));
  const raw = ratio((run) => run.heroDpsGrowth);
  const low = ratio((run) => run.heroDpsGrowthLowCrowd);
  const high = ratio((run) => run.heroDpsGrowthHighCrowd);
  const heroGrowth = median(randomRuns.map((run) => run.heroDpsGrowth));
  const foeGrowth = median(randomRuns.map((run) => run.foeHpGrowth));
  return {
    id: MEASURE_IDS.powerAgainstWorld,
    raw,
    note: `hero DPS grows ${formatNumber(heroGrowth)}x and surge foe HP ${formatNumber(foeGrowth)}x from the end of the opening act to the boss (medians); ${FOES_IN_REACH} foes in reach, ${formatNumber(low)} at ${FOES_IN_REACH_LOW} and ${formatNumber(high)} at ${FOES_IN_REACH_HIGH}`,
  };
}
