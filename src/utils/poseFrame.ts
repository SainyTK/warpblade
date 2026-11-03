import type { Pose } from "../types/pose";

type Vec = [number, number];

/** the pose turns its back to the camera */
export const isTurned = (p: Pose): boolean => p.tw >= 0.5;
/** the pose is drawn mirrored, facing behind Kael */
export const isMirrored = (p: Pose): boolean => p.mr >= 0.5;

/** the sword angle as drawn, after any mirroring */
export const bladeAngle = (p: Pose): number => (isMirrored(p) ? Math.PI - p.sa : p.sa);

/** a point of the pose as drawn, after any mirroring */
export const drawnPoint = (p: Pose, x: number, y: number): Vec => [isMirrored(p) ? -x : x, y];

/** the spine's unit vector from hip to neck, and the unit vector across it toward the front */
export function spineFrame(p: Pose): { ux: number; uy: number; rx: number; ry: number } {
  const dx = p.nx - p.hx;
  const dy = p.ny - p.hy;
  const d = Math.hypot(dx, dy) || 1;
  const ux = dx / d;
  const uy = dy / d;
  return { ux, uy, rx: -uy, ry: ux };
}

/** a point offset from a base by dx across the body (toward the front) and dy down the spine */
export function alongSpine(p: Pose, base: Vec, dx: number, dy: number): Vec {
  const { ux, uy, rx, ry } = spineFrame(p);
  return [base[0] + rx * dx - ux * dy, base[1] + ry * dx - uy * dy];
}

/** the middle of the head, carried along the spine so a lean puts it out ahead of the hips */
export function headCenter(p: Pose): Vec {
  const { ux, uy } = spineFrame(p);
  return [p.nx + ux * 5, p.ny + uy * 5];
}
