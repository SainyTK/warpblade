import { ESCALATION_MIN_STAGES, SKILLED } from "../constants";
import type { FightRun } from "../types";
import { spearman } from "./spearman";

export interface Escalation {
  rho: number | null;
  fights: number;
  stages: number;
}

export function escalation(runs: readonly FightRun[]): Escalation {
  const timed = runs.filter((run) => run.policy === SKILLED && run.fightSeconds !== null && run.fightSeconds > 0);
  const stages = new Set(timed.map((run) => run.stage)).size;
  if (stages < ESCALATION_MIN_STAGES) {
    return { rho: null, fights: timed.length, stages };
  }
  const tiers = timed.map((run) => run.tier);
  const lossPerMinute = timed.map((run) => run.hpLost / ((run.fightSeconds ?? 1) / 60));
  return { rho: spearman(tiers, lossPerMinute), fights: timed.length, stages };
}
