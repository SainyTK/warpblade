import { skillValues } from "../../../game/skills/query";
import { hero, progress } from "../../../game/state";
import { HEFT } from "../constants/heft";
import { brynn } from "./state";

/** the most Heft she can hold */
export const heftMost = (): number => HEFT.most;

/** add Heft, up to the top; Bellows makes it come faster */
export function addHeft(amount: number): void {
  const gain = amount * (1 + (skillValues("br_bellows").heftGain ?? 0));
  brynn.heft = Math.min(heftMost(), brynn.heft + gain);
}

/** a string blow struck `hits` foes: Heft for the blow, more for a crowd and for a heavy swing */
export function heftForBlow(hits: number, heavy: boolean): void {
  if (hits <= 0) return;
  brynn.sinceHit = 0;
  const crowd = Math.min(HEFT.blowMost, HEFT.blow + HEFT.perFoe * (hits - 1));
  addHeft(crowd + (heavy ? HEFT.heavy + (skillValues("br_heavy").heft ?? 0) : 0));
}

/** Heft is full: the bar glows and the next slam is a fissure */
export const heftFull = (): boolean => brynn.heft >= heftMost() - 0.01;

/** a fissure spends the bar; Furnace (Bellows evolved) leaves part of it */
export function spendHeft(): void {
  brynn.heft = heftMost() * (skillValues("br_bellows").keep ?? 0);
}

/** the timers: after a while without a blow landing Heft drains; at full Heft Bellows gives stamina back */
export function tickHeft(dt: number): void {
  const v = skillValues("br_bellows");
  brynn.sinceHit += dt;
  if (brynn.sinceHit > HEFT.wait + (v.hold ?? 0)) brynn.heft = Math.max(0, brynn.heft - HEFT.drain * dt);
  if (v.stamina && heftFull()) hero.stamina = Math.min(progress.stats.stamina, hero.stamina + v.stamina * dt);
}
