import type { Color, Ramp } from "../../../types/color";
import type { PlatePaint } from "../../platePaint";
import { fillPoly, hairline, type Only, type Pt } from "./brush";

/** Crystal shards painted on the plate, in image pixels: three facets lit from the upper right, a hot edge and tip. */

/** one shard of a cluster, as shares of the cluster's size: where its foot sits, its lean from upright in degrees, its length and half width */
type ShardShape = readonly [foot: number, lean: number, length: number, half: number];
/** the cluster shapes: a tall spire with smaller shards leaning out around its foot */
export const CLUSTERS: readonly (readonly ShardShape[])[] = [
  [
    [-0.3, -34, 0.6, 0.13],
    [0.34, 30, 0.7, 0.14],
    [0, -6, 1, 0.17],
    [-0.5, -62, 0.34, 0.1],
    [0.52, 56, 0.38, 0.1],
  ],
  [
    [0.3, 38, 0.55, 0.13],
    [-0.28, -22, 0.78, 0.15],
    [0.06, 10, 1, 0.16],
    [-0.5, -52, 0.4, 0.1],
  ],
  [
    [-0.26, -40, 0.5, 0.12],
    [0.1, 4, 1, 0.18],
    [0.42, 44, 0.46, 0.12],
  ],
];
const FACET = { lit: 0.25, shade: -0.3, root: 0.18, crown: 0.8 };
const LIT_EDGE = 0.85;
const SHADE_EDGE = 0.55;

export interface CrystalStyle {
  /** five tones from the deep root to the hot tip */
  tones: Ramp;
  /** recolors each tone, for haze on far crystals */
  tint?: (c: Color) => Color;
  only?: Only;
}

/** one shard growing from (bx, by) for `length` pixels along `angle`, in radians clockwise from straight up */
export function paintShard(
  paint: PlatePaint,
  bx: number,
  by: number,
  angle: number,
  length: number,
  half: number,
  style: CrystalStyle,
): void {
  const tint = style.tint ?? ((c: Color) => c);
  const tones = style.tones.map(tint);
  const dx = Math.sin(angle);
  const dy = -Math.cos(angle);
  // the side whose face turns toward the light at the upper right
  const lit = dy - dx < 0 ? 1 : -1;
  const px = -dy * lit;
  const py = dx * lit;
  const at = (along: number, side: number): Pt => [
    bx + dx * length * along + px * half * side,
    by + dy * length * along + py * half * side,
  ];
  const tip = at(1, 0);
  const litShoulder = at(0.35, 1);
  const shadeShoulder = at(0.35, -1);
  fillPoly(
    paint,
    [at(0, 0.7), litShoulder, tip, shadeShoulder, at(0, -0.7)],
    (ix, iy) => {
      const rx = ix + 0.5 - bx;
      const ry = iy + 0.5 - by;
      const along = (rx * dx + ry * dy) / length;
      const side = (rx * px + ry * py) / half;
      let tone = side > FACET.lit ? 3 : side > FACET.shade ? 2 : 1;
      if (along < FACET.root) tone--;
      else if (along > FACET.crown && side > FACET.shade) tone++;
      return tones[tone];
    },
    style.only,
  );
  hairline(paint, shadeShoulder[0], shadeShoulder[1], tip[0], tip[1], tones[0], SHADE_EDGE, style.only);
  hairline(paint, litShoulder[0], litShoulder[1], tip[0], tip[1], tones[4], LIT_EDGE, style.only);
  paint.put(Math.floor(tip[0]), Math.floor(tip[1]), tones[4], style.only);
}

/** a cluster of shards rooted at (bx, by), `size` pixels tall, growing along `angle` */
export function paintCluster(
  paint: PlatePaint,
  bx: number,
  by: number,
  size: number,
  shape: number,
  style: CrystalStyle,
  angle = 0,
): void {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  for (const [foot, lean, length, half] of CLUSTERS[shape % CLUSTERS.length])
    paintShard(
      paint,
      bx + foot * size * 0.5 * cos,
      by + foot * size * 0.5 * sin,
      angle + (lean * Math.PI) / 180,
      Math.max(3, length * size),
      Math.max(1.2, half * size),
      style,
    );
}
