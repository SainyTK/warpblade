import { pose, READY } from "../../src/constants/hero";
import { clamp } from "../../src/utils/math";
import { type Key, keyed } from "./keys";
import type { Motion } from "./types";

const takeoff = 0.16;
const landing = 0.65;
const height = 23;

const keys: readonly Key[] = [
  [0, { pose: READY, root: 0, lift: 0, contacts: [true, true], beat: "Ready" }],
  [
    0.11,
    {
      pose: pose({
        hx: -1,
        hy: -9.3,
        nx: 3,
        ny: -18,
        cb: 1.4,
        ffx: 4,
        bfx: -4,
        fx: 4,
        fy: -11,
        bx: -3,
        by: -12,
        sa: 2.45,
      }),
      root: 0,
      lift: 0,
      contacts: [true, true],
      beat: "Load",
    },
  ],
  [
    takeoff,
    {
      pose: pose({ hx: 0.6, hy: -13.3, nx: 3.4, ny: -23, ffx: 4, bfx: -4, fx: 7, fy: -19, bx: -2, by: -17, sa: 2.18 }),
      root: 0,
      lift: 0,
      contacts: [false, false],
      beat: "Takeoff",
    },
  ],
  [
    0.405,
    {
      pose: pose({
        hy: -15,
        nx: 2.5,
        ny: -25,
        cb: -0.66,
        ffx: 6,
        ffy: -7,
        fa: 0.42,
        bfx: -4.5,
        bfy: -4,
        ba: 0.65,
        fx: 6,
        fy: -22,
        bx: -3.5,
        by: -18,
        sa: 0.45,
      }),
      root: 11,
      lift: 0,
      contacts: [false, false],
      beat: "Apex",
    },
  ],
  [
    landing,
    {
      pose: pose({ hx: 1.1, hy: -12.5, nx: 3, ny: -22, ffx: 4, bfx: -4, fx: 7, fy: -17, bx: -4, by: -16, sa: 0.89 }),
      root: 22,
      lift: 0,
      contacts: [true, true],
      beat: "Land",
    },
  ],
  [
    0.73,
    {
      pose: pose({
        hx: 2,
        hy: -9.5,
        nx: 5,
        ny: -18.5,
        cb: 1.5,
        ffx: 4,
        bfx: -4,
        fx: 8,
        fy: -14,
        bx: 0,
        by: -14,
        sa: 0.57,
      }),
      root: 22,
      lift: 0,
      contacts: [true, true],
      beat: "Absorb",
    },
  ],
  [1.02, { pose: READY, root: 22, lift: 0, contacts: [true, true], beat: "Recover" }],
];

export const jump: Motion = {
  duration: 1.22,
  sample(time) {
    const frame = keyed(keys, time);
    const flight = clamp((time - takeoff) / (landing - takeoff));
    return { ...frame, lift: 4 * height * flight * (1 - flight), root: 22 * flight };
  },
};
