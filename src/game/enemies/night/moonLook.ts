import type { Ramp } from "../../../types/color";
import { FIRE_SPARKS, INNER_FIRE, MOON, MOON_SPARKS } from "./colors";

export interface MoonLook {
  ramp: Ramp;
  sparks: Ramp;
}

export const moonLook = (enraged: boolean): MoonLook =>
  enraged ? { ramp: INNER_FIRE, sparks: FIRE_SPARKS } : { ramp: MOON, sparks: MOON_SPARKS };

export interface MoonStrike {
  struck: Set<number>;
}
