import { ENEMY_COLORS as EC, HERO_COLORS as HC, PAL } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { hex } from "../../../utils/color";
import { arrow, crescent, fill, sparkle, speedLines, sword } from "./parts";

const PINK = hex("#ff7ae0");

/** Blade path icons: swords, cuts and stances */
export const BLADE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  b_edge: (s) => {
    sword(s, 3, 13, 13, 3);
    sparkle(s, 11, 8, 2.5);
  },
  b_flow: (s) => {
    crescent(s, 5, 9, 4, -2.2, 1.2, PAL.crystal[3]);
    crescent(s, 9, 8, 4, -2.2, 1.2, PAL.crystal[4]);
    crescent(s, 12, 7, 3.5, -2.2, 1.2, PAL.crystal[5]);
  },
  b_launcher: (s) => {
    sword(s, 10, 14, 10, 2);
    arrow(s, 4, 14, 4, 4, PAL.heal[3]);
  },
  b_sweep: (s) => {
    crescent(s, 8, 6, 7, 0.5, 2.6, PAL.crystal[3]);
    sword(s, 2, 11, 14, 11);
    fill(s, () => {
      for (const x of [4, 7, 10, 13]) s.set(x, 14, PAL.shadow[3]);
    });
  },
  b_swift: (s) => {
    speedLines(s, 7, [5, 8, 11], 5, PAL.crystal[3]);
    sword(s, 6, 13, 14, 3);
  },
  b_phase: (s) => {
    fill(s, () => s.dot(8, 8, 3.2, EC.body));
    arrow(s, 1, 8, 14, 8, PAL.crystal[4]);
    fill(s, () => s.set(9, 7, EC.eye));
  },
  b_sky: (s) => {
    fill(s, () => s.dot(8, 3, 2.2, EC.body));
    for (const x of [3, 8, 13]) arrow(s, x, 15, x, 8, PAL.crystal[4], 2.5);
  },
  b_berserk: (s) => {
    sword(s, 3, 13, 13, 3, HC.scarf);
    fill(s, () => {
      s.set(5, 6, HC.scarfLight);
      s.set(4, 8, HC.scarf);
      s.set(12, 11, HC.scarf);
      s.set(13, 13, HC.scarfLight);
    });
  },
  b_guard: (s) => {
    fill(s, () =>
      s.poly(
        [
          [3, 3],
          [13, 3],
          [13, 9],
          [8, 14],
          [3, 9],
        ],
        HC.coat,
      ),
    );
    fill(s, () => {
      s.stroke(8, 4, 8, 12, 0.5, HC.trim);
      s.stroke(4.5, 7, 11.5, 7, 0.5, HC.trim);
      s.set(5, 4, HC.coatLight);
    });
  },
  b_ult: (s) => {
    sword(s, 3, 13, 13, 3, PAL.crystal[4]);
    sword(s, 13, 13, 3, 3, PAL.crystal[4]);
    sword(s, 8, 15, 8, 1, PINK);
  },
};
