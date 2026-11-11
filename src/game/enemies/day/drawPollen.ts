import { disc, fleck, glow, px } from "../../../engine/frame";
import { DAY_COLORS as DC } from "./colors";

/** How a Glimmer Moth's pollen looks: a soft golden cloud full of turning grains, a few of them twinkling. */

const P = DC.pollen;
const GRAINS = 12;
/** the cloud's radius in the air, and how fast it spreads once it lies on the floor */
const CLOUD = { radius: 3.5, spread: 10, haze: 0.2, heart: 0.26 };
const HALF = 0.5;

/** a puff at (x, y) aged t seconds, k from 0 to 1 solid, `landed` seconds since it touched the floor */
export function drawPollen(x: number, y: number, t: number, k: number, landed: number): void {
  const spread = CLOUD.radius + landed * CLOUD.spread;
  disc(x, y, spread + 1.5, P[1], CLOUD.haze * k);
  disc(x, y - 0.5, spread * 0.6, P[2], CLOUD.heart * k);
  for (let i = 0; i < GRAINS; i++) {
    const a = t * (i % 2 ? 2.2 : -1.6) + i * 2.4;
    const r = spread * (0.3 + ((i * 37) % 10) / 13);
    const gx = x + Math.cos(a) * r;
    const gy = y + Math.sin(a) * r * 0.8;
    const twinkle = Math.sin(t * 9 + i * 1.7);
    const c = i % 4 === 0 ? DC.pollenPink : i % 2 ? P[2] : P[1];
    if (twinkle > 0.6) {
      px(gx, gy, P[3], k);
      fleck(gx - HALF, gy + HALF * 0.5, P[2], k);
      fleck(gx + 1, gy + HALF * 0.5, P[2], k);
      fleck(gx + HALF * 0.5, gy - HALF, P[2], k);
      fleck(gx + HALF * 0.5, gy + 1, P[2], k);
    } else if (i % 3 === 0) px(gx, gy, c, k);
    else fleck(gx, gy, c, k);
  }
  px(x, y, P[3], k);
  glow(x, y, 11, P[2], 0.35 * k);
}
