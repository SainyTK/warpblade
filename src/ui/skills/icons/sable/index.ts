import { JADE } from "../../../../constants/characters/sable/look";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { arc, arrow, fill, sparkle, speedLines } from "../parts";
import { foe, seg } from "../ysra/parts";
import { bolt, boot, crossbow, SC, snare } from "./parts";

/** Sable's skill icons: bolts, the crossbow, the kick, the hop and her snares */
export const SABLE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** the crossbow with the string drawn heavy */
  m_draw: (s) => {
    crossbow(s, 12, 8);
    arrow(s, 6, 14, 1, 14, JADE[4], 2);
  },
  /** one bolt through two foes */
  m_pierce: (s) => {
    foe(s, 5, 8, 2.6);
    foe(s, 10, 8, 2.6);
    bolt(s, 0, 8, 15, 8, true);
  },
  /** a quiver full of bolts */
  m_quiver: (s) => {
    for (const x of [5, 8, 11]) bolt(s, x, 14, x, 2);
    fill(s, () => {
      s.poly(
        [
          [3, 9],
          [13, 9],
          [12, 15],
          [4, 15],
        ],
        SC.coatDark,
      );
      seg(s, 4, 10, 12, 10, SC.trim);
    });
  },
  /** bolts raining down */
  m_storm: (s) => {
    for (const [x, y] of [
      [2, 1],
      [7, 3],
      [12, 0],
      [5, 8],
      [11, 7],
    ])
      bolt(s, x - 1, y, x + 2, y + 6, true);
    fill(s, () => seg(s, 0, 15, 15, 15, SC.trim));
  },
  /** a bolt bouncing off the floor */
  m_ricochet: (s) => {
    fill(s, () => seg(s, 0, 14, 15, 14, SC.trim));
    bolt(s, 1, 3, 7, 12);
    bolt(s, 8, 12, 14, 4, true);
    sparkle(s, 7.5, 13, 2, JADE[5]);
  },
  /** three bolts in a fan */
  m_scatter: (s) => {
    bolt(s, 1, 8, 14, 2, true);
    bolt(s, 1, 8, 15, 8, true);
    bolt(s, 1, 8, 14, 14, true);
  },
  /** one heavy bolt across the whole icon with a glint at the eye */
  m_ult: (s) => {
    fill(s, () => s.stroke(0, 8, 13, 8, 0.8, JADE[4]));
    bolt(s, 0, 8, 15, 8, true);
    sparkle(s, 12, 8, 3, WHITE);
  },
  /** swift feet: speed lines behind a boot */
  k_fleet: (s) => {
    boot(s, 6, 10);
    speedLines(s, 5, [5, 8, 11], 5, JADE[4]);
  },
  /** a hop back over three bolts flying ahead */
  k_volley: (s) => {
    arc(s, 6, 9, 5, Math.PI, Math.PI * 2, JADE[4]);
    bolt(s, 6, 9, 15, 5, true);
    bolt(s, 6, 10, 15, 10, true);
    bolt(s, 6, 11, 15, 15, true);
  },
  /** the boot driving a foe off */
  k_boot: (s) => {
    boot(s, 1, 9);
    foe(s, 12, 8, 3);
    speedLines(s, 15, [3, 13], 3, WHITE);
  },
  /** a low slide under a foe it trips */
  k_slide: (s) => {
    fill(s, () => seg(s, 0, 15, 15, 15, SC.trim));
    boot(s, 3, 13);
    foe(s, 12, 7, 3);
    speedLines(s, 3, [11, 13], 3, JADE[4]);
  },
  /** an open snare */
  t_snare: (s) => {
    snare(s, 8, 12);
    arc(s, 8, 12, 5, Math.PI * 1.1, Math.PI * 1.9, JADE[4]);
  },
  /** the reload's bright window on a bar */
  t_rhythm: (s) => {
    fill(s, () => {
      s.poly(
        [
          [1, 6],
          [15, 6],
          [15, 10],
          [1, 10],
        ],
        SC.coatDeep,
      );
    });
    fill(s, () => {
      seg(s, 7, 7, 10, 7, JADE[5]);
      seg(s, 7, 8, 10, 8, JADE[4]);
      seg(s, 7, 9, 10, 9, JADE[4]);
    });
    fill(s, () => seg(s, 8, 4, 8, 12, WHITE));
  },
  /** barbed jaws biting */
  t_barbed: (s) => {
    snare(s, 8, 13, SC.scarf);
    fill(s, () => {
      seg(s, 2, 13, 8, 5, SC.steelLight);
      seg(s, 14, 13, 8, 5, SC.steelLight);
      for (const [x, y] of [
        [4, 10],
        [12, 10],
        [6, 8],
        [10, 8],
      ])
        s.set(x, y, WHITE);
    });
  },
  /** two snares side by side */
  t_twin: (s) => {
    snare(s, 4, 8);
    snare(s, 11, 14);
  },
  /** a perfect reload's sparkle over the crossbow */
  t_focus: (s) => {
    crossbow(s, 12, 11);
    sparkle(s, 7, 4, 3, JADE[5]);
  },
  /** a boot with a bolt loading into it */
  x_bootBolt: (s) => {
    boot(s, 1, 13);
    bolt(s, 14, 2, 8, 8, true);
  },
  /** a sprung snare loosing bolts upward */
  x_tripwire: (s) => {
    snare(s, 8, 14);
    bolt(s, 8, 12, 2, 3, true);
    bolt(s, 8, 12, 14, 3, true);
    bolt(s, 8, 12, 8, 1, true);
  },
};
