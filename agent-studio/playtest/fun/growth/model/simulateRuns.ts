import { FIRST_RUN_SEED } from "../constants";
import type { Game, HeroDef } from "../types/game";
import type { CardPolicy, Crowd, RunRecord, StagePlan } from "../types/model";
import { simulateRun } from "./simulateRun";

export interface RunBatch {
  game: Game;
  heroes: readonly HeroDef[];
  runs: number;
  plans: readonly StagePlan[];
  policy: CardPolicy;
  crowd: Crowd;
}

export function simulateRuns({ game, heroes, runs, plans, policy, crowd }: RunBatch): RunRecord[] {
  return heroes.flatMap((hero) =>
    Array.from({ length: runs }, (_, index) =>
      simulateRun({ game, hero, policy, seed: FIRST_RUN_SEED + index, plans, crowd }),
    ),
  );
}
