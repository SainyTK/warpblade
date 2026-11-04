import type { Pose } from "../../../types/pose";
import { grip } from "../../../utils/glaiveGrip";
import { pose } from "../../hero";

/**
 * Ysra at rest: a wide, heavy stance with the hips sunk, the shoulders a little forward, and the glaive held across
 * the body in both hands, blade high in front and butt low behind.
 */
export const Y_STAND: Pose = grip(
  pose({ hx: -0.5, hy: -13, cb: -0.5, nx: 1.5, ny: -23, fx: 6, fy: -16, sa: -0.85, ffx: 5, bfx: -5 }),
  6,
);

/** a pose that changes only some joints of her stance, with the far hand put back on the haft this far behind the near one */
export const y = (o: Partial<Pose>, d = 6): Pose => grip({ ...Y_STAND, ...o }, d);
/** a pose that changes only some joints of her stance, the far hand where the pose says, off the haft */
export const yFree = (o: Partial<Pose>): Pose => ({ ...Y_STAND, ...o });
