import { FH, FW, MOON, RES } from "../../../constants/stage";
import type { Color, Ramp } from "../../../types/color";
import { cb, cg, cr, mix, rgb } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { clamp, smooth } from "../../../utils/math";
import { LAYER } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import type { ScenePalette } from "../sceneDef";
import { ribbonColumns } from "./aurora";
import { lighten } from "./brush";
import { RIBBON_TONES } from "./colors";

/** The open sky repainted at full detail: a smooth fall of color, the moon's soft halo, the aurora's curtains, fine stars. */

/** the sky's bands run from the top of the picture down to this art row, as the shared sky does */
const SKY_DEPTH = 150;
const HALO = { reach: 20, strength: 0.42 };
/** the soft upper edge of a curtain, in art pixels above and below its top line */
const EDGE = { above: 1.2, below: 0.8 };
const BRIGHT_STAR = 150;
const STAR_ARM = 0.42;
const OPEN_SKY = [LAYER.sky, LAYER.celestial] as const;

interface Star {
  ix: number;
  iy: number;
  c: Color;
}

const luma = (c: Color): number => (cr(c) * 3 + cg(c) * 6 + cb(c)) / 10;

/** the stars the shared sky scattered, read off the plate before the sky is repainted over them */
function collectStars(paint: PlatePaint, tones: Set<Color>): Star[] {
  const stars: Star[] = [];
  for (let iy = 0; iy < FH; iy += RES)
    for (let ix = 0; ix < FW; ix += RES) {
      if (paint.layerAt(ix, iy) !== LAYER.sky) continue;
      for (let j = 0; j < RES * RES; j++) {
        const c = paint.get(ix + (j % RES), iy + ((j / RES) | 0));
        if (tones.has(c)) continue;
        stars.push({ ix: ix + (grain(ix, iy) < 0.5 ? 0 : 1), iy: iy + (grain(iy, ix) < 0.5 ? 0 : 1), c });
        break;
      }
    }
  return stars;
}

/** a star as a single image pixel, the bright ones with four faint arms */
function paintStars(paint: PlatePaint, stars: readonly Star[]): void {
  for (const { ix, iy, c } of stars) {
    lighten(paint, ix, iy, c, 1, OPEN_SKY);
    if (luma(c) < BRIGHT_STAR) continue;
    lighten(paint, ix + 1, iy, c, STAR_ARM, OPEN_SKY);
    lighten(paint, ix - 1, iy, c, STAR_ARM, OPEN_SKY);
    lighten(paint, ix, iy + 1, c, STAR_ARM, OPEN_SKY);
    lighten(paint, ix, iy - 1, c, STAR_ARM, OPEN_SKY);
  }
}

/** the sky's color at art row y, blended between the palette's bands */
function skyTone(S: Ramp, y: number): Color {
  const v = clamp(y / SKY_DEPTH) * (S.length - 1);
  const i = Math.min(S.length - 2, Math.floor(v));
  return mix(S[i], S[i + 1], v - i);
}

/** a curtain's color at share u of the way down it */
function curtainTone(tones: Ramp, u: number): Color {
  return u < 0.35 ? mix(tones[0], tones[1], u / 0.35) : mix(tones[1], tones[2], (u - 0.35) / 0.65);
}

export function paintSky(paint: PlatePaint, P: ScenePalette, veil: number, haloColor: Color): void {
  const tones = new Set<Color>(P.sky);
  // the moon's old dithered halo, so its pixels are repainted and the disc is kept
  const oldHalo = new Set<Color>(P.sky.map((c) => mix(c, haloColor, 0.6)));
  const stars = collectStars(paint, tones);
  const ribbons = ribbonColumns(veil);
  for (let iy = 0; iy < FH; iy++) {
    const y = (iy + 0.5) / RES;
    const base = skyTone(P.sky, y);
    for (let ix = 0; ix < FW; ix++) {
      const layer = paint.layerAt(ix, iy);
      if (layer !== LAYER.sky && layer !== LAYER.celestial) continue;
      const x = (ix + 0.5) / RES;
      const fromMoon = Math.hypot(x - MOON.x, y - MOON.y) - MOON.r;
      if (layer === LAYER.celestial && fromMoon < 2 && !oldHalo.has(paint.get(ix, iy)) && !tones.has(paint.get(ix, iy)))
        continue;
      let r = cr(base);
      let g = cg(base);
      let b = cb(base);
      for (let i = 0; i < ribbons.length; i++) {
        const d = y - ribbons[i].top[ix];
        const length = ribbons[i].length[ix];
        if (d <= -EDGE.above || d >= length) continue;
        const u = Math.max(0, d / length);
        const a = smooth(-EDGE.above, EDGE.below, d) * (1 - u) ** 1.5 * ribbons[i].bright[ix];
        const c = curtainTone(RIBBON_TONES[i], u);
        r += cr(c) * a;
        g += cg(c) * a;
        b += cb(c) * a;
      }
      if (fromMoon < HALO.reach) {
        const h = (1 - Math.max(0, fromMoon) / HALO.reach) ** 2 * HALO.strength;
        r += (cr(haloColor) - r) * h;
        g += (cg(haloColor) - g) * h;
        b += (cb(haloColor) - b) * h;
      }
      paint.put(ix, iy, rgb(r, g, b));
    }
  }
  paintStars(paint, stars);
}
