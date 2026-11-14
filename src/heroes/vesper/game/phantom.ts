import { RES } from "../../../constants/stage";
import { fleck, glow, place } from "../../../engine/frame";
import { DUSK_RAMP } from "../look/colors";

/** a dusk figure of her for summons and the waltz: a slim violet silhouette leaning into a stride, lit at the edge */
export function drawPhantom(x: number, y: number, face: number, k: number): void {
  place();
  const C = DUSK_RAMP;
  // the body as stacked rows from the boots to the hair, each a few image pixels wide
  const rows: readonly [number, number, number][] = [
    [0, -1, 2],
    [-3, -1, 2],
    [-7, 0, 2.5],
    [-11, 0.5, 3],
    [-15, 1, 3.5],
    [-19, 1.5, 3.5],
    [-23, 2, 3],
    [-26, 1.5, 3],
    [-29, 1, 2.5],
  ];
  for (const [dy, dx, w] of rows)
    for (let i = -w * RES; i <= w * RES; i++) {
      const edge = Math.abs(i) >= w * RES - 1;
      fleck(x + face * (dx + i / RES), y + dy, edge ? C[5] : C[2], edge ? k : k * 0.55);
    }
  // the two blades: the long one out ahead, the short one back
  for (let d = 0; d < 16; d++) fleck(x + face * (4 + d), y - 18 + d * 0.3, d > 13 ? C[6] : C[4], k);
  for (let d = 0; d < 8; d++) fleck(x - face * (3 + d), y - 15 + d * 0.5, C[4], k);
  glow(x, y - 16, 14, C[3], 0.35 * k);
}
