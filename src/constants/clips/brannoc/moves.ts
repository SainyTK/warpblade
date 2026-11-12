import type { ActionClip, Pose } from "../../../types/pose";
import { BERSERK, CRESCENT_CAST, CRY_CAST, FRENZY_CAST, HUNT, SPELL_CAST } from "../../brannoc/moves";
import { frame } from "../../hero";
import { free, STANCE, s } from "./stance";

/** Hunt's crouch: two frames low on the back foot, the axe drawn back for the lunge */
export const HUNT_LOAD: Pose = s({
  hx: -1,
  hy: -10.6,
  cb: -0.4,
  nx: 0.6,
  ny: -20.2,
  fx: -1,
  fy: -14,
  sa: 2.6,
  ffx: 5.6,
  bfx: -5.4,
  ba: 0.3,
  ah: 1,
});

/**
 * Hunt's lunge: the body leaning almost flat toward the foe, the axe trailing low behind, the front knee driving and
 * the back leg long, carried `HUNT.lift` pixels over the floor.
 */
const LUNGE_AT: Partial<Pose> = {
  hx: -0.5,
  hy: -10.5 - HUNT.lift,
  cb: 0.8,
  nx: 7.4,
  ny: -16.4 - HUNT.lift,
  fx: -2.4,
  fy: -11 - HUNT.lift,
  sa: 2.95,
  ffx: 5.6,
  ffy: -2 - HUNT.lift,
  fa: 0.3,
  bfx: -8,
  bfy: -3.6 - HUNT.lift,
  ba: 0.7,
  ah: 1,
};
export const HUNT_LUNGE: Pose = s(LUNGE_AT);

/** Headlong: diving 45 degrees down, the axe raised over his head to come down on the foe below */
export const HEADLONG: Pose = s({
  hx: -1.4,
  hy: -15,
  cb: 0.6,
  nx: 4.6,
  ny: -22.6,
  fx: 4,
  fy: -26.4,
  sa: -1.5,
  ffx: 2,
  ffy: -4.4,
  fa: 0.5,
  bfx: -4.6,
  bfy: -6,
  ba: 0.6,
});

/**
 * Frenzy: the far forearm held out across his chest, the near hand drags the axe edge across it on the hit frame, then
 * the head goes back in a short roar with the chest open.
 */
export const FRENZY_CLIP: ActionClip = {
  dur: FRENZY_CAST.dur,
  hit: FRENZY_CAST.hit,
  keys: [
    [0, STANCE],
    [frame(2), free({ cb: 0.4, nx: 1.8, fx: 3.6, fy: -21, sa: -0.15, bx: 6.6, by: -18.6, be: 1 })],
    [frame(3), free({ cb: 0.5, nx: 1.9, fx: 4, fy: -21.2, sa: -0.1, bx: 7, by: -18.8, be: 1 })],
    [frame(4), free({ cb: 0.6, nx: 2, fx: -1.6, fy: -20.4, sa: 0.02, bx: 7, by: -18.6, be: 1 }), "snap"],
    [frame(6), free({ hx: -0.6, cb: -1.2, nx: -0.4, ny: -24.4, fx: 4, fy: -14.6, sa: 1, bx: -5, by: -17, be: 0 })],
    [frame(8), STANCE],
  ],
};

/** War Cry: the axe swung down to his side, arms flung wide and the head thrown back */
export const CRY_CLIP: ActionClip = {
  dur: CRY_CAST.dur,
  hit: CRY_CAST.hit,
  keys: [
    [0, STANCE],
    [frame(2), free({ hy: -12.6, cb: 0.8, nx: 2.6, ny: -22, fx: 6, fy: -15, sa: 0.6, bx: 2, by: -14 })],
    [
      frame(4),
      free({ hx: -0.8, hy: -13.8, cb: -1.4, nx: -1.2, ny: -24.6, fx: 8.4, fy: -14.6, sa: 1, bx: -7, by: -17.6 }),
      "snap",
    ],
    [
      frame(9),
      free({ hx: -0.8, hy: -13.8, cb: -1.3, nx: -1.1, ny: -24.4, fx: 8.2, fy: -14.8, sa: 1, bx: -6.8, by: -17.4 }),
    ],
    [frame(12), STANCE],
  ],
};

