import { FW, RES } from "../../../constants/stage";
import { grain } from "../../../utils/grain";
import { lerp, smooth } from "../../../utils/math";

/** The aurora's ribbons as functions of x, shared by the static plate and the light that drifts along them. */

interface Ribbon {
  /** the height its top edge hangs around, in art pixels */
  base: number;
  phase: number;
  /** how far its curtain hangs down, in art pixels */
  length: number;
  strength: number;
}
export const RIBBONS: readonly Ribbon[] = [
  { base: 30, phase: 0, length: 24, strength: 1 },
  { base: 50, phase: 2.3, length: 20, strength: 0.85 },
  { base: 13, phase: 4.1, length: 26, strength: 0.5 },
];
/** a curtain is streaked with rays this many image pixels wide, with finer threads inside them */
const RAY = { width: 13, thread: 3, threadDepth: 0.3, floor: 0.16 };
/** a bright ray stands this many art pixels taller than a dim one, and hangs further down */
const RAY_RISE = 3.5;

/** the top edge of ribbon b above art pixel x */
export function ribbonTop(b: number, x: number): number {
  const { base, phase } = RIBBONS[b];
  return (
    base + Math.sin(x * 0.028 + phase) * 9 + Math.sin(x * 0.011 + phase * 0.4) * 6 + Math.sin(x * 0.07 + phase) * 2
  );
}

/** smooth noise from 0 to 1 along a line */
function noise(v: number, seed: number): number {
  const i = Math.floor(v);
  return lerp(grain(i, seed), grain(i + 1, seed), smooth(0, 1, v - i));
}

export interface RibbonColumns {
  top: Float32Array;
  length: Float32Array;
  /** how bright the curtain is in each image column: fine rays inside slow swells */
  bright: Float32Array;
}

/** each ribbon's shape for every image column, so the sky is painted without a sine per pixel */
export function ribbonColumns(veil: number): RibbonColumns[] {
  return RIBBONS.map((ribbon, b) => {
    const top = new Float32Array(FW);
    const length = new Float32Array(FW);
    const bright = new Float32Array(FW);
    for (let ix = 0; ix < FW; ix++) {
      const x = (ix + 0.5) / RES;
      const ray = noise(ix / RAY.width, 7 + b * 13);
      const thread = 1 - RAY.threadDepth * noise(ix / RAY.thread, 3 + b * 17);
      const swell = 0.3 + 0.7 * noise(ix / 90, 71 + b * 5);
      top[ix] = ribbonTop(b, x) - ray * RAY_RISE;
      length[ix] = ribbon.length * (0.55 + 0.75 * ray) * (0.75 + 0.25 * veil);
      bright[ix] = ribbon.strength * veil * (RAY.floor + (1 - RAY.floor) * ray ** 1.6) * thread * swell;
    }
    return { top, length, bright };
  });
}
