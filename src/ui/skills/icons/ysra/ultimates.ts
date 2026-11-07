import { EMBER } from "../../../../constants/characters/ysra/look";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { evolvedStar, fill } from "../parts";
import { ember, glaive, seg, spear, YC } from "./parts";

/** a sun of fire at (x, y) */
function sun(s: SpriteCanvas, x: number, y: number, r: number): void {
  fill(s, () => s.dot(x, y, r, EMBER[3]));
  fill(s, () => {
    s.dot(x, y, r * 0.62, EMBER[5]);
    s.set(x - 1, y - 1, WHITE);
  });
}

/** the cracked floor at y = 13.5, glowing through the cracks */
function crackedFloor(s: SpriteCanvas): void {
  fill(s, () => s.stroke(0, 13.5, 16, 13.5, 0.5, YC.bootLight));
  fill(s, () => {
    for (let x = 1; x < 16; x += 2) s.set(x, 14 + ((x - 1) % 4) / 2, EMBER[5]);
  });
}

/** Ysra's ultimates and their evolved forms */
export const ULTIMATE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** Sunspear: a spear of fire flung across the sun */
  y_sunspear: (s) => {
    sun(s, 6, 6, 4.2);
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
  /** Solar Lance: a fan of three spears thrown out of the sun */
  y_sunspear_evo: (s) => {
    sun(s, 3, 13, 3);
    spear(s, 3, 13, 15, 13);
    spear(s, 3, 13, 12, 5);
    spear(s, 3, 13, 5, 1);
    evolvedStar(s);
  },
  /** Volcanic Rift: the glaive driven into a cracked floor, fire erupting from the crack both sides */
  y_rift: (s) => {
    ember(s, 3, 13, 9, -1);
    ember(s, 13, 13, 9, 1);
    crackedFloor(s);
    glaive(s, 8, 1, 8, 15, false, 5);
  },
  /** Caldera: a volcano blowing fire out of its crater, lava running down its sides */
  y_rift_evo: (s) => {
    ember(s, 7, 7, 7);
    fill(s, () =>
      s.poly(
        [
          [0, 14],
          [4, 7],
          [10, 7],
          [15, 14],
        ],
        YC.bootLight,
      ),
    );
    fill(s, () => {
      seg(s, 5, 7, 9, 7, EMBER[5]);
      seg(s, 6, 8, 4, 13, EMBER[4]);
      seg(s, 9, 8, 11, 12, EMBER[4]);
    });
    crackedFloor(s);
    evolvedStar(s);
  },
};
