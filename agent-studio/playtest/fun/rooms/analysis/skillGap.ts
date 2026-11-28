import { SKILLED } from "../constants";
import type { RoomRun } from "../types";

export interface SkillGap {
  ratio: number | null;
  skilledRemoved: number;
  mashRemoved: number;
}

const removed = (runs: readonly RoomRun[]): number => runs.reduce((sum, run) => sum + run.bossHpRemoved, 0);

export function skillGap(runs: readonly RoomRun[]): SkillGap {
  const skilledRemoved = removed(runs.filter((run) => run.policy === SKILLED));
  const mashRemoved = removed(runs.filter((run) => run.policy !== SKILLED));
  return {
    ratio: skilledRemoved ? (skilledRemoved - mashRemoved) / skilledRemoved : null,
    skilledRemoved,
    mashRemoved,
  };
}
