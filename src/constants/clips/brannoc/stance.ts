import type { ActionClip, Pose } from "../../../types/pose";
import { grip } from "../../../utils/glaiveGrip";
import { frame, pose } from "../../hero";

/** the far hand rides the haft this far below the near hand */
export const GRIP = 5;

/**
 * His ready stance: heavy and planted, feet wide, chest forward, the great axe across his body in both hands with its
 * head up in front of his shoulder.
 */
export const STANCE: Pose = grip(
  pose({
    hx: -0.4,
    hy: -13.4,
    cb: 0.6,
    nx: 1.6,
    ny: -23.4,
    fx: 5,
    fy: -17,
    sa: -1.1,
    ffx: 4.6,
    bfx: -4.6,
  }),
  GRIP,
);

/** a pose that changes only some joints of his stance, both hands on the haft */
export const s = (p: Partial<Pose>, d = GRIP): Pose => grip({ ...STANCE, ...p }, d);

/** a pose with the far hand free of the haft, where the clip puts it */
export const free = (p: Partial<Pose>): Pose => ({ ...STANCE, ...p });

/** his idle: a slow, deep breath, the axe head rising and settling with the shoulders */
export const BRANNOC_IDLE: ActionClip = {
  dur: frame(48),
  hit: 0,
  keys: [
    [0, STANCE],
    [frame(12), s({ ny: -23.7, nx: 1.7, fy: -17.3, cb: 0.75 })],
    [frame(24), s({ ny: -23.9, nx: 1.7, fy: -17.5, cb: 0.85 })],
    [frame(36), s({ ny: -23.6, nx: 1.6, fy: -17.2, cb: 0.7 })],
    [frame(48), STANCE],
  ],
};

/** Bloodied: head low and shoulders forward, the axe in the near hand with its head dragging on the floor ahead */
const DRAG: Pose = free({
  hx: -0.6,
  hy: -12.8,
  cb: -0.4,
  nx: 3,
  ny: -22,
  fx: 6.5,
  fy: -12.5,
  sa: 0.78,
  bx: 0.5,
  by: -12.5,
  be: 1,
  ffx: 5,
  bfx: -5,
});

/** the Bloodied idle: a heaving 0.8 s breath, the shoulders rising and dropping over the dragging axe */
export const BLOODIED_IDLE: ActionClip = {
  dur: frame(24),
  hit: 0,
  keys: [
    [0, DRAG],
    [frame(6), { ...DRAG, ny: -22.7, nx: 2.7, fy: -12.9, by: -13, cb: -0.2 }],
    [frame(10), { ...DRAG, ny: -22.9, nx: 2.6, fy: -13, by: -13.2, cb: -0.1 }],
    [frame(16), { ...DRAG, ny: -22.2, nx: 2.9, fy: -12.6, by: -12.6 }],
    [frame(20), { ...DRAG, ny: -21.8, nx: 3.1, fy: -12.4, by: -12.3, cb: -0.5 }],
    [frame(24), DRAG],
  ],
};

/** the special gathering: crouched, the haft level across his chest in both fists, head down */
export const CHARGE_POSE: Pose = s(
  {
    hy: -11.6,
    cb: -0.6,
    nx: 2.4,
    ny: -21.2,
    fx: 7,
    fy: -17,
    sa: -0.25,
    ffx: 6,
    bfx: -6,
  },
  7,
);

/** walking and running he carries the axe on the near shoulder, its head up behind him */
export const SHOULDERED: Partial<Pose> = { fx: 4.2, fy: -20.5, sa: -2.05 };
