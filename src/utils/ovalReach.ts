import type { Box } from "../types/world";

/** whether an oval centred at (cx, cy) with radii rx and ry touches a box: its nearest point lies inside the oval */
export function ovalReachesBox(cx: number, cy: number, rx: number, ry: number, box: Box): boolean {
  const nx = Math.min(Math.max(cx, box[0]), box[2]);
  const ny = Math.min(Math.max(cy, box[1]), box[3]);
  const dx = (nx - cx) / rx;
  const dy = (ny - cy) / ry;
  return dx * dx + dy * dy <= 1;
}
