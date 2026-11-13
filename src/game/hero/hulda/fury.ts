import { FURY } from "../../../constants/hulda/fury";
import { hulda } from "./memory";

/** Fury from a precise skill: the highest share wins, and a new one refreshes the time */
export function gainFury(share: number, seconds: number = FURY.time): void {
  if (share <= 0) return;
  hulda.fury = hulda.furyT > 0 ? Math.max(hulda.fury, share) : share;
  hulda.furyT = Math.max(hulda.furyT, seconds);
}

/** Fury, Iron Counter's leftovers and Quake Drop's iron run out */
export function tickFury(dt: number): void {
  hulda.furyT = Math.max(0, hulda.furyT - dt);
  if (hulda.furyT <= 0) hulda.fury = 0;
  hulda.unbreakT = Math.max(0, hulda.unbreakT - dt);
  hulda.freeBlock = Math.max(0, hulda.freeBlock - dt);
  hulda.ironT = Math.max(0, hulda.ironT - dt);
  if (hulda.ironT <= 0) hulda.iron = 0;
}

/** Quake Drop's iron is on */
export const inIron = (): boolean => hulda.ironT > 0;

/** her damage multiplier: Fury and Quake Drop's iron add, as bonuses from different skills do */
export const huldaDamageScale = (): number => 1 + hulda.fury + hulda.iron;
