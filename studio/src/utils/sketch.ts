import { ANIM_FPS, STAND } from '@game/constants/hero';
import type { ActionClip, Pose } from '@game/types/pose';
import type { EffectCel, MotionKey, Sketch } from '@shared/sketch';

export const newId = (): string => crypto.randomUUID();

export function motionKey(
  frame: number,
  pose: Pose,
  root = { x: 0, y: 0 },
  snap = false,
): MotionKey {
  return { id: newId(), frame, pose: { ...pose }, root: { ...root }, snap };
}

export function emptySketch(name: string): Sketch {
  return {
    id: newId(),
    name,
    updatedAt: new Date().toISOString(),
    motion: { keys: [motionKey(0, STAND)], hitFrame: null },
    effect: { cels: [] },
  };
}

/** One of the game's clips as snapshots, to start a motion from. States (idle, walk...) have no hit frame. */
export function clipKeys(
  clip: ActionClip,
  struck: boolean,
): { keys: MotionKey[]; hitFrame: number | null } {
  return {
    keys: clip.keys.map(([time, pose, mode]) =>
      motionKey(Math.round(time * ANIM_FPS), pose, { x: 0, y: 0 }, mode === 'snap'),
    ),
    hitFrame: struck ? Math.round(clip.hit * ANIM_FPS) : null,
  };
}

export function emptyCel(frame: number, hold: number): EffectCel {
  return { id: newId(), frame, hold, pixels: {} };
}

/** A saved sketch with every key's pose filled out to the current rig: joints added since it was saved stand neutral. */
export const withCurrentRig = (sketch: Sketch): Sketch => ({
  ...sketch,
  motion: {
    ...sketch.motion,
    keys: sketch.motion.keys.map((key) => ({ ...key, pose: { ...STAND, ...key.pose } })),
  },
});
