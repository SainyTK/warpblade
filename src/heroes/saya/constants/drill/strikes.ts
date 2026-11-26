import { frame, pose } from "../../../../constants/hero";
import type { DrillStrike, DrillStrikeId } from "../../../../types/drill";
import { sampleKeys } from "../../../../utils/sampleKeys";
import { INK_RAMP } from "../../look/ramp";
import { BLADE_STATE } from "../blade";
import { AIR_CLIPS } from "../clips/air";
import { SAYA_POSES } from "../clips/poses";
import { STRING_CLIPS } from "../clips/string";

const { drawCut, returnCut, sheathe } = STRING_CLIPS;
const { airDraw } = AIR_CLIPS;
const at = (clip: { keys: Parameters<typeof sampleKeys>[0] }, n: number) => sampleKeys(clip.keys, frame(n));

const DRAW_LUNGE = { ...at(drawCut, 5), hx: 6, hy: -9.6, nx: 10.4, ny: -18.6, fx: 21, fy: -17.4, ffx: 16, bfx: -9 };
const RETURN_RISE = { ...at(returnCut, 5), hy: -13.4, ny: -24, cb: -0.8 };
const CLICK_LUNGE = pose({
  hx: 3,
  hy: -8.4,
  cb: 2,
  nx: 9,
  ny: -16.8,
  fx: 9.6,
  fy: -11.6,
  bx: 7.4,
  by: -10.8,
  ffx: 13,
  bfx: -10,
  bfy: -0.5,
  ba: 0.9,
  sa: -2.7,
  bs: BLADE_STATE.sheathed,
});
const CLICK_RISE = { ...SAYA_POSES.click, hy: -13, ny: -23, cb: -0.2 };

const INK = { ramp: INK_RAMP };

export const SAYA_STRIKES: Readonly<Record<DrillStrikeId, DrillStrike>> = {
  first: {
    hit: 0.085,
    duration: 0.29,
    reach: 40,
    height: 14,
    step: 7,
    next: "second",
    damage: 1,
    finisher: false,
    poses: { ready: SAYA_POSES.coil, load: at(drawCut, 4), cut: DRAW_LUNGE, finish: at(drawCut, 9), settle: 0.6 },
    arc: { ...INK, cx: 2, cy: -17, sy: 0.2, rot: 0.04, a0: -2.2, a1: 0.5, W: 9, sweep: 0.03, trail: 0.16 },
  },
  second: {
    hit: 0.075,
    duration: 0.26,
    reach: 36,
    height: 16,
    step: 2,
    next: "third",
    damage: 0.9,
    finisher: false,
    poses: { ready: at(drawCut, 13), load: at(returnCut, 4), cut: RETURN_RISE, finish: at(returnCut, 9), settle: 0.6 },
    arc: { ...INK, cx: 0, cy: -18, sy: 0.7, rot: 0.3, a0: 2.4, a1: -1.3, W: 10, sweep: 0.034 },
  },
  third: {
    hit: 0.12,
    duration: 0.4,
    reach: 32,
    height: 16,
    step: 10,
    next: null,
    damage: 1.3,
    finisher: true,
    poses: { ready: at(sheathe, 4), load: at(sheathe, 7), cut: CLICK_LUNGE, finish: CLICK_RISE, settle: 0.72 },
    arc: { ...INK, cx: 4, cy: -14, sy: 0.12, rot: 0, a0: -0.6, a1: 0.6, W: 13, hold: 0.06, trail: 0.22 },
  },
  air: {
    hit: 0.06,
    duration: 0.25,
    reach: 34,
    height: 24,
    step: 0,
    next: null,
    damage: 1,
    finisher: false,
    poses: { ready: at(airDraw, 0), load: at(airDraw, 3), cut: at(airDraw, 4), finish: at(airDraw, 9), settle: 0.52 },
    arc: { ...INK, cx: 4, cy: -17, sy: 0.85, rot: 0.2, a0: -1.6, a1: 1.5, W: 10, sweep: 0.036, trail: 0.12 },
  },
};
