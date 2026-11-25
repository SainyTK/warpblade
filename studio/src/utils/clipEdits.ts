import type { Pose } from '@game/types/pose';
import type { ClipFrames } from '@/types/studio';

export function setFrame(clip: ClipFrames, frame: number, pose: Pose): ClipFrames {
  if (!clip.frames[frame]) {
    return clip;
  }
  return {
    ...clip,
    frames: clip.frames.map((existing, index) => (index === frame ? pose : existing)),
  };
}

export function setSnap(clip: ClipFrames, frame: number, on: boolean): ClipFrames {
  const others = clip.snaps.filter((index) => index !== frame);
  return { ...clip, snaps: on ? [...others, frame].sort((a, b) => a - b) : others };
}
