import { EMBER } from "../../../../constants/characters/ysra/look";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { evolvedStar } from "../evolution";
import { chevron, fill } from "../parts";
import { brand, ember, floor, foe, glaive, pillar, seg, vaultArc, YC } from "./parts";

/** a row of three ember pips at (x, y), lit up to `lit`: the stacks of a burn */
function pips(s: SpriteCanvas, x: number, y: number, lit: number): void {
  fill(s, () => {
    for (let k = 0; k < 3; k++) s.dot(x + k * 3, y, 0.9, k < lit ? EMBER[5] : EMBER[2]);
  });
}

/** Ysra's burns and her Heat passive, and their evolved forms */
export const BURN_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** Searing Edge: the glaive's blade wreathed in flame */
  y_searing: (s) => {
    ember(s, 11, 9, 8, 1);
    glaive(s, 1, 15, 14, 2, false, 7);
    fill(s, () => {
      s.set(14, 6, EMBER[5]);
      s.set(9, 1, EMBER[4]);
    });
  },
  /** Wildfire: a burning foe throwing its fire onto the foes beside it */
  y_searing_evo: (s) => {
    floor(s, 0, 16, 15, EMBER[2]);
    foe(s, 2.5, 13, 2);
    foe(s, 13.5, 13, 2);
    ember(s, 2.5, 11.5, 4);
    ember(s, 13.5, 11.5, 4);
    foe(s, 8, 12, 2.8);
    ember(s, 8, 10, 8);
    fill(s, () => {
      for (const [x, y] of [
        [4, 4],
        [5, 7],
        [12, 7],
      ])
        s.set(x, y, EMBER[5]);
    });
    evolvedStar(s);
  },
  /** Ashen Wake: the vault's path, and fire left burning on the floor under it */
  y_ashen: (s) => {
    vaultArc(s, 1, 15, 9, 8);
    floor(s, 0, 16, 15, EMBER[2]);
    ember(s, 4, 15, 4);
    ember(s, 8, 15, 5);
    ember(s, 12, 15, 4);
  },
  /** Scorched Earth: a landing, and every burning patch on the floor erupting as a pillar */
  y_ashen_evo: (s) => {
    floor(s, 0, 16, 15, EMBER[2]);
    pillar(s, 2, 7, 1.6);
    pillar(s, 6, 10, 1.6);
    pillar(s, 10, 7, 1.6);
    pillar(s, 14, 5, 1.6);
    chevron(s, 4.5, 4.5, 0, 1, 2, EMBER[5]);
    evolvedStar(s);
  },
  /** Ember Brand: a foe marked with a glowing rune, its stacks above it */
  y_brand: (s) => {
    foe(s, 8, 10, 5.5);
    brand(s, 8, 10, 3.5);
    pips(s, 5, 2, 2);
  },
  /** Pyre Mark: the brand spent in a blast that brands every foe round it */
  y_brand_evo: (s) => {
    fill(s, () => {
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2 + 0.4;
        s.stroke(
          7 + Math.cos(a) * 4.5,
          9 + Math.sin(a) * 4.5,
          7 + Math.cos(a) * 6.5,
          9 + Math.sin(a) * 6.5,
          0.5,
          EMBER[3],
        );
      }
    });
    brand(s, 7, 9, 4);
    foe(s, 2, 14, 1.8);
    foe(s, 13, 14, 1.8);
    fill(s, () => {
      s.set(2, 14, EMBER[5]);
      s.set(13, 14, EMBER[5]);
    });
    evolvedStar(s);
  },
  /** Kindling: a bed of coals catching, the heat climbing */
  y_kindling: (s) => {
    fill(s, () => {
      for (const [x, y] of [
        [4, 14],
        [7, 14],
        [10, 14],
        [13, 14],
        [5.5, 12.5],
        [8.5, 12.5],
        [11.5, 12.5],
      ])
        s.dot(x, y, 1.3, EMBER[1]);
    });
    fill(s, () => {
      for (const [x, y] of [
        [5, 14],
        [9, 13],
        [12, 14],
      ])
        s.set(x, y, EMBER[4]);
    });
    ember(s, 8, 12, 7);
    chevron(s, 3.5, 3.5, 0, -1, 2, EMBER[5]);
    chevron(s, 13.5, 5.5, 0, -1, 2, EMBER[4]);
  },
  /** Eternal Hearth: a stone hearth with a fire that never goes out */
  y_kindling_evo: (s) => {
    fill(s, () => {
      s.poly(
        [
          [1, 15],
          [1, 7],
          [3, 4],
          [9, 4],
          [11, 7],
          [11, 15],
        ],
        YC.bootLight,
      );
    });
    fill(s, () => {
      s.poly(
        [
          [3, 15],
          [3, 8],
          [4.5, 6],
          [7.5, 6],
          [9, 8],
          [9, 15],
        ],
        EMBER[0],
      );
    });
    ember(s, 6, 15, 8);
    fill(s, () => {
      seg(s, 0, 15, 12, 15, YC.trim);
      seg(s, 1, 4, 11, 4, YC.trim);
    });
    evolvedStar(s);
  },
};
