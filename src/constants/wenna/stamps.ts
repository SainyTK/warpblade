import { PAL } from "../palette";
import { WICK_FLAME, WICK_WAX } from "./wickLook";

/** the letters every small wax picture uses: k its dark line, L lit wax, W wax, w its shaded side, d its deep shade */
export const WAX_LETTERS = {
  k: WICK_WAX.ink,
  L: WICK_WAX.light,
  W: WICK_WAX.body,
  w: WICK_WAX.mid,
  d: WICK_WAX.shade,
} as const;

/** a flame's letters: f its edge, F its body, h its heart, o its gold root */
export const FLAME_LETTERS = {
  f: WICK_FLAME.edge,
  F: WICK_FLAME.body,
  h: WICK_FLAME.heart,
  o: WICK_FLAME.root,
} as const;

/** a drip of wax a fallen foe leaves: a bead with a lit side, one letter an image pixel */
export const DRIP_ART = [
  "...kk...",
  "..kLWk..",
  "..kLWk..",
  ".kLWWwk.",
  ".kLWWwk.",
  "kLWWWwdk",
  "kLWWwwdk",
  "kWWwwddk",
  ".kwwddk.",
  "..kkkk..",
] as const;

/** a small candle: the ghost candle of Remembrance and each candle of Great Wick's field */
export const CANDLE_ART = [
  "..kk..",
  ".kLWk.",
  ".kLWk.",
  ".kLWk.",
  ".kLwk.",
  ".kLwk.",
  ".kWwk.",
  ".kWwk.",
  ".kwdk.",
  "..kk..",
] as const;

/** a candle's small flame, in its flicker shapes */
export const CANDLE_FLAMES: readonly (readonly string[])[] = [
  ["..f...", "..Ff..", ".fhFf.", ".fhhf.", "..oo.."],
  [".f....", ".fF...", ".fhFf.", ".fhhf.", "..oo.."],
  ["...f..", "..fF..", ".fFhf.", ".fhhf.", "..oo.."],
];

/** a lampfly, wings out and wings in */
export const LAMPFLY_ART: readonly (readonly string[])[] = [
  ["f.h.f", ".FhF.", "..o.."],
  ["..h..", ".fhf.", "..o.."],
];

/** the marker under a Quarry's ring, pointing down at the foe: v its violet, k its dark line */
export const QUARRY_MARK = ["kvvvvvk", ".kvvvk.", "..kvk..", "...k..."] as const;
export const QUARRY_LETTERS = { k: PAL.wick[0], v: PAL.wick[4] } as const;
