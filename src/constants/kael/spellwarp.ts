import type { Ramp } from "../../types/color";
import type { KaelAbility } from "../../types/spell";
import { SPARKS } from "../palette";

/** Spellwarp: the sparks each ability's element throws off the foe the warp lands on */
export const SPELLWARP_SPARKS: Readonly<Record<KaelAbility, Ramp>> = {
  lance: SPARKS.crystal,
  burst: SPARKS.crystal,
  fire: SPARKS.hot,
  ice: SPARKS.ice,
  volt: SPARKS.volt,
};
/** Arcane Arrival: the free cast on an arrival goes off at this share of the ability's power */
export const ARCANE_SHARE = 0.5;
