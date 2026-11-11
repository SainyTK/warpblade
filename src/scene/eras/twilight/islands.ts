import { RES } from "../../../constants/stage";
import type { Color } from "../../../types/color";
import { mix } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { LAYER } from "../../plate";
import type { PlatePaint } from "../../platePaint";
import { fillPoly, hairline, type Pt } from "./brush";
import { CRYSTAL, CRYSTAL_TEAL, ISLAND_MOSS, ROCK } from "./colors";
import { paintCluster, paintShard } from "./crystal";
import { grownBy, sizeAt } from "./growth";

/** Rocks and loose shards floating in the far sky, torn up from the ruins as the veil thins. */

/** floating rocks: x, y of the top's middle and width in art pixels, and the k at which each has drifted into view */
export const ISLANDS: readonly (readonly [number, number, number, number])[] = [
  [104, 22, 9, 0],
  [54, 62, 7, 0.25],
  [132, 54, 6, 0.5],
  [300, 74, 7, 0.75],
  [186, 40, 5, 1],
];
/** loose shards hanging in the air: x, y in art pixels, length in image pixels, lean in radians, the k each appears at */
const SHARDS: readonly (readonly [number, number, number, number, number])[] = [
  [38, 30, 7, 0.5, 0],
  [146, 16, 6, -0.4, 0],
  [226, 58, 8, 0.3, 0.25],
  [88, 78, 6, -0.7, 0.25],
  [276, 96, 6, 0.9, 0.5],
  [180, 70, 5, -0.2, 0.5],
  [12, 94, 7, 0.4, 0.75],
  [118, 8, 5, 1.1, 0.75],
  [240, 12, 6, -0.9, 1],
  [316, 54, 7, 0.2, 1],
];
const OPEN_SKY = [LAYER.sky, LAYER.celestial] as const;
/** how far the rocks and shards fade into the sky behind them */
const HAZE = 0.22;
const SHARD_HAZE = 0.3;

function paintIsland(paint: PlatePaint, x: number, y: number, w: number, size: number, sky: Color): void {
  const cx = x * RES;
  const top = y * RES;
  const half = w * size;
  const depth = half * 1.7;
  const hazed = (c: Color): Color => mix(c, sky, HAZE);
  const outline: Pt[] = [
    [cx - half, top],
    [cx + half, top],
    [cx + half * 0.95, top + depth * 0.18],
    [cx + half * 0.5, top + depth * 0.5],
    [cx + half * 0.3, top + depth * 0.62],
    [cx + half * 0.12, top + depth],
    [cx - half * 0.2, top + depth * 0.66],
    [cx - half * 0.5, top + depth * 0.7],
    [cx - half * 0.72, top + depth * 0.3],
    [cx - half, top + depth * 0.14],
  ];
  fillPoly(
    paint,
    outline,
    (ix, iy) => {
      const row = iy - Math.floor(top);
      if (row === 0) return hazed(ISLAND_MOSS.tip);
      if (row === 1) return hazed(grain(ix, 3) < 0.7 ? ISLAND_MOSS.body : ROCK[2]);
      const lit = ((ix - cx) / half) * 0.8 - ((iy - top) / depth) * 1.1 + (grain(ix >> 1, iy >> 1) - 0.5) * 0.5;
      return hazed(ROCK[lit > 0.35 ? 3 : lit > -0.25 ? 2 : lit > -0.9 ? 1 : 0]);
    },
    OPEN_SKY,
  );
  // the veil's light along the right edge, and a root hanging from the underside
  hairline(paint, cx + half, top + 1, cx + half * 0.5, top + depth * 0.5, hazed(ROCK[4]), 0.8, OPEN_SKY);
  hairline(
    paint,
    cx - half * 0.45,
    top + depth * 0.7,
    cx - half * 0.5,
    top + depth * 0.7 + 3,
    hazed(ROCK[1]),
    1,
    OPEN_SKY,
  );
  paintCluster(paint, cx - half * 0.25, top, half * 1.5, w, { tones: CRYSTAL, tint: hazed, only: OPEN_SKY });
  paintShard(paint, cx + half * 0.55, top, 0.5, half * 0.7, 1.3, { tones: CRYSTAL_TEAL, tint: hazed, only: OPEN_SKY });
}

export function paintIslands(paint: PlatePaint, k: number, sky: Color): void {
  for (const [x, y, length, lean, from] of SHARDS)
    if (grownBy(k, from))
      paintShard(paint, x * RES, y * RES, lean, length, 1.4, {
        tones: (x + y) % 3 === 0 ? CRYSTAL_TEAL : CRYSTAL,
        tint: (c) => mix(c, sky, SHARD_HAZE),
        only: OPEN_SKY,
      });
  for (const [x, y, w, from] of ISLANDS) {
    const size = sizeAt(k, from);
    if (size > 0) paintIsland(paint, x, y, w, size, sky);
  }
}
