// Pure edits of a sketch. Each returns a new sketch and leaves the old one as it was, for undo.
import type { Pose } from '@game/types/pose';
import type { EffectCel, MotionKey, Sketch } from '@shared/sketch';
import { byFrame } from './frames';
import { emptyCel, motionKey, newId } from './sketch';

type Root = { x: number; y: number };

const withKeys = (sketch: Sketch, keys: MotionKey[]): Sketch => ({
  ...sketch,
  motion: { ...sketch.motion, keys: byFrame(keys) },
});

const withCels = (sketch: Sketch, cels: EffectCel[]): Sketch => ({
  ...sketch,
  effect: { cels: byFrame(cels) },
});

/** Sets the snapshot at a frame, replacing one already there. */
export function putKey(sketch: Sketch, frame: number, pose: Pose, root: Root): Sketch {
  const existing = sketch.motion.keys.find((key) => key.frame === frame);
  const others = sketch.motion.keys.filter((key) => key.frame !== frame);
  const key = existing
    ? { ...existing, pose: { ...pose }, root: { ...root } }
    : motionKey(frame, pose, root);
  return withKeys(sketch, [...others, key]);
}

export function updateKey(
  sketch: Sketch,
  id: string,
  change: Partial<Omit<MotionKey, 'id'>>,
): Sketch {
  return withKeys(
    sketch,
    sketch.motion.keys.map((key) => (key.id === id ? { ...key, ...change } : key)),
  );
}

/** Moves a snapshot to another frame. A frame that already has one is refused. */
export function moveKey(sketch: Sketch, id: string, frame: number): Sketch {
  const target = Math.max(0, Math.round(frame));
  if (sketch.motion.keys.some((key) => key.frame === target && key.id !== id)) {
    return sketch;
  }
  return updateKey(sketch, id, { frame: target });
}

export function removeKey(sketch: Sketch, id: string): Sketch {
  return withKeys(
    sketch,
    sketch.motion.keys.filter((key) => key.id !== id),
  );
}

export function setHit(sketch: Sketch, frame: number | null): Sketch {
  return { ...sketch, motion: { ...sketch.motion, hitFrame: frame } };
}

export function replaceMotion(sketch: Sketch, keys: MotionKey[], hitFrame: number | null): Sketch {
  return { ...sketch, motion: { keys: byFrame(keys), hitFrame } };
}

/** Adds an empty effect frame at a frame, or returns the sketch when one already starts there. */
export function addCel(sketch: Sketch, frame: number, hold: number, copyFrom?: EffectCel): Sketch {
  if (sketch.effect.cels.some((cel) => cel.frame === frame)) {
    return sketch;
  }
  const cel = copyFrom ? { ...copyFrom, id: newId(), frame, hold } : emptyCel(frame, hold);
  return withCels(sketch, [...sketch.effect.cels, cel]);
}

export function updateCel(
  sketch: Sketch,
  id: string,
  change: Partial<Omit<EffectCel, 'id'>>,
): Sketch {
  return withCels(
    sketch,
    sketch.effect.cels.map((cel) => (cel.id === id ? { ...cel, ...change } : cel)),
  );
}

export function moveCel(sketch: Sketch, id: string, frame: number): Sketch {
  const target = Math.max(0, Math.round(frame));
  if (sketch.effect.cels.some((cel) => cel.frame === target && cel.id !== id)) {
    return sketch;
  }
  return updateCel(sketch, id, { frame: target });
}

export function removeCel(sketch: Sketch, id: string): Sketch {
  return withCels(
    sketch,
    sketch.effect.cels.filter((cel) => cel.id !== id),
  );
}
