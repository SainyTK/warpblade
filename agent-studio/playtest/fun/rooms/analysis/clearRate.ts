import { SKILLED } from "../constants";
import type { RoomRun } from "../types";

export interface ClearRate {
  percent: number | null;
  clears: number;
  rooms: number;
}

export function clearRate(runs: readonly RoomRun[]): ClearRate {
  const skilled = runs.filter((run) => run.policy === SKILLED);
  const clears = skilled.filter((run) => run.ending === "clear").length;
  return { percent: skilled.length ? (clears / skilled.length) * 100 : null, clears, rooms: skilled.length };
}
