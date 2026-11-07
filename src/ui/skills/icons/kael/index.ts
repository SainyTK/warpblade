import { COIN_GOLD, PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { fill, gem, sparkle } from "../parts";

/** Kael's skill icons not yet in the old path files, and their evolved forms (`<id>_evo`) */
export const KAEL_SKILL_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** a crystal shard trailing a streak toward the corner */
  k_familiar: (s) => {
    fill(s, () => {
      s.stroke(2, 14, 7, 9, 0.4, PAL.crystal[2]);
      s.stroke(4, 14, 8, 10, 0.3, PAL.crystal[3]);
    });
    gem(s, 10, 6, 3, 4);
  },
  /** three shards in a fan, ringed with gold */
  k_familiar_evo: (s) => {
    gem(s, 4, 9, 2, 3);
    gem(s, 12, 9, 2, 3);
    gem(s, 8, 6, 3, 4);
    sparkle(s, 8, 13, 2, COIN_GOLD[4]);
  },
};
