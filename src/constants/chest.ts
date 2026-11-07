import { hex } from "../utils/color";
import { COIN_GOLD } from "./palette";

/** The chest as drawn on the floor, 13 by 10 art pixels with its feet at the bottom middle. */
export const CHEST_ROWS = [
  "..DDDDDDDDD..",
  ".DwWWWWWWWwD.",
  "DwWwwwwwwwWwD",
  "DgGGGGGGGGGgD",
  "DDDDDgLgDDDDD",
  "DwwwwgLgwwwwD",
  "DwwwwgggwwwwD",
  "DdwwwwwwwwwdD",
  "DgGGGGGGGGGgD",
  "DDDDDDDDDDDDD",
] as const;
export const CHEST_COLORS = {
  D: hex("#1a0f0c"),
  d: hex("#5a3418"),
  w: hex("#8a5228"),
  W: hex("#b8763a"),
  g: COIN_GOLD[1],
  G: COIN_GOLD[3],
  L: COIN_GOLD[4],
} as const;
