import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";

const HALF = 0.5;

const SHAPES: readonly (readonly (readonly [number, number])[])[] = [
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [1, 1],
    [1, 2],
  ],
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 1],
    [2, 2],
  ],
  [
    [0, 2],
    [1, 1],
    [2, 0],
    [0, 0],
  ],
  [
    [0, 0],
    [2, 0],
    [1, 1],
    [0, 2],
    [2, 2],
  ],
  [
    [1, 0],
    [0, 1],
    [2, 1],
    [1, 2],
  ],
];

export function letter(s: SpriteCanvas, x: number, y: number, which: number, c: Color, hot: Color): void {
  const shape = SHAPES[((which % SHAPES.length) + SHAPES.length) % SHAPES.length];
  shape.forEach(([dx, dy], i) => {
    s.set(x + dx * HALF, y + dy * HALF, i === 0 ? hot : c);
  });
}
