import { EMBER } from "../../../constants/characters/ysra/look";
import { glow, place, px } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import { WHITE } from "../../../utils/color";

/**
 * The salamander facing right, feet on the bottom row: a dark back over a bright belly, a blunt head with a white eye,
 * a tail held out behind. `c` is the Magma Drake's crest, drawn only on the drake. Legs and jaw are drawn apart, since
 * they move.
 */
const BODY = [
  "..........ccc....",
  "....c.c.c.bhhh...",
  ".tt.bbbbbbbhhwh..",
  "ttBtBBBBBBBBhhhhj",
  "t..t.........hh..",
] as const;
/** the two leg poses of the gait: legs under the body's front and back, reaching or tucked */
const LEGS = [
  [5, 7, 10, 12],
  [6, 6, 11, 11],
] as const;

const COLORS: Readonly<Record<string, Color>> = {
  b: EMBER[2],
  B: EMBER[4],
  h: EMBER[3],
  w: WHITE,
  t: EMBER[3],
  j: EMBER[4],
  c: EMBER[5],
};

/**
 * A fire salamander on the floor at (x, y) facing `face`, `scale` pixels to each of its pixels (2 for the Magma Drake,
 * which also wears a crest of flame). `stride` is the gait's phase; `open` drops the jaw while it bites or breathes.
 */
export function drawSalamander(x: number, y: number, face: number, stride: number, scale: number, open: number): void {
  place();
  const drake = scale > 1;
  const top = y - (BODY.length + 1) * scale;
  const left = -8;
  const put = (col: number, row: number, c: Color) => {
    for (let i = 0; i < scale; i++)
      for (let j = 0; j < scale; j++) px(x + face * ((left + col) * scale + i), top + row * scale + j, c);
  };
  const swish = Math.round(Math.sin(stride * Math.PI * 2));
  BODY.forEach((line, row) => {
    for (let col = 0; col < line.length; col++) {
      const k = line[col];
      if (k === "." || (k === "c" && !drake)) continue;
      // the tail swishes up and down; the jaw drops open while it bites
      const r = k === "t" ? row + (col < 2 ? swish : 0) : k === "j" ? row + open : row;
      put(col, r, COLORS[k]);
    }
  });
  const legs = LEGS[Math.floor(stride * 2) % 2];
  for (const col of legs) put(col, BODY.length, EMBER[1]);
  glow(x, y - 3 * scale, 9 * scale, EMBER[4], drake ? 0.45 : 0.3);
}
