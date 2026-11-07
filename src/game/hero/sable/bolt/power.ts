import { BOLT, STRING } from "../../../../constants/sable/bolt";
import { skillValues } from "../../../skills/query";
import { rng } from "../../../state";
import type { Shot } from "./shot";

/** the bolt's own damage as a multiple of attack damage, before bonuses */
export function basePower(b: Shot): number {
  if (b.power !== undefined) return b.power * b.share;
  const p = b.closing ? STRING.closingPower : BOLT.power;
  return p * b.share * (b.hop ? BOLT.hopShare : 1);
}

/** a primed bolt's bonus: a perfect reload's takes Perfect Rhythm's, a kick's, slide's or hop's the base one */
export function primeBonus(b: Shot): number {
  if (b.prime === "reload") return skillValues("s_rhythm").bonus ?? BOLT.primedBonus;
  return b.prime === "charged" ? BOLT.primedBonus : 0;
}

/** the share of its range a bolt had flown when it struck, and whether that counts as far for Longshot */
export function isFar(flown: number): boolean {
  const far = skillValues("s_longshot").far;
  return far !== undefined && flown >= far;
}

/**
 * Every skill's bonus to one bolt hit, added into one sum (one bonus never multiplies another): the prime, Piercing
 * Bolts for each foe passed, Longshot far, Featherdraw in the air, Ricochet per bounce and Breaching Bolt on the closing
 * bolt.
 */
export function bonusSum(b: Shot, passed: number, flown: number): number {
  if (b.plain) return primeBonus(b);
  let sum = primeBonus(b);
  sum += (skillValues("s_pierce").perFoe ?? 0) * passed;
  if (isFar(flown)) sum += skillValues("s_longshot").bonus ?? 0;
  if (b.air) sum += skillValues("s_featherdraw").bonus ?? 0;
  sum += (skillValues("s_ricochet").perBounce ?? 0) * (b.depth ?? 0);
  if (b.closing) sum += skillValues("s_breach").bonus ?? 0;
  return sum;
}

/** a sure crit: Perfect Rhythm's primed bolts at level 8, Longshot's sweet spot at the end of the flight, or Longshot's
 *  added crit chance on a far hit */
export function sureCrit(b: Shot, flown: number, range: number): boolean {
  if (b.plain) return false;
  if (b.prime === "reload" && skillValues("s_rhythm").sureCrit) return true;
  if (!isFar(flown)) return false;
  const v = skillValues("s_longshot");
  if (v.sweet && flown >= range * 0.8) return true;
  return rng.chance(v.crit ?? 0);
}

/** foes a bolt passes through before it stops */
export function pierceOf(b: Shot): number {
  if (b.plain) return b.pierce ?? 0;
  const all = 99;
  if (b.closing && (skillValues("s_pierce").closingAll || skillValues("s_breach").pierceAll)) return all;
  let n = BOLT.pierce + (skillValues("s_pierce").pierce ?? 0);
  if (b.prime === "reload") n += skillValues("s_rhythm").pierce ?? 0;
  if (b.air) n += skillValues("s_featherdraw").pierce ?? 0;
  if (b.side) n += skillValues("s_scatter").pierce ?? 0;
  if (b.hop) n += skillValues("s_hopVolley").pierce ?? 0;
  return n;
}

/** how far a bolt flies: the farthest of Piercing Bolts and Longshot */
export function rangeOf(b: Shot): number {
  if (b.plain) return BOLT.range;
  return Math.max(BOLT.range, skillValues("s_pierce").range ?? 0, skillValues("s_longshot").range ?? 0);
}

/** how fast a bolt flies: Railbolt's are faster */
export const speedOf = (b: Shot): number => (b.plain ? BOLT.speed : (skillValues("s_pierce").speed ?? BOLT.speed));
