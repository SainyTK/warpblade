import { ENEMY_COLORS as EC, PAL } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { WHITE } from "../../../utils/color";
import { arrow, bolt, chevron, crescent, fill, flame, gem, ring, sword } from "./parts";

/** Fusion icons: each mixes the marks of the two paths it joins */
export const FUSION_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  f_static: (s) => {
    chevron(s, 9, 11, 1, 0, 4, PAL.crystal[3]);
    chevron(s, 13, 11, 1, 0, 4, PAL.crystal[4]);
    bolt(s, [
      [9, 1],
      [6, 5],
      [9, 5],
      [6, 9],
    ]);
  },
  f_shatter: (s) => {
    gem(s, 8, 8, 5, 6, PAL.ice);
    fill(s, () => {
      s.stroke(6, 3, 8, 8, 0.3, PAL.ice[0]);
      s.stroke(8, 8, 7, 13, 0.3, PAL.ice[0]);
      s.stroke(8, 8, 11, 9, 0.3, PAL.ice[0]);
      s.set(1, 3, PAL.ice[4]);
      s.set(15, 5, PAL.ice[4]);
      s.set(2, 13, PAL.ice[3]);
    });
  },
  f_ignition: (s) => {
    flame(s, 6, 15, 10);
    arrow(s, 12, 15, 12, 3, PAL.heal[3]);
  },
  f_echo: (s) => {
    sword(s, 5, 14, 14, 5, PAL.shadow[3]);
    sword(s, 2, 12, 11, 3);
  },
  f_manablade: (s) => {
    sword(s, 2, 14, 8, 8);
    crescent(s, 7, 8, 6, -1.2, 1.2, PAL.crystal[4]);
    fill(s, () => s.set(13, 8, WHITE));
  },
  f_gravity: (s) => {
    ring(s, 8, 9, 6, EC.rim);
    ring(s, 8, 9, 3.2, EC.crack);
    arrow(s, 8, 0, 8, 9, WHITE, 2.5);
  },
  f_riposte: (s) => {
    sword(s, 3, 13, 13, 3);
    sword(s, 13, 13, 3, 3, PAL.shadow[4]);
    fill(s, () => s.set(8, 8, WHITE));
  },
};
