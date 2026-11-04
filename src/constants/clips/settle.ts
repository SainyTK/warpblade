import type { ActionClip } from "../../types/pose";
import { frame, pose, STAND } from "../hero";

/**
 * Kael's recoveries, played over his free states by his pose layer. The landing takes the fall's last pose onto bent
 * knees, sinks into the weight with the arms dropping, and rises back into the stand his idle starts from.
 */
export const SETTLE_CLIPS = {
  land: {
    dur: frame(7),
    hit: 0,
    keys: [
      [
        0,
        pose({ hy: -12.5, nx: 2, ny: -22.5, fx: 8, fy: -17, bx: -6.5, by: -18.5, ffx: 4, fa: 0.1, bfx: -4, sa: 0.95 }),
      ],
      [
        frame(2),
        pose({
          hx: 0.5,
          hy: -10.5,
          cb: 1,
          nx: 3,
          ny: -20.5,
          fx: 7.5,
          fy: -13.5,
          bx: -4.5,
          by: -15,
          ffx: 4.5,
          bfx: -4.5,
          ba: 0.2,
          sa: 1.05,
        }),
      ],
      [
        frame(4),
        pose({
          hy: -12.5,
          cb: 0.5,
          nx: 1.5,
          ny: -22.5,
          fx: 6.5,
          fy: -14,
          bx: -3.5,
          by: -14.5,
          ffx: 3.5,
          bfx: -3.5,
          sa: 1.1,
        }),
      ],
      [frame(7), STAND],
    ],
  },
} satisfies Record<string, ActionClip>;
