import { BOLT } from "../../../constants/sable/bolt";
import { RELOAD } from "../../../constants/sable/reload";
import { sable } from "./memory";
import { rankOf } from "./rank";

/** bolts a full quiver holds, with Deep Quiver */
export const quiverSize = (): number => BOLT.quiver + BOLT.quiverPerRank * rankOf("m_quiver");

/** bolts a perfect reload primes, with Perfect Rhythm */
export const primedBolts = (): number => RELOAD.primed + RELOAD.primedPerRank * rankOf("t_rhythm");

/** the reload's bright window as parts of its length, wider with Perfect Rhythm */
export function reloadWindow(): readonly [number, number] {
  const w = RELOAD.windowPerRank * rankOf("t_rhythm");
  return [RELOAD.window[0] - w, RELOAD.window[1] + w];
}

/** flash the quiver on the HUD */
export function flashQuiver(kind: typeof sable.flashKind): void {
  sable.flash = RELOAD.flash;
  sable.flashKind = kind;
}

/** take one bolt from the quiver; false when it is empty */
export function drawBolt(): boolean {
  if (sable.ammo <= 0) return false;
  sable.ammo--;
  return true;
}

/** put bolts back into the quiver, never past full */
export function loadBolts(n: number): void {
  sable.ammo = Math.min(quiverSize(), sable.ammo + n);
}
