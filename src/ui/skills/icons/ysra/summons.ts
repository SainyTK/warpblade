import { EMBER } from "../../../../constants/characters/ysra/look";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { WHITE } from "../../../../utils/color";
import { evolvedStar, fill } from "../parts";
import { ember, floor, glaive, SPECTRAL, seg, shade } from "./parts";

/** a lizard walking right, its feet on y = 15 and its snout at x, k times the salamander's size */
function lizard(s: SpriteCanvas, x: number, k: number, body: Color, glow: Color): void {
  const y = 15 - 3 * k;
  fill(s, () => {
    s.taper(x - 8 * k, y, x - 14 * k, y - 4 * k, 1.1 * k, 0.3, body, -1.5 * k);
    s.stroke(x - 8 * k, y, x - 4 * k, y, 1.3 * k, body);
    s.poly(
      [
        [x - 4.5 * k, y - 1.6 * k],
        [x, y - 0.5 * k],
        [x, y + 0.5 * k],
        [x - 4.5 * k, y + 1.4 * k],
      ],
      body,
    );
    for (const dx of [-7.5, -4]) seg(s, x + dx * k, y, x + (dx - 1) * k, 15, body);
  });
  fill(s, () => {
    s.set(x - 2 * k, y - 1 * k, EMBER[0]);
    seg(s, x - 9 * k, y + 0.6 * k, x - 4 * k, y + 0.6 * k, glow);
  });
}

/** a hawk of fire flying up and to the right, wings raised, its head at (x, y) */
function hawk(s: SpriteCanvas, x: number, y: number, k = 1): void {
  fill(s, () => {
    s.poly(
      [
        [x - 3 * k, y + 1 * k],
        [x - 9 * k, y - 4 * k],
        [x - 6 * k, y + 1.5 * k],
      ],
      EMBER[3],
    );
    s.poly(
      [
        [x - 8 * k, y + 3 * k],
        [x - 11 * k, y + 6 * k],
        [x - 11 * k, y + 2.5 * k],
      ],
      EMBER[3],
    );
  });
  fill(s, () => {
    s.poly(
      [
        [x - 8.5 * k, y + 3 * k],
        [x - 3 * k, y + 0.5 * k],
        [x + 0.5 * k, y + 0.5 * k],
        [x - 3 * k, y + 3.5 * k],
      ],
      EMBER[4],
    );
    s.dot(x, y, 1.3 * k, EMBER[4]);
  });
  fill(s, () => {
    s.set(x + 1.6 * k, y, EMBER[6]);
    s.set(x, y - 0.5, EMBER[0]);
  });
}

/** Ysra's summons and their evolved forms */
export const SUMMON_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** Glaive Shade: a pale temple guard thrusting its spectral glaive */
  y_shade: (s) => {
    shade(s, 5, 15);
    glaive(s, 3, 11, 15, 7, false, 5, SPECTRAL);
  },
  /** Temple Host: three shades in a row, their glaives raised behind them in a fan */
  y_shade_evo: (s) => {
    glaive(s, 4, 13, 1, 1, false, 5, SPECTRAL);
    glaive(s, 8, 13, 7, 0, false, 5, SPECTRAL);
    glaive(s, 12, 13, 15, 7, false, 5, SPECTRAL);
    for (const x of [3, 8, 13]) shade(s, x, 15);
    evolvedStar(s);
  },
  /** Salamander: a small fire lizard running along the floor, a flame on its back */
  y_salamander: (s) => {
    floor(s, 0, 16, 15, EMBER[2]);
    ember(s, 7, 11, 5, -1);
    lizard(s, 15, 1, EMBER[3], EMBER[5]);
  },
  /** Magma Drake: a dark crusted drake with a raised wing, breathing fire along the floor */
  y_salamander_evo: (s) => {
    floor(s, 0, 16, 15, EMBER[2]);
    fill(s, () =>
      s.poly(
        [
          [3, 9],
          [1, 1],
          [8, 8],
        ],
        EMBER[2],
      ),
    );
    lizard(s, 10, 1.15, EMBER[1], EMBER[4]);
    fill(s, () =>
      s.poly(
        [
          [10, 11],
          [16, 9],
          [16, 15],
        ],
        EMBER[4],
      ),
    );
    fill(s, () => {
      seg(s, 11, 11, 15, 12, EMBER[5]);
      s.set(14, 11, WHITE);
    });
    evolvedStar(s);
  },
  /** Sun Hawk: a bird of fire on the wing */
  y_hawk: (s) => {
    hawk(s, 13, 7);
  },
  /** Sunflock: a hawk of fire leading two more */
  y_hawk_evo: (s) => {
    fill(s, () => {
      for (const [x, y] of [
        [3, 3],
        [7, 7],
      ]) {
        seg(s, x - 3, y - 2, x, y, EMBER[4]);
        seg(s, x, y, x + 3, y - 2, EMBER[4]);
      }
    });
    hawk(s, 14, 10, 0.85);
    evolvedStar(s);
  },
};
