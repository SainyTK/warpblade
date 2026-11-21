import { armReach, legReach, toePoint } from "../src/rig";
import type { Vec } from "../src/types/rig";
import {
  atHip,
  chestPoint,
  farShoulder,
  headCenter,
  isElbowFlipped,
  isMirrored,
  nearShoulder,
} from "../src/utils/poseFrame";
import type { Frame } from "./motion/types";

export function drawRigOverlay(ctx: CanvasRenderingContext2D, frame: Frame, x: number, y: number, scale: number): void {
  const p = frame.pose;
  const sign = isMirrored(p) ? -1 : 1;
  const project = ([px, py]: Vec): Vec => [x + px * scale * sign * (frame.profile ?? 1), y + py * scale];
  function joint(point: Vec, color: string, radius = 1.6): void {
    ctx.beginPath();
    ctx.arc(...project(point), radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
  function line(points: readonly Vec[], color: string, dots = true): void {
    ctx.beginPath();
    ctx.moveTo(...project(points[0]));
    for (const point of points.slice(1)) {
      ctx.lineTo(...project(point));
    }
    ctx.strokeStyle = color;
    ctx.stroke();
    if (dots) {
      for (const point of points) {
        joint(point, color);
      }
    }
  }
  const near = nearShoulder(p);
  const far = farShoulder(p);
  const [elbow, hand] = armReach(near, [p.fx, p.fy], isElbowFlipped(p.fe));
  const [farElbow, farHand] = armReach(far, [p.bx, p.by], isElbowFlipped(p.be));
  ctx.save();
  ctx.lineWidth = 1.2;
  line([far, farElbow, farHand], "#c29af8");
  line([[p.hx, p.hy], chestPoint(p), [p.nx, p.ny], headCenter(p)], "#f6f3e9");
  line([near, elbow, hand], "#a9edff");
  for (const [index, [footX, footY, tilt, hipOffset]] of [
    [p.ffx, p.ffy, p.fa, 1.5],
    [p.bfx, p.bfy, p.ba, -1.5],
  ].entries()) {
    const hip = atHip(p, hipOffset, 0);
    const [knee, ankle] = legReach(hip, [footX, footY]);
    const toe = toePoint(ankle, tilt);
    line([hip, knee, ankle, toe], index === 0 ? "#a9edff" : "#c29af8");
    if (frame.contacts[index]) {
      joint([footX, frame.lift], "#ffff9a", 2.7);
    }
  }
  if (frame.impact) {
    joint(hand, "#ffda75", 3.4);
  }
  ctx.restore();
}
