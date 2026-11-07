import { EMBER } from "../../../../constants/characters/ysra/look";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { evolvedStar } from "../evolution";
import { chevron, fill } from "../parts";
import { ember, floor, foe, heart, pillar, seg, YC } from "./parts";

/** a burst of eight tongues of fire round (x, y), from radius r0 out to r1 */
function burst(s: SpriteCanvas, x: number, y: number, r0: number, r1: number): void {
  fill(s, () => {
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      s.stroke(x + Math.cos(a) * r0, y + Math.sin(a) * r0, x + Math.cos(a) * r1, y + Math.sin(a) * r1, 0.6, EMBER[3]);
    }
  });
}

/** Ysra's rites (the spells Heat pays for) and their evolved forms */
export const RITE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** Flare: tongues of fire bursting out all round a white core */
  r_flare: (s) => {
    burst(s, 8, 8, 3, 7);
    fill(s, () => {
      s.dot(8, 8, 3, EMBER[4]);
      s.dot(8, 8, 1.6, EMBER[5]);
      s.set(8, 8, WHITE);
    });
  },
  /** Cinder Lash: a whip of fire lashing along the floor and dragging a foe in */
  y_cinder: (s) => {
    floor(s, 0, 16, 15, EMBER[2]);
    fill(s, () => {
      for (let x = 1; x <= 12; x += 0.25) s.dot(x, 12 - Math.sin(x * 0.9) * 1.6, 0.4 + x * 0.06, EMBER[3]);
    });
    fill(s, () => {
      for (let x = 2; x <= 12; x += 0.5) s.set(x, 12 - Math.sin(x * 0.9) * 1.6, EMBER[5]);
    });
    foe(s, 12.5, 6, 2.4, 1);
    chevron(s, 4.5, 4.5, -1, 0, 2, EMBER[5]);
    chevron(s, 8.5, 4.5, -1, 0, 2, EMBER[4]);
  },
  /** Flame Pillar: a column of fire bursting under a foe and throwing it up */
  y_pillar: (s) => {
    floor(s, 1, 15, 15, EMBER[2]);
    pillar(s, 8, 12, 3);
    foe(s, 12, 3, 2.1);
  },
  /** Pyre Colonnade: a tall pillar flanked by two shorter ones */
  y_pillar_evo: (s) => {
    floor(s, 0, 16, 15, EMBER[2]);
    pillar(s, 3, 8, 2);
    pillar(s, 13, 8, 2);
    pillar(s, 8, 13, 3);
    evolvedStar(s);
  },
  /** Brazier: a bronze bowl on its stand, spitting embers */
  y_brazier: (s) => {
    fill(s, () => {
      seg(s, 8, 10, 8, 14, YC.bootLight);
      seg(s, 5, 15, 11, 15, YC.bootLight);
    });
    ember(s, 8, 8, 7);
    fill(s, () =>
      s.poly(
        [
          [3, 7],
          [13, 7],
          [11, 10.5],
          [5, 10.5],
        ],
        YC.trim,
      ),
    );
    fill(s, () => {
      seg(s, 3.5, 7.5, 12.5, 7.5, EMBER[5]);
      s.set(1, 3, EMBER[4]);
      s.set(14, 2, EMBER[5]);
      s.set(15, 5, EMBER[4]);
    });
  },
  /** Forge Altar: a broad stone altar with a great fire on it, throwing three embers */
  y_brazier_evo: (s) => {
    ember(s, 7, 9, 8);
    fill(s, () => {
      s.poly(
        [
          [1, 9],
          [13, 9],
          [11, 12],
          [3, 12],
        ],
        YC.trim,
      );
      s.poly(
        [
          [3, 12],
          [11, 12],
          [12, 15],
          [2, 15],
        ],
        YC.bootLight,
      );
    });
    fill(s, () => {
      seg(s, 1.5, 9.5, 12.5, 9.5, EMBER[5]);
      seg(s, 6, 13, 8, 13, EMBER[4]);
    });
    fill(s, () => {
      for (const [x, y] of [
        [1, 4],
        [3, 1],
        [14, 8],
      ])
        s.dot(x, y, 0.8, EMBER[5]);
    });
    evolvedStar(s);
  },
  /** Overheat: the Heat bar full and bursting into flame */
  y_overheat: (s) => {
    ember(s, 4, 9, 6, -1);
    ember(s, 11, 9, 8, 1);
    fill(s, () =>
      s.poly(
        [
          [1, 10],
          [15, 10],
          [15, 14],
          [1, 14],
        ],
        EMBER[1],
      ),
    );
    fill(s, () => {
      for (let x = 2; x <= 13; x++) seg(s, x, 11, x, 12, EMBER[Math.min(6, 2 + Math.floor(x / 3))]);
    });
  },
  /** Sunheart: a white-hot heart in a burst of sun rays */
  y_overheat_evo: (s) => {
    burst(s, 7, 9, 5, 7.5);
    heart(s, 7, 9, 5, EMBER[3], EMBER[6]);
    fill(s, () => {
      s.dot(7, 9.5, 2, EMBER[5]);
      s.set(7, 9, WHITE);
    });
    evolvedStar(s);
  },
};
