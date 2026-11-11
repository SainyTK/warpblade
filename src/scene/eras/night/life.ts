import { fleck, glow, hairline, px } from "../../../engine/frame";
import { WHITE } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { METEOR } from "./colors";
import type { BrightStar } from "./sky";

/** What moves in the night sky each frame: the bright stars twinkle, and now and then a star falls. */

/** a bright star flares for a moment when its own slow wave peaks */
const TWINKLE = { speed: 1.3, from: 0.82, glow: 5 };
/** a shooting star crosses the open sky left of the moon once in this many seconds, in art pixels */
const METEOR_PATH = { every: 19, lasts: 0.55, x: [30, 190], y: [6, 34], run: 46, drop: 17, tail: 12 } as const;

/** rays of single image pixels round each bright star while it flares */
export function drawTwinkles(t: number, stars: readonly BrightStar[]): void {
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    const wave = Math.sin(t * (TWINKLE.speed + (i % 5) * 0.23) + i * 2.4);
    if (wave < TWINKLE.from) continue;
    const k = (wave - TWINKLE.from) / (1 - TWINKLE.from);
    fleck(s.x, s.y, WHITE);
    fleck(s.x + 1, s.y, s.tint, k);
    fleck(s.x - 1, s.y, s.tint, k);
    fleck(s.x, s.y + 1, s.tint, k);
    fleck(s.x, s.y - 1, s.tint, k);
    glow(s.x, s.y, TWINKLE.glow, s.tint, 0.35 * k);
  }
}

/** a short bright streak falling toward the lower right, a different place each time */
export function drawMeteor(t: number): void {
  const M = METEOR_PATH;
  const turn = Math.floor(t / M.every);
  const u = (t - turn * M.every) / M.lasts;
  if (u >= 1) return;
  const x0 = M.x[0] + grain(turn, 3) * (M.x[1] - M.x[0]);
  const y0 = M.y[0] + grain(turn, 7) * (M.y[1] - M.y[0]);
  const fade = u < 0.7 ? 1 : (1 - u) / 0.3;
  const hx = x0 + M.run * u;
  const hy = y0 + M.drop * u;
  const back = Math.min(1, u * 3) * M.tail;
  const tx = hx - (back * M.run) / Math.hypot(M.run, M.drop);
  const ty = hy - (back * M.drop) / Math.hypot(M.run, M.drop);
  hairline(tx, ty, (tx + hx) / 2, (ty + hy) / 2, METEOR[2], 0.5 * fade);
  hairline((tx + hx) / 2, (ty + hy) / 2, hx, hy, METEOR[1], 0.9 * fade);
  px(hx, hy, METEOR[0], fade);
  glow(hx, hy, 6, METEOR[1], 0.4 * fade);
}