/** Red Crescent: the axe raised high behind him, then swung overhead into the floor ahead, where the crescent leaves */
export const CRESCENT_CLIP: ActionClip = {
  dur: CRESCENT_CAST.dur,
  hit: CRESCENT_CAST.hit,
  keys: [
    [0, STANCE],
    [frame(3), s({ hx: -1, cb: -0.8, nx: -0.2, ny: -24, fx: 0.6, fy: -26.4, sa: -2.4, ba: 0.2 })],
    [frame(6), s({ hx: -1.2, cb: -0.9, nx: -0.4, ny: -24.2, fx: 0.2, fy: -26.8, sa: -2.5, ba: 0.2 })],
    [frame(7), s({ hx: 0.8, hy: -11.6, cb: 1.4, nx: 4.2, ny: -20.8, fx: 9.6, fy: -12.6, sa: 0.5, ffx: 6.4 }), "snap"],
    [frame(10), s({ hx: 0.6, hy: -11.8, cb: 1.2, nx: 3.8, ny: -21, fx: 9, fy: -13, sa: 0.42, ffx: 6.2 })],
    [frame(14), STANCE],
  ],
};

/** his spell skills: the axe planted head down beside him, the far fist raised and clenched */
export const SPELL_CLIP: ActionClip = {
  dur: SPELL_CAST.dur,
  hit: SPELL_CAST.hit,
  keys: [
    [0, STANCE],
    [frame(3), free({ hy: -12.8, cb: 0.4, nx: 2, ny: -22.4, fx: 7, fy: -14, sa: 1.3, bx: 3, by: -20, be: 1 })],
    [
      frame(5),
      free({ hy: -13.6, cb: -0.6, nx: 0.8, ny: -24, fx: 7, fy: -14.4, sa: 1.35, bx: 3.4, by: -27, be: 1 }),
      "snap",
    ],
    [
      frame(9),
      free({ hy: -13.6, cb: -0.5, nx: 0.9, ny: -23.8, fx: 7, fy: -14.4, sa: 1.35, bx: 3.2, by: -26.4, be: 1 }),
    ],
    [frame(12), STANCE],
  ],
};

/** Berserk's roar: arms flung wide, the axe raised high in the near hand, chest out and head back */
export const ROAR_POSE: Pose = free({
  hx: -0.6,
  hy: -13.8,
  cb: -1.4,
  nx: -0.8,
  ny: -24.8,
  fx: 5.6,
  fy: -30.4,
  sa: -1.35,
  bx: -8,
  by: -23.6,
  ffx: 5.6,
  bfx: -5.6,
});

/** Last Cleave: a short load, a full turn with the axe out on its hit frame, and a slam */
const SPIN_AT: Partial<Pose> = {
  hy: -12,
  cb: 0.5,
  nx: 1.4,
  ny: -21.6,
  fx: 10.4,
  fy: -15.6,
  sa: 0.02,
  ffx: 5.8,
  bfx: -5.8,
};
export const LAST_CLEAVE_CLIP: ActionClip = {
  dur: BERSERK.spin,
  hit: BERSERK.spinHit,
  keys: [
    [0, ROAR_POSE],
    [
      frame(2),
      s({ hx: -0.8, hy: -10.6, cb: -0.8, nx: -1.2, ny: -20, fx: -4.6, fy: -12.6, sa: 2.7, ffx: 6, bfx: -6, ah: 1 }),
    ],
    [frame(4), s({ ...SPIN_AT, tw: 1, fx: 3 })],
    [frame(5), s({ ...SPIN_AT, mr: 1 })],
    [frame(6), s(SPIN_AT), "snap"],
    [frame(7), s({ ...SPIN_AT, tw: 1, fx: 3 })],
    [frame(8), s({ ...SPIN_AT, mr: 1 })],
    [frame(9), s(SPIN_AT)],
    [
      frame(10),
      s({ hx: 0.6, hy: -10.6, cb: 1.4, nx: 4, ny: -20, fx: 9, fy: -11, sa: 0.82, ffx: 6.4, bfx: -5.6 }),
      "snap",
    ],
    [
      frame(13),
      s({ hx: 0.4, hy: -10.8, cb: 1.2, nx: 3.6, ny: -20.4, fx: 8.6, fy: -11.4, sa: 0.78, ffx: 6.2, bfx: -5.6 }),
    ],
    [frame(16), STANCE],
  ],
};
