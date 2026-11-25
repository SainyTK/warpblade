import type { Vec } from "../../types/rig";
import { PARTS, type Rect } from "./atlas";
import { paintTriangle } from "./meshPaint";
import { sampleTrail, shapeTrail } from "./trailCurve";

type Span = [Vec, Vec, Vec];

interface TrailShape {
  rect: Rect;
  tie: number;
  width: number;
  lengthScale: number;
  restLength: number;
}

const SCARF: TrailShape = { rect: PARTS.scarfTail, tie: 3, width: 5.5, lengthScale: 1, restLength: 12 };
const PONYTAIL: TrailShape = { rect: PARTS.ponytail, tie: 4, width: 6.3, lengthScale: 1.24, restLength: 8 };

export interface Trail {
  points: readonly Vec[];
  anchor: Vec;
  centers: readonly number[];
}

function placeRope(rope: readonly Vec[], anchor: Vec, sign: number, shape: TrailShape): Vec[] {
  const root = rope[0];
  if (!root || !rope.some(([x, y]) => Math.hypot(x - root[0], y - root[1]) > 0.0001)) {
    return [anchor, [anchor[0], anchor[1] + shape.restLength]];
  }
  return rope.map(([x, y]) => [
    anchor[0] + (x - root[0]) * sign * shape.lengthScale,
    anchor[1] + (y - root[1]) * shape.lengthScale,
  ]);
}

function restCenter(shape: TrailShape, centers: readonly number[], y: number): number {
  const offset = (y / shape.rect[3]) * (centers.length - 1);
  const lower = Math.floor(offset);
  const a = centers[lower];
  const b = centers[lower + 1] ?? a;
  return a + (b - a) * (offset - lower);
}

function bindSpan(shape: TrailShape, centers: readonly number[], y: number): Span {
  return [
    [0, y],
    [restCenter(shape, centers, y), y],
    [shape.rect[2], y],
  ];
}

function drawTrail(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  shape: TrailShape,
  trail: Trail,
  sign: number,
): void {
  const rope = placeRope(trail.points, trail.anchor, sign, shape);
  const bands = Math.max(8, (rope.length - 1) * 3);
  const bindRows = [bindSpan(shape, trail.centers, 0)];
  const spanLength = shape.rect[3] - shape.tie;
  for (let i = 0; i <= bands; i++) {
    bindRows.push(bindSpan(shape, trail.centers, shape.tie + (spanLength * i) / bands));
  }
  const scale = shape.width / shape.rect[2];
  const centers = bindRows.map(([[, y]]) => sampleTrail(rope, (y - shape.tie) / spanLength));
  const halfWidths: Vec[] = bindRows.map(([, [x], [right]]) => [x * scale, (right - x) * scale]);
  const poseRows = shapeTrail(centers, halfWidths);
  for (let band = 1; band < bindRows.length; band++) {
    const previousBind = bindRows[band - 1];
    const nextBind = bindRows[band];
    const previousPose = poseRows[band - 1];
    const nextPose = poseRows[band];
    for (let side = 0; side < 2; side++) {
      const next = side + 1;
      paintTriangle(
        ctx,
        image,
        shape.rect,
        [previousBind[side], previousBind[next], nextBind[side]],
        [previousPose[side], previousPose[next], nextPose[side]],
      );
      paintTriangle(
        ctx,
        image,
        shape.rect,
        [previousBind[next], nextBind[next], nextBind[side]],
        [previousPose[next], nextPose[next], nextPose[side]],
      );
    }
  }
}

export function drawSpriteTrails(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  scarf: Trail | undefined,
  ponytail: Trail | undefined,
  sign: number,
): void {
  if (ponytail) {
    drawTrail(ctx, image, PONYTAIL, ponytail, sign);
  }
  if (scarf) {
    drawTrail(ctx, image, SCARF, scarf, sign);
  }
}
