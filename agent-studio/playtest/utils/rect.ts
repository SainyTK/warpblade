export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** the smallest whole-pixel box around all of these */
export function unionRect(rects: readonly Rect[]): Rect {
  const left = Math.floor(Math.min(...rects.map((r) => r.x)));
  const top = Math.floor(Math.min(...rects.map((r) => r.y)));
  const right = Math.ceil(Math.max(...rects.map((r) => r.x + r.width)));
  const bottom = Math.ceil(Math.max(...rects.map((r) => r.y + r.height)));
  return { x: left, y: top, width: right - left, height: bottom - top };
}

/** the height for this width at the box's aspect, rounded to an even number as H.264 needs */
export function evenHeight(box: Rect, width: number): number {
  return Math.max(2, Math.round((box.height * width) / box.width / 2) * 2);
}
