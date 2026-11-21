import type { Vec } from "../types/rig";
import type { Rect } from "./atlas";

export function createPartPainter(ctx: CanvasRenderingContext2D, image: CanvasImageSource) {
  return (rect: Rect, joint: Vec, size: Vec, angle = 0, anchor: Vec = [0.5, 0.5]): void => {
    const [w, h] = size;
    ctx.save();
    ctx.translate(...joint);
    ctx.rotate(angle);
    ctx.drawImage(image, ...rect, -w * anchor[0], -h * anchor[1], w, h);
    ctx.restore();
  };
}

export type PartPainter = ReturnType<typeof createPartPainter>;

export const segmentAngle = (from: Vec, to: Vec): number => Math.atan2(to[1] - from[1], to[0] - from[0]) - Math.PI / 2;

export function drawRotatedPart(
  paint: PartPainter,
  rect: Rect,
  joint: Vec,
  size: Vec,
  angle: number,
  pivot: Vec,
): void {
  paint(rect, joint, size, angle, [pivot[0] / rect[2], pivot[1] / rect[3]]);
}
