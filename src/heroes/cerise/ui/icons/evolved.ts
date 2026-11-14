import { KEEN_RAMP } from "../../../../constants/combo";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { ring } from "../../../../ui/skills/icons/parts";
import { foe, petal, R, rapier, star, streak } from "./parts";

/** the evolved forms that have art of their own */
export const CERISE_EVOLVED_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** Perfect Measure: the rapier's point bursting in a gold star */
  ce_measure_evo: (s) => {
    rapier(s, 1, 12, 10, 6);
    star(s, 11, 6, 4.5, KEEN_RAMP[4]);
  },
  /** Comet Lunge: the streak across the whole icon */
  ce_lunge_evo: (s) => {
    streak(s, 0, 8, 15, R[5]);
    streak(s, 2, 6, 15, R[3]);
    streak(s, 2, 10, 15, R[3]);
    foe(s, 11, 8, 2);
  },
  /** Garden of Blades: three rings of petals */
  ce_bloom_evo: (s) => {
    ring(s, 8, 8, 3, R[4], 0.75);
    ring(s, 8, 8, 5, R[3], 0.75);
    ring(s, 8, 8, 7, R[2], 0.75);
    petal(s, 8, 8, 1.6, R[5]);
  },
  /** Thousand Roses: a burst of streaks both ways */
  ce_tempest_evo: (s) => {
    for (const y of [3, 6, 10, 13]) streak(s, 1, y, 15, R[3 + (y % 3)]);
    ring(s, 8, 8, 5, R[5], 0.75);
  },
};
