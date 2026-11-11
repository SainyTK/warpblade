import { MOON, RES } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import { clamp, smooth } from "../../../utils/math";
import { LAYER } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import { CLOUD_LIT, CLOUD_ON_MOON, MOON_HALO, MOON_TONES } from "./colors";
import { cloudNoise, valueNoise } from "./noise";

/** The moon at image pixel detail: a gibbous disc with seas and craters, a soft halo, and thin cloud drifting across it. */

const SKY = [LAYER.sky, LAYER.celestial] as const;
const CX = MOON.x * RES;
const CY = MOON.y * RES;
const R = MOON.r * RES;
/** where the light comes from, as a unit vector: from the right, a little above, and toward the viewer */
const LIGHT = { x: 0.6, y: -0.22, z: 0.77 };
/** how far the halo reaches past the disc, and how fast its bright inner part falls off, in image pixels */
const HALO = { reach: 84, core: 15, coreStrength: 0.42, wideStrength: 0.34 };
/** craters as x, y from the moon's center and radius, in image pixels */
const CRATERS: readonly (readonly [number, number, number])[] = [
  [-9, -11, 6.5],
  [10, 4, 5],
  [-4, 13, 4.2],
  [13, -14, 3.2],
  [1, -3, 2.4],
  [-17, 3, 2.6],
  [18, 12, 2.2],
  [5, 20, 2.8],
  [-12, -22, 2],
];
const SEA_DEPTH = 0.2;
const CRATER = { floor: 0.1, wall: 0.2, rimFrom: 0.62 };
/** thin cloud bands near the moon: the band's height above the moon's center, its thickness and its seed */
const CLOUDS: readonly (readonly [number, number, number])[] = [
  [-15, 6, 3.1],
  [17, 8, 11.7],
  [33, 5, 23.9],
];
const CLOUD_REACH = 120;
/** how much of the moon's light a cloud in front of it takes, and how bright a cloud beside it shows */
const CLOUD_STRENGTH = { onMoon: 0.42, far: 0.12, near: 0.4 };
/** the surface's brightness: the night side's floor and the day side's level before seas and craters */
const SURFACE = { night: 0.08, day: 0.7 };
/** the share of a step between two tones that is broken up, around its middle */
const DITHER_SPAN = 0.44;

/** how much thin cloud lies over an image pixel near the moon, from 0 to 1 */
function cloudAt(ix: number, iy: number): number {
  let most = 0;
  for (const [dy, thick, seed] of CLOUDS) {
    const mid = CY + dy + Math.sin(ix * 0.031 + seed) * 5;
    const swell = 0.45 + 0.55 * valueNoise(ix / 34 + seed, 1.5);
    const across = 1 - Math.abs(iy - mid) / (thick * swell);
    if (across <= 0) continue;
    const body = smooth(0.3, 0.7, cloudNoise(ix / 40 + seed, iy / 8 + seed));
    const ends = 1 - clamp(Math.abs(ix - CX + dy * 1.5) / CLOUD_REACH);
    most = Math.max(most, across * across * body * ends);
  }
  return most;
}

/** how bright the moon's surface is at a point of the disc, from 0 to 1 */
function surfaceAt(dx: number, dy: number): number {
  const nx = dx / R;
  const ny = dy / R;
  const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
  const facing = nx * LIGHT.x + ny * LIGHT.y + nz * LIGHT.z;
  const lit = smooth(-0.04, 0.42, facing);
  const sea = smooth(0.5, 0.72, valueNoise(dx / 13 + 40, dy / 11 + 7)) * SEA_DEPTH;
  let relief = 0;
  for (const [qx, qy, qr] of CRATERS) {
    const ux = (dx - qx) / qr;
    const uy = (dy - qy) / qr;
    const u = Math.hypot(ux, uy);
    if (u >= 1) continue;
    // the wall away from the light catches it, the wall toward the light is in shadow
    relief += u < CRATER.rimFrom ? -CRATER.floor : (-(ux * LIGHT.x + uy * LIGHT.y) / u) * CRATER.wall;
  }
  return clamp(SURFACE.night + lit * (SURFACE.day - sea + relief) * (0.8 + 0.2 * nz));
}

/** a tone of the ramp for a brightness, the step between two tones broken up on the image grid */
function toneAt(v: number, ix: number, iy: number): Color {
  const at = clamp(v) * (MOON_TONES.length - 1);
  const i = Math.floor(at);
  const part = clamp((at - i - (1 - DITHER_SPAN) / 2) / DITHER_SPAN);
  return MOON_TONES[Math.min(MOON_TONES.length - 1, part > bayerAt(ix, iy) ? i + 1 : i)];
}

/** paint the halo, the disc and the cloud over the sky around the moon */
export function paintMoon(paint: PlatePaint): void {
  const reach = R + HALO.reach;
  for (let iy = Math.floor(CY - reach); iy <= CY + reach; iy++)
    for (let ix = Math.floor(CX - CLOUD_REACH); ix <= CX + CLOUD_REACH; ix++) {
      if (!paint.on(ix, iy, SKY)) continue;
      const dx = ix + 0.5 - CX;
      const dy = iy + 0.5 - CY;
      const d = Math.hypot(dx, dy);
      const cloud = cloudAt(ix, iy);
      if (d <= R + 0.5) {
        paint.put(ix, iy, toneAt(surfaceAt(dx, dy), ix, iy));
        paint.blend(ix, iy, CLOUD_ON_MOON, cloud * CLOUD_STRENGTH.onMoon);
        if (d > R - 0.5) paint.blend(ix, iy, MOON_HALO, 0.5);
        continue;
      }
      const out = d - R;
      const near = 1 - clamp(out / HALO.reach);
      paint.blend(ix, iy, MOON_HALO, HALO.coreStrength * Math.exp(-out / HALO.core) + HALO.wideStrength * near * near);
      paint.blend(ix, iy, CLOUD_LIT, cloud * (CLOUD_STRENGTH.far + CLOUD_STRENGTH.near * near));
    }
}
