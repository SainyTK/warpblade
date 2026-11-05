import { EMBER } from "../../../../constants/characters/ysra/look";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { arc, arrow, chevron, crescent, fill, speedLines } from "../parts";
import { floor, foe, glaive, seg, spear } from "./parts";

/** Lance path icons: reach, held lunges and the glaive string */
export const LANCE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** a long glaive, and an arrow along it for the reach it gains */
  l_haft: (s) => {
    glaive(s, 1, 10, 15, 2);
    arrow(s, 2, 14, 14, 14, EMBER[4], 2);
  },
  /** the glaive drawn back while a coil of heat winds up behind it */
  l_heft: (s) => {
    arc(s, 4, 9, 3.5, 0.6, 5.6, EMBER[3]);
    arc(s, 4, 9, 1.8, 0.6, 5.6, EMBER[5]);
    glaive(s, 2, 9, 15, 9);
  },
  /** blow after blow: three short pokes, then a fourth that reaches farthest */
  l_string: (s) => {
    for (const [i, y] of [2, 6, 10].entries()) glaive(s, 1, y, 8 + i * 2, y, false, 4);
    glaive(s, 1, 14, 15, 14, false, 5);
  },
  /** a foe carried on the blade and driven into the floor */
  l_skewer: (s) => {
    floor(s, 1, 15, 15);
    glaive(s, 1, 1, 12, 14, true);
    foe(s, 5, 6);
    fill(s, () => {
      s.set(9, 15, EMBER[5]);
      s.set(14, 15, EMBER[5]);
      s.set(15, 13, EMBER[4]);
    });
  },
  /** the lunge through a line of foes, struck twice each */
  l_rail: (s) => {
    foe(s, 4, 8, 2.6);
    foe(s, 10, 8, 2.6);
    speedLines(s, 4, [4, 12], 3, EMBER[3]);
    glaive(s, 0, 8, 15, 8);
  },
  /** the glaive spun overhead, drawing foes in from both sides */
  l_windmill: (s) => {
    crescent(s, 8, 8, 6, Math.PI * 0.9, Math.PI * 2.1, EMBER[3]);
    crescent(s, 8, 8, 6, Math.PI * -0.1, Math.PI * 0.1, EMBER[3]);
    glaive(s, 2, 9, 14, 5);
    chevron(s, 4, 14, 1, 0, 2, EMBER[5]);
    chevron(s, 12, 14, -1, 0, 2, EMBER[5]);
  },
  /** a rising sweep in the air that lifts a foe up with it */
  l_reaper: (s) => {
    foe(s, 11, 3, 2.2);
    crescent(s, 9, 11, 6, Math.PI * 1.05, Math.PI * 1.75, EMBER[4]);
    arrow(s, 3, 15, 3, 6, EMBER[5], 2);
  },
  /** a foe pinned to the floor under the glaive */
  l_impale: (s) => {
    floor(s, 1, 15, 15);
    foe(s, 8, 11);
    glaive(s, 8, 1, 8, 14, false, 5);
    fill(s, () => {
      seg(s, 3, 14, 4, 13, EMBER[4]);
      seg(s, 13, 14, 12, 13, EMBER[4]);
    });
  },
  /** Sunspear: a spear of fire flung across the sun */
  l_ult: (s) => {
    fill(s, () => s.dot(6, 6, 4.2, EMBER[3]));
    fill(s, () => {
      s.dot(6, 6, 2.6, EMBER[5]);
      s.set(5, 5, WHITE);
    });
    fill(s, () => {
      for (const [x, y] of [
        [3, 13],
        [5, 14],
        [1, 11],
      ])
        s.set(x, y, EMBER[4]);
    });
    spear(s, 1, 15, 15, 1);
  },
};
