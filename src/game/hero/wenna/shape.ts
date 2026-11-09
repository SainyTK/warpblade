import { type LampShape, SHOULDER_Y } from "../../../constants/wenna/lamp";
import type { Box } from "../../../types/world";

/** where and which way a blow was struck: her feet and facing (or a Wick's, for a repeated Flare) */
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

/** a point of the box, relative to the shoulder and facing right, lies in the cone */
function inCone(shape: LampShape & { kind: "cone" }, far: number, at: StrikePlace, x: number, y: number): boolean {
  const dx = (x - at.x) * at.face;
  const dy = y - (at.y - SHOULDER_Y);
  const d = Math.hypot(dx, dy);
  if (d < shape.near - SLACK || d > far + SLACK) return false;
  return Math.abs(Math.atan2(dy, dx)) <= shape.half;
}

/** a foe's body box is reached by a blow of this shape struck here; `grow` lengthens it (Open Shutter) */
export function shapeReaches(shape: LampShape, at: StrikePlace, b: Box, grow = 0): boolean {
  const sy = at.y - SHOULDER_Y;
  switch (shape.kind) {
    case "jab": {
      const x0 = at.x + at.face * shape.near;
      const x1 = at.x + at.face * (shape.far + grow);
      const cy = at.y - shape.y;
      const half = shape.height / 2;
      return b[0] < Math.max(x0, x1) && b[2] > Math.min(x0, x1) && b[1] < cy + half && b[3] > cy - half;
    }
    case "cone": {
      const far = shape.far + grow;
      const xs = [b[0], (b[0] + b[2]) / 2, b[2]];
      const ys = [b[1], (b[1] + b[3]) / 2, b[3]];
      for (const x of xs) for (const y of ys) if (inCone(shape, far, at, x, y)) return true;
      // a foe big enough to wrap the cone's middle line
      const mx = at.x + at.face * ((shape.near + far) / 2);
      return inBox(b, mx, sy);
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
