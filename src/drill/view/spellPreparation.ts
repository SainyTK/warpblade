import { W } from "../../constants/stage";
import { glow, hairline, place, polygon } from "../../engine/frame";
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

function bar(x: number, y: number, width: number, height: number, color: number): void {
  polygon(
    [
      [x, y],
      [x + width, y],
      [x + width, y + height],
      [x, y + height],
    ],
    color,
  );
}

export function drawSpellPreparation({ x, y, spellBook }: Fighter, cameraX: number): void {
  const { preparation, selectionCue, selected } = spellBook;
  const preparing = !!preparation && preparation.remaining > 0;
  if (!preparing && selectionCue <= 0) {
    return;
  }
  const { color, core, look } = selected;
  const progress = preparing ? clamp(1 - preparation.remaining / preparation.duration) : 0;
  const alpha = preparing ? 1 : clamp(selectionCue / (SPELL_SELECTION_CUE * 0.35));
  const center = clamp(x, cameraX + 23, cameraX + W - 23);
  const top = Math.max(7, y - 49);
  place();
  for (const [i, glyph] of SIGILS[look].entries()) {
    const gx = center + (i - 2) * 7;
    const gy = top + Math.sin(progress * 32 - i) * 1.5;
    const flash = alpha * (0.57 + 0.43 * (0.5 + 0.5 * Math.sin(progress * 41 + i * 1.32)));
    glow(gx, gy, 5, color, flash * 0.32);
    for (const [[x0, y0], [x1, y1]] of GLYPHS[glyph]) {
      hairline(gx + x0, gy + y0, gx + x1, gy + y1, i % 2 ? core : color, flash);
    }
  }
  if (preparing) {
    const width = 38;
    const gx = center - width / 2;
    const gy = top + 7;
    bar(gx, gy, width, 4, 0x72839a);
    bar(gx + 0.65, gy + 0.65, width - 1.3, 2.7, 0x131b2c);
    if (progress > 0) {
      bar(gx + 0.65, gy + 0.65, (width - 1.3) * progress, 2.7, color);
      if (progress > 0.07) {
        hairline(gx + 1, gy + 1, gx + (width - 1.3) * progress, gy + 1, core, 0.72);
      }
    }
  }
}
