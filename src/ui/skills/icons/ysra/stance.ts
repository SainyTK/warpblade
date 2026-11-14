import { EMBER } from "../../../../constants/characters/ysra/look";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { chevron, evolvedStar, fill, speedLines } from "../parts";
import { floor, foe, glaive, pillar, seg } from "./parts";

/** Ysra's movement icons, the dodge and the charge, and their evolved forms */
export const STANCE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** Firewalk: the dodge passing through a foe, the glaive held low and a cut of fire across the foe */
  y_firewalk: (s) => {
    speedLines(s, 6.5, [4.5, 7.5, 10.5], 5, EMBER[3]);
    foe(s, 11.5, 7.5, 3);
    fill(s, () => {
      seg(s, 8, 11, 15, 4, EMBER[4]);
      seg(s, 9, 11, 15, 5, EMBER[5]);
      s.set(12, 8, WHITE);
    });
    glaive(s, 1, 14, 15, 14, true, 5);
  },
  /** Pillar Stride: a row of flame pillars rising behind the dodge, each taller than the last */
  y_firewalk_evo: (s) => {
    floor(s, 0, 16, 15, EMBER[2]);
    pillar(s, 2.5, 5, 1.3);
    pillar(s, 6.5, 8, 1.5);
    pillar(s, 10.5, 11, 1.7);
    chevron(s, 15, 11, 1, 0, 2, EMBER[5]);
    evolvedStar(s);
  },
  /** Warpath: a charge, the glaive levelled ahead, speed lines and a foe thrown aside */
  y_warpath: (s) => {
    speedLines(s, 6.5, [6.5, 9.5, 12.5], 5, EMBER[3]);
    glaive(s, 4, 10, 15, 10);
    foe(s, 12, 4, 2.6, 1);
  },
  /** Juggernaut: the charge with a stack of foes gathered on the glaive */
  y_warpath_evo: (s) => {
    speedLines(s, 4.5, [8.5, 11.5, 14.5], 4, EMBER[3]);
    foe(s, 7, 8, 2.4);
    foe(s, 11, 8, 2.4);
    foe(s, 9, 4.5, 2.2);
    glaive(s, 2, 11, 15, 11);
    evolvedStar(s);
  },
};
