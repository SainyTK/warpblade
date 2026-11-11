import { PAL } from "../../../constants/palette";
import { fleck, glow, hairline } from "../../../engine/frame";

/** how long a bolt's tail is for its speed, in seconds of flight, and the longest it gets in art pixels */
const TAIL = { time: 0.035, most: 9 } as const;

/**
 * A bolt of violet flame flying at (vx, vy): a small pale head, and a tail that thins from three image pixels to one
 * and darkens down the lamp's ramp behind it. The caller has placed the frame in world space.
 */
export function drawFlameBolt(x: number, y: number, vx: number, vy: number, a = 1): void {
  const R = PAL.wick;
  const speed = Math.hypot(vx, vy) || 1;
  const ux = vx / speed;
  const uy = vy / speed;
  const long = Math.min(TAIL.most, speed * TAIL.time);
  for (const [side, reach] of [
    [0, 1],
    [-0.5, 0.45],
    [0.5, 0.45],
  ] as const) {
    const ox = -uy * side;
    const oy = ux * side;
    hairline(
      x + ox,
      y + oy,
      x + ox - ux * long * reach,
      y + oy - uy * long * reach,
      (u) => (u < 0.25 ? R[4] : u < 0.6 ? R[3] : R[2]),
      (u) => a * (1 - u * 0.8),
    );
  }
  fleck(x, y, R[5], a);
  fleck(x + ux * 0.5, y + uy * 0.5, R[5], a);
  fleck(x - 0.5 * uy, y + 0.5 * ux, R[4], a);
  glow(x, y, 6, R[4], 0.4 * a);
}
