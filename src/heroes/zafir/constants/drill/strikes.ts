import { frame, pose } from "../../../../constants/hero";
import type { DrillStrike, DrillStrikeId } from "../../../../types/drill";
import type { ActionClip } from "../../../../types/pose";
import { sampleKeys } from "../../../../utils/sampleKeys";
import { AIR_CLIPS } from "../clips/air";
import { STRING_CLIPS } from "../clips/string";
import { ZAFIR_POSES } from "./locomotion";

const at = (clip: ActionClip, n: number) => sampleKeys(clip.keys, frame(n));

const SWEEP_FINISH = at(STRING_CLIPS.turn1, 9);
const RISING_FINISH = at(STRING_CLIPS.turn2, 9);
const DROP = AIR_CLIPS.spinDrop;

const RING = { cx: 0, sy: 0.3, rot: 0, a0: 3.1, a1: -3.1, sweep: 0.065, hold: 0.04, trail: 0.16 };

export const ZAFIR_STRIKES: Readonly<Record<DrillStrikeId, DrillStrike>> = {
  first: {
    hit: 0.08,
    duration: 0.28,
    reach: 30,
    height: 14,
    step: 5,
    next: "second",
    damage: 0.85,
    finisher: false,
    poses: {
      ready: pose({ ...ZAFIR_POSES.stance, cb: -0.4, nx: -0.8, fx: -1.5, fy: -20 }),
      load: at(STRING_CLIPS.turn1, 4),
      cut: at(STRING_CLIPS.turn1, 5),
      finish: SWEEP_FINISH,
      settle: 0.6,
    },
    arc: { ...RING, cy: -18, W: 7 },
  },
  second: {
    hit: 0.08,
    duration: 0.27,
    reach: 30,
    height: 20,
    step: 4,
    next: "third",
    damage: 0.9,
    finisher: false,
    poses: {
      ready: SWEEP_FINISH,
      load: at(STRING_CLIPS.turn2, 4),
      cut: at(STRING_CLIPS.turn2, 5),
      finish: RISING_FINISH,
      settle: 0.62,
    },
    arc: { ...RING, cy: -23, sy: 0.42, rot: -0.18, W: 7 },
  },
  third: {
    hit: 0.1,
    duration: 0.4,
    reach: 32,
    height: 16,
    step: 9,
    next: null,
    damage: 1.2,
    finisher: true,
    poses: {
      ready: RISING_FINISH,
      load: at(STRING_CLIPS.turn3, 4),
      cut: at(STRING_CLIPS.turn3, 5),
      finish: at(STRING_CLIPS.turn3, 11),
      settle: 0.7,
    },
    arc: { ...RING, cy: -11, sy: 0.24, W: 6 },
  },
  air: {
    hit: 0.06,
    duration: 0.26,
    reach: 28,
    height: 24,
    step: 0,
    next: null,
    damage: 0.8,
    finisher: false,
    poses: {
      ready: sampleKeys(DROP.keys, frame(6)),
      load: sampleKeys(DROP.keys, frame(0)),
      cut: sampleKeys(DROP.keys, frame(2)),
      finish: sampleKeys(DROP.keys, frame(4)),
      settle: 0.55,
    },
    arc: { ...RING, cy: -17, sy: 0.55, rot: 0.45, W: 6, sweep: 0.05 },
  },
};

export const TWIN_RING = { ...RING, cy: -23, sy: 0.3, W: 7 };
export const TWIN_TURN = { delay: 0.1, share: 0.55 };
export const BEHIND_SHARE = 0.75;
export const ARRIVAL_CUT = { reach: 30, height: 40, power: 1.2 };
