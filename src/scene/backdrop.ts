import { WORLD_COLORS as WC } from "../constants/palette";
import { GROUND, H, W } from "../constants/stage";
import { bayerAt } from "../engine/frame";
import type { Color } from "../types/color";
import { cb, cg, cr, mix, scale } from "../utils/color";
import { clamp } from "../utils/math";
import { groundAt, ridgeAt, ridgeTopAt, skyAt } from "./terrain";

/** the world beyond the stage darkens to this much of its light over FADE art pixels, so the edge of play reads without a frame */
const DIM = 0.55;
const FADE = 48;
/** below the stage the stone fades into the night over this many art pixels */
const DEPTH_FADE = 96;
const STAR_CHANCE = 0.008;

/** a fixed pseudo-random value in [0, 1) for one art pixel, so the stars stay put when the window resizes */
function hash(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function worldAt(x: number, y: number): Color {
  if (y >= GROUND) {
    const fade = clamp((y - H) / DEPTH_FADE);
    return fade > bayerAt(x, y) ? WC.sky[0] : groundAt(x, y);
  }
  if (y >= ridgeTopAt(x)) return ridgeAt(x, y);
  if (y < 110 && hash(x, y) < STAR_CHANCE) return mix(WC.starDim, WC.starBright, hash(y, x) * 0.6);
  return skyAt(x, y);
}

/**
 * The night scene continued past the stage on every side, as RGBA bytes.
 * The stage's top left corner sits at (left, top) of the backdrop; the stage area itself is left dark, the game covers it.
 */
export function paintBackdrop(out: ImageData, left: number, top: number): void {
  const { width, height, data } = out;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const wx = x - left;
      const wy = y - top;
      const out = Math.hypot(Math.max(0, -wx, wx - W + 1), Math.max(0, -wy, wy - H + 1));
      const c = out === 0 ? WC.sky[0] : scale(worldAt(wx, wy), 1 - (1 - DIM) * clamp(out / FADE));
      const j = (y * width + x) * 4;
      data[j] = cr(c);
      data[j + 1] = cg(c);
      data[j + 2] = cb(c);
      data[j + 3] = 255;
    }
}
