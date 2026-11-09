import { SHOULDER_Y, type StaffShape } from "../../../constants/mirel/string";
import type { Box } from "../../../types/world";

/** where and which way a blow was struck: her feet and facing, kept so an echo strikes the same place */
export interface StrikePlace {
  x: number;
  y: number;
  face: number;
}

/** the arc is tested at these shares of its radius and this many steps along its sweep */
const ARC_RADII = [0.35, 0.65, 1];
const ARC_STEPS = 10;
/** a foe body this close outside a point still counts as reached */
const SLACK = 2;

const inBox = (b: Box, x: number, y: number): boolean =>
  x >= b[0] - SLACK && x <= b[2] + SLACK && y >= b[1] - SLACK && y <= b[3] + SLACK;

/** the shortest distance from a point to a box, 0 inside it */
function boxDistance(b: Box, x: number, y: number): number {
  const dx = Math.max(b[0] - x, 0, x - b[2]);
  const dy = Math.max(b[1] - y, 0, y - b[3]);
  return Math.hypot(dx, dy);
}

/** the middle of a ring blow, world pixels */
export function ringCentre(shape: StaffShape & { kind: "ring" }, at: StrikePlace): [number, number] {
  return [at.x + at.face * shape.ahead, at.y - SHOULDER_Y];
}

/** a foe's body box is reached by a blow of this shape struck here; `grow` widens it (Long Echo, Great Toll) */
export function shapeReaches(shape: StaffShape, at: StrikePlace, b: Box, grow = 0): boolean {
  const sy = at.y - SHOULDER_Y;
  switch (shape.kind) {
    case "jab": {
      const x0 = at.x + at.face * (shape.near - grow * 0.5);
      const x1 = at.x + at.face * (shape.far + grow);
      const cy = at.y - shape.y;
      const half = shape.height / 2 + grow * 0.5;
      return b[0] < Math.max(x0, x1) && b[2] > Math.min(x0, x1) && b[1] < cy + half && b[3] > cy - half;
    }
    case "ring": {
      const [cx, cy] = ringCentre(shape, at);
      return boxDistance(b, cx, cy) <= shape.radius + grow;
    }
    case "arc": {
      const r = shape.radius + grow;
      for (let i = 0; i <= ARC_STEPS; i++) {
        const a = shape.a0 + ((shape.a1 - shape.a0) * i) / ARC_STEPS;
        for (const k of ARC_RADII) {
          const x = at.x + Math.cos(a) * r * k * at.face;
          const y = sy + Math.sin(a) * r * k;
          if (inBox(b, x, y)) return true;
        }
      }
      return false;
    }
  }
}
