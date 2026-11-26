import type { DrillStrikeId } from "../../../../types/drill";
import type { Enemy } from "../../../../types/enemy";
import { fireRound } from "./round";

const POWER = { third: 0.8, warp: 0.6 } as const;
const struck: Enemy[] = [];

export function noteStruck(foe: Enemy): void {
  struck.push(foe);
}

export function struckThisSwing(): readonly Enemy[] {
  return struck;
}

export function pullTrigger(strike: DrillStrikeId | "warp", landed: boolean): void {
  if (landed && (strike === "third" || strike === "warp")) {
    fireRound(struck[0] ?? null, { power: POWER[strike], kind: strike === "warp" ? "warp" : "trigger" });
  }
}

export function clearStruck(): void {
  struck.length = 0;
}
