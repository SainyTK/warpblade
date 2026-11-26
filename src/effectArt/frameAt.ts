import type { EffectSprite } from "./types";

export function effectFrameAt(sprite: EffectSprite, seconds: number, loop = true): number {
  const count = sprite.frames.length;
  const step = Math.max(0, Math.floor(seconds * sprite.fps));
  return loop ? step % count : Math.min(step, count - 1);
}
