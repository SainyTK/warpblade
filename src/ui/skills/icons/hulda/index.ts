import { RUST } from "../../../../constants/characters/hulda/look";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { arc, arrow, fill, ring, sparkle, speedLines } from "../parts";
import { floor, foe, heart, seg } from "../ysra/parts";
import { body, fist, HC, plate } from "./parts";

/** Hulda's skill icons: gauntlet fists, plates, the rush, the roar and the throws */
export const HULDA_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** a heavy fist with weight lines under it */
  b_hands: (s) => {
    fist(s, 9, 7, 3.5);
    speedLines(s, 4, [12, 14], 6, RUST[4]);
  },
  /** a fist driving straight up through a foe */
  b_uppercut: (s) => {
    foe(s, 8, 4, 2.6);
    arrow(s, 8, 14, 8, 8, RUST[4], 2);
    fist(s, 8, 11, 2.4);
  },
  /** two fists on the floor and a crack running out */
  b_quake: (s) => {
    floor(s, 0, 15, 13, HC.trim);
    fill(s, () => {
      for (let x = 1; x <= 14; x++) s.set(x, 14 + ((x * 7) % 3 === 0 ? 1 : 0), RUST[x % 2 ? 4 : 5]);
    });
    fist(s, 6, 9, 2.4);
    fist(s, 11, 9, 2.4);
  },
  /** a flurry of small fists */
  b_knuckles: (s) => {
    fist(s, 5, 4, 1.8);
    fist(s, 11, 7, 1.8);
    fist(s, 6, 11, 1.8);
    speedLines(s, 3, [7, 13], 4, RUST[4]);
  },
  /** a heap of foes thrown in an arc */
  b_titan: (s) => {
    arc(s, 8, 14, 7, Math.PI, Math.PI * 1.9, RUST[4]);
    body(s, 13, 7, 2);
    body(s, 11, 4, 2);
    body(s, 14, 3, 1.6);
    sparkle(s, 3, 12, 2, RUST[5]);
  },
  /** a thick hide heart under a plate */
  i_hide: (s) => {
    heart(s, 8, 9, 5, RUST[3], RUST[5]);
    plate(s, 4, 2, 8, 3);
  },
  /** a lowered shoulder carrying a foe */
  i_horns: (s) => {
    speedLines(s, 4, [8, 11, 14], 4, RUST[4]);
    fill(s, () => s.dot(9, 11, 3.5, HC.coat));
    plate(s, 6, 6, 6, 2);
    body(s, 10, 3, 2.4);
  },
  /** three plates stacked */
  i_plates: (s) => {
    plate(s, 3, 2, 10, 3);
    plate(s, 3, 7, 10, 3);
    plate(s, 3, 12, 10, 3);
  },
  /** a broken plate giving off a small heart */
  i_wind: (s) => {
    plate(s, 2, 6, 9, 6, true);
    heart(s, 12, 4, 2.6, RUST[4], RUST[6]);
  },
  /** rings rolling out from her */
  t_bellow: (s) => {
    ring(s, 4, 8, 3, RUST[5]);
    arc(s, 4, 8, 7, -0.8, 0.8, RUST[4]);
    arc(s, 4, 8, 11, -0.6, 0.6, RUST[3]);
    foe(s, 13, 8, 2.2, -1);
  },
  /** two fists clenched round a body */
  h_grip: (s) => {
    body(s, 8, 8, 3);
    fist(s, 4, 8, 2.2);
    fist(s, 12, 8, 2.2);
  },
  /** a body swung round in a circle */
  h_swing: (s) => {
    ring(s, 8, 8, 6, RUST[3]);
    fill(s, () => s.dot(8, 8, 1.6, HC.coat));
    body(s, 14, 8, 2);
    arrow(s, 8, 2, 4, 3, RUST[5], 2);
  },
  /** a body hitting the floor in a burst */
  h_wreck: (s) => {
    floor(s, 0, 15, 14, HC.trim);
    body(s, 8, 11, 2.6);
    sparkle(s, 3, 10, 2.5, RUST[5]);
    sparkle(s, 13, 9, 2.5, RUST[5]);
    arrow(s, 2, 3, 6, 7, RUST[4], 2);
  },
  /** the rush ending in two hands */
  x_rushGrab: (s) => {
    speedLines(s, 6, [5, 8, 11], 5, RUST[4]);
    fist(s, 10, 6, 2);
    fist(s, 10, 11, 2);
    body(s, 14, 8, 1.8);
  },
  /** a slam ring throwing foes up */
  x_aftershock: (s) => {
    floor(s, 0, 15, 14, HC.trim);
    arc(s, 8, 14, 7, Math.PI, Math.PI * 2, RUST[4]);
    foe(s, 3, 6, 2);
    foe(s, 13, 5, 2);
    fill(s, () => seg(s, 8, 13, 8, 9, RUST[5]));
  },
};
