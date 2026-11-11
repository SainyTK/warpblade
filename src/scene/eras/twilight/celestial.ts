import { MOON, RES } from "../../../constants/stage";
import { grain } from "../../../utils/grain";
import { clamp, TAU } from "../../../utils/math";
import { LAYER } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import { PLANET, RING } from "./colors";

/** The ring that forms around the moon and the small teal world that rises beside it. */

/** the second moon, high left of the moon, in art pixels */
export const PLANET_AT = { x: 214, y: 20, r: 5 } as const;
/** the k at which the second moon has risen */
export const PLANET_FROM = 0.5;
const OPEN_SKY = [LAYER.sky, LAYER.celestial] as const;
/** the ring's outer edge and its fainter inner band, as radii along and across its tilt, in art pixels */
const RING_BANDS = [
  { rx: 25, ry: 5, lit: RING.lit, far: RING.dim, strength: 1 },
  { rx: 22.5, ry: 4.4, lit: RING.band, far: RING.dim, strength: 0.6 },
] as const;
const RING_TILT = 6 / 25;
const RING_STEPS = 720;

/** a tilted ring around the moon: its far half passes behind the disc */
export function paintMoonRing(paint: PlatePaint, k: number): void {
  const a = clamp((k - 0.1) / 0.6);
  if (a <= 0) return;
  for (const band of RING_BANDS)
    for (let s = 0; s < RING_STEPS; s++) {
      const g = (s / RING_STEPS) * TAU;
      const x = MOON.x + Math.cos(g) * band.rx;
      const y = MOON.y + Math.sin(g) * band.ry - Math.cos(g) * band.rx * RING_TILT;
      const near = Math.sin(g) > 0;
      if (!near && Math.hypot(x - MOON.x, y - MOON.y) <= MOON.r + 1) continue;
      paint.blend(Math.floor(x * RES), Math.floor(y * RES), near ? band.lit : band.far, a * band.strength, OPEN_SKY);
    }
}

/** a second, smaller moon with cloud bands, lit from the upper right */
export function paintPlanet(paint: PlatePaint, k: number): void {
  if (k < PLANET_FROM) return;
  const cx = PLANET_AT.x * RES;
  const cy = PLANET_AT.y * RES;
  const r = (PLANET_AT.r - 1 + (k - PLANET_FROM) * 2) * RES;
  for (let iy = Math.floor(cy - r); iy <= cy + r; iy++)
    for (let ix = Math.floor(cx - r); ix <= cx + r; ix++) {
      const dx = (ix + 0.5 - cx) / r;
      const dy = (iy + 0.5 - cy) / r;
      const d = Math.hypot(dx, dy);
      if (d > 1) continue;
      const band = Math.sin((dy + dx * 0.3) * 7) * 0.12;
      const lit = dx * 0.62 - dy * 0.5 + band + (grain(ix, iy) - 0.5) * 0.08 - Math.max(0, d - 0.8) * 1.2;
      paint.put(ix, iy, PLANET[lit > 0.42 ? 4 : lit > 0.12 ? 3 : lit > -0.2 ? 2 : lit > -0.5 ? 1 : 0], OPEN_SKY);
    }
}
