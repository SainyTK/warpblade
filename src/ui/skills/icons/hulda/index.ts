import { RUST } from "../../../../constants/characters/hulda/look";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { arc, arrow, fill, ring, sparkle, speedLines } from "../parts";
import { floor, foe, heart, seg } from "../ysra/parts";
import { body, fist, HC, plate } from "./parts";

/** Hulda's skill icons: gauntlet fists, plates, the rush, the roar and the throws */
export const HULDA_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** a heavy fist driving down, weight lines over it */
  b_hands: (s) => {
    speedLines(s, 9, [2, 4], 7, RUST[4]);
    fist(s, 9, 10, 4.6);
  },
  /** a fist driving straight up into a foe */
  b_uppercut: (s) => {
    foe(s, 11, 3, 2.8);
    arc(s, 6, 12, 7, -1.5, -0.4, RUST[4]);
    fist(s, 7, 10, 3.6);
  },
  /** two fists on the floor and a crack running out lit from below */
  b_quake: (s) => {
    fill(s, () => {
      for (let x = 0; x <= 15; x++) s.set(x, 14 + (x % 3 === 0 ? 1 : 0), RUST[x % 2 ? 4 : 5]);
    });
    fist(s, 5, 9, 3.2, -1);
    fist(s, 11, 9, 3.2);
    sparkle(s, 8, 13, 2, RUST[6]);
  },
  /** a flurry of fists */
  b_knuckles: (s) => {
    fist(s, 6, 4, 2.8);
    fist(s, 11, 8, 2.8);
    fist(s, 6, 12, 2.8);
  },
  /** a heap of foes flung in an arc */
  b_titan: (s) => {
    arc(s, 7, 15, 8, Math.PI * 1.05, Math.PI * 1.75, RUST[4]);
    body(s, 12, 6, 2.6);
    body(s, 9, 3, 2.2);
    body(s, 14, 2, 1.8);
    fist(s, 3, 12, 2.6, -1);
  },
  /** a thick heart under a plate */
  i_hide: (s) => {
    heart(s, 8, 10, 6, RUST[3], RUST[5]);
    plate(s, 3, 1, 10, 3);
  },
  /** a lowered shoulder carrying a foe, speed lines behind */
  i_horns: (s) => {
    speedLines(s, 5, [8, 11, 14], 5, RUST[4]);
    fill(s, () => s.dot(10, 11, 4.2, HC.coat));
    plate(s, 6, 6, 8, 3);
    body(s, 11, 3, 2.6);
  },
  /** three plates stacked */
  i_plates: (s) => {
    plate(s, 2, 1, 12, 3);
    plate(s, 2, 6, 12, 3);
    plate(s, 2, 11, 12, 3);
  },
  /** a broken plate giving off a heart */
  i_wind: (s) => {
    plate(s, 1, 5, 10, 8, true);
    heart(s, 12, 4, 3.4, RUST[4], RUST[6]);
  },
  /** rings rolling out from her toward a foe */
  t_bellow: (s) => {
    fill(s, () => s.dot(3, 8, 2.4, RUST[4]));
    arc(s, 3, 8, 6, -0.9, 0.9, RUST[5]);
    arc(s, 3, 8, 10, -0.7, 0.7, RUST[4]);
    foe(s, 13, 8, 2.4, -1);
  },
  /** two fists clenched round a body */
  h_grip: (s) => {
    body(s, 8, 8, 4);
    fist(s, 3, 8, 2.8, 1);
    fist(s, 13, 8, 2.8, -1);
  },
  /** a body swung round in a circle */
  h_swing: (s) => {
    ring(s, 8, 8, 6.5, RUST[3]);
    fill(s, () => s.dot(8, 8, 2, HC.coat));
    body(s, 14, 8, 2.4);
    arrow(s, 9, 1, 4, 2, RUST[5], 2);
  },
  /** a body hitting the floor in a burst */
  h_wreck: (s) => {
    floor(s, 0, 15, 14, HC.trim);
    body(s, 8, 10, 3.4);
    sparkle(s, 2, 9, 3, RUST[5]);
    sparkle(s, 14, 8, 3, RUST[5]);
    arrow(s, 2, 1, 6, 5, RUST[4], 2);
  },
  /** the rush ending in a grab */
  x_rushGrab: (s) => {
    speedLines(s, 6, [4, 8, 12], 6, RUST[4]);
    body(s, 13, 8, 2.6);
    fist(s, 9, 4, 2.6);
    fist(s, 9, 12, 2.6);
  },
  /** a slam ring throwing foes up */
  x_aftershock: (s) => {
    floor(s, 0, 15, 14, HC.trim);
    arc(s, 8, 14, 7, Math.PI, Math.PI * 2, RUST[4]);
    foe(s, 3, 5, 2.4);
    foe(s, 13, 4, 2.4);
    fill(s, () => seg(s, 8, 13, 8, 8, RUST[5]));
    body(s, 8, 6, 2.2);
  },
};
