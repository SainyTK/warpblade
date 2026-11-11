import type { PixelColors } from "../effectColors";
import { PAL } from "../palette";

const G = PAL.gloam;

/** a Gloam Crow facing right, in image pixels, with its wings up and down */
export const CROW_PIXELS = [
  ["...hw.......", "...www......", "....www.....", "....bwwbbe..", "bbbbbbbbbbkk", ".bbbbbbbbb..", "...bbbbb...."],
  ["........bbe.", "bbbbbbbbbbkk", ".bbbbwwbbb..", "...bwwwb....", "...www......", "..www.......", "..hw........"],
] as const;
/** a crow: ink body, paler wing feathers with a lit tip, a rose beak and eye */
export const CROW_COLORS: PixelColors = { b: G[1], w: G[2], h: G[3], k: G[4], e: G[5] };

/** a Hollow Wraith in image pixels: an empty hood with two eyes over a robe that ends in rags */
export const WRAITH_PIXELS = [
  "....kkkkkk....",
  "...kbbbbbbk...",
  "..kbbmmmmbbk..",
  "..kbmddddmbk..",
  ".kbbdeddedbbk.",
  ".kbbddddddbbk.",
  ".kbmbddddbmbk.",
  "kbbmbbbbbbmbbk",
  "kbmmbbbbbbmmbk",
  "kbmbbbbbbbbmbk",
  "kbbbbbbbbbbbbk",
  ".kbbbbbbbbbbk.",
  ".kbbbbbbbbbbk.",
  "..kbbbbbbbbk..",
  "..kbbbkbbbbk..",
  "..kbbk.kbbbk..",
  "...kbk.kbbk...",
  "...kk...kbk...",
  ".........kk...",
] as const;
/** a wraith: a plum edge so it reads on a dark scene, ink robe with paler folds, a black hollow and rose eyes */
export const WRAITH_COLORS: PixelColors = { k: G[3], b: G[1], m: G[2], d: G[0], e: G[5] };
/** the letters of a wraith drawn solid; the rest of it lets the scene through */
export const WRAITH_SOLID = "ke";

/** a caltrop on the floor in image pixels, its top spike leaning either way */
export const CALTROP_PIXELS = [
  ["..t..", ".sbs.", "sbbbs"],
  [".t...", ".sbs.", "sbbbs"],
] as const;
export const CALTROP_COLORS: PixelColors = { t: G[5], s: G[4], b: G[2] };

/** a footprint Quiet Step leaves, in image pixels */
export const PRINT_PIXELS = [".hmm.", "mmmmh"] as const;
export const PRINT_COLORS: PixelColors = { m: G[2], h: G[3] };
