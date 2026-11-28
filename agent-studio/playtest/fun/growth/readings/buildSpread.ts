import type { MeasureReading } from "../../types";
import { MEASURE_IDS, PERCENT } from "../constants";
import type { RunRecord } from "../types/model";
import { formatNumber } from "../utils/formatNumber";

interface TopCore {
  hero: string;
  core: string;
  share: number;
}

function topCore(hero: string, runs: readonly RunRecord[]): TopCore {
  const counts = new Map<string, number>();
  for (const run of runs) {
    counts.set(run.core, (counts.get(run.core) ?? 0) + 1);
  }
  const [core, count] = [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0] ?? ["", 0];
  return { hero, core, share: (count / Math.max(1, runs.length)) * PERCENT };
}

export function buildSpread(strongestRuns: readonly RunRecord[]): MeasureReading {
  const heroes = [...new Set(strongestRuns.map((run) => run.hero))];
  const tops = heroes.map((hero) =>
    topCore(
      hero,
      strongestRuns.filter((run) => run.hero === hero),
    ),
  );
  const worst = [...tops].sort((a, b) => b.share - a.share)[0];
  if (!worst) {
    return { id: MEASURE_IDS.buildSpread, raw: null, note: "no strongest-card runs" };
  }
  return {
    id: MEASURE_IDS.buildSpread,
    raw: worst.share,
    note: `${worst.hero} ends ${formatNumber(worst.share)} percent of runs with ${worst.core}`,
  };
}
