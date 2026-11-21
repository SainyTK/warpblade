import { frame } from "../../../../constants/hero";
import type { DrillStrike, DrillStrikeId } from "../../../../types/drill";
import type { ActionClip } from "../../../../types/pose";
import { sampleKeys } from "../../../../utils/sampleKeys";
import { AIR_CLIPS } from "../clips/air";
import { STRING_CLIPS } from "../clips/string";

const posesOf = (clip: ActionClip, load: number, finish: number, settle: number) => ({
  ready: sampleKeys(clip.keys, 0),
  load: sampleKeys(clip.keys, frame(load)),
  cut: sampleKeys(clip.keys, clip.hit),
  finish: sampleKeys(clip.keys, frame(finish)),
  settle,
});

export const CALDER_STRIKES: Readonly<Record<DrillStrikeId, DrillStrike>> = {
  first: {
    hit: 0.09,
    duration: 0.33,
    reach: 36,
    height: 16,
    step: 5,
    next: "second",
    damage: 1.15,
    finisher: false,
    poses: posesOf(STRING_CLIPS.hew, 3, 9, 0.6),
    arc: { cx: 4, cy: -21, sy: 0.86, rot: -0.3, a0: -2.2, a1: 1.2, W: 14 },
  },
  second: {
    hit: 0.085,
    duration: 0.31,
    reach: 37,
    height: 16,
    step: 2,
    next: "third",
    damage: 1.2,
    finisher: false,
    poses: posesOf(STRING_CLIPS.rip, 3, 9, 0.6),
    arc: { cx: 2, cy: -16, sy: 0.7, rot: 0.2, a0: 1.6, a1: -1.9, W: 12, sweep: 0.04 },
  },
  third: {
    hit: 0.14,
    duration: 0.44,
    reach: 40,
    height: 20,
    step: 9,
    next: null,
    damage: 2,
    finisher: true,
    poses: posesOf(STRING_CLIPS.breaker, 4, 12, 0.68),
    arc: { cx: 6, cy: -24, sy: 1, rot: 0.05, a0: -3.3, a1: 0.7, W: 16, hold: 0.07 },
  },
  air: {
    hit: 0.07,
    duration: 0.28,
    reach: 34,
    height: 24,
    step: 0,
    next: null,
    damage: 1.15,
    finisher: false,
    poses: posesOf(AIR_CLIPS.airHew, 3, 9, 0.52),
    arc: { cx: 5, cy: -17, sy: 0.9, rot: -0.15, a0: -2, a1: 1.4, W: 12, sweep: 0.04, trail: 0.12 },
  },
};
