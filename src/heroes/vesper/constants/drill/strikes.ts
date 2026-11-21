import { frame } from "../../../../constants/hero";
import type { DrillStrike, DrillStrikeId, DrillStrikePoses } from "../../../../types/drill";
import type { ActionClip } from "../../../../types/pose";
import { sampleKeys } from "../../../../utils/sampleKeys";
import { DUSK_RAMP } from "../../look/colors";
import { AIR_CLIPS } from "../clips/air";
import { STRING_CLIPS } from "../clips/string";

interface Samples {
  load: number;
  cut: number;
  finish: number;
  settle: number;
}

const posesOf = ({ keys }: ActionClip, { load, cut, finish, settle }: Samples): DrillStrikePoses => ({
  ready: sampleKeys(keys, 0),
  load: sampleKeys(keys, frame(load)),
  cut: sampleKeys(keys, frame(cut)),
  finish: sampleKeys(keys, frame(finish)),
  settle,
});

export const VESPER_STRIKES: Readonly<Record<DrillStrikeId, DrillStrike>> = {
  first: {
    hit: 0.068,
    duration: 0.27,
    reach: 34,
    height: 14,
    step: 4,
    next: "second",
    damage: 0.75,
    finisher: false,
    poses: posesOf(STRING_CLIPS.duskCross, { load: 3, cut: 4, finish: 7, settle: 0.6 }),
    arc: { cx: 4, cy: -21, sy: 0.78, rot: 0.25, a0: -2.3, a1: 0.95, W: 11, ramp: DUSK_RAMP },
  },
  second: {
    hit: 0.07,
    duration: 0.26,
    reach: 33,
    height: 16,
    step: 3,
    next: "third",
    damage: 0.75,
    finisher: false,
    poses: posesOf(STRING_CLIPS.risingPair, { load: 3, cut: 4, finish: 7, settle: 0.6 }),
    arc: { cx: 2, cy: -14, sy: 0.7, rot: -0.35, a0: 1.9, a1: -1.4, W: 10, sweep: 0.036, ramp: DUSK_RAMP },
  },
  third: {
    hit: 0.12,
    duration: 0.42,
    reach: 34,
    height: 26,
    step: 10,
    next: null,
    damage: 1.7,
    finisher: true,
    poses: posesOf(STRING_CLIPS.moonrise, { load: 3, cut: 8, finish: 10, settle: 0.72 }),
    arc: { cx: 2, cy: -18, sy: 0.92, rot: -1.2, a0: 2.5, a1: -1.25, W: 14, hold: 0.06, trail: 0.2, ramp: DUSK_RAMP },
  },
  air: {
    hit: 0.06,
    duration: 0.24,
    reach: 33,
    height: 24,
    step: 0,
    next: null,
    damage: 0.95,
    finisher: false,
    poses: posesOf(AIR_CLIPS.swallowCut, { load: 3, cut: 4, finish: 6, settle: 0.5 }),
    arc: { cx: 4, cy: -18, sy: 0.88, rot: 0.3, a0: -2.1, a1: 1.3, W: 11, sweep: 0.036, trail: 0.12, ramp: DUSK_RAMP },
  },
};
