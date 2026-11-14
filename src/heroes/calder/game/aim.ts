import { hero } from "../../../game/state";
import type { Vec } from "../../../types/rig";
import { MUZZLE } from "../constants/sword";

/** a point on the held sword in the world, `d` along it from the hand and `w` across it, with the sword at angle `sa` */
export function swordPoint(d: number, w: number, sa: number): Vec {
  const h = hero;
  const ca = Math.cos(sa);
  const sn = Math.sin(sa);
  return [h.x + h.face * (h.hand[0] + ca * d - sn * w), h.y + h.hand[1] + sn * d + ca * w];
}

/** the muzzle in the world, with the sword at angle `sa` */
export const muzzlePoint = (sa: number): Vec => swordPoint(MUZZLE.d, MUZZLE.w, sa);
