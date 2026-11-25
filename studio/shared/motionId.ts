import { type DrillClipId, isDrillClipId } from '../../src/motionClips';

/** A hero's motion clip as `<hero>/<clip>`, such as `saya/run` or `kael/strikes/first`: how drafts, the API and apply-motion name it. */
export type MotionId = `${string}/${DrillClipId}`;

export interface MotionRef {
  hero: string;
  clip: DrillClipId;
}

const HERO = /^[a-z]+$/;

export const motionId = (hero: string, clip: DrillClipId): MotionId => `${hero}/${clip}`;

export function parseMotionId(id: string): MotionRef | null {
  const slash = id.indexOf('/');
  const hero = id.slice(0, slash);
  const clip = id.slice(slash + 1);
  return HERO.test(hero) && isDrillClipId(clip) ? { hero, clip } : null;
}
