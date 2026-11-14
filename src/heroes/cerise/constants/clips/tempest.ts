import { frame, pose } from "../../../../constants/hero";
import type { ActionClip, Pose, PoseKeyframe } from "../../../../types/pose";
import { TEMPEST } from "../tempest";
import { EN_GARDE } from "./base";

const g = (o: Partial<Pose>): Pose => pose({ ...EN_GARDE, ...o });

/** the storm's stance: planted wide and low, the off hand back at the hip */
const STORM = { hx: 0, hy: -11.5, nx: 3, ny: -21.5, cb: 0.5, bx: -5, by: -15, ffx: 8, bfx: -7, ba: 0.4 } as const;
/** the storm's thrust heights in turn */
const HEIGHTS = [-18, -22, -15, -20, -16, -23, -17] as const;

function tempestKeys(): PoseKeyframe[] {
  const keys: PoseKeyframe[] = [[0, g({ ...STORM, fx: 4, fy: -19, sa: -0.1, nx: 1 })]];
  for (let i = 0; i < TEMPEST.thrusts; i++) {
    const at = TEMPEST.start + i * TEMPEST.gap;
    const fy = HEIGHTS[i % HEIGHTS.length];
    keys.push([at, g({ ...STORM, fx: 19, fy, sa: (fy + 18.5) * 0.08, nx: 4 }), "snap"]);
    keys.push([at + TEMPEST.gap * 0.6, g({ ...STORM, fx: 12, fy, sa: (fy + 18.5) * 0.04 })]);
  }
  const coil = TEMPEST.lungeAt - frame(3);
  keys.push([
    coil,
    g({ hx: -3, hy: -11.5, nx: -3.5, ny: -21.5, cb: -1, fx: 3, fy: -19, sa: -0.15, bx: -6, by: -26, ffx: 6, bfx: -7 }),
  ]);
  keys.push([
    TEMPEST.lungeAt - 0.001,
    g({
      hx: -3.2,
      hy: -11.3,
      nx: -3.8,
      ny: -21.3,
      cb: -1.1,
      fx: 2.5,
      fy: -19,
      sa: -0.15,
      bx: -6,
      by: -26.5,
      ffx: 6,
      bfx: -7,
    }),
  ]);
  const lunge = g({
    hx: 4.5,
    hy: -9,
    nx: 10,
    ny: -18,
    cb: 0.4,
    fx: 23,
    fy: -16,
    sa: 0.03,
    bx: -7,
    by: -10.5,
    ffx: 15,
    bfx: -12,
    ba: 0.55,
  });
  keys.push([TEMPEST.lungeAt, lunge, "snap"]);
  keys.push([TEMPEST.lungeAt + frame(5), { ...lunge, fx: 23.5, nx: 10.3 }]);
  keys.push([
    TEMPEST.dur - frame(3),
    g({ hx: 2, hy: -11.5, nx: 5, ny: -21, fx: 15, fy: -17.5, sa: 0, bx: -7, by: -16, ffx: 11, bfx: -7, ba: 0.35 }),
  ]);
  keys.push([TEMPEST.dur, g({ ffx: 8, bfx: -5 })]);
  return keys;
}

/** Rose Tempest: a storm of thrusts from a planted stance, a deep coil, then the lunge along the line */
export const TEMPEST_CLIP: ActionClip = { dur: TEMPEST.dur, hit: TEMPEST.start, keys: tempestKeys() };
