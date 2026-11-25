import type { HeroSkin } from '@game/types/character';
import type { Pose } from '@game/types/pose';

/** What is drawn for each pose, kept per hero look, so a pose two heroes share draws each of them. */
export function poseCache<T>() {
  const bySkin = new WeakMap<HeroSkin, WeakMap<Pose, T>>();
  const of = (skin: HeroSkin): WeakMap<Pose, T> => {
    const known = bySkin.get(skin);
    if (known) {
      return known;
    }
    const made = new WeakMap<Pose, T>();
    bySkin.set(skin, made);
    return made;
  };
  return {
    get: (skin: HeroSkin, pose: Pose): T | undefined => of(skin).get(pose),
    has: (skin: HeroSkin, pose: Pose): boolean => of(skin).has(pose),
    set: (skin: HeroSkin, pose: Pose, value: T): void => {
      of(skin).set(pose, value);
    },
  };
}
