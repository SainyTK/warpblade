import { ERAS, type Era } from "../constants/eras";
import { clamp } from "./math";

/** the era a wave belongs to; waves before the first or past the last take the nearest era */
export function eraOf(wave: number): Era {
  return ERAS.find((e) => wave <= e.last) ?? ERAS[ERAS.length - 1];
}

/** how far a wave is through its era, from 0 at its first wave to 1 at its last */
export function eraProgress(wave: number): number {
  const e = eraOf(wave);
  return e.last === e.first ? 1 : clamp((wave - e.first) / (e.last - e.first));
}
