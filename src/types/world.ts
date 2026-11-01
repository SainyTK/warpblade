export interface Point {
  x: number;
  y: number;
}
export interface Platform {
  x0: number;
  x1: number;
  y: number;
}
/** [left, top, right, bottom] in stage pixels. */
export type Box = readonly [number, number, number, number];
