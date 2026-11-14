import { frame, pose } from "../../../../constants/hero";
import type { ActionClip, Pose } from "../../../../types/pose";

/** the four quarters of a turn in the air, knees tucked: blade out in front, back turned, blade out behind, turning back */
const OUT = pose({
  hy: -16,
  nx: 3,
  ny: -25.5,
  fx: 15,
  fy: -20,
  sa: 0.1,
  bx: -7,
  by: -21,
  ffx: 4,
  ffy: -5,
  bfx: -4,
  bfy: -3,
});
const TURNED = pose({
  tw: 1,
  hy: -16,
  nx: -1,
  ny: -25,
  fx: -4,
  fy: -21,
  sa: 3.0,
  bx: 4,
  by: -20,
  ffx: 3,
  ffy: -5,
  bfx: -3,
  bfy: -4,
});
const BEHIND = pose({ ...OUT, mr: 1 });
const TURNING = pose({ ...TURNED, mr: 1 });
const TURN: readonly Pose[] = [TURNED, OUT, TURNING, BEHIND];

/**
 * The spinning descent: tucked, he turns over and over as he drops, the blade out on each side in turn, a cut on every
 * half turn (frames 2, 6, 10, 14 and 18); it lasts until he lands, where a ring of sand cuts both sides.
 */
export const AIR_CLIPS = {
  spinDrop: {
    dur: frame(24),
    hit: frame(2),
    keys: Array.from({ length: 13 }, (_, i) => [frame(i * 2), TURN[i % TURN.length]] as const),
  },
} satisfies Record<string, ActionClip>;
