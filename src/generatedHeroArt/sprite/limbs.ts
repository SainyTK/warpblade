import { legReach } from "../../rig";
import type { Vec } from "../../types/rig";
import { PARTS, type Rect } from "./atlas";
import type { PartPainter } from "./paint";
import { drawRotatedPart, segmentAngle } from "./paint";

interface BoneArt {
  rect: Rect;
  parent: Vec;
  child: Vec;
  width: number;
}

const UPPER_ARM: BoneArt = { rect: PARTS.upperArm, parent: [10.3, 7], child: [6.7, 22], width: 4.1 };
const FOREARM: BoneArt = { rect: PARTS.forearm, parent: [6.1, 7], child: [12.5, 25.5], width: 4.35 };
const THIGH: BoneArt = { rect: PARTS.thigh, parent: [10.9, 6.5], child: [8.4, 26], width: 4.25 };
const SHIN: BoneArt = { rect: PARTS.shin, parent: [6, 6.5], child: [6.4, 26.5], width: 3.8 };
const ELBOW_CLOTH: Rect = [111, 19, 7, 6];
const KNEE_CLOTH: Rect = [150, 20, 8, 7];
const ANKLE_LEATHER: Rect = [168, 23, 6, 6];

function drawBone(ctx: CanvasRenderingContext2D, paint: PartPainter, art: BoneArt, from: Vec, to: Vec): void {
  const [px, py] = art.parent;
  const rise = art.child[1] - py;
  const shear = (px - art.child[0]) / rise;
  const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
  ctx.save();
  ctx.translate(...from);
  ctx.rotate(segmentAngle(from, to));
  ctx.transform(art.width / art.rect[2], 0, (art.width / art.rect[2]) * shear, length / rise, 0, 0);
  paint(art.rect, [0, 0], [art.rect[2], art.rect[3]], 0, [px / art.rect[2], py / art.rect[3]]);
  ctx.restore();
}

function fillJoint(
  ctx: CanvasRenderingContext2D,
  paint: PartPainter,
  rect: Rect,
  joint: Vec,
  radius: number,
  angle: number,
): void {
  ctx.save();
  ctx.beginPath();
  ctx.arc(...joint, radius, 0, Math.PI * 2);
  ctx.clip();
  const diameter = radius * 2 + 0.25;
  paint(rect, joint, [diameter, diameter], angle);
  ctx.restore();
}

export function drawSpriteArm(
  ctx: CanvasRenderingContext2D,
  paint: PartPainter,
  shoulder: Vec,
  elbow: Vec,
  hand: Vec,
): void {
  fillJoint(ctx, paint, ELBOW_CLOTH, elbow, 1.02, segmentAngle(shoulder, elbow));
  drawBone(ctx, paint, UPPER_ARM, shoulder, elbow);
  drawBone(ctx, paint, FOREARM, elbow, hand);
}

export function drawSpriteLeg(
  ctx: CanvasRenderingContext2D,
  paint: PartPainter,
  hip: Vec,
  foot: Vec,
  tilt: number,
): void {
  const [knee, ankle] = legReach(hip, foot);
  fillJoint(ctx, paint, KNEE_CLOTH, knee, 1.11, segmentAngle(hip, knee));
  fillJoint(ctx, paint, ANKLE_LEATHER, ankle, 0.81, segmentAngle(knee, ankle));
  drawBone(ctx, paint, THIGH, hip, knee);
  drawBone(ctx, paint, SHIN, knee, ankle);
  drawRotatedPart(paint, PARTS.foot, ankle, [4.5, 3.25], tilt, [7.5, 7]);
}
