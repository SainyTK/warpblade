import type { Pose } from "../types/pose";

type Vec = [number, number];

interface Frame {
  /** unit vector up the spine */
  ux: number;
  uy: number;
  /** unit vector across the spine, toward the front */
  rx: number;
  ry: number;
}

/** the pose turns its back to the camera */
export const isTurned = (p: Pose): boolean => p.tw >= 0.5;
/** the pose is drawn mirrored, facing behind Kael */
export const isMirrored = (p: Pose): boolean => p.mr >= 0.5;
/** an elbow bends the other way: down under a raised hand, or up over a low one */
export const isElbowFlipped = (flip: number): boolean => flip >= 0.5;

/** the sword angle as drawn, after any mirroring */
export const bladeAngle = (p: Pose): number => (isMirrored(p) ? Math.PI - p.sa : p.sa);

/** a point of the pose as drawn, after any mirroring */
export const drawnPoint = (p: Pose, x: number, y: number): Vec => [isMirrored(p) ? -x : x, y];

function frameBetween(ax: number, ay: number, bx: number, by: number): Frame {
  const dx = bx - ax;
  const dy = by - ay;
  const d = Math.hypot(dx, dy) || 1;
  const ux = dx / d;
  const uy = dy / d;
  return { ux, uy, rx: -uy, ry: ux };
}

/** the straight line from hip to neck; the chest bend pushes the middle of the spine across it */
const straightFrame = (p: Pose): Frame => frameBetween(p.hx, p.hy, p.nx, p.ny);

/** the middle of the spine, pushed toward the front by the chest bend (cb), or toward the back when it is negative */
export function chestPoint(p: Pose): Vec {
  const { rx, ry } = straightFrame(p);
  return [(p.hx + p.nx) / 2 + rx * p.cb, (p.hy + p.ny) / 2 + ry * p.cb];
}

/** the chest bend that puts the chest nearest this point, measured across the straight spine */
export function chestBendToward(p: Pose, x: number, y: number): number {
  const { rx, ry } = straightFrame(p);
  return (x - (p.hx + p.nx) / 2) * rx + (y - (p.hy + p.ny) / 2) * ry;
}

/** the spine from the chest up to the neck: shoulders, head and scarf follow it */
export function chestFrame(p: Pose): Frame {
  const [cx, cy] = chestPoint(p);
  return frameBetween(cx, cy, p.nx, p.ny);
}

/** the spine from the hip up to the chest: the belt, legs and coat tails follow it */
export function waistFrame(p: Pose): Frame {
  const [cx, cy] = chestPoint(p);
  return frameBetween(p.hx, p.hy, cx, cy);
}

const offset = (f: Frame, base: Vec, dx: number, dy: number): Vec => [
  base[0] + f.rx * dx - f.ux * dy,
  base[1] + f.ry * dx - f.uy * dy,
];

/** a point near the neck, dx across the chest (toward the front) and dy down the spine */
export const atNeck = (p: Pose, dx: number, dy: number): Vec => offset(chestFrame(p), [p.nx, p.ny], dx, dy);

/** a point near the hip, dx across the waist (toward the front) and dy down the spine */
export const atHip = (p: Pose, dx: number, dy: number): Vec => offset(waistFrame(p), [p.hx, p.hy], dx, dy);

/** a point at the chest, dx across the spine where it bends (toward the front) */
export function atChest(p: Pose, dx: number): Vec {
  const upper = chestFrame(p);
  const lower = waistFrame(p);
  const rx = upper.rx + lower.rx;
  const ry = upper.ry + lower.ry;
  const d = Math.hypot(rx, ry) || 1;
  const [cx, cy] = chestPoint(p);
  return [cx + (rx / d) * dx, cy + (ry / d) * dx];
}

/** the near (sword arm) shoulder and the far shoulder */
export const nearShoulder = (p: Pose): Vec => atNeck(p, 1, 2);
export const farShoulder = (p: Pose): Vec => atNeck(p, -1, 2);

/** the middle of the head, carried along the upper spine so a lean or an arch puts it out ahead of the hips */
export function headCenter(p: Pose): Vec {
  const { ux, uy } = chestFrame(p);
  return [p.nx + ux * 5, p.ny + uy * 5];
}

/** where the scarf is tied on, as drawn */
export const scarfAnchor = (p: Pose): Vec => drawnPoint(p, ...atNeck(p, -2, 0.5));

/** where a sash leaves the belt at the back of the hip, as drawn */
export const sashAnchor = (p: Pose): Vec => drawnPoint(p, ...atHip(p, -2.5, -1.5));

/** where the ponytail leaves the back of the head, as drawn */
export function tailAnchor(p: Pose): Vec {
  const [hx, hy] = headCenter(p);
  return drawnPoint(p, hx - 4.5, hy - 1);
}
