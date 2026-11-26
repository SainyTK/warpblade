import { HERO_MOTION, type HeroMotion } from '@/constants/heroMotion';
import { useMotionStore } from '@/store/motionStore';
import { differsFromGame } from '@/utils/edited';

/** The clips whose drafts would change the game, hero by hero in gallery order. */
export function useEditedMotions(): HeroMotion[] {
  const drafts = useMotionStore((state) => state.drafts);
  const game = useMotionStore((state) => state.game);
  return [...HERO_MOTION.values()].filter((motion) =>
    differsFromGame(drafts[motion.id], game[motion.id]),
  );
}
