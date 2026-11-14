import { frame, pose } from "../../../../constants/hero";
import type { ActionClip, Pose, PoseKeyframe } from "../../../../types/pose";
import { FLURRY, ROSE_LINE } from "../abilities";
import { EN_GARDE } from "./base";

const g = (o: Partial<Pose>): Pose => pose({ ...EN_GARDE, ...o });

/** the Flurry's thrust heights, in turn, so the point fans through the cone: chest, high, low, middle */
const FAN = [
  { fy: -18, sa: 0 },
  { fy: -20, sa: -0.32 },
  { fy: -16, sa: 0.3 },
  { fy: -19, sa: -0.12 },
  { fy: -17, sa: 0.16 },
] as const;
/** the Flurry's stance: low, square to the foe, the off hand tucked at the hip */
const FLURRY_STANCE = {
  hx: 0.5,
  hy: -12,
  nx: 2.5,
  ny: -22,
  cb: 0.4,
  bx: -4,
  by: -15,
  ffx: 7,
  bfx: -6,
  ba: 0.35,
} as const;

/** one extension and one draw-back per thrust, two frames apart on the 30 fps clock, for the longest Flurry */
function flurryKeys(): PoseKeyframe[] {
  const keys: PoseKeyframe[] = [
    [0, EN_GARDE],
    [frame(2), g({ ...FLURRY_STANCE, fx: 4, fy: -18, sa: -0.05, nx: 1, hx: -0.5 })],
  ];
  const total = FLURRY.wideCount + FLURRY.perPoint * 2;
  for (let i = 0; i < total; i++) {
    const at = FLURRY.start + i * FLURRY.gap;
    const fan = FAN[i % FAN.length];
    keys.push([at, g({ ...FLURRY_STANCE, fx: 18, fy: fan.fy, sa: fan.sa, nx: 3.5 }), "snap"]);
    keys.push([at + FLURRY.gap * 0.6, g({ ...FLURRY_STANCE, fx: 12, fy: fan.fy + 0.5, sa: fan.sa * 0.5 })]);
  }
  const end = FLURRY.start + total * FLURRY.gap;
  keys.push([end + FLURRY.tail, EN_GARDE]);
  return keys;
}

/** the Flurry: a stance square to the foe and a blur of thrusts fanning through the cone */
export const FLURRY_CLIP: ActionClip = {
  dur: FLURRY.start + (FLURRY.wideCount + FLURRY.perPoint * 2) * FLURRY.gap + FLURRY.tail,
  hit: FLURRY.start,
  keys: flurryKeys(),
};

/** Rose Line: the point drawn back past the ear and held, then one long thrust that lets the line go off the point */
export const LINE_CLIP: ActionClip = {
  dur: ROSE_LINE.dur,
  hit: ROSE_LINE.release,
  keys: [
    [0, EN_GARDE],
    [
      frame(2),
      g({
        hx: -2,
        hy: -12.5,
        nx: -2.5,
        ny: -22.5,
        cb: -0.8,
        fx: 0,
        fy: -22,
        sa: -0.05,
        bx: 2,
        by: -19,
        ffx: 6,
        bfx: -6,
      }),
    ],
    [
      ROSE_LINE.release - 0.001,
      g({
        hx: -2.3,
        hy: -12.3,
        nx: -2.8,
        ny: -22.3,
        cb: -1,
        fx: -0.5,
        fy: -22.5,
        sa: -0.05,
        bx: 2.5,
        by: -19,
        ffx: 6,
        bfx: -6,
      }),
    ],
    [
      ROSE_LINE.release,
      g({
        hx: 2.5,
        hy: -11.5,
        nx: 6.5,
        ny: -21,
        cb: 0.6,
        fx: 21,
        fy: -18.5,
        sa: 0,
        bx: -8,
        by: -16,
        ffx: 11,
        bfx: -6,
        ba: 0.5,
      }),
      "snap",
    ],
    [
      ROSE_LINE.release + frame(4),
      g({
        hx: 2.7,
        hy: -11.4,
        nx: 6.8,
        ny: -20.9,
        cb: 0.7,
        fx: 21.5,
        fy: -18.3,
        sa: 0.01,
        bx: -8,
        by: -15.5,
        ffx: 11,
        bfx: -6,
        ba: 0.5,
      }),
    ],
    [ROSE_LINE.dur, g({ ffx: 8, bfx: -5 })],
  ],
};
