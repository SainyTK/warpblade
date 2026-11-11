import { PAL } from "../../../constants/palette";
import { fleck, glow, hairline } from "../../../engine/frame";
import { WHITE } from "../../../utils/color";

const G = PAL.gloam;

/** a needle in flight: a hair of steel with a white point, and a rose thread fading out behind it */
export function drawNeedle(x: number, y: number, dx: number, dy: number): void {
  hairline(x - dx * 9, y - dy * 9, x - dx * 3, y - dy * 3, G[3], (u) => 0.25 + u * 0.75);
  hairline(x - dx * 3, y - dy * 3, x, y, G[5]);
  fleck(x, y, WHITE);
  glow(x, y, 4, G[4], 0.2);
}

/** a thrown knife: the blade turning end over end as it flies, a white point, and a rose streak fading out behind it */
export function drawSpinningKnife(x: number, y: number, face: number, flown: number): void {
  const turn = flown * 0.42 * face;
  const bx = Math.cos(turn) * 2.5;
  const by = Math.sin(turn) * 2.5;
  hairline(x - face * 11, y, x - face * 2, y, G[3], (u) => u * 0.7);
  hairline(x - face * 7, y + 0.5, x - face * 2, y + 0.5, G[4], (u) => u * 0.6);
  hairline(x - bx, y - by, x + bx, y + by, G[5]);
  hairline(x - bx * 0.4, y - by * 0.4 + 0.5, x + bx, y + by + 0.5, G[4]);
  fleck(x + bx, y + by, WHITE);
  glow(x, y, 5, G[4], 0.25);
}
