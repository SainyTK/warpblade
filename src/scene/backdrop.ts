import { FW, H, RES, W } from "../constants/stage";
import { bayerAt } from "../engine/frame";
import type { Color } from "../types/color";
import { cb, cg, cr, mix, rgb, scale } from "../utils/color";
import { clamp, smooth } from "../utils/math";
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
const JOIN_SPAN = 2;
const JOIN_ROWS = 4;
const RISE = 24;
const SKY_RISE = 72;
const TOP_BLUR = 48;
const BODIES_FADE = 32;
/** a slab or brazier mirrored beyond the stage would look like somewhere to stand, so what is this far above it shows in its place */
const SLAB_SKIP = 14;

/** x mirrored back and forth across the stage, so the picture repeats outward without a break */
function mirrored(x: number): number {
  const period = 2 * W;
  const m = ((x % period) + period) % period;
  return m < W ? m : period - 1 - m;
}

function meanOfTopRows(plate: Uint32Array, x0: number, x1: number, rows: number): Color {
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (let y = 0; y < rows * RES; y++)
    for (let x = x0; x <= x1; x++) {
      const c = plate[y * FW + clamp(x, 0, W - 1) * RES];
      r += cr(c);
      g += cg(c);
      b += cb(c);
      n++;
    }
  return rgb(r / n, g / n, b / n);
}

function topRowsPerColumn(plate: Uint32Array, span: number, rows: number): Color[] {
  return Array.from({ length: W }, (_, x) => meanOfTopRows(plate, x - span, x + span, rows));
}

/**
 * The current era's scene continued past the stage on every side, as RGBA bytes: the stage's own picture mirrored to
 * the left and right without its slabs and braziers, its top row carried upward, and the floor carried down into the dark.
 * The stage's top left corner sits at (left, top) of the backdrop; the stage area itself is left dark, the game covers it.
 */
export function paintBackdrop(out: ImageData, left: number, top: number): void {
  const { width, height, data } = out;
  const { def, k } = scene();
  const { plate, layers, bodiless } = scenePlate();
  const P = paletteAt(def, k);
  const join = {
    lit: topRowsPerColumn(plate, JOIN_SPAN, JOIN_ROWS),
    bare: topRowsPerColumn(bodiless, JOIN_SPAN, JOIN_ROWS),
  };
  const above = topRowsPerColumn(bodiless, TOP_BLUR, 1);
  const standing = (x: number, y: number): boolean => {
    const layer = layers[y * W + x] & LAYER_MASK;
    return layer === LAYER.slab || layer === LAYER.prop;
  };
  const worldAt = (wx: number, wy: number): Color => {
    const x = mirrored(wx);
    const bare = smooth(0, BODIES_FADE, Math.max(0, -wx, wx - W + 1));
    if (wy < 0) {
      const sky = mix(above[x], P.sky[0], smooth(0, SKY_RISE, -wy));
      return mix(mix(join.lit[x], join.bare[x], bare), sky, smooth(0, RISE, -wy));
    }
    if (wy >= H) {
      const fade = clamp((wy - H) / DEPTH_FADE);
      return fade > bayerAt(wx, wy) ? P.sky[0] : scale(groundAt(wx, wy, P), floorToneAt(wx, wy));
    }
    let y = wy;
    while (y >= SLAB_SKIP && standing(x, y)) y -= SLAB_SKIP;
    const i = y * RES * FW + x * RES;
    return bare > 0 ? mix(plate[i], bodiless[i], bare) : plate[i];
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
