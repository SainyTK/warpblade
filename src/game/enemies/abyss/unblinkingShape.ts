import type { UnblinkingPose } from "./unblinkingPose";

/**
 * The Unblinking's shape in its own art pixels, from the middle of the eye on screen (+x right, +y down), before the
 * body's breath, squash and shiver are applied.
 */

/** the hide around the eye, an almond: half its width, how far it reaches above and below the middle, and how pointed its corners are */
export const BODY = { x: 24, top: 17, bottom: 15, point: 0.6 } as const;
/**
 * the opening between the lids: half its width, where the upper and lower lid edges sit at rest, how pointed its
 * corners are, and how far below the middle the shut lids meet
 */
export const OPENING = { x: 19.5, up: 11.5, low: 9, point: 0.75, seam: 3 } as const;
/** the eyeball behind the lids: the sphere's radius and its middle's height */
export const BALL = { r: 21, y: 0.5 } as const;
/** the iris's radius, and the share of its width it loses to the eyeball's curve at the far edge of its reach */
export const IRIS = { r: 9, foreshorten: 0.2 } as const;

/** how far from the middle line an almond of this half width and pointedness reaches at x, as a share of its full reach */
export const almond = (x: number, half: number, point: number): number => {
  const k = 1 - (x / half) ** 2;
  return k > 0 ? k ** point : 0;
};

export const bodyTop = (x: number): number => -BODY.top * almond(x, BODY.x, BODY.point);
export const bodyBottom = (x: number): number => BODY.bottom * almond(x, BODY.x, BODY.point);

/** where the shut lids meet at x */
const seam = (x: number): number => OPENING.seam * almond(x, OPENING.x, OPENING.point);
/** the lower lid follows the upper one down only over the last part of a close */
const LOWER_FOLLOWS = 0.3;

/** the upper lid's edge at x: on the seam when shut, at its rest line when open is 1, higher still when pulled back */
export function lidUpper(x: number, p: UnblinkingPose): number {
  const f = almond(x, OPENING.x, OPENING.point);
  return seam(x) + (-OPENING.up * f - seam(x)) * p.open;
}

/** the lower lid's edge at x */
export function lidLower(x: number, p: UnblinkingPose): number {
  const f = almond(x, OPENING.x, OPENING.point);
  const follow = Math.min(1, p.open / LOWER_FOLLOWS);
  return seam(x) + (OPENING.low * f * p.low - seam(x)) * follow;
}

/** where the body sits and how it is squashed: the middle's offset, and its scale across and up */
export interface BodyFrame {
  x: number;
  y: number;
  sx: number;
  sy: number;
}
