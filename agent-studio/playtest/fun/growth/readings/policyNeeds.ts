import { MEASURE_IDS } from "../constants";

const RANDOM_POLICY_MEASURES: readonly string[] = [
  MEASURE_IDS.powerAgainstWorld,
  MEASURE_IDS.growthRunway,
  MEASURE_IDS.decisionsPerRun,
  MEASURE_IDS.chosenGrowth,
  MEASURE_IDS.noveltyRate,
];

const STRONGEST_POLICY_MEASURES: readonly string[] = [MEASURE_IDS.buildSpread];

export const needsRandomRuns = (measures: readonly string[]): boolean =>
  measures.some((id) => RANDOM_POLICY_MEASURES.includes(id));

export const needsStrongestRuns = (measures: readonly string[]): boolean =>
  measures.some((id) => STRONGEST_POLICY_MEASURES.includes(id));
