import { frame } from "../../../../constants/hero";
import type { DrillStrike, DrillStrikeId } from "../../../../types/drill";
import type { ActionClip, Pose } from "../../../../types/pose";
import { sampleKeys } from "../../../../utils/sampleKeys";
import { AIR_CLIPS } from "../clips/air";
import { STRING_CLIPS } from "../clips/string";
import { DAWN_RAMP } from "../light";

const forward = (sample: Pose, shield: number): Pose => ({ ...sample, bx: sample.bx + shield });

const posesOf = (clip: ActionClip, finishFrame: number, settle: number, shield: number) => ({
  ready: forward(sampleKeys(clip.keys, 0), shield),
  load: forward(sampleKeys(clip.keys, clip.hit - frame(1)), shield),
  cut: forward(sampleKeys(clip.keys, clip.hit), shield),
  finish: forward(sampleKeys(clip.keys, frame(finishFrame)), shield),
  settle,
});

export const ALDRIC_STRIKES: Readonly<Record<DrillStrikeId, DrillStrike>> = {
  first: {
    hit: 0.09,
    duration: 0.31,
    reach: 33,
    height: 14,
    step: 4,
    next: "second",
    damage: 1.1,
    finisher: false,
    poses: posesOf(STRING_CLIPS.oathCut, 9, 0.64, 3.5),
    arc: { cx: 4, cy: -19, sy: 0.8, rot: -0.15, a0: -1.7, a1: 1.1, W: 12, ramp: DAWN_RAMP },
  },
  second: {
    hit: 0.085,
    duration: 0.3,
    reach: 27,
    height: 16,
    step: 9,
    next: "third",
    damage: 0.9,
    finisher: false,
    poses: posesOf(STRING_CLIPS.shieldBash, 9, 0.62, 1),
    arc: { cx: 9, cy: -18, sy: 0.28, rot: 0, a0: -1.3, a1: 1.3, W: 10, sweep: 0.03, ramp: DAWN_RAMP },
  },
  third: {
    hit: 0.14,
    duration: 0.42,
    reach: 38,
    height: 16,
    step: 10,
    next: null,
    damage: 2.1,
    finisher: true,
    poses: posesOf(STRING_CLIPS.crestBreaker, 12, 0.72, 3),
    arc: { cx: 4, cy: -24, sy: 0.72, rot: 0.15, a0: -3.1, a1: 1.05, W: 15, hold: 0.06, ramp: DAWN_RAMP },
  },
  air: {
    hit: 0.07,
    duration: 0.28,
    reach: 32,
    height: 22,
    step: 0,
    next: null,
    damage: 1.05,
    finisher: false,
    poses: posesOf(AIR_CLIPS.skyCut, 9, 0.52, 3.5),
    arc: { cx: 5, cy: -17, sy: 0.88, rot: -0.1, a0: -1.9, a1: 1.3, W: 11, sweep: 0.036, trail: 0.11, ramp: DAWN_RAMP },
  },
};
