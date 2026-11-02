import { PAL } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { fill, gem, ring } from "./parts";

/** Crystal Nova, the special Kael has from the start: a crystal with a ring bursting out of it */
export function drawNovaIcon(s: SpriteCanvas): void {
  ring(s, 8, 8, 6.5, PAL.crystal[3]);
  fill(s, () => {
    for (let k = 0; k < 8; k++) {
      const a = (k * Math.PI) / 4;
      s.set(8 + Math.cos(a) * 7.5, 8 + Math.sin(a) * 7.5, PAL.crystal[5]);
    }
  });
  gem(s, 8, 8, 2.5, 4);
}
