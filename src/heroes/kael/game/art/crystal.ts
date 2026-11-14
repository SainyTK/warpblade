import { fleck, hairline, polygon } from "../../../../engine/frame";
import type { Ramp } from "../../../../types/color";
import { scale, WHITE } from "../../../../utils/color";

/** the share of a crystal's width its middle facet takes, and how far up the white ridge starts */
const FACET = { middle: 0.3, ridgeFrom: 0.45 } as const;

/**
 * a crystal standing on (x, base), h tall and w to each side, its tip leaning by `lean`: a shaded face away from the
 * light at the upper right, a middle facet, a lit face, a white ridge near the tip and a dark edge on the shaded side.
 * `R` runs dark to light over at least six tones; `bright` dims the whole crystal and `a` dithers it away.
 */
export function drawCrystal(
  x: number,
  base: number,
  h: number,
  w: number,
  lean: number,
  R: Ramp,
  bright = 1,
  a = 1,
): void {
  if (h < 1 || a <= 0) return;
  const tip: [number, number] = [x + lean, base - h];
  const m = w * FACET.middle;
  polygon([[x - w, base], [x - m, base], tip], scale(R[2], bright), a);
  polygon([[x - m, base], [x + m, base], tip], scale(R[3], bright), a);
  polygon([[x + m, base], [x + w, base], tip], scale(R[4], bright), a);
  hairline(x - w, base, tip[0], tip[1], scale(R[1], bright), a);
  hairline(x + m, base, tip[0], tip[1], (u) => (u > FACET.ridgeFrom ? WHITE : R[5]), a);
  fleck(tip[0], tip[1], WHITE, a);
}

/**
 * a cut gem seen side on, centred on (x, y): `r` long along `angle` and `half` to each side, its upper facets lit, its
 * lower facets in shade, a white ridge down the middle
 */
export function drawGem(x: number, y: number, r: number, half: number, angle: number, R: Ramp, a = 1): void {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const nose: [number, number] = [x + c * r, y + s * r];
  const tail: [number, number] = [x - c * r * 0.7, y - s * r * 0.7];
  const one: [number, number] = [x - s * half, y + c * half];
  const other: [number, number] = [x + s * half, y - c * half];
  // the side that faces up the screen takes the light
  const upper = one[1] < other[1] ? one : other;
  const lower = upper === one ? other : one;
  polygon([nose, upper, tail], R[4], a);
  polygon([nose, lower, tail], R[2], a);
  hairline(tail[0], tail[1], nose[0], nose[1], (u) => (u > 0.5 ? WHITE : R[5]), a);
}
