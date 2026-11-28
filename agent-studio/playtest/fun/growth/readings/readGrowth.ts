import type { MeasureReading } from "../../types";
import { MEASURE_IDS } from "../constants";
import type { GrowthData } from "../types/model";
import { buildSpread } from "./buildSpread";
import { chosenGrowth } from "./chosenGrowth";
import { decisionsPerRun } from "./decisionsPerRun";
import { growthRunway } from "./growthRunway";
import { noveltyRate } from "./noveltyRate";
import { powerAgainstWorld } from "./powerAgainstWorld";
import { runLength } from "./runLength";

const READERS: Readonly<Record<string, (data: GrowthData) => MeasureReading>> = {
  [MEASURE_IDS.powerAgainstWorld]: (data) => powerAgainstWorld(data.randomRuns),
  [MEASURE_IDS.growthRunway]: (data) => growthRunway(data.randomRuns),
  [MEASURE_IDS.runLength]: (data) => runLength(data.plans),
  [MEASURE_IDS.decisionsPerRun]: (data) => decisionsPerRun(data.randomRuns),
  [MEASURE_IDS.buildSpread]: (data) => buildSpread(data.strongestRuns),
  [MEASURE_IDS.chosenGrowth]: (data) => chosenGrowth(data.randomRuns),
  [MEASURE_IDS.noveltyRate]: (data) => noveltyRate(data.novelty),
};

export function readGrowth(measures: readonly string[], data: GrowthData): MeasureReading[] {
  return measures.map((id) => {
    const read = READERS[id];
    if (!read) {
      throw new Error(`the growth job does not measure ${id}`);
    }
    return read(data);
  });
}
