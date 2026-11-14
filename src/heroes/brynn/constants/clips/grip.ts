import { pose } from "../../../../constants/hero";
import type { Pose } from "../../../../types/pose";

/** the far hand holds the grip this many pixels behind the near hand, toward the pommel */
const GRIP = 3.2;
/** Anvilheart on her shoulder: the near hand this far ahead of and below the neck, the blade up and back over the
 *  shoulder at this angle, and the blade state that draws it behind her body */
export const SHOULDER = { dx: 6.5, dy: 4, sa: -2.66, bs: 1 } as const;

/** both hands on the grip: the far hand set on it behind the near one, wherever the near hand and the blade point */
export function grip(o: Partial<Pose>): Pose {
  const p = pose(o);
  return { ...p, bx: p.fx - Math.cos(p.sa) * GRIP, by: p.fy - Math.sin(p.sa) * GRIP };
}

/** the same body with Anvilheart resting on the shoulder in the near hand; the far arm keeps its own swing */
export function shouldered(p: Pose, lift = 0): Pose {
  return {
    ...p,
    fx: p.nx + SHOULDER.dx,
    fy: p.ny + SHOULDER.dy - lift,
    fe: 0,
    sa: SHOULDER.sa - lift * 0.05,
    bs: SHOULDER.bs,
  };
}
