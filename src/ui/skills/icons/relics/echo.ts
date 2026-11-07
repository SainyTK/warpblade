import { PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { arc, crescent, fill } from "../parts";

/** Echo Blade's icon and Phantom Arc's */
export const ECHO_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** a crystal crescent flying right, the ghost of a second one behind it */
  relic_echo: (s) => {
    crescent(s, 3, 8, 6, -1, 1, PAL.crystal[2]);
    crescent(s, 6, 8, 7, -1.15, 1.15, PAL.crystal[3]);
    fill(s, () => {
      s.set(13, 8, WHITE);
      s.set(12, 4, PAL.crystal[5]);
    });
  },
  /** two shadowed crescents flying apart, the arc that brings them back over them */
  relic_echo_evo: (s) => {
    crescent(s, 8.5, 9.5, 6, -1.1, 1.1, PAL.shadow[4]);
    crescent(s, 7.5, 9.5, 6, Math.PI - 1.1, Math.PI + 1.1, PAL.shadow[4]);
    arc(s, 8, 9, 7.5, -2.6, -0.55, PAL.crystal[4], 0.4);
    fill(s, () => {
      s.set(14, 9, WHITE);
      s.set(2, 9, WHITE);
    });
  },
};
