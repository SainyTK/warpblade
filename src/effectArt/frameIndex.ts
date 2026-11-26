import type { EffectFrame, EffectSprite } from "./types";

export function pickEffectFrame(sprite: EffectSprite, frame = 0): EffectFrame {
  const count = sprite.frames.length;
  return sprite.frames[((Math.floor(frame) % count) + count) % count];
}
