import { FW, GROUND, RES } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import { mix } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import type { SkyColors } from "./colors";
import { smoothNoise } from "./noise";

/** Two mountain ranges behind the green ridge, at image pixel detail: sunlit right slopes, shaded left ones, snow caps. */

interface Range {
  /** the crest's height at art column x */
  top(x: number): number;
  /** shaded slopes to sunlit ones */
  tones: readonly Color[];
  /** crests above this row carry snow, deeper the higher they stand; 0 for none */
  snowLine: number;
  /** how far the line between light and shade leans left as it runs down from a peak */
  lean: number;
  /** the range melts into the sky between these rows, and is already this hazy at its crest */
  hazeFrom: number;
  hazeTo: number;
  haze: number;
}

const farTop = (x: number): number =>
  96 -
  Math.abs(Math.sin(x * 0.018 + 0.6)) * 16 -
  Math.sin(x * 0.047 + 2.1) * 5 -
  Math.sin(x * 0.11) * 1.5 -
  Math.sin(x * 0.37) * 0.8 -
  Math.sin(x * 0.83 + 1) * 0.4;
const nearTop = (x: number): number =>
  111 - Math.abs(Math.sin(x * 0.027 + 2.2)) * 9 - Math.sin(x * 0.071) * 4 - Math.sin(x * 0.29) * 0.9;

/** crest samples kept past both edges of the picture, so a leaning shade line can look beyond it */
const MARGIN = 96;
const HAZE_STEPS = 5;
const SNOW_DEPTH = 0.55;
/** streaks of rock run down each face: their width in image pixels and how far they move a face's tone */
const ROCK = { grain: 7, depth: 0.5 };

function paintRange(sky: Uint32Array, range: Range, snow: Color, snowShade: Color): void {
  const tops = new Float32Array(FW + MARGIN * 2);
  for (let j = 0; j < tops.length; j++) tops[j] = range.top((j - MARGIN + 0.5) / RES);
  const slopeAt = (j: number): number => {
    const at = clamp(Math.round(j) + MARGIN, 3, tops.length - 4);
    return tops[at + 3] - tops[at - 3];
  };
  const lastRow = Math.min(GROUND, range.hazeTo) * RES;
  for (let ix = 0; ix < FW; ix++) {
    const top = tops[ix + MARGIN];
    const snowDepth =
      range.snowLine > top
        ? (range.snowLine - top) * SNOW_DEPTH + Math.sin(ix * 0.65) * 0.7 + Math.sin(ix * 1.45) * 0.4
        : 0;
    for (let iy = Math.max(0, Math.ceil(top * RES - 0.5)); iy < lastRow; iy++) {
      const y = (iy + 0.5) / RES;
      const depth = y - top;
      const b = bayerAt(ix, iy);
      const lit = slopeAt(ix + depth * range.lean * RES) > 0;
      const rock = smoothNoise(ix + depth * range.lean * RES * (lit ? 2.2 : -0.6), iy * 0.45, ROCK.grain);
      let c: Color;
      if (depth < snowDepth) c = lit ? snow : snowShade;
      else {
        const v = (lit ? 0.7 : 0.26) + (rock - 0.5) * ROCK.depth + (b - 0.5) * 0.1;
        c = range.tones[clamp(Math.floor(v * range.tones.length), 0, range.tones.length - 1)];
      }
      const fade = clamp((y - range.hazeFrom) / (range.hazeTo - range.hazeFrom));
      const haze = Math.floor((range.haze + (1 - range.haze) * fade) * HAZE_STEPS + b) / HAZE_STEPS;
      const i = iy * FW + ix;
      sky[i] = mix(c, sky[i], Math.min(1, haze));
    }
  }
}

/** paint both ranges into the sky picture, the far snowy one first */
export function paintMountains(sky: Uint32Array, C: SkyColors): void {
  paintRange(
    sky,
    { top: farTop, tones: C.far, snowLine: 89, lean: 0.55, hazeFrom: 98, hazeTo: 124, haze: 0.12 },
    C.farSnow,
    C.farSnowShade,
  );
  paintRange(
    sky,
    { top: nearTop, tones: C.near, snowLine: 0, lean: 0.4, hazeFrom: 116, hazeTo: 140, haze: 0.05 },
    C.farSnow,
    C.farSnowShade,
  );
}
