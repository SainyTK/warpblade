export type EditorMode = 'motion' | 'effect';
export type PaintTool = 'pencil' | 'eraser' | 'line' | 'fill' | 'picker';

/** A pixel buffer of 0xRRGGBB colors, 0 for empty. */
export interface Raster {
  w: number;
  h: number;
  d: Uint32Array;
}

/** A point in art pixels. */
export type Point = readonly [number, number];
