import { KAEL_COLORS as K, PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { evolvedStar } from "../evolution";
import { bolt, fill } from "../parts";

const V = PAL.volt;

/** Storm Rod: a brass rod with a charged orb, and the bolt it calls; Thunder Crown: a crackling crown of three points */
export const STORM_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  relic_storm: (s) => {
    fill(s, () => {
      s.stroke(2, 15, 7.5, 7, 0.6, K.trimDark);
      s.stroke(3, 13, 7, 7.5, 0.3, K.trimLight);
    });
    fill(s, () => {
      s.dot(8.5, 5.5, 2.3, V[2]);
      s.dot(8, 5, 1.2, V[4]);
      s.set(7.5, 4.5, WHITE);
    });
    bolt(s, [
      [10.5, 6],
      [14, 8.5],
      [11.5, 10.5],
      [14.5, 15],
    ]);
  },
  relic_storm_evo: (s) => {
    fill(s, () => {
      s.poly(
        [
          [1.5, 13],
          [1.5, 7],
          [4.5, 10],
          [7, 5],
          [9.5, 10],
          [12.5, 7],
          [12.5, 13],
        ],
        V[2],
      );
    });
    fill(s, () => {
      s.stroke(2, 12.5, 12, 12.5, 0.6, V[3]);
      s.set(1.5, 6.5, WHITE);
      s.set(7, 4.5, WHITE);
      s.set(12.5, 6.5, WHITE);
      s.dot(7, 10, 0.8, V[4]);
    });
    bolt(s, [
      [4, 14],
      [2.5, 15.5],
    ]);
    bolt(s, [
      [10, 14],
      [11.5, 15.5],
    ]);
    evolvedStar(s);
  },
};
