import { PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Ramp } from "../../../../types/color";
import { WHITE } from "../../../../utils/color";
import { arc, fill, snowflake } from "../parts";

/** a hand bell with its clapper, lit on its left */
function handBell(s: SpriteCanvas, cx: number, top: number, ramp: Ramp): void {
  fill(s, () => {
    s.stroke(cx, top - 1.5, cx, top, 0.5, ramp[1]);
    s.poly(
      [
        [cx - 1.5, top],
        [cx + 1.5, top],
        [cx + 2.5, top + 4],
        [cx + 4, top + 6],
        [cx - 4, top + 6],
        [cx - 2.5, top + 4],
      ],
      ramp[3],
    );
    s.stroke(cx - 1.2, top + 1, cx - 2.6, top + 5, 0.4, ramp[4]);
    s.set(cx - 1, top + 1, WHITE);
  });
  fill(s, () => s.dot(cx, top + 7, 1, ramp[2]));
}

/** Frost Bell's icon and Glacier Toll's */
export const BELL_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** a cold bell ringing, one ring running out from it */
  relic_bell: (s) => {
    arc(s, 8, 8.5, 7, 2.6, 6.8, PAL.ice[3], 0.45);
    handBell(s, 8, 3, PAL.ice);
  },
  /** a crystal bell inside two rings, a snowflake on the outer one */
  relic_bell_evo: (s) => {
    arc(s, 8, 8.5, 7.3, 2.4, 7, PAL.crystal[4], 0.45);
    arc(s, 8, 8.5, 5.4, 2.8, 6.6, PAL.crystal[3], 0.4);
    handBell(s, 8, 3.5, PAL.crystal);
    snowflake(s, 13, 3, 2);
  },
};
