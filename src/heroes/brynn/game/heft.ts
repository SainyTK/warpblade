import { skillValues } from "../../../game/skills/query";
import { HEFT } from "../constants/heft";
import { brynn } from "./state";

/** the most Heft she can hold */
export const heftMost = (): number => HEFT.most;

/** add Heft, up to the top */
export function addHeft(amount: number): void {
  const gain = amount * (1 + (skillValues("br_bellows").heftGain ?? 0));
  brynn.heft = Math.min(heftMost(), brynn.heft + gain);
}

/** a string blow struck `hits` foes: Heft for the blow, more for a crowd and for a heavy swing */
export function heftForBlow(hits: number, heavy: boolean): void {
  if (hits <= 0) return;
  brynn.sinceHit = 0;
  const crowd = Math.min(HEFT.blowMost, HEFT.blow + HEFT.perFoe * (hits - 1));
  addHeft(crowd + (heavy ? HEFT.heavy : 0));
}

/** Heft is full: the bar glows and the next slam is a fissure */
export const heftFull = (): boolean => brynn.heft >= heftMost() - 0.01;

/** the timers: after a while without a blow landing, Heft drains */
export function tickHeft(dt: number): void {
  brynn.sinceHit += dt;
  if (brynn.sinceHit > HEFT.wait) brynn.heft = Math.max(0, brynn.heft - HEFT.drain * dt);
}
