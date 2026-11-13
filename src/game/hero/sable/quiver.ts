import { BOLT } from "../../../constants/sable/bolt";
import { RELOAD } from "../../../constants/sable/reload";
import { skillValues } from "../../skills/query";
import { sable } from "./memory";

/** how a drawn bolt is primed: by a perfect reload (Perfect Rhythm's bonus), by a parry, a slide or a hop (the base bonus),
 *  or not at all */
export type Prime = "reload" | "charged" | null;

/** bolts a full quiver holds, with Perfect Rhythm */
export const quiverSize = (): number => BOLT.quiver + (skillValues("s_rhythm").quiver ?? 0);

/** bolts a perfect reload primes, with Perfect Rhythm */
export const primedBolts = (): number => skillValues("s_rhythm").primed ?? RELOAD.primed;

/** the reload's bright window as parts of its length, wider with Perfect Rhythm */
export function reloadWindow(): readonly [number, number] {
  const w = skillValues("s_rhythm").window ?? 0;
  return [RELOAD.window[0] - w, RELOAD.window[1] + w];
}

/** flash the quiver on the HUD */
export function flashQuiver(kind: typeof sable.flashKind): void {
  sable.flash = RELOAD.flash;
  sable.flashKind = kind;
}

/** take one bolt from the quiver, with how it is primed; false when it is empty */
export function drawBolt(): { prime: Prime } | false {
  if (sable.ammo <= 0) return false;
  sable.ammo--;
  if (sable.primed > 0) {
    sable.primed--;
    return { prime: "reload" };
  }
  if (sable.charged > 0) {
    sable.charged--;
    return { prime: "charged" };
  }
  return { prime: sable.shade > 0 ? "charged" : null };
}

/** prime the next bolts at the base bonus (a parry, a slide or a hop did it) */
export function chargeBolts(n: number): void {
  sable.charged = Math.max(sable.charged, n);
}

/** put bolts back into the quiver, never past full */
export function loadBolts(n: number): void {
  sable.ammo = Math.min(quiverSize(), sable.ammo + n);
}
