import { frame } from "../hero";

/** I: a snare set at her feet that snaps shut on the first foe to walk into it */
export const SNARE = {
  mp: 20,
  cooldown: 3.5,
  /** snares on the floor at once */
  max: 2,
  /** half the width of the jaws, pixels */
  reach: 9,
  /** damage as a multiple of ability power */
  power: 6,
  /** foes caught are held this long */
  hold: 1.6,
  /** a snare left unsprung falls apart after this long */
  life: 20,
  /** Barbed Jaws: the bolts a sprung snare looses at foes near it, as a share of a bolt */
  volleyPower: 0.7,
  /** the setting clip */
  dur: frame(9),
  set: frame(5),
} as const;
