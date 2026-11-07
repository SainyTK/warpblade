import type { ActionClip } from "../../../types/pose";
import { frame } from "../../hero";
import { RIDE } from "../../hulda/ride";
import { CHAIN, STOMP, WALL } from "../../hulda/spells";
import { GUARD, g } from "./stance";

/** both hands hauling the chain in against her chest, leaning back on her heels */
const HAUL = g({
  hx: -1.5,
  hy: -12,
  nx: -1.5,
  ny: -22,
  cb: -1,
  fx: 6,
  fy: -18,
  bx: 3,
  by: -18,
  be: 0,
  ffx: 7,
  bfx: -6,
});
/** gauntlets crossed before her face, feet wide, sunk low behind them */
const BRACE = g({
  hx: -1,
  hy: -11,
  nx: 0.5,
  ny: -21,
  cb: -0.5,
  fx: 7,
  fy: -22,
  bx: 8,
  by: -20,
  be: 0,
  ffx: 7,
  bfx: -7,
});
/** kneeling on a foe's back, both fists raised over her head */
const KNEEL_UP = g({
  hx: -1,
  hy: -7,
  nx: 0,
  ny: -17,
  cb: -0.5,
  fx: 3,
  fy: -29,
  bx: 1,
  by: -29,
  be: 0,
  ffx: 4,
  bfx: -5,
});

