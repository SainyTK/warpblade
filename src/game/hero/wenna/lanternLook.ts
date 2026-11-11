import { COIN_GOLD, HERO_COLORS as HC, PAL } from "../../../constants/palette";
import type { Color } from "../../../types/color";
import { WHITE } from "../../../utils/color";

/** paints one image pixel (half an art pixel a side) at a place in art pixels */
export type PutPixel = (x: number, y: number, c: Color) => void;

const W = PAL.wick;
const GOLD = COIN_GOLD[3];

/**
 * The lantern's iron, one letter an image pixel, its top two rows the ring the chain runs through: L lit iron, B iron,
 * D iron in shade, "g" where the glass and the flame go.
 */
const IRON = [
  "....LB....",
  "...L..D...",
  "...LBBD...",
  "..LBBBBD..",
  ".LLBBBBBD.",
  ".LggggggD.",
  ".LggggggD.",
  ".LggggggD.",
  ".LggggggD.",
  ".LggggggD.",
  ".LBBBBBDD.",
  "..DDDDDD..",
] as const;
/** rows of the picture above the lantern's own top left corner: the ring */
const RING_ROWS = 2;
/** where the glass starts in the picture */
const GLASS = { col: 2, row: 5 } as const;

/**
 * The flame behind the glass, three flicker shapes: g glass, h a glint on the glass, f flame, F its bright heart, o the
 * gold root.
 */
const FLAMES: readonly (readonly string[])[] = [
  ["hgffgg", "hfFFfg", "gfFFfg", "gfoofg", "ggoogg"],
  ["hfgggg", "hfFfgg", "gfFFfg", "gfoofg", "ggoogg"],
  ["hgggfg", "hgfFfg", "gfFFfg", "gfoofg", "ggoogg"],
];

/** the glass and flame colours at a brightness from 0 (at rest) to 1 (shutter open) */
function inner(ch: string, bright: number): Color {
  const lift = bright > 0.66 ? 2 : bright > 0.33 ? 1 : 0;
  if (ch === "o") return bright > 0.8 ? WHITE : GOLD;
  if (ch === "F") return lift >= 1 ? WHITE : W[5];
  if (ch === "f") return W[3 + lift];
  if (ch === "h") return W[2 + lift];
  return W[1 + lift];
}

const iron = (ch: string): Color => (ch === "L" ? HC.bladeEdge : ch === "B" ? HC.blade : HC.bladeDeep);

/**
 * The lantern at full detail, its top left corner at (x, y) in art pixels: a ring for the chain over a peaked iron cap,
 * an iron frame lit from the top left round violet glass with the flame flickering inside on a gold root, and an iron
 * foot. `flicker` picks the flame's shape; `bright` lifts the glass and flame toward white as the shutter opens.
 */
export function paintLantern(put: PutPixel, x: number, y: number, bright: number, flicker: number): void {
  const flame = FLAMES[((flicker % FLAMES.length) + FLAMES.length) % FLAMES.length];
  IRON.forEach((line, row) => {
    for (let col = 0; col < line.length; col++) {
      const ch = line[col];
      if (ch === ".") continue;
      const c = ch === "g" ? inner(flame[row - GLASS.row][col - GLASS.col], bright) : iron(ch);
      put(x + col / 2, y + (row - RING_ROWS) / 2, c);
    }
  });
}
