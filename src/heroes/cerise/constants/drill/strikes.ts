import { frame } from "../../../../constants/hero";
import type { DrillStrike, DrillStrikeId } from "../../../../types/drill";
import type { ActionClip } from "../../../../types/pose";
import { sampleKeys } from "../../../../utils/sampleKeys";
import { AIR_CLIPS } from "../clips/air";
import { STRING_CLIPS } from "../clips/string";

const posesOf = (clip: ActionClip, settle: number) => ({
  ready: sampleKeys(clip.keys, 0),
  load: sampleKeys(clip.keys, frame(3)),
  cut: sampleKeys(clip.keys, clip.hit),
  finish: sampleKeys(clip.keys, frame(8)),
  settle,
});

const THRUST_ARC = { cx: 6, cy: -18, sy: 0.16, rot: 0, a0: -0.42, a1: 0.3, W: 5, sweep: 0.03, trail: 0.1 };

export const CERISE_STRIKES: Readonly<Record<DrillStrikeId, DrillStrike>> = {
  first: {
    hit: 0.07,
    duration: 0.26,
    reach: 38,
    height: 12,
    step: 4,
    next: "second",
    damage: 0.9,
    finisher: false,
    poses: posesOf(STRING_CLIPS.thrust1, 0.62),
    arc: THRUST_ARC,
  },
  second: {
    hit: 0.07,
    duration: 0.24,
    reach: 40,
    height: 12,
    step: 3,
    next: "third",
    damage: 0.9,
    finisher: false,
    poses: posesOf(STRING_CLIPS.thrust2, 0.62),
    arc: { ...THRUST_ARC, cy: -16 },
  },
  third: {
    hit: 0.11,
    duration: 0.36,
    reach: 46,
    height: 13,
    step: 14,
    next: null,
    damage: 1.7,
    finisher: true,
    poses: posesOf(STRING_CLIPS.lunge, 0.7),
    arc: { ...THRUST_ARC, cy: -15, W: 7, hold: 0.05 },
  },
  air: {
    hit: 0.058,
    duration: 0.25,
    reach: 36,
    height: 22,
    step: 0,
    next: null,
    damage: 1,
    finisher: false,
    poses: posesOf(AIR_CLIPS.airThrust, 0.52),
    arc: { ...THRUST_ARC, cy: -14, rot: 0.35 },
  },
};