/** Hulda's spell clips on I, and the ride on a big foe's back */
export const SPELL_CLIPS = {
  /** the gauntlet cocks back by her ear, the arm snaps straight out after it, then both hands haul the chain home */
  chain: {
    dur: CHAIN.dur,
    hit: CHAIN.throw,
    keys: [
      [0, GUARD],
      [frame(2), g({ hx: -1, nx: -0.5, cb: -0.5, fx: 1, fy: -22, bx: 6, by: -19 })],
      [CHAIN.throw - frame(1), g({ hx: -1.5, nx: -1, cb: -1, fx: -1, fy: -23, bx: 6, by: -19, ffx: 6 })],
      [
        CHAIN.throw,
        g({ hx: 1, nx: 4.5, ny: -21.5, cb: 1.5, fx: 16, fy: -19, bx: 2, by: -18, be: 0, ffx: 8, bfx: -6, ba: 0.4 }),
        "snap",
      ],
      [frame(7), g({ hx: 1, nx: 4, ny: -21.5, cb: 1.2, fx: 15, fy: -19, bx: 3, by: -18, be: 0, ffx: 8, bfx: -6 })],
      [frame(10), g({ hx: -0.5, nx: 1, cb: 0, fx: 10, fy: -18.5, bx: 7, by: -18.5, be: 0, ffx: 7, bfx: -6 })],
      [CHAIN.dur, HAUL],
    ],
  },
  /** she keeps hauling hand over hand while the chain is still out */
  haul: {
    dur: frame(8),
    hit: 0,
    keys: [
      [0, HAUL],
      [
        frame(4),
        g({ hx: -1.5, hy: -12, nx: -1, ny: -22, cb: -1, fx: 9, fy: -19, bx: 2, by: -17, be: 0, ffx: 7, bfx: -6 }),
      ],
      [frame(8), HAUL],
    ],
  },
  /** the near knee comes up high with the fists, then the foot drives down into the floor under her whole weight */
  stomp: {
    dur: STOMP.dur,
    hit: STOMP.hit,
    keys: [
      [0, GUARD],
      [frame(2), g({ hy: -13, nx: 0.5, ny: -23, fx: 6, fy: -22, bx: 3, by: -23, ffx: 5, ffy: -3, fa: 0.3 })],
      [
        STOMP.hit - frame(1),
        g({ hy: -13.5, nx: 0, ny: -23.5, cb: -0.5, fx: 5, fy: -25, bx: 2, by: -25, ffx: 5, ffy: -8, fa: 0.4, bfx: -4 }),
      ],
      [
        STOMP.hit,
        g({ hy: -10, nx: 2, ny: -20, cb: 1, fx: 10, fy: -11, bx: 7, by: -12, be: 0, ffx: 7, ffy: 0, fa: 0, bfx: -6 }),
        "snap",
      ],
      [frame(9), g({ hy: -10.5, nx: 2, ny: -20.5, cb: 1, fx: 10, fy: -12, bx: 7, by: -13, be: 0, ffx: 7, bfx: -6 })],
      [frame(12), g({ hy: -12, nx: 1.5, ny: -22, fx: 8, fy: -17, bx: 5, by: -19, ffx: 6, bfx: -5 })],
      [STOMP.dur, GUARD],
    ],
  },
  /** into the brace: feet out, gauntlets crossed */
  braceIn: {
    dur: frame(3),
    hit: 0,
    keys: [
      [0, GUARD],
      [frame(3), BRACE],
    ],
  },
  /** held in the brace, trembling under the load */
  brace: {
    dur: frame(4),
    hit: 0,
    keys: [
      [0, BRACE],
      [frame(2), { ...BRACE, hy: BRACE.hy + 0.5, ny: BRACE.ny + 0.5, fy: BRACE.fy + 0.5, by: BRACE.by + 0.5 }],
      [frame(4), BRACE],
    ],
  },
  /** out of the brace: the near fist draws back, then everything goes into one punch, and back to the guard */
  release: {
    dur: WALL.release,
    hit: WALL.hit,
    keys: [
      [0, BRACE],
      [
        frame(2),
        g({ hx: -1.5, hy: -11, nx: -1, ny: -21, cb: -1, fx: 0, fy: -19, bx: 7, by: -20, be: 0, ffx: 7, bfx: -7 }),
      ],
      [
        WALL.hit - frame(1),
        g({ hx: -2, hy: -11, nx: -1.5, ny: -21, cb: -1, fx: -2, fy: -19, bx: 7, by: -20, be: 0, ffx: 7, bfx: -7 }),
      ],
      [
        WALL.hit,
        g({
          hx: 1.5,
          hy: -11.5,
          nx: 6,
          ny: -21,
          cb: 1.5,
          fx: 17,
          fy: -18,
          bx: -2,
          by: -17,
          be: 0,
          ffx: 9,
          bfx: -7,
          ba: 0.5,
        }),
        "snap",
      ],
      [
        frame(7),
        g({ hx: 1.5, hy: -11.5, nx: 5.5, ny: -21, cb: 1.5, fx: 16, fy: -18, bx: -1, by: -17, be: 0, ffx: 9, bfx: -7 }),
      ],
      [frame(10), g({ hx: 0.5, nx: 3, ny: -22, cb: 1, fx: 10, fy: -17, bx: 3, by: -19, ffx: 7, bfx: -5 })],
      [WALL.release, GUARD],
    ],
  },
  /** from the lunge onto the big foe's back, kneeling with both fists going up */
  rideLand: {
    dur: RIDE.first,
    hit: 0,
    keys: [
      [
        0,
        g({
          hx: -1,
          hy: -15,
          nx: 5,
          ny: -21,
          cb: 1.5,
          fx: 13,
          fy: -12,
          bx: 12,
          by: -13,
          be: 0,
          ffx: -2,
          ffy: -4,
          bfx: -6,
        }),
      ],
      [frame(2), g({ hx: -1, hy: -8, nx: 3, ny: -18, cb: 1, fx: 10, fy: -10, bx: 9, by: -10, be: 0, ffx: 4, bfx: -5 })],
      [RIDE.first, KNEEL_UP],
    ],
  },
  /** one pound: the fists rise a little more, then hammer down into its back and come back up */
  pound: {
    dur: RIDE.every,
    hit: RIDE.strike,
    keys: [
      [0, KNEEL_UP],
      [RIDE.strike - frame(1), { ...KNEEL_UP, ny: -18, fy: -31, by: -31, cb: -1 }],
      [
        RIDE.strike,
        g({ hx: 0, hy: -6.5, nx: 3, ny: -15, cb: 1.5, fx: 9, fy: -6, bx: 8, by: -6, be: 0, ffx: 4, bfx: -5 }),
        "snap",
      ],
      [frame(7), g({ hx: 0, hy: -7, nx: 2, ny: -16, cb: 1, fx: 8, fy: -10, bx: 7, by: -10, be: 0, ffx: 4, bfx: -5 })],
      [RIDE.every, KNEEL_UP],
    ],
  },
} satisfies Record<string, ActionClip>;
