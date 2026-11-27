import { px } from "../../../engine/frame";
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

const shapeOf = (which: number) => SHAPES[((which % SHAPES.length) + SHAPES.length) % SHAPES.length];

export function letter(s: SpriteCanvas, x: number, y: number, which: number, c: Color, hot: Color): void {
  shapeOf(which).forEach(([dx, dy], i) => {
    s.set(x + dx * HALF, y + dy * HALF, i === 0 ? hot : c);
  });
}

export function bigLetter(x: number, y: number, which: number, c: Color, hot: Color, a = 1): void {
  shapeOf(which).forEach(([dx, dy], i) => {
    px(x + dx, y + dy, i === 0 ? hot : c, a);
  });
}
