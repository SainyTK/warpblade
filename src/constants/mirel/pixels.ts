import { hex } from "../../utils/color";
import type { PixelColors } from "../effectColors";
import { PAL, SAND } from "../palette";

/** a Clockwork Wren facing right, in image pixels, with its wings up and down: brass, a teal eye, a key on its back */
export const WREN_PIXELS = [
  ["...ll.......", "..lll..k....", "...llb.k.dd.", ".dbbbbbbbleo", "dbbbbbbbbbd.", ".ddbbbbbdd..", "...ddddd...."],
  [".......k....", ".......k.dd.", ".dbbbbbbbleo", "dbbbllbbbbd.", ".ddlllbbdd..", "...lll......", "...ll......."],
] as const;
export const WREN_COLORS: PixelColors = {
  b: SAND.shade,
  l: SAND.light,
  d: hex("#4a3a22"),
  e: PAL.hour[4],
  k: PAL.hour[3],
  o: hex("#fff3c8"),
};
