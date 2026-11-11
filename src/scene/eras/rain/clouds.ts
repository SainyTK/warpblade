import { FW, RES } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import { mix } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { LAYER } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import { billows, noise } from "./noise";
import { CLOUD_DARK, CLOUD_LIGHT, RAIN_COLORS as RC } from "./palette";

/** where the hidden sun glows through the clouds, fading out as the storm builds */
export const SUN = { x: 236, y: 40, r: 48 } as const;

/**
 * One cloud bank: the art row of its flat base, how far it billows above and hangs below that row, the size of its
 * billows across and down in art pixels, how much of the sky it fills from 0 to 1, and its own place in the noise.
 */
interface Bank {
  base: number;
  above: number;
  below: number;
  across: number;
  down: number;
  cover: number;
  seed: number;
}

/** the banks from the heavy one overhead to the far, hazy one over the horizon, in the order of the cloud ramps */
const BANKS: readonly Bank[] = [
  { base: 36, above: 70, below: 16, across: 50, down: 30, cover: 0.84, seed: 1 },
  { base: 66, above: 24, below: 7, across: 36, down: 20, cover: 0.66, seed: 2 },
  { base: 88, above: 15, below: 5, across: 26, down: 13, cover: 0.6, seed: 3 },
  { base: 105, above: 9, below: 3, across: 18, down: 8, cover: 0.56, seed: 4 },
];
/** the lowest art row any bank reaches */
const CLOUD_FLOOR = 112;
const SKY_LAYERS = [LAYER.sky, LAYER.celestial] as const;
/** the light comes from the upper right: how far toward it, in art pixels, a bank is sampled to find its lit side */
const LIGHT = { dx: 3, dy: -4, gain: 5 };
/** how strongly the heaps shape a bank's outline */
const SHAPE = 1.6;
/** how thick a bank must be before it is solid; thinner than this its edge breaks up in the dither */
const WISP = 0.06;
const SUN_HAZE = 0.55;
/** how much narrower than a whole tone step the dithered seam between two tones is */
const SEAM = 2.4;

/** the bank's heaps at an art position, from 0 in a crease to 1 on a crown, in as much detail as `octaves` gives */
const heaps = (b: Bank, x: number, y: number, octaves: number): number =>
  billows(x / b.across + b.seed * 19.7, y / b.down + b.seed * 7.3, octaves);

/** how thick the bank is at an art position: above 0 inside it, growing toward its heart */
function thickness(b: Bank, x: number, y: number): number {
  const v = y - b.base;
  const span = v < 0 ? b.above : b.below;
  const profile = 1 - (v / span) * (v / span);
  // the base is flat and the billows are tall: the heaps shape the top far more than the underside
  const reach = v < 0 ? 1 : 0.45;
  return profile * 0.5 + (heaps(b, x, y, 4) - 0.4) * SHAPE * reach + b.cover - 1;
}

/** the tone of a bank's pixel from 0, its darkest belly, to 1, its lit rim */
function toneAt(b: Bank, x: number, y: number): number {
  const lit = clamp((heaps(b, x, y, 2) - heaps(b, x + LIGHT.dx, y + LIGHT.dy, 2)) * LIGHT.gain, -1, 1);
  const belly = clamp((y - (b.base - b.above * 0.3)) / (b.above * 0.3 + b.below));
  const streak = noise(x / 14 + b.seed * 3.1, y / 3) - 0.5;
  return clamp(0.48 + lit * 0.5 - belly * 0.4 + streak * 0.16);
}

/**
 * Storm banks painted on the sky at the frame's full detail: each has a flat dark belly and tall billows lit on the
 * side that faces the hidden sun, its tones stepping through a dither, its thin edges breaking up into wisps. The far
 * banks are paler and flatter, and the sun's haze warms what lies in front of it while the storm is still light.
 */
export function paintClouds(paint: PlatePaint, k: number): void {
  const ramps: Color[][] = BANKS.map((_, b) => CLOUD_LIGHT[b].map((c, i) => mix(c, CLOUD_DARK[b][i], k)));
  for (let iy = 0; iy < CLOUD_FLOOR * RES; iy++) {
    const y = (iy + 0.5) / RES;
    for (let ix = 0; ix < FW; ix++) {
      if (!paint.on(ix, iy, SKY_LAYERS)) continue;
      const x = (ix + 0.5) / RES;
      const th = bayerAt(ix, iy);
      for (let b = 0; b < BANKS.length; b++) {
        const bank = BANKS[b];
        if (y < bank.base - bank.above || y > bank.base + bank.below) continue;
        const d = thickness(bank, x, y);
        if (d <= 0 || d < WISP * th) continue;
        const ramp = ramps[b];
        const step = toneAt(bank, x, y) * (ramp.length - 1);
        const whole = Math.floor(step);
        // flat tones with a narrow dithered seam between them
        const seam = (step - whole - 0.5) * SEAM + 0.5;
        let c = ramp[Math.min(ramp.length - 1, seam > th ? whole + 1 : whole)];
        const sun = clamp(1 - Math.hypot(x - SUN.x, (y - SUN.y) * 1.3) / SUN.r) * (1 - k);
        if (sun > 0) c = mix(c, RC.sunHaze, sun * sun * SUN_HAZE);
        paint.put(ix, iy, c);
        break;
      }
    }
  }
}
