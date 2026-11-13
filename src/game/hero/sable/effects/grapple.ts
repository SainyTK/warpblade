import { SABLE_SKIN } from "../../../../constants/characters/sable/look";
import { GRAPPLE_LOOK } from "../../../../constants/sable/look";
import { fleck, glow, hairline, line, place } from "../../../../engine/frame";
import { WHITE } from "../../../../utils/color";
import { skin } from "../../skin";

const C = SABLE_SKIN.colors;

/**
 * Her grapple bolt flying point first, its point at (x, y): a wooden shaft, a jade-steel head whose three hooks fold
 * flat as it leaves the crossbow and spring open in flight, and the cord's eye at the tail.
 */
export function drawGrappleBolt(x: number, y: number, angle: number, t: number): void {
  const c = Math.cos(angle);
  const n = Math.sin(angle);
  const L = GRAPPLE_LOOK;
  /** a point `d` along the shaft from the tail, `w` across it */
  const at = (d: number, w: number): [number, number] => [
    x - c * (L.length - d) - n * w,
    y - n * (L.length - d) + c * w,
  ];
  const open = Math.min(1, t / L.openTime) * L.hookSpread;
  const neck = L.length - L.head;
  line(...at(1, 0), ...at(neck, 0), C.hilt);
  hairline(...at(1, -0.5), ...at(neck, -0.5), C.gloveLight);
  // the head: a steel socket, a white point, and three hooks swept back from it
  hairline(...at(neck, 0), ...at(L.length, 0), C.blade);
  hairline(...at(neck, -0.5), ...at(L.length - 0.5, -0.5), C.bladeEdge);
  for (const side of [-1, 1]) {
    hairline(...at(L.length - 1, 0), ...at(neck - 1, side * (0.8 + open)), side < 0 ? C.bladeEdge : C.bladeBack);
    fleck(...at(neck - 1, side * (0.8 + open)), C.bladeDeep);
  }
  hairline(...at(L.length - 1.5, 0), ...at(neck, 0), C.bladeDeep);
  fleck(...at(L.length, 0), WHITE);
  // the cord's eye at the tail
  fleck(...at(0, 0), C.trimLight);
  fleck(...at(-0.5, 0.5), C.trim);
  glow(x, y, L.glow, skin.ramp[3], 0.35);
}

/** the cord from her crossbow to the grapple bolt's tail, sagging less as it pays out to its length */
export function drawGrappleCord(x0: number, y0: number, x1: number, y1: number, taut: number): void {
  place();
  const sag = GRAPPLE_LOOK.sag * (1 - taut);
  const steps = GRAPPLE_LOOK.cordSteps;
  let px0 = x0;
  let py0 = y0;
  for (let i = 1; i <= steps; i++) {
    const u = i / steps;
    const px1 = x0 + (x1 - x0) * u;
    const py1 = y0 + (y1 - y0) * u + Math.sin(u * Math.PI) * sag;
    hairline(px0, py0, px1, py1, i % 2 ? C.trim : C.trimDark);
    hairline(px0, py0 + 0.5, px1, py1 + 0.5, C.trimDark, 0.6);
    px0 = px1;
    py0 = py1;
  }
}
