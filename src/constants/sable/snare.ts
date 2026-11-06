import { frame } from "../hero";

/** I: a snare set at her feet that snaps shut on the first foe to walk into it */
export const SNARE = {
  mp: 20,
  cooldown: 3.5,
  /** snares on the floor at once, Twin Snare raises it */
  max: 2,
  twinMax: 3,
  twinCooldown: 1.75,
  /** half the width of the jaws, pixels */
  reach: 9,
  /** damage as a multiple of ability power */
  power: 2.6,
  barbedPower: 4.2,
  /** foes caught are held this long */
  hold: 1.6,
  barbedHold: 2.2,
  /** a snare left unsprung falls apart after this long */
  life: 20,
  /** Tripwire Volley: bolts loosed at foes this near the sprung snare */
  volleyRange: 70,
  volleyPower: 0.7,
  /** the setting clip */
  dur: frame(9),
  set: frame(5),
} as const;
