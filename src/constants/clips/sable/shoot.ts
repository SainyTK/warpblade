import type { ActionClip, Pose } from "../../../types/pose";
import { frame } from "../../hero";
import { hold } from "./stance";

/**
 * One shot from a stance: the shoulders brace forward a hair, the string lets go with a snap that kicks the crossbow up
 * and the body back, then the stance settles back to where it began so held shots chain without a seam.
 */
export function shootClip(stance: Pose): ActionClip {
  const at = (o: Partial<Pose>): Pose => hold({ ...stance, ...o });
  const { nx, fx, fy, sa, hx } = stance;
  return {
    dur: frame(8),
    hit: frame(2),
    keys: [
      [0, stance],
      [frame(1), at({ nx: nx + 0.5, fx: fx + 0.5 })],
      [frame(2), at({ nx: nx - 1, hx: hx - 0.5, fx: fx - 1.5, fy: fy - 1, sa: sa - 0.22 }), "snap"],
      [frame(4), at({ nx: nx - 0.5, fx: fx - 1, fy: fy - 0.5, sa: sa - 0.1 })],
      [frame(6), at({ nx: nx - 0.25, fx: fx - 0.5, sa: sa - 0.04 })],
      [frame(8), stance],
    ],
  };
}
