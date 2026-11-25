import { HERO_MOTION, type HeroMotion } from '@/constants/heroMotion';
import { useMotionStore } from '@/store/motionStore';

/** The hero's clip open on the stage. */
export function useOpenMotion(): HeroMotion {
  const id = useMotionStore((state) => state.motion);
  const motion = HERO_MOTION.get(id);
  if (!motion) {
    throw new Error(`No hero has the motion clip ${id}`);
  }
  return motion;
}
