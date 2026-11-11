import { RES } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import { lerp } from "../../../utils/math";
import type { Rng } from "../../../utils/rng";
import type { SkyColors } from "./colors";

/** Puffy clouds at image pixel detail: round lumps over a flat base, each lump lit from the sun's side, shaded beneath. */

export interface CloudShape {
  w: number;
  h: number;
  /** x, y, radius in art pixels, from the shape's top left corner */
  lumps: readonly (readonly [number, number, number])[];
}

/** art pixels between one lump and the next */
const LUMP_SPACING = 5.5;
/** where the sun stands for a cloud: to the right, above and a little toward the viewer */
const LIGHT = { x: 0.5, y: -0.72, z: 0.48 };
/** the share of a cloud's height, from its base up, that falls into the shade of its own body */
const UNDERSIDE = 0.42;
/** brightness from 0 to 1 above which a cloud pixel takes the lit, plain and shaded tone; the rest is the deep one */
const TONE_STEPS = [0.66, 0.43, 0.22];
const DITHER = 0.1;

export function cloudShape(w: number, h: number, r: Rng): CloudShape {
  const lumps: [number, number, number][] = [];
  const n = Math.max(4, Math.round(w / LUMP_SPACING));
  for (let j = 0; j < n; j++) {
    const u = (j + 0.5) / n;
    const rad = lerp(h * 0.34, h * 0.92, Math.sin(u * Math.PI) ** 0.8) * r.range(0.72, 1.12);
    lumps.push([u * w + r.range(-1, 1), h - rad * 0.62, rad]);
  }
  return { w, h, lumps };
}

/** paint a cloud with its top left corner at image pixel (ix0, iy0) */
export function paintCloud(
  put: (ix: number, iy: number, c: Color) => void,
  ix0: number,
  iy0: number,
  shape: CloudShape,
  C: SkyColors,
): void {
  const { w, h, lumps } = shape;
  const base = h - 0.75;
  for (let v = Math.floor(-h * RES); v < h * RES; v++)
    for (let u = Math.floor(-h * RES); u < (w + h) * RES; u++) {
      const x = (u + 0.5) / RES;
      const y = (v + 0.5) / RES;
      if (y > base + Math.sin(x * 0.55) * 0.35) continue;
      let height = 0;
      let light = 0;
      for (const [cx, cy, rad] of lumps) {
        const dx = (x - cx) / rad;
        const dy = (y - cy) / rad;
        const d = dx * dx + dy * dy;
        if (d >= 1) continue;
        const dz = Math.sqrt(1 - d);
        if (dz * rad <= height) continue;
        height = dz * rad;
        light = dx * LIGHT.x + dy * LIGHT.y + dz * LIGHT.z;
      }
      if (height <= 0) continue;
      const under = Math.max(0, (y - base + h * UNDERSIDE) / (h * UNDERSIDE));
      const tone = light * 0.5 + 0.5 - under * 0.55 + (bayerAt(ix0 + u, iy0 + v) - 0.5) * DITHER;
      const c =
        tone > TONE_STEPS[0]
          ? C.cloudLit
          : tone > TONE_STEPS[1]
            ? C.cloud
            : tone > TONE_STEPS[2]
              ? C.cloudShade
              : C.cloudDeep;
      put(ix0 + u, iy0 + v, c);
    }
}
