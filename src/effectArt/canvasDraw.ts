import { pickEffectFrame } from "./frameIndex";
import type { EffectDrawOptions, EffectSprite } from "./types";

export function drawEffectSprite(
  ctx: CanvasRenderingContext2D,
  sprite: EffectSprite,
  x: number,
  y: number,
  { frame = 0, scale = 1, rotation = 0, alpha = 1, blend = "normal", flip = false }: EffectDrawOptions = {},
): void {
  if (alpha <= 0 || scale <= 0) {
    return;
  }
  const [sx, sy, w, h] = pickEffectFrame(sprite, frame);
  ctx.save();
  ctx.globalAlpha *= Math.min(1, alpha);
  ctx.globalCompositeOperation = blend === "additive" ? "lighter" : "source-over";
  ctx.imageSmoothingEnabled = false;
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(flip ? -scale : scale, scale);
  ctx.drawImage(sprite.image, sx, sy, w, h, -w / 2, -h / 2, w, h);
  ctx.restore();
}
