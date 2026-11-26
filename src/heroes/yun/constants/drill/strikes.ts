import { frame } from "../../../../constants/hero";
import type { DrillStrike, DrillStrikeId } from "../../../../types/drill";
import type { ActionClip } from "../../../../types/pose";
import { sampleKeys } from "../../../../utils/sampleKeys";
import { AIR_CLIPS } from "../clips/air";
import { STRING_CLIPS } from "../clips/string";

const posesOf = (clip: ActionClip, finish: number, settle: number) => ({
  ready: sampleKeys(clip.keys, 0),
  load: sampleKeys(clip.keys, clip.hit - frame(1)),
  cut: sampleKeys(clip.keys, clip.hit),
  finish: sampleKeys(clip.keys, frame(finish)),
  settle,
});

export const YUN_STRIKES: Readonly<Record<DrillStrikeId, DrillStrike>> = {
  first: {
    hit: 0.085,
    duration: 0.3,
    reach: 34,
    height: 14,
    step: 6,
    next: "second",
    damage: 0.95,
    finisher: false,
    poses: posesOf(STRING_CLIPS.willow, 9, 0.64),
    arc: { cx: 4, cy: -18, sy: 0.62, rot: 0.12, a0: -2.2, a1: 0.95, W: 11, trail: 0.16 },
  },
  second: {
    hit: 0.095,
    duration: 0.31,
    reach: 38,
    height: 14,
    step: 2,
    next: "third",
    damage: 1,
    finisher: false,
    poses: posesOf(STRING_CLIPS.crane, 10, 0.64),
    arc: { cx: 0, cy: -17, sy: 0.26, rot: 0, a0: 3.5, a1: -0.3, W: 9, sweep: 0.04, trail: 0.18 },
  },
  third: {
    hit: 0.125,
    duration: 0.4,
    reach: 40,
    height: 16,
    step: 10,
    next: null,
    damage: 1.75,
    finisher: true,
    poses: posesOf(STRING_CLIPS.tide, 11, 0.7),
    arc: { cx: 3, cy: -22, sy: 0.82, rot: 0.2, a0: -3.3, a1: 1.05, W: 14, hold: 0.06, trail: 0.22 },
  },
  air: {
    hit: 0.07,
    duration: 0.28,
    reach: 34,
    height: 22,
    step: 0,
    next: null,
    damage: 1,
    finisher: false,
    poses: posesOf(AIR_CLIPS.drift, 8, 0.52),
    arc: { cx: 4, cy: -17, sy: 0.85, rot: -0.1, a0: -2.1, a1: 1.4, W: 11, sweep: 0.04, trail: 0.14 },
  },
};
