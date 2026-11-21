import type { Vec } from "../types/rig";
import { PARTS, type Rect } from "./atlas";
import { paintTriangle } from "./meshPaint";
import { sampleTrail, shapeTrail } from "./trailCurve";

type Span = [Vec, Vec, Vec];

interface TrailArt {
  rect: Rect;
  tie: number;
  centers: readonly number[];
  width: number;
  lengthScale: number;
  restLength: number;
}

const SCARF: TrailArt = {
  rect: PARTS.scarfTail,
  tie: 3,
  centers: [23.5, 23.5, 19, 15, 12.5, 11.5, 12, 13.5, 15.5, 18, 21],
  width: 5.5,
  lengthScale: 1,
  restLength: 12,
};

const PONYTAIL: TrailArt = {
  rect: PARTS.ponytail,
  tie: 4,
  centers: [26, 26, 18.5, 16.5, 16, 13, 11, 11, 14, 17, 21],
  width: 6.3,
  lengthScale: 1.24,
  restLength: 8,
};

function placeRope(rope: readonly Vec[], anchor: Vec, sign: number, art: TrailArt): Vec[] {
  const root = rope[0];
  if (!root || !rope.some(([x, y]) => Math.hypot(x - root[0], y - root[1]) > 0.0001)) {
    return [anchor, [anchor[0], anchor[1] + art.restLength]];
  }
  return rope.map(([x, y]) => [
    anchor[0] + (x - root[0]) * sign * art.lengthScale,
    anchor[1] + (y - root[1]) * art.lengthScale,
  ]);
}

function restCenter(art: TrailArt, y: number): number {
  const offset = (y / art.rect[3]) * (art.centers.length - 1);
  const lower = Math.floor(offset);
  const a = art.centers[lower];
  const b = art.centers[lower + 1] ?? a;
  return a + (b - a) * (offset - lower);
}

function bindSpan(art: TrailArt, y: number): Span {
  return [
    [0, y],
    [restCenter(art, y), y],
    [art.rect[2], y],
  ];
}

function drawTrail(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  art: TrailArt,
  points: readonly Vec[],
  anchor: Vec,
  sign: number,
): void {
  const rope = placeRope(points, anchor, sign, art);
  const bands = Math.max(8, (rope.length - 1) * 3);
  const bindRows = [bindSpan(art, 0)];
  const spanLength = art.rect[3] - art.tie;
  for (let i = 0; i <= bands; i++) {
    bindRows.push(bindSpan(art, art.tie + (spanLength * i) / bands));
  }
  const scale = art.width / art.rect[2];
  const centers = bindRows.map(([[, y]]) => sampleTrail(rope, (y - art.tie) / spanLength));
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
        art.rect,
        [previousBind[side], previousBind[next], nextBind[side]],
        [previousPose[side], previousPose[next], nextPose[side]],
      );
      paintTriangle(
        ctx,
        image,
        art.rect,
        [previousBind[next], nextBind[next], nextBind[side]],
        [previousPose[next], nextPose[next], nextPose[side]],
      );
    }
  }
}

export function drawSpriteTrails(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  scarf: readonly Vec[],
  tail: readonly Vec[],
  scarfAnchor: Vec,
  tailAnchor: Vec,
  sign: number,
): void {
  drawTrail(ctx, image, PONYTAIL, tail, tailAnchor, sign);
  drawTrail(ctx, image, SCARF, scarf, scarfAnchor, sign);
}
