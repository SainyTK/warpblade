import { CHAIN_LOOK } from "../../../constants/orrin/chainLook";
import { HERO_COLORS as HC } from "../../../constants/palette";
import { RES } from "../../../constants/stage";
import { putImage, toScreenX, toScreenY } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import type { Point } from "../../../types/world";

/** each link of the chain being drawn: its middle in image pixels and the chain's direction there */
const linkX = new Float32Array(CHAIN_LOOK.most);
const linkY = new Float32Array(CHAIN_LOOK.most);
const linkUx = new Float32Array(CHAIN_LOOK.most);
const linkUy = new Float32Array(CHAIN_LOOK.most);

/** lay links a pitch apart along the path, and return how many */
function layLinks(path: readonly Point[], count: number): number {
  let n = 0;
  let next = CHAIN_LOOK.pitch / 2;
  let ax = toScreenX(path[0].x) * RES;
  let ay = toScreenY(path[0].y) * RES;
  for (let i = 1; i < count; i++) {
    const bx = toScreenX(path[i].x) * RES;
    const by = toScreenY(path[i].y) * RES;
    const len = Math.hypot(bx - ax, by - ay);
    if (len > 1e-3) {
      const ux = (bx - ax) / len;
      const uy = (by - ay) / len;
      for (; next <= len && n < CHAIN_LOOK.most; next += CHAIN_LOOK.pitch, n++) {
        linkX[n] = ax + ux * next;
        linkY[n] = ay + uy * next;
        linkUx[n] = ux;
        linkUy[n] = uy;
      }
      next -= len;
    }
    ax = bx;
    ay = by;
  }
  return n;
}

/** is a point `u` along and `v` across a link's middle inside an oval of these half sizes */
const inOval = (u: number, v: number, long: number, wide: number): boolean =>
  (u * u) / (long * long) + (v * v) / (wide * wide) <= 1;

/** the dark line round link `i`, a ring when `ring` and a bar otherwise */
function linkRim(i: number, ring: boolean, a: number): void {
  const { rim } = CHAIN_LOOK;
  const shape = ring ? CHAIN_LOOK.ring : CHAIN_LOOK.bar;
  const reach = Math.ceil(shape.long + rim);
  const left = Math.floor(linkX[i]);
  const top = Math.floor(linkY[i]);
  for (let py = top - reach; py <= top + reach; py++)
    for (let px = left - reach; px <= left + reach; px++) {
      const dx = px + 0.5 - linkX[i];
      const dy = py + 0.5 - linkY[i];
      const u = dx * linkUx[i] + dy * linkUy[i];
      const v = dy * linkUx[i] - dx * linkUy[i];
      if (inOval(u, v, shape.long + rim, shape.wide + rim)) putImage(px, py, HC.steelDeep, a);
    }
}

/** the metal of link `i`, lit along its upper side: a ring with a dark hole through it, or a bar */
function linkMetal(i: number, ring: boolean, glint: Color, a: number): void {
  const shape = ring ? CHAIN_LOOK.ring : CHAIN_LOOK.bar;
  const reach = Math.ceil(shape.long);
  const left = Math.floor(linkX[i]);
  const top = Math.floor(linkY[i]);
  for (let py = top - reach; py <= top + reach; py++)
    for (let px = left - reach; px <= left + reach; px++) {
      const dx = px + 0.5 - linkX[i];
      const dy = py + 0.5 - linkY[i];
      const u = dx * linkUx[i] + dy * linkUy[i];
      const v = dy * linkUx[i] - dx * linkUy[i];
      if (!inOval(u, v, shape.long, shape.wide)) continue;
      if (ring && inOval(u, v, CHAIN_LOOK.ring.holeLong, CHAIN_LOOK.ring.holeWide)) {
        putImage(px, py, HC.steelDeep, a);
        continue;
      }
      putImage(px, py, dy < CHAIN_LOOK.lit ? glint : dy > CHAIN_LOOK.shaded ? HC.steelDark : HC.steel, a);
    }
}

/**
 * A chain along a path of world points, the first `count` of them: steel links at image pixel detail, a ring seen face
 * on then a link seen edge on, each with a dark line round it and its upper side lit in `glint`. The links keep their
 * spacing round the path's corners. The caller has placed the frame in world space.
 */
export function drawChain(path: readonly Point[], count: number, glint: Color = HC.steelLight, a = 1): void {
  if (count < 2) return;
  const n = layLinks(path, count);
  for (let i = 0; i < n; i++) linkRim(i, i % 2 === 0, a);
  for (let i = 1; i < n; i += 2) linkMetal(i, false, glint, a);
  for (let i = 0; i < n; i += 2) linkMetal(i, true, glint, a);
}

const ends: [Point, Point] = [
  { x: 0, y: 0 },
  { x: 0, y: 0 },
];

/** a straight run of chain from one world point to another */
export function drawLinks(x0: number, y0: number, x1: number, y1: number, glint: Color = HC.steelLight, a = 1): void {
  ends[0].x = x0;
  ends[0].y = y0;
  ends[1].x = x1;
  ends[1].y = y1;
  drawChain(ends, 2, glint, a);
}
