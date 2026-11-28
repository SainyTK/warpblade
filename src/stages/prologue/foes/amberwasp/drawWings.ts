import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { scale } from "../../../../utils/color";
import { pointInPolygon } from "../../../../utils/pointInPolygon";
import { WASP_COLORS as WC } from "./colors";

type Pt = readonly [number, number];
export type Place = (x: number, y: number) => Pt;

const FORE: readonly Pt[] = [
  [0, -0.6],
  [5, -2],
  [11, -2.4],
  [13.5, -1],
  [12, 1],
  [6, 1.6],
  [0, 0.8],
];
const HIND: readonly Pt[] = [
  [0, -0.4],
  [4, -1.4],
  [8, -1],
  [7.5, 1],
  [3, 1.2],
];
const FLAP = [-2.35, -1.95, -1.45] as const;

function along(at: Place, root: Pt, angle: number, u: number, v: number): Pt {
  return at(root[0] + u * Math.cos(angle) - v * Math.sin(angle), root[1] + u * Math.sin(angle) + v * Math.cos(angle));
}

function membrane(s: SpriteCanvas, at: Place, root: Pt, angle: number, shape: readonly Pt[], dim: number): void {
  const c = (col: Color): Color => (dim < 1 ? scale(col, dim) : col);
  const step = 1 / s.res;
  const tip = shape.reduce((m, [u]) => Math.max(m, u), 0);
  for (let u = 0.5; u < tip; u += step)
    for (let v = -2.5; v <= 2; v += step) {
      if (!pointInPolygon(shape, u, v)) continue;
      const iu = Math.round(u * s.res);
      const iv = Math.round(v * s.res);
      if ((iu + iv) % 2) continue;
      const [x, y] = along(at, root, angle, u, v);
      s.set(x, y, c(u > tip * 0.75 ? WC.wingSheen : WC.wing));
    }
  for (let i = 0; i < shape.length; i++) {
    const [u0, v0] = shape[i];
    const [u1, v1] = shape[(i + 1) % shape.length];
    const [ax, ay] = along(at, root, angle, u0, v0);
    const [bx, by] = along(at, root, angle, u1, v1);
    s.hairline(ax, ay, bx, by, c(i < 3 ? WC.wingVein : WC.wingEdge));
  }
  const [vx, vy] = along(at, root, angle, tip * 0.85, -0.2);
  const [rx, ry] = along(at, root, angle, 0.5, 0);
  s.hairline(rx, ry, vx, vy, c(WC.wingVein));
}

export function wings(s: SpriteCanvas, at: Place, flap: number, dim: number): void {
  const angle = FLAP[flap];
  s.begin();
  membrane(s, at, [0, -3.2], angle + (dim < 1 ? 0.3 : 0), FORE, dim);
  membrane(s, at, [-1, -2.6], angle - 0.5 + (dim < 1 ? 0.3 : 0), HIND, dim);
  s.commit(false);
}
