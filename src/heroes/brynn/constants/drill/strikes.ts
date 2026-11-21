import { frame } from "../../../../constants/hero";
import type { DrillStrike, DrillStrikeId } from "../../../../types/drill";
import type { SlashShape } from "../../../../types/effect";
import type { ActionClip } from "../../../../types/pose";
import { sampleKeys } from "../../../../utils/sampleKeys";
import { BRYNN_AIR_CLIPS } from "../clips/air";
import { BRYNN_STRING_CLIPS } from "../clips/string";
import { SLASH } from "../slashes";

const posesOf = (clip: ActionClip, load: number, finish: number, settle: number) => ({
  ready: sampleKeys(clip.keys, 0),
  load: sampleKeys(clip.keys, frame(load)),
  cut: sampleKeys(clip.keys, clip.hit),
  finish: sampleKeys(clip.keys, frame(finish)),
  settle,
});

const arcOf = ({ R: _radius, ...shape }: SlashShape): Omit<SlashShape, "R"> => shape;

export const BRYNN_STRIKES: Readonly<Record<DrillStrikeId, DrillStrike>> = {
  first: {
    hit: 0.12,
    duration: 0.4,
    reach: 44,
    height: 17,
    step: 5,
    next: "second",
    damage: 1.3,
    finisher: false,
    poses: posesOf(BRYNN_STRING_CLIPS.sweep, 5, 12, 0.6),
    arc: arcOf(SLASH.sweep),
  },
  second: {
    hit: 0.12,
    duration: 0.4,
    reach: 38,
    height: 28,
    step: 4,
    next: "third",
    damage: 1.35,
    finisher: false,
    poses: posesOf(BRYNN_STRING_CLIPS.heave, 5, 12, 0.62),
    arc: arcOf(SLASH.heave),
  },
  third: {
    hit: 0.17,
    duration: 0.54,
    reach: 46,
    height: 30,
    step: 15,
    next: null,
    damage: 2.4,
    finisher: true,
    poses: posesOf(BRYNN_STRING_CLIPS.slam, 7, 15, 0.7),
    arc: arcOf(SLASH.slam),
  },
  air: {
    hit: 0.1,
    duration: 0.34,
    reach: 34,
    height: 30,
    step: 0,
    next: null,
    damage: 1.3,
    finisher: false,
    poses: posesOf(BRYNN_AIR_CLIPS.airSlam, 4, 10, 0.55),
    arc: arcOf(SLASH.airSlam),
  },
};
