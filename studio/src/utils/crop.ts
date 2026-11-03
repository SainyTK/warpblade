import type { Raster } from '@/types/studio';

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** The smallest box around every drawn pixel of the rasters, padded and kept inside them. */
export function contentBox(rasters: readonly Raster[], pad: number): Box {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (const r of rasters) {
    for (let y = 0; y < r.h; y++) {
      for (let x = 0; x < r.w; x++) {
        if (r.d[y * r.w + x]) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }
  }
  const first = rasters[0];
  if (!first || minX > maxX) {
    return { x: 0, y: 0, w: first?.w ?? 1, h: first?.h ?? 1 };
  }
  const x = Math.max(0, minX - pad);
  const y = Math.max(0, minY - pad);
  return {
    x,
    y,
    w: Math.min(first.w, maxX + pad + 1) - x,
    h: Math.min(first.h, maxY + pad + 1) - y,
  };
}

/** A copy of part of a raster; parts outside it stay empty. */
export function cropRaster(r: Raster, box: Box): Raster {
  const d = new Uint32Array(box.w * box.h);
  for (let y = 0; y < box.h; y++) {
    for (let x = 0; x < box.w; x++) {
      const sx = box.x + x;
      const sy = box.y + y;
      if (sx >= 0 && sy >= 0 && sx < r.w && sy < r.h) {
        d[y * box.w + x] = r.d[sy * r.w + sx] ?? 0;
      }
    }
  }
  return { w: box.w, h: box.h, d };
}
