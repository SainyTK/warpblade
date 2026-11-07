import { HEAT, OVERHEAT, SEARING } from "../../../../constants/ysra/heat";
import { rechargeStep } from "../../../build/recharge";
import { hasPerk } from "../../../progress";
import { objectMemory, rememberPerSeat } from "../../../seatMemory";
import { skillValues } from "../../../skills/query";
import { hero, progress } from "../../../state";

/** Heat and Overheat: the one owner of both */
const state = { heat: 0, sinceBlow: 0, overheat: 0, flash: 0 };
rememberPerSeat(objectMemory(state));

/** Heat, 0 to HEAT.max */
export const heat = (): number => state.heat;
/** Heat as a share of the bar, 0 to 1 */
export const heatShare = (): number => state.heat / HEAT.max;
/** seconds of Overheat left, 0 when none */
export const overheatLeft = (): number => state.overheat;
/** seconds left of the bar's flash after a rite Heat could not pay for */
export const heatFlash = (): number => state.flash;
/** Searing Edge burns: above half Heat, or while Overheat lasts */
export const searing = (): boolean => hasPerk("searingEdge") && (state.overheat > 0 || heatShare() >= SEARING.from);

/** Kindling adds a share per rank; Unbroken doubles gains below a third of HP; Haste, which recharges rites, adds to it */
function gainScale(): number {
  const kindling = 1 + (skillValues("r_kindle").rank ?? 0) * HEAT.kindlingPerRank;
  const low = hasPerk("unbroken") && hero.hp < progress.stats.hp * HEAT.unbrokenBelow;
  return kindling * (low ? HEAT.unbrokenScale : 1) * rechargeStep(1);
}

/** Heat for each foe a blow struck, heavier for lunges, vault crashes, dive impacts and counters */
export function heatForStrike(source: string, hits: number): number {
  const heavy = HEAT.heavySources.some((s) => source.toLowerCase().includes(s));
  return hits * (heavy ? HEAT.perFoeHeavy : HEAT.perFoe);
}

/** a blow landed: Heat rises and the drain waits again */
export function gainHeat(amount: number): void {
  state.sinceBlow = 0;
  if (state.overheat > 0) return;
  state.heat = Math.min(HEAT.max, state.heat + amount * gainScale());
}
/** Heat that comes from the guard, outside blows: no Kindling, no Unbroken */
export function addHeat(amount: number): void {
  if (state.overheat > 0) return;
  state.heat = Math.min(HEAT.max, state.heat + amount);
}
export function spendHeat(amount: number): void {
  state.heat = Math.max(0, state.heat - amount);
}
/** a rite Heat could not pay for: the bar blinks */
export function flashHeat(time: number): void {
  state.flash = time;
}

/** Overheat starts with a full bar that burns down to empty as it runs out */
export const overheatReady = (): boolean => hasPerk("overheat") && state.overheat <= 0 && state.heat >= HEAT.max;
export function startOverheat(): void {
  state.overheat = OVERHEAT.time;
}

export function tickHeat(dt: number): void {
  state.flash = Math.max(0, state.flash - dt);
  if (state.overheat > 0) {
    state.overheat = Math.max(0, state.overheat - dt);
    state.heat = (HEAT.max * state.overheat) / OVERHEAT.time;
    return;
  }
  state.sinceBlow += dt;
  if (state.sinceBlow > HEAT.drainDelay) state.heat = Math.max(0, state.heat - HEAT.drainPerSecond * dt);
}

export function resetHeat(): void {
  Object.assign(state, { heat: 0, sinceBlow: 0, overheat: 0, flash: 0 });
}
