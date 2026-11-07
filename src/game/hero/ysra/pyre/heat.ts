import { HEAT } from "../../../../constants/ysra/heat";
import { rechargeStep } from "../../../build/recharge";
import { objectMemory, rememberPerSeat } from "../../../seatMemory";
import { skillLevel, skillValues } from "../../../skills/query";
import { hero, progress } from "../../../state";

/** Heat and Overheat: the one owner of both. `burn` is the Overheat's whole length, for the bar to burn down. */
const state = { heat: 0, sinceBlow: 0, overheat: 0, burn: 0, flash: 0 };
rememberPerSeat(objectMemory(state));

/** Kindling's numbers; empty when not held */
const kindling = () => skillValues("y_kindling");

/** Heat, 0 to HEAT.max */
export const heat = (): number => state.heat;
/** Heat as a share of the bar, 0 to 1 */
export const heatShare = (): number => state.heat / HEAT.max;
/** seconds of Overheat left, 0 when none */
export const overheatLeft = (): number => state.overheat;
/** seconds left of the bar's flash after a rite Heat could not pay for */
export const heatFlash = (): number => state.flash;
/** Searing Edge burns: from its Heat share up, or while Overheat lasts */
export const searing = (): boolean =>
  skillLevel("y_searing") > 0 && (state.overheat > 0 || heatShare() >= (skillValues("y_searing").from ?? 0));

/** Kindling: below a third of her HP she burns brighter */
export const nearDeath = (): boolean => !!kindling().low && hero.hp < progress.stats.hp * HEAT.lowBelow;

/** Kindling multiplies gains, and doubles them near death; Haste, which recharges rites, adds to it */
const gainScale = (): number => (kindling().gain ?? 1) * (nearDeath() ? 2 : 1) * rechargeStep(1);

/** Heat for each foe a blow struck, heavier for lunges, vault crashes, dive impacts and counters */
export function heatForStrike(source: string, hits: number): number {
  const heavy = HEAT.heavySources.some((s) => source.toLowerCase().includes(s));
  return hits * (heavy ? HEAT.perFoeHeavy : HEAT.perFoe);
}

/** a blow landed: Heat rises and the drain waits again; in Overheat, a share of it feeds the fire longer */
export function gainHeat(amount: number): void {
  state.sinceBlow = 0;
  const gained = amount * gainScale();
  if (state.overheat > 0) {
    const feed = skillValues("y_overheat").feed ?? 0;
    const more = ((gained * feed) / HEAT.max) * (skillValues("y_overheat").time ?? 0);
    state.overheat += more;
    state.burn += more;
    return;
  }
  state.heat = Math.min(HEAT.max, state.heat + gained);
}
/** Heat that comes from the guard, outside blows: no Kindling multiplier */
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

/** Overheat: all her Heat spent on a burn that lasts its level's seconds per full bar */
export function startOverheat(): void {
  const time = (skillValues("y_overheat").time ?? 0) * heatShare();
  state.overheat = time;
  state.burn = time;
}
/** Overheat's kills hold the fire this much longer */
export function extendOverheat(seconds: number): void {
  if (state.overheat <= 0) return;
  state.overheat += seconds;
  state.burn += seconds;
}

/** step Heat: Overheat burns the bar down (held while blows land, as Sunheart), otherwise Heat drains after a pause
 *  without blows (never, as Eternal Hearth); true on the step Overheat runs out */
export function tickHeat(dt: number): boolean {
  state.flash = Math.max(0, state.flash - dt);
  state.sinceBlow += dt;
  if (state.overheat > 0) {
    const hold = skillValues("y_overheat").hold ?? 0;
    if (state.sinceBlow > hold) state.overheat = Math.max(0, state.overheat - dt);
    state.heat = state.burn > 0 ? (HEAT.max * state.overheat) / state.burn : 0;
    if (state.overheat > 0) return false;
    state.heat = 0;
    return true;
  }
  const k = kindling();
  if (!k.noDrain && state.sinceBlow > (k.drainDelay ?? HEAT.drainDelay))
    state.heat = Math.max(0, state.heat - HEAT.drainPerSecond * dt);
  return false;
}

export function resetHeat(): void {
  Object.assign(state, { heat: 0, sinceBlow: 0, overheat: 0, burn: 0, flash: 0 });
}
