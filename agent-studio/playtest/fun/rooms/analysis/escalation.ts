import { ESCALATION_MIN_STAGES, SKILLED } from "../constants";
import type { RoomRun } from "../types";
import { spearman } from "./spearman";

export interface Escalation {
  rho: number | null;
  rooms: number;
  stages: number;
}

export function escalation(runs: readonly RoomRun[]): Escalation {
  const timed = runs.filter((run) => run.policy === SKILLED && run.roomSeconds > 0);
  const stages = new Set(timed.map((run) => run.stage)).size;
  if (stages < ESCALATION_MIN_STAGES) {
    return { rho: null, rooms: timed.length, stages };
  }
  const tiers = timed.map((run) => run.tier);
  const lossPerMinute = timed.map((run) => run.hpLost / (run.roomSeconds / 60));
  return { rho: spearman(tiers, lossPerMinute), rooms: timed.length, stages };
}
