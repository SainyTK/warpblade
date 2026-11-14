import { HERO_COLORS as HC } from "../constants/palette";
import type { SpriteCanvas } from "../engine/sprite";
import type { Vec } from "../types/rig";

/** a point `d` pixels along a held item from the hand and `w` across it, toward its edge side */
export type Along = (d: number, w: number) => Vec;

/** the axis of an item held in `hand` and pointing along `angle` (radians): where each point along and across it lands */
export function heldAxis(hand: Readonly<Vec>, angle: number): Along {
  const ca = Math.cos(angle);
  const sn = Math.sin(angle);
  return (d, w) => [hand[0] + ca * d - sn * w, hand[1] + sn * d + ca * w];
}

/** a metal fitting (a guard, a pommel, a collar) in the trim colours, lit from the top left */
export function drawFitting(s: SpriteCanvas, draw: () => void): void {
  s.begin();
  draw();
  s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
  s.commit();
}
