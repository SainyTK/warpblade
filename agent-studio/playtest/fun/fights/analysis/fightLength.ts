import { median } from "../../../utils/median";
import { SKILLED } from "../constants";
import type { FightRun } from "../types";

export interface FightLength {
  ratio: number | null;
  ratios: Record<string, number | null>;
}

function killRatio(run: FightRun): number {
  const fight = run.fightSeconds ?? 0;
  if (run.ending !== "clear" && run.bossHpRemoved <= 0) {
    return Number.POSITIVE_INFINITY;
  }
  const killSeconds = run.ending === "clear" ? fight : fight / run.bossHpRemoved;
  return killSeconds / run.designedKillSeconds;
}

export function fightLength(runs: readonly FightRun[]): FightLength {
  const skilled = runs.filter((run) => run.policy === SKILLED);
  const ratios = skilled.map(killRatio);
  const middle = median(ratios);
  return {
    ratio: middle !== null && Number.isFinite(middle) ? middle : null,
    ratios: Object.fromEntries(skilled.map((run, i) => [run.id, Number.isFinite(ratios[i]) ? ratios[i] : null])),
  };
}
