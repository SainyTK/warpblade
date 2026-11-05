import { EMBER } from "../../../../constants/characters/ysra/look";
import { PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { arrow, chevron, fill } from "../parts";
import { ember, floor, foe, glaive, heart, seg, vaultArc, YC } from "./parts";

/** Pyre path icons: Heat and the rites it pays for */
export const PYRE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** Flare: tongues of fire bursting out all round a white core */
  r_flare: (s) => {
    fill(s, () => {
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        s.stroke(8 + Math.cos(a) * 3, 8 + Math.sin(a) * 3, 8 + Math.cos(a) * 7, 8 + Math.sin(a) * 7, 0.6, EMBER[3]);
      }
    });
    fill(s, () => {
      s.dot(8, 8, 3, EMBER[4]);
      s.dot(8, 8, 1.6, EMBER[5]);
      s.set(8, 8, WHITE);
    });
  },
  /** Pyre Wave: a wall of flame rising as it rolls ahead */
  r_pyre: (s) => {
    floor(s, 1, 15, 15, EMBER[2]);
    ember(s, 3, 15, 5, 1);
    ember(s, 7.5, 15, 8, 1);
    ember(s, 12, 15, 12, 1.5);
    chevron(s, 15, 4, 1, 0, 2, EMBER[5]);
  },
  /** Kindling: a bed of coals catching, the heat climbing */
  r_kindle: (s) => {
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
    chevron(s, 3, 3, 0, -1, 2, EMBER[5]);
    chevron(s, 13, 5, 0, -1, 2, EMBER[4]);
  },
  /** Flame Pillar: a column of fire bursting under a foe and throwing it up */
  r_pillar: (s) => {
    floor(s, 1, 15, 15, EMBER[2]);
    fill(s, () =>
      s.poly(
        [
          [5, 15],
          [11, 15],
          [10, 6],
          [8, 3],
          [6, 6],
        ],
        EMBER[3],
      ),
    );
    fill(s, () => {
      s.poly(
        [
          [6.5, 15],
          [9.5, 15],
          [9, 7],
          [8, 5],
          [7, 7],
        ],
        EMBER[5],
      );
      seg(s, 8, 14, 8, 10, WHITE);
    });
    foe(s, 12, 3, 2.1);
  },
  /** Brazier: a bronze bowl on its stand, spitting embers */
  r_brazier: (s) => {
    fill(s, () => {
      s.stroke(8, 10, 8, 14, 0.5, YC.bootLight);
      s.stroke(5, 15, 11, 15, 0.5, YC.bootLight);
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
  /** Searing Edge: the glaive's blade wreathed in flame */
  r_searing: (s) => {
    ember(s, 11, 9, 8, 1);
    glaive(s, 1, 15, 14, 2, false, 7);
    fill(s, () => {
      s.set(14, 6, EMBER[5]);
      s.set(9, 1, EMBER[4]);
    });
  },
  /** Ashen Wake: the vault's path, and fire left burning on the floor under it */
  r_ash: (s) => {
    vaultArc(s, 1, 15, 9, 8);
    floor(s, 0, 16, 15, EMBER[2]);
    ember(s, 4, 15, 4);
    ember(s, 8, 15, 5);
    ember(s, 12, 15, 4);
  },
  /** Overheat: the Heat bar full and bursting into flame */
  r_overheat: (s) => {
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
  /** Hearthfire: a flame warming a heart */
  r_hearth: (s) => {
    heart(s, 8, 10, 5, PAL.heal[2], PAL.heal[4]);
    ember(s, 8, 11, 7);
    arrow(s, 14, 9, 14, 3, PAL.heal[4], 1.5);
  },
  /** Volcanic Rift: the glaive driven into a cracked floor, fire erupting from the crack both sides */
  r_ult: (s) => {
    ember(s, 3, 13, 9, -1);
    ember(s, 13, 13, 9, 1);
    fill(s, () => {
      s.stroke(0, 13.5, 16, 13.5, 0.5, YC.bootLight);
    });
    fill(s, () => {
      for (const [x, y] of [
        [1, 14],
        [3, 15],
        [5, 14],
        [7, 15],
        [9, 14],
        [11, 15],
        [13, 14],
        [15, 15],
      ])
        s.set(x, y, EMBER[5]);
    });
    glaive(s, 8, 1, 8, 15, false, 5);
  },
};
