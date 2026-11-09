import { COIN_GOLD, HERO_COLORS as HC, PAL } from "../../../constants/palette";
import { LANTERN } from "../../../constants/wenna/lantern";
import type { Color } from "../../../types/color";
import { WHITE } from "../../../utils/color";

/** paints one art pixel */
export type PutPixel = (x: number, y: number, c: Color) => void;

const W = PAL.wick;
const GOLD = COIN_GOLD[3];

/** the flame inside the glass, three flicker shapes, 3 by 3: f flame, F its bright heart, g glass, o the gold core */
const FLAMES: readonly (readonly string[])[] = [
  ["gfg", "fFf", "gog"],
  ["fgg", "fFf", "gog"],
  ["ggf", "fFg", "gog"],
];

/** the glass and flame colours at a brightness from 0 (at rest) to 1 (shutter open) */
function inner(ch: string, bright: number): Color {
  const lift = bright > 0.66 ? 2 : bright > 0.33 ? 1 : 0;
  if (ch === "o") return bright > 0.8 ? WHITE : GOLD;
  if (ch === "F") return lift >= 1 ? WHITE : W[5];
  if (ch === "f") return W[3 + lift];
  return W[1 + lift];
}

/**
 * The lantern, its top left corner at (x, y): a ring for the chain over an iron cap, an iron frame lit from the top left
 * round three panes of violet glass with the flame flickering inside on a gold core, and an iron foot. `flicker` picks
 * the flame's shape; `bright` lifts the glass and flame toward white as the shutter opens.
 */
export function paintLantern(put: PutPixel, x: number, y: number, bright: number, flicker: number): void {
  const n = LANTERN.size;
  put(x + 2, y - 1, HC.bladeBack);
  put(x + 1, y, HC.bladeEdge);
  put(x + 2, y, HC.blade);
  put(x + 3, y, HC.bladeBack);
  for (let row = 1; row < n - 1; row++) {
    put(x, y + row, HC.blade);
    put(x + n - 1, y + row, HC.bladeDeep);
  }
  put(x, y + n - 1, HC.blade);
  for (let col = 1; col < n - 1; col++) put(x + col, y + n - 1, HC.bladeBack);
  put(x + n - 1, y + n - 1, HC.bladeDeep);
  const shape = FLAMES[((flicker % FLAMES.length) + FLAMES.length) % FLAMES.length];
  shape.forEach((rowText, row) => {
    for (let col = 0; col < rowText.length; col++) put(x + 1 + col, y + 1 + row, inner(rowText[col], bright));
  });
}
