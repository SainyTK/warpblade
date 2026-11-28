import { median } from "../../../utils/median";
import { REWARD_MERGE_MS } from "../constants";
import type { Reward, StageRun } from "../types";

export interface RewardRhythm {
  seconds: number | null;
  perRun: Record<string, number | null>;
}

function medianGap(rewards: readonly Reward[]): number | null {
  const moments: number[] = [];
  for (const t of rewards.map((reward) => reward.t).sort((a, b) => a - b)) {
    const last = moments.at(-1);
    if (last === undefined || t - last >= REWARD_MERGE_MS) moments.push(t);
  }
  const gaps = moments.slice(1).map((t, i) => (t - moments[i]) / 1000);
  return median(gaps);
}

export function rewardRhythm(runs: readonly StageRun[]): RewardRhythm {
  const perRun = runs.map((run) => medianGap(run.rewards));
  return {
    seconds: median(perRun.filter((gap): gap is number => gap !== null)),
    perRun: Object.fromEntries(runs.map((run, i) => [run.id, perRun[i]])),
  };
}
