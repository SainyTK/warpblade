import type { Color } from '@game/types/color';
import { pixelKey } from '@shared/utils/celRows';
import { ORIGIN_X, ORIGIN_Y, STAGE_H, STAGE_W } from '@/constants/stage';
import type { Point } from '@/types/studio';

export type Pixels = Record<string, number>;

/** Stage art pixels to a cel's coordinates, which start at Kael's feet at the start of the motion. */
export const toCel = ([x, y]: Point): Point => [Math.floor(x) - ORIGIN_X, Math.floor(y) - ORIGIN_Y];

/** Every pixel on the line from a to b. */
export function linePoints([x0, y0]: Point, [x1, y1]: Point): Point[] {
  const points: Point[] = [];
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  let x = x0;
  let y = y0;
  for (;;) {
    points.push([x, y]);
    if (x === x1 && y === y1) {
      return points;
    }
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
  }
}

/** The square brush footprint around a point. */
export function brushPoints([x, y]: Point, size: number): Point[] {
  const start = -Math.floor((size - 1) / 2);
  const points: Point[] = [];
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      points.push([x + start + i, y + start + j]);
    }
  }
  return points;
}

/** Paints (or with a null color, erases) points into a copy of the pixels. */
export function paintPoints(pixels: Pixels, points: readonly Point[], color: Color | null): Pixels {
  const next = { ...pixels };
  for (const [x, y] of points) {
    if (color === null) {
      delete next[pixelKey(x, y)];
    } else {
      next[pixelKey(x, y)] = color;
    }
  }
  return next;
}

/** Fills the region of same-colored pixels around a point, kept inside the stage window. */
export function floodFill(pixels: Pixels, start: Point, color: Color | null): Pixels {
  const target = pixels[pixelKey(start[0], start[1])] ?? null;
  if (target === color) {
    return pixels;
  }
  const minX = -ORIGIN_X;
  const minY = -ORIGIN_Y;
  const maxX = STAGE_W - ORIGIN_X - 1;
  const maxY = STAGE_H - ORIGIN_Y - 1;
  const seen = new Set<string>();
  const region: Point[] = [];
  const stack: Point[] = [start];
  while (stack.length) {
    const point = stack.pop();
    if (!point) {
      break;
    }
    const [x, y] = point;
    const key = pixelKey(x, y);
    if (x < minX || y < minY || x > maxX || y > maxY || seen.has(key)) {
      continue;
    }
    seen.add(key);
    if ((pixels[key] ?? null) !== target) {
      continue;
    }
    region.push(point);
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  return paintPoints(pixels, region, color);
}
