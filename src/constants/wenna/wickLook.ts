import { hex, mix } from "../../utils/color";
import { COIN_GOLD, PAL, WAX } from "../palette";

/** the wax of a Wick: the dark line round it, its deep shade, its shaded side, its body, its lit side */
export const WICK_WAX = {
  ink: PAL.wick[0],
  deep: WAX[0],
  shade: WAX[1],
  mid: hex("#c9b596"),
  body: WAX[2],
  light: WAX[3],
  /** the wax under the flame takes its violet */
  crown: mix(WAX[3], PAL.wick[4], 0.45),
  /** the hot wax where the flame sits */
  melt: COIN_GOLD[4],
} as const;

/** a flame's tones from its edge to its heart, and the gold at its root */
export const WICK_FLAME = {
  tip: PAL.wick[2],
  edge: PAL.wick[3],
  body: PAL.wick[4],
  heart: PAL.wick[5],
  root: COIN_GOLD[3],
} as const;

/**
 * A Wick's figure, in art pixels at full size: the canvas it is drawn on (its feet at the bottom middle), its body's
 * height and half width, the skirt of pooled wax at its foot, its flame, and how its parts sit.
 */
export const WICK_LOOK = {
  canvas: { w: 30, h: 30 },
  tall: 8,
  half: 3.1,
  /** the pooled wax at its foot stands out this far past its body and is this thick */
  skirt: 0.5,
  skirtThick: 0.7,
  /** the eyes sit this far under its crown, the nearer one this far ahead of its middle, this far apart */
  eyeDrop: 3,
  eyeAhead: -0.3,
  eyeGap: 2,
  /** the arms leave the body this share of the way up */
  armAt: 0.52,
  /** the flame's height and half width, and how much longer it burns in a bite */
  flame: { tall: 5.4, wide: 2.1, bite: 1.35 },
  /** a bite leans the crown this far forward; a waddle rocks it this far */
  lean: 2.2,
  rock: 0.5,
  /** it never shrinks below this share of its size, so the last seconds still read */
  least: 0.55,
  /** the flame's flicker steps a second */
  flicker: 12,
} as const;

/**
 * The Great Wick, in art pixels: its canvas, its body's height and half widths at the foot and the shoulders, its
 * flame, its arm's length and thickness and its fist.
 */
export const GREAT_LOOK = {
  canvas: { w: 96, h: 74 },
  body: 34,
  foot: 10,
  shoulder: 7,
  flame: { tall: 15, wide: 5.6 },
  arm: 20,
  upperArm: 2.8,
  foreArm: 2.2,
  fist: 3.2,
  /** the arm's angle ahead of the giant (up negative): raised up and back before the swing, down ahead after */
  armFrom: -2.3,
  armTo: 0.9,
  /** the eyes: how far under the crown, how far ahead of the middle each sits, and their radius */
  eyeDrop: 7,
  eyes: [0.8, 5],
  eye: 1.6,
} as const;

/**
 * The Wax Effigy, in art pixels: its canvas, its half width under the head and at the foot, its head's radius, how its
 * raised arms reach, and the three flames of its crown (where each sits across the head, and how tall it burns).
 */
export const EFFIGY_LOOK = {
  canvas: { w: 36, h: 40 },
  neck: 2.2,
  foot: 4.6,
  head: 3,
  arm: { out: 5.5, up: 6, thick: 1.1 },
  flames: [
    [-2.6, 3.4],
    [0, 4.6],
    [2.6, 3.4],
  ],
  flameWide: 1.3,
} as const;
