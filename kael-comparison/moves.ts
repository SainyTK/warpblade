import { pose } from "../src/constants/hero";
import { gait } from "./motion/gait";
import { jump } from "./motion/jump";
import { PREVIOUS } from "./motion/previous";
import { referenceRun } from "./motion/run";
import { airSpin, crescent } from "./motion/strike";
import type { Motion } from "./motion/types";

const idle: Motion = {
  duration: 2.4,
  cycles: true,
  sample(time) {
    const breath = Math.sin((time / 2.4) * 2 * Math.PI);
    const delay = Math.sin((time / 2.4) * 2 * Math.PI - 0.6);
    return {
      pose: pose({
        hx: 0.6 + 0.36 * breath,
        hy: -12.6 - 0.27 * breath,
        nx: 1.75 + 0.43 * delay,
        ny: -22.5 - 0.47 * delay,
        cb: 0.35 + 0.2 * delay,
        fx: 6 + delay * 0.5,
        fy: -15.7 - 0.43 * delay,
        bx: -3.6,
        by: -16 + 0.21 * delay,
        sa: 1.19 + 0.045 * delay,
      }),
      root: 0,
      lift: 0,
      contacts: [true, true],
      beat: "Idle",
    };
  },
};

interface Move {
  label: string;
  revised: Motion;
  previous?: Motion;
}

export const MOVES: readonly Move[] = [
  { label: "Idle", revised: idle, previous: PREVIOUS.Idle },
  { label: "Walk", revised: gait(false), previous: PREVIOUS.Walk },
  { label: "Run", revised: referenceRun, previous: gait(true) },
  { label: "Jump / land", revised: jump },
  { label: "Crescent", revised: crescent, previous: PREVIOUS.Crescent },
  { label: "Air spin", revised: airSpin, previous: PREVIOUS["Air spin"] },
];
