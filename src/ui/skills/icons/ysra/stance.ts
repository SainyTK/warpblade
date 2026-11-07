import { EMBER } from "../../../../constants/characters/ysra/look";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { evolvedStar } from "../evolution";
import { fill, sparkle, speedLines } from "../parts";
import { ember, floor, foe, glaive, seg, vaultArc } from "./parts";

/** Ysra's movement icons, the vault, the dive and the charge, and their evolved forms */
export const STANCE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** Vault Strike: over the top in a vault, then the glaive driven down where she lands */
  y_vault: (s) => {
    vaultArc(s, 1, 11, 14, 11);
    floor(s, 1, 15, 15);
    glaive(s, 12, 2, 12, 14);
    fill(s, () => {
      seg(s, 9, 14, 8, 12, EMBER[5]);
      seg(s, 15, 14, 15.5, 12, EMBER[5]);
    });
  },
  /** Skyfall: a burning meteor coming down on a crater of flame */
  y_vault_evo: (s) => {
    floor(s, 0, 16, 15, EMBER[2]);
    ember(s, 2, 15, 5, -1);
    ember(s, 14, 15, 5, 1);
    fill(s, () => s.taper(1, 1, 7, 9, 0.6, 2.6, EMBER[3]));
    fill(s, () => {
      s.dot(8, 10, 3.4, EMBER[4]);
      s.taper(3, 4, 7, 9, 0.3, 1.2, EMBER[5]);
    });
    fill(s, () => {
      s.dot(8.5, 10.5, 1.8, EMBER[5]);
      s.set(9, 11, WHITE);
    });
    evolvedStar(s);
  },
  /** Falling Star: the glaive diving point first at 45 degrees, a star at its tail */
  y_dive: (s) => {
    floor(s, 4, 16, 15);
    fill(s, () => {
      seg(s, 1, 6, 6, 11, EMBER[3]);
      seg(s, 6, 1, 11, 6, EMBER[3]);
    });
    glaive(s, 3, 3, 13, 13);
    sparkle(s, 3.5, 3.5, 2, EMBER[5]);
    fill(s, () => {
      s.set(10, 15, EMBER[5]);
      s.set(15, 13, EMBER[5]);
    });
  },
  /** Phoenix Dive: a bird of fire stooping onto the floor */
  y_dive_evo: (s) => {
    floor(s, 1, 15, 15, EMBER[2]);
    fill(s, () => {
      s.poly(
        [
          [8, 13],
          [1, 3],
          [4, 3],
          [7, 6],
        ],
        EMBER[3],
      );
      s.poly(
        [
          [8, 13],
          [13, 6],
          [11, 6],
          [9, 8],
        ],
        EMBER[3],
      );
    });
    fill(s, () => {
      seg(s, 8, 3, 8, 7, EMBER[4]);
      seg(s, 6, 3, 7, 6, EMBER[4]);
    });
    fill(s, () => {
      s.poly(
        [
          [8, 6],
          [9.6, 10],
          [8, 14],
          [6.4, 10],
        ],
        EMBER[5],
      );
      s.set(8, 13, WHITE);
      for (const x of [2, 5]) s.set(x, 4, EMBER[5]);
    });
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
