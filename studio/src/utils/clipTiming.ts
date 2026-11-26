import { ANIM_FPS } from '@game/constants/hero';
import type { HeroMotion } from '@/constants/heroMotion';

/** The frames a second the game shows a clip of this many frames at: over its span, or in time at 30. */
export function framesPerSecond({ timing }: HeroMotion, frames: number): number {
  if (!timing) {
    return ANIM_FPS;
  }
  return (timing.loop ? frames : Math.max(frames - 1, 1)) / timing.seconds;
}

/** The frame the blow lands on, in a clip of this many frames, or null. */
export function hitFrame({ hit, timing }: HeroMotion, frames: number): number | null {
  if (hit === null) {
    return null;
  }
  return timing ? Math.round((hit / timing.seconds) * (frames - 1)) : Math.round(hit * ANIM_FPS);
}
