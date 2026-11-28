import { SKILLED } from "../constants";
import type { FightRun } from "../types";

export interface ClearRate {
  percent: number | null;
  clears: number;
  fights: number;
}

export function clearRate(runs: readonly FightRun[]): ClearRate {
  const skilled = runs.filter((run) => run.policy === SKILLED);
  const clears = skilled.filter((run) => run.ending === "clear").length;
  return { percent: skilled.length ? (clears / skilled.length) * 100 : null, clears, fights: skilled.length };
}
