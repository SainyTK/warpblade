import { KAEL_COLORS as K, PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { WHITE } from "../../../../utils/color";
import { evolvedStar } from "../evolution";
import { fill, speedLines } from "../parts";

/** a flat throwing dagger along a row, its point at x1, its grip toward x0 */
function dagger(s: SpriteCanvas, x0: number, x1: number, y: number, blade: Color, edge: Color): void {
  const d = Math.sign(x1 - x0);
  fill(s, () => {
    s.poly(
      [
        [x0 + d * 2.5, y - 1],
        [x1 - d * 2, y - 1],
        [x1, y],
        [x1 - d * 2, y + 1],
        [x0 + d * 2.5, y + 1],
      ],
      blade,
    );
    s.hairline(x0 + d * 3, y - 0.5, x1 - d * 2, y - 0.5, edge);
    s.set(x1 - d * 0.5, y, WHITE);
  });
  fill(s, () => {
    s.stroke(x0, y, x0 + d * 1.5, y, 0.5, K.hilt);
    s.block(x0 + d * 2 - 0.5, y - 2, K.trim, 1, 4);
  });
}

/** Warp Daggers: two daggers flying ahead; Dagger Storm: daggers flying both ways */
export const DAGGERS_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  relic_daggers: (s) => {
    speedLines(s, 3, [4, 6], 3, PAL.crystal[3]);
    dagger(s, 4, 15, 5, K.steelLight, K.steelGlint);
    speedLines(s, 1, [10, 12], 2, PAL.crystal[3]);
    dagger(s, 2, 13, 11, K.steelLight, K.steelGlint);
  },
  relic_daggers_evo: (s) => {
    dagger(s, 1, 10, 3, K.blade, K.bladeEdge);
    dagger(s, 3, 15, 8, K.blade, K.bladeEdge);
    dagger(s, 13, 1, 13, K.blade, K.bladeEdge);
    evolvedStar(s);
  },
};
