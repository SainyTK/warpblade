import { W } from "../../constants/stage";
import { glow, hairline, place } from "../../engine/frame";
import type { Fighter } from "../../types/drill";
import type { Vec } from "../../types/rig";
import { clamp } from "../../utils/math";
import { SPELL_SELECTION_CUE } from "../constants";

const GLYPHS: readonly (readonly (readonly [Vec, Vec])[])[] = [
  [
    [
      [-2, 3],
      [0, -3],
    ],
    [
      [0, -3],
      [2, 3],
    ],
    [
      [-1, 0],
      [1, 0],
    ],
  ],
  [
    [
      [-2, -3],
      [2, -3],
    ],
    [
      [2, -3],
      [-2, 3],
    ],
    [
      [-2, 3],
      [2, 3],
    ],
    [
      [-1, 0],
      [1, 0],
    ],
  ],
  [
    [
      [0, -3],
      [0, 3],
    ],
    [
      [0, -3],
      [-2, -0.5],
    ],
    [
      [0, -3],
      [2, -0.5],
    ],
  ],
  [
    [
      [-2, 3],
      [-2, -3],
    ],
    [
      [-2, -3],
      [2, -1],
    ],
    [
      [-2, 0],
      [2, -1],
    ],
    [
      [-2, 0],
      [2, 3],
    ],
  ],
  [
    [
      [0, -3],
      [2, 0],
    ],
    [
      [2, 0],
      [0, 3],
    ],
    [
      [0, 3],
      [-2, 0],
    ],
    [
      [-2, 0],
      [0, -3],
    ],
  ],
  [
    [
      [-2, -3],
      [-2, 3],
    ],
    [
      [2, -3],
      [2, 3],
    ],
    [
      [-2, -1],
      [2, 1],
    ],
  ],
];
const SIGILS = {
  flame: [0, 3, 2, 5, 0],
  shard: [4, 5, 0, 4, 2],
  spark: [1, 2, 3, 1, 5],
};

export function drawSpellSelection({ x, y, spellBook }: Fighter, cameraX: number): void {
  const { selectionCue, selected } = spellBook;
  if (selectionCue <= 0) {
    return;
  }
  const { color, core, look } = selected;
  const alpha = clamp(selectionCue / (SPELL_SELECTION_CUE * 0.35));
  const turn = SPELL_SELECTION_CUE - selectionCue;
  const center = clamp(x, cameraX + 23, cameraX + W - 23);
  const top = Math.max(7, y - 49);
  place();
  for (const [i, glyph] of SIGILS[look].entries()) {
    const gx = center + (i - 2) * 7;
    const gy = top + Math.sin(turn * 9 - i) * 1.5;
    const flash = alpha * (0.57 + 0.43 * (0.5 + 0.5 * Math.sin(turn * 12 + i * 1.32)));
    glow(gx, gy, 5, color, flash * 0.32);
    for (const [[x0, y0], [x1, y1]] of GLYPHS[glyph]) {
      hairline(gx + x0, gy + y0, gx + x1, gy + y1, i % 2 ? core : color, flash);
    }
  }
}
