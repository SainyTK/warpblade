import { SAND_BAR } from "../../../constants/mirel/field";
import { mirel } from "./memory";
import { sandMaxBonus, sandRefillScale } from "./sandSkills";

/** the most Sand her hourglass holds */
export const sandMax = (): number => SAND_BAR.max + sandMaxBonus();

/** the share of the hourglass full, for the SD bar and the hourglass at her belt */
export const sandShare = (): number => Math.max(0, Math.min(1, mirel.sand / sandMax()));

/** the hourglass holds at least this much */
export const hasSand = (amount: number): boolean => mirel.sand >= amount - 1e-6;

/** pay Sand; the hourglass waits a moment before it refills */
export function spendSand(amount: number): void {
  mirel.sand = Math.max(0, mirel.sand - amount);
  mirel.sandWait = SAND_BAR.wait;
}

/** Sand given back by a blow or a skill */
export function gainSand(amount: number): void {
  mirel.sand = Math.min(sandMax(), mirel.sand + amount);
}

/** Sand refills while she waits: never while her own field stands (unless a skill says so), nor just after a spend */
export function refillSand(dt: number): void {
  mirel.sandWait = Math.max(0, mirel.sandWait - dt);
  if (mirel.sandWait > 0) return;
  const rate = SAND_BAR.refill * sandRefillScale(!!mirel.field);
  if (rate <= 0) return;
  gainSand(rate * dt);
}
