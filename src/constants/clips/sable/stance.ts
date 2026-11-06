import type { Pose } from "../../../types/pose";
import { pose } from "../../hero";

/** the far hand under the fore-stock, this many pixels along the crossbow from the grip */
const FORE = 4.5;

/** the pose with the far hand put under the crossbow's fore-stock */
export function hold(p: Pose): Pose {
  return { ...p, bx: p.fx + Math.cos(p.sa) * FORE, by: p.fy + Math.sin(p.sa) * FORE + 0.5 };
}

/** a pose that changes only some joints of the stand, with both hands on the crossbow */
export const s = (o: Partial<Pose>): Pose => hold(pose(o));

/** the legs of a shot or a kick in the air: tucked under her */
export const AIR_LEGS = { ffx: 4, ffy: -5, fa: 0.3, bfx: -3, bfy: -3, ba: 0.4 } as const;

/** Sable's stance at each aim, the crossbow shouldered and level with the eye line, the feet set wide and light */
export const AIM_STANCE = {
  level: s({ hx: -1, hy: -13.5, nx: 1.5, ny: -23.5, cb: 0.5, fx: 6, fy: -18, sa: 0, ffx: 5, bfx: -5, ba: 0.15 }),
  up: s({ hx: -1.5, hy: -13.5, nx: 0, ny: -23.5, cb: 1, fx: 5, fy: -21, sa: -0.5, ffx: 5, bfx: -5, ba: 0.15 }),
  /** kneeling: the near knee up, the far knee on the floor */
  low: s({ hx: -2, hy: -8, nx: 1, ny: -18, cb: 0.5, fx: 6, fy: -11, sa: 0, ffx: 6, bfx: -6, bfy: -0.5, ba: 1.2 }),
  /** slanted down in the air */
  air: s({ hx: -1, hy: -14, nx: 1, ny: -24, cb: 0.5, fx: 5, fy: -17, sa: 0.62, ...AIR_LEGS }),
} as const;

/** at rest: the crossbow carried low across the body, pointed at the floor ahead */
export const SABLE_STAND = s({ hx: -0.5, hy: -13.5, nx: 1, ny: -23.5, fx: 5, fy: -15, sa: 0.45, ffx: 4, bfx: -4 });
