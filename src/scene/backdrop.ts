import { FW, H, RES, W } from "../constants/stage";
import { bayerAt } from "../engine/frame";
import type { Color } from "../types/color";
import { cb, cg, cr, rgb, scale } from "../utils/color";
import { clamp } from "../utils/math";
import { paletteAt } from "./eras/sceneDef";
import { LAYER, LAYER_MASK } from "./plate";
import { scene, scenePlate } from "./scenery";
import { floorToneAt } from "./stoneTone";
import { groundAt } from "./terrain";

/** the world beyond the stage darkens to this much of its light over FADE art pixels, so the edge of play reads without a frame */
const DIM = 0.55;
const FADE = 48;
/** below the stage the stone fades into the night over this many art pixels */
const DEPTH_FADE = 96;
/** the sky above the stage continues from the stage's top row, each column averaged over this many art pixels either side */
const TOP_BLUR = 48;
/** a slab or brazier mirrored beyond the stage would look like somewhere to stand, so what is this far above it shows in its place */
const SLAB_SKIP = 14;

/** x mirrored back and forth across the stage, so the picture repeats outward without a break */
function mirrored(x: number): number {
  const period = 2 * W;
  const m = ((x % period) + period) % period;
  return m < W ? m : period - 1 - m;
}

/** the stage's top row smoothed along x, one color per art column */
function topRow(plate: Uint32Array): Color[] {
  const row: Color[] = [];
  for (let x = 0; x < W; x++) {
    let r = 0;
    let g = 0;
    let b = 0;
    let n = 0;
    for (let d = -TOP_BLUR; d <= TOP_BLUR; d++) {
      const c = plate[clamp(x + d, 0, W - 1) * RES];
      r += cr(c);
      g += cg(c);
      b += cb(c);
      n++;
    }
    row.push(rgb(r / n, g / n, b / n));
  }
  return row;
}

/**
 * The current era's scene continued past the stage on every side, as RGBA bytes: the stage's own picture mirrored to
 * the left and right without its slabs and braziers, its top row carried upward, and the floor carried down into the dark.
 * The stage's top left corner sits at (left, top) of the backdrop; the stage area itself is left dark, the game covers it.
 */
export function paintBackdrop(out: ImageData, left: number, top: number): void {
  const { width, height, data } = out;
  const { def, k } = scene();
  const { plate, layers } = scenePlate();
  const P = paletteAt(def, k);
  const above = topRow(plate);
  const standing = (x: number, y: number): boolean => {
    const layer = layers[y * W + x] & LAYER_MASK;
    return layer === LAYER.slab || layer === LAYER.prop;
  };
  const worldAt = (wx: number, wy: number): Color => {
    const x = mirrored(wx);
    if (wy < 0) return above[x];
    if (wy >= H) {
      const fade = clamp((wy - H) / DEPTH_FADE);
      return fade > bayerAt(wx, wy) ? P.sky[0] : scale(groundAt(wx, wy, P), floorToneAt(wx, wy));
    }
    let y = wy;
    while (y >= SLAB_SKIP && standing(x, y)) y -= SLAB_SKIP;
    return plate[y * RES * FW + x * RES];
  };
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const wx = x - left;
      const wy = y - top;
      const out = Math.hypot(Math.max(0, -wx, wx - W + 1), Math.max(0, -wy, wy - H + 1));
      const c = out === 0 ? P.sky[0] : scale(worldAt(wx, wy), 1 - (1 - DIM) * clamp(out / FADE));
      const j = (y * width + x) * 4;
      data[j] = cr(c);
      data[j + 1] = cg(c);
      data[j + 2] = cb(c);
      data[j + 3] = 255;
    }
}
