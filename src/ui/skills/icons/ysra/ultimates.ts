import { EMBER } from "../../../../constants/characters/ysra/look";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { evolvedStar, fill } from "../parts";
import { ember, floor, seg, YC } from "./parts";

/** the cracked floor at y = 13.5, glowing through the cracks */
function crackedFloor(s: SpriteCanvas): void {
  fill(s, () => s.stroke(0, 13.5, 16, 13.5, 0.5, YC.bootLight));
  fill(s, () => {
    for (let x = 1; x < 16; x += 2) s.set(x, 14 + ((x - 1) % 4) / 2, EMBER[5]);
  });
}

/** a wall of flame rolling toward the right, tallest at its front */
function wave(s: SpriteCanvas): void {
  ember(s, 4, 13, 5, 1);
  ember(s, 8, 13, 8, 1);
  ember(s, 12, 13, 11, 1);
}

/** Ysra's one ultimate, Pyre Wave, and its evolved form */
export const ULTIMATE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** Pyre Wave: a wall of flame rolling out over the floor */
  y_pyre: (s) => {
    wave(s);
    floor(s, 0, 16, 14);
    fill(s, () => {
      s.set(14, 3, EMBER[5]);
      s.set(15, 6, EMBER[4]);
    });
  },
  /** Caldera: a volcano blowing fire out of its crater, lava running down its sides */
  y_pyre_evo: (s) => {
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
