import { ANIM_FPS, frame as frameTime, STAND } from '@game/constants/hero';
import type { Pose, PoseKeyframe } from '@game/types/pose';
import { ease, lerp } from '@game/utils/math';
import { sampleKeys } from '@game/utils/sampleKeys';
import type { EffectCel, MotionKey } from '@shared/sketch';

export const byFrame = <T extends { frame: number }>(items: readonly T[]): T[] =>
  [...items].sort((a, b) => a.frame - b.frame);

/** The sketch's keys in the game's keyframe format, so sampling matches the game exactly. */
export function poseKeyframes(keys: readonly MotionKey[]): PoseKeyframe[] {
  return byFrame(keys).map((key) =>
    key.snap ? [frameTime(key.frame), key.pose, 'snap'] : [frameTime(key.frame), key.pose],
  );
}

/** Kael's pose at an animation frame, sampled by the game's own sampleKeys. */
export function poseAt(keys: readonly MotionKey[], frame: number): Pose {
  return keys.length ? sampleKeys(poseKeyframes(keys), frame / ANIM_FPS) : STAND;
}

/** Where Kael's feet are at a frame, eased between keys the way sampleKeys eases joints. */
export function rootAt(keys: readonly MotionKey[], frame: number): { x: number; y: number } {
  const sorted = byFrame(keys);
  const first = sorted[0];
  if (!first || frame <= first.frame) {
    return first?.root ?? { x: 0, y: 0 };
  }
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (!a || !b || frame >= b.frame) {
      continue;
    }
    if (b.snap) {
      return a.root;
    }
    const u = ease.outQuad((frame - a.frame) / (b.frame - a.frame));
    return { x: lerp(a.root.x, b.root.x, u), y: lerp(a.root.y, b.root.y, u) };
  }
  return sorted.at(-1)?.root ?? { x: 0, y: 0 };
}

export const keyAt = (keys: readonly MotionKey[], frame: number): MotionKey | undefined =>
  keys.find((key) => key.frame === frame);

export const lastKeyFrame = (keys: readonly MotionKey[]): number =>
  keys.reduce((last, key) => Math.max(last, key.frame), 0);

/** The effect frame showing at an animation frame, if any. */
export const celAt = (cels: readonly EffectCel[], frame: number): EffectCel | undefined =>
  byFrame(cels)
    .reverse()
    .find((cel) => frame >= cel.frame && frame < cel.frame + cel.hold);

export const lastCelFrame = (cels: readonly EffectCel[]): number =>
  cels.reduce((last, cel) => Math.max(last, cel.frame + cel.hold - 1), 0);

/** The neighbouring snapshot or cel before and after a frame, for onion skins. */
export function neighbours<T extends { frame: number }>(
  items: readonly T[],
  frame: number,
): { before: T | undefined; after: T | undefined } {
  const sorted = byFrame(items);
  return {
    before: sorted.filter((item) => item.frame < frame).at(-1),
    after: sorted.find((item) => item.frame > frame),
  };
}
