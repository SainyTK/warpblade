import { GUARD_TIMES } from "../../../../constants/combat";
import { frame, pose } from "../../../../constants/hero";
import type { ActionClip, Pose, PoseKeyframe } from "../../../../types/pose";
import { lerp } from "../../../../utils/math";
import { key, SHIELD_UP } from "./key";

/**
 * Aldric at rest, b the breath from 0 out to 1 in: the shield grounded on its point in front of his far leg, the sword
 * lowered at his side, weight back on the rear foot and the chest up.
 */
const rest = (b: number): Pose =>
  pose({
    ...SHIELD_UP,
    oa: 1.62,
    hx: -0.5,
    hy: lerp(-14, -14.3, b),
    cb: lerp(0.5, 0.9, b),
    nx: lerp(0.5, 0.7, b),
    ny: lerp(-24, -24.6, b),
    fx: 8,
    fy: lerp(-14.5, -14.8, b),
    sa: 1.32,
    bx: 4.5,
    by: lerp(-12.5, -12.8, b),
    ffx: 4,
    bfx: -4,
    ba: 0.1,
  });

/** the calm breath on every second frame: a slow rise and fall that loops */
const BREATH = [0, 0.15, 0.4, 0.7, 0.9, 1, 0.95, 0.8, 0.6, 0.4, 0.22, 0.08] as const;
export const ALDRIC_IDLE: ActionClip = {
  dur: frame(BREATH.length * 4),
  hit: 0,
  keys: BREATH.map((b, i): PoseKeyframe => [frame(i * 4), rest(b)]),
};

/** hurt and short of breath: bowed over the grounded shield, both hands weighing on it, the sword point on the floor */
const wounded = (b: number): Pose =>
  pose({
    ...SHIELD_UP,
    oa: 1.6,
    hx: -0.5,
    hy: lerp(-11.8, -12.4, b),
    cb: lerp(-2, -1, b),
    nx: lerp(3.5, 2.8, b),
    ny: lerp(-20.5, -22, b),
    fx: 8.5,
    fy: -13,
    sa: 1.45,
    bx: lerp(5.5, 5, b),
    by: lerp(-12, -12.6, b),
    ffx: 4,
    bfx: -4.5,
  });
const GASPS = [0, 0.35, 0.75, 1, 0.85, 0.6, 0.35, 0.12, 0.05, 0.4, 0.8, 1, 0.7, 0.3] as const;
export const ALDRIC_WOUNDED_IDLE: ActionClip = {
  dur: frame(GASPS.length * 2),
  hit: 0,
  keys: GASPS.map((b, i): PoseKeyframe => [frame(i * 2), wounded(b)]),
};

/** his jump loads into this: knees bent over the shield, sword low */
export const ALDRIC_CROUCH: Pose = pose({
  ...SHIELD_UP,
  hx: 0,
  hy: -10.5,
  cb: 1,
  nx: 2.5,
  ny: -20.5,
  fx: 8,
  fy: -12,
  sa: 1.1,
  bx: 5.5,
  by: -13,
  ffx: 4.5,
  bfx: -4.5,
});

/** the guard held: sunk behind the raised kite shield, the sword cocked over its top edge, point toward the foe */
export const GUARD_HOLD = {
  ...SHIELD_UP,
  oa: 1.52,
  hx: -1,
  hy: -12.5,
  cb: 0.5,
  nx: 1,
  ny: -22.5,
  fx: 4,
  fy: -15,
  sa: 0.12,
  bx: 7,
  by: -19,
  ffx: 6,
  bfx: -6,
  ba: 0.3,
} as const;
const t = GUARD_TIMES;

/**
 * The guard in the shared segments: the shield snapped up; held, breathing; the jolt of a block, driven onto the rear
 * foot with the shield pressed in; the parry, the shield thrown out into the Stun bash and pulled back.
 */
export const ALDRIC_GUARD_CLIP: ActionClip = {
  dur: t.parryEnd,
  hit: 0,
  keys: [
    [0, pose({ ...GUARD_HOLD, hy: -13.5, ny: -23.5, bx: 4, by: -16, fx: 6, fy: -18, sa: 0.3 })],
    [t.loopFrom, pose(GUARD_HOLD), "snap"],
    [frame(16), pose({ ...GUARD_HOLD, ny: -23, cb: 1, by: -18.5, fy: -15.5 })],
    [frame(32), pose({ ...GUARD_HOLD, hy: -12, ny: -22.4 })],
    [t.loopTo - 0.001, pose(GUARD_HOLD)],
    [t.block, pose({ ...GUARD_HOLD, hx: -2.5, cb: -0.5, nx: -1, bx: 5, by: -17.5, fx: 3, bfx: -7, ba: 0.6 }), "snap"],
    [t.block + frame(3), pose({ ...GUARD_HOLD, hx: -2, nx: 0, bx: 6, bfx: -7, ba: 0.5 })],
    [t.blockEnd - 0.001, pose(GUARD_HOLD)],
    [t.parry, pose({ ...GUARD_HOLD, hx: 1.5, nx: 5, ny: -23, bx: 13, by: -19, oa: 1.4, ffx: 9 }), "snap"],
    [t.parry + frame(3), pose({ ...GUARD_HOLD, hx: 2, nx: 5.5, bx: 13.5, by: -18.5, oa: 1.35, ffx: 9.5 })],
    [t.parry + frame(7), pose({ ...GUARD_HOLD, hx: 0.5, nx: 3, bx: 9.5, ffx: 7.5 })],
    [t.parryEnd, pose(GUARD_HOLD)],
  ],
};

/** the ultimate gathering: the sword raised straight up behind the shield, which he holds before him */
export const ALDRIC_CHARGE: ActionClip = {
  dur: frame(16),
  hit: 0,
  keys: [
    key(0, { ...SHIELD_UP, hy: -13, nx: 1, ny: -23, fx: 3, fy: -33, sa: -1.57, bx: 7, by: -17, ffx: 5, bfx: -5 }),
    key(8, {
      ...SHIELD_UP,
      hy: -12.5,
      nx: 1,
      ny: -22.5,
      fx: 3,
      fy: -33.5,
      sa: -1.57,
      bx: 7,
      by: -16.5,
      ffx: 5,
      bfx: -5,
    }),
    key(16, { ...SHIELD_UP, hy: -13, nx: 1, ny: -23, fx: 3, fy: -33, sa: -1.57, bx: 7, by: -17, ffx: 5, bfx: -5 }),
  ],
};
