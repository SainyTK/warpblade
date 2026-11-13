import type { ActionClip, Pose } from "../../../types/pose";
import { frame } from "../../hero";
import { ABILITY_CAST, BOOM, SPELL_CAST } from "../../jory/moves";
import { CHARGE_POSE, STANCE, s } from "./stance";

/** Boom: palms out, a two frame load with the drum pulled to his belly, then both palms flat on the drum head */
export const BOOM_CLIP: ActionClip = {
  dur: BOOM.dur,
  hit: BOOM.hit,
  keys: [
    [0, STANCE],
    [frame(1), s({ hy: -12.8, ny: -22.8, cb: 0.3, fx: 2.6, fy: -18.4, sa: -1.9, bx: 1.6, by: -18, be: 0, dr: 0.8 })],
    [
      BOOM.hit,
      s({ hy: -12.2, ny: -22.4, nx: 2, cb: 1.1, fx: 7.6, fy: -14, sa: -1.4, bx: 7, by: -13.8, be: 0, dr: 1 }),
      "snap",
    ],
    [
      frame(4),
      s({ hy: -12.4, ny: -22.6, nx: 1.8, cb: 1, fx: 7.2, fy: -14.4, sa: -1.5, bx: 6.6, by: -14.2, be: 0, dr: 1 }),
    ],
    [frame(6), s({ hy: -13, fx: 6, fy: -16, sa: -1.2, bx: 4.4, by: -15, dr: 0.6 })],
    [BOOM.dur, STANCE],
  ],
};

/** Steady Hand: the near mallet taps the drum's rim once, and the metronome starts over his head */
export const STEADY_CLIP: ActionClip = {
  dur: ABILITY_CAST.dur,
  hit: ABILITY_CAST.hit,
  keys: [
    [0, STANCE],
    [frame(2), s({ fx: 3.6, fy: -21.5, sa: -2.1, dr: 0.3 })],
    [ABILITY_CAST.hit, s({ nx: 1.8, cb: 0.8, fx: 5.6, fy: -12.6, sa: 0.85, dr: 0.4 }), "snap"],
    [frame(6), s({ nx: 1.6, cb: 0.7, fx: 5.4, fy: -13.6, sa: 0.6, dr: 0.35 })],
    [ABILITY_CAST.dur, STANCE],
  ],
};

/** Thunder Skin: down on one knee, both mallets beating the drum against the floor */
export const THUNDER_CLIP: ActionClip = {
  dur: ABILITY_CAST.dur,
  hit: ABILITY_CAST.hit,
  keys: [
    [0, STANCE],
    [frame(2), s({ hy: -11.5, ny: -21.6, cb: 0.6, fx: 4, fy: -22, sa: -1.8, bx: 2.6, by: -21.5, be: 0, dr: 1 })],
    [
      ABILITY_CAST.hit,
      s({
        hx: 0.4,
        hy: -8,
        ny: -17.6,
        nx: 3,
        cb: 1.4,
        fx: 8,
        fy: -4.5,
        sa: 0.9,
        bx: 7,
        by: -4.8,
        be: 0,
        ffx: 5.5,
        bfx: -4.5,
        bfy: 0,
        ba: 0.9,
        dr: 1,
      }),
      "snap",
    ],
    [
      frame(7),
      s({
        hy: -8.4,
        ny: -18,
        nx: 2.6,
        cb: 1.2,
        fx: 7.6,
        fy: -5.6,
        sa: 0.6,
        bx: 6.6,
        by: -6,
        be: 0,
        ffx: 5.5,
        bfx: -4.5,
        ba: 0.9,
        dr: 1,
      }),
    ],
    [ABILITY_CAST.dur, STANCE],
  ],
};

/** a spell skill: the near mallet thrust out level, the spell leaving its head on the frame */
export const SPELL_CLIP: ActionClip = {
  dur: SPELL_CAST.dur,
  hit: SPELL_CAST.hit,
  keys: [
    [0, STANCE],
    [frame(2), s({ nx: 0.6, cb: 0.2, fx: 2.6, fy: -21, sa: -2.2 })],
    [SPELL_CAST.hit, s({ nx: 2.6, cb: 1.1, fx: 11, fy: -19, sa: -0.1, ffx: 5.4 }), "snap"],
    [frame(6), s({ nx: 2.4, cb: 1, fx: 10.4, fy: -19, sa: -0.2, ffx: 5.4 })],
    [SPELL_CAST.dur, STANCE],
  ],
};

/** the Drumroll: the drum planted in front, each beat of the roll a mallet down on the head, alternating hands */
export const ROLL_PLANT: Pose = CHARGE_POSE;
export const ROLL_NEAR: Pose = s({
  hy: -11.6,
  ny: -21.8,
  nx: 2.2,
  cb: 1.1,
  fx: 8.6,
  fy: -12.6,
  sa: 0.5,
  bx: 3,
  by: -22,
  be: 0,
  ffx: 5.6,
  bfx: -5.6,
  dr: 1,
});
export const ROLL_FAR: Pose = s({
  hy: -11.6,
  ny: -21.8,
  nx: 2,
  cb: 1.1,
  fx: 4,
  fy: -22.4,
  sa: -1.7,
  bx: 8,
  by: -12.6,
  be: 0,
  ffx: 5.6,
  bfx: -5.6,
  dr: 1,
});
