import type { MotionKey } from '@shared/sketch';
import { poseAt, rootAt } from './frames';
import { RopeRig } from './ropes';
import type { HeroLayer } from './stageRaster';

/** World steps per animation frame: the game steps at 60 a second and samples poses at 30. */
const STEPS_PER_FRAME = 2;

/**
 * Kael at every animation frame from 0 to `last`, with the scarf and ponytail swinging through the motion
 * as they would in the game.
 */
export function motionFrames(keys: readonly MotionKey[], last: number): HeroLayer[] {
  const rig = RopeRig.settled(poseAt(keys, 0));
  const frames: HeroLayer[] = [];
  let previous = rootAt(keys, 0);
  for (let frame = 0; frame <= last; frame++) {
    const pose = poseAt(keys, frame);
    const root = rootAt(keys, frame);
    const vx = (root.x - previous.x) * 30;
    for (let i = 0; i < STEPS_PER_FRAME; i++) {
      rig.step(pose, root, vx);
    }
    previous = root;
    frames.push({ pose, root, ropes: rig.look(root) });
  }
  return frames;
}
