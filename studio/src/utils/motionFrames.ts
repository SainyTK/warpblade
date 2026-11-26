import type { HeroSkin } from '@game/types/character';
import type { Pose } from '@game/types/pose';
import type { HeroLayer } from '@/types/studio';
import { RopeRig } from './ropes';

/** World steps per animation frame: the game steps at 60 a second and samples poses at 30. */
const STEPS_PER_FRAME = 2;

/** The hero at every frame of a clip, with the scarf and ponytail swinging through it as they would in the game. */
export function motionFrames(skin: HeroSkin, frames: readonly Pose[]): HeroLayer[] {
  const first = frames[0];
  if (!first) {
    return [];
  }
  const rig = RopeRig.settled(skin, first);
  return frames.map((pose) => {
    for (let i = 0; i < STEPS_PER_FRAME; i++) {
      rig.step(pose);
    }
    return { pose, ropes: rig.look() };
  });
}

/** A still hero with the scarf and ponytail settled. */
export const stillHero = (skin: HeroSkin, pose: Pose): HeroLayer => ({
  pose,
  ropes: RopeRig.settled(skin, pose).look(),
});
