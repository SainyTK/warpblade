import { Undo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameClip } from '@/hooks/useGameClip';
import { useOpenMotion } from '@/hooks/useOpenMotion';
import { useMotionStore } from '@/store/motionStore';
import { differsFromGame } from '@/utils/edited';

/** Puts every frame of the open clip back to how the game plays it. Undo brings the edits back. */
export function ClipActions() {
  const game = useGameClip(useOpenMotion().id);
  const current = useMotionStore((state) => state.current);
  const change = useMotionStore((state) => state.change);
  return (
    <Button
      variant="destructive"
      size="sm"
      className="w-full"
      disabled={!differsFromGame(current, game)}
      onClick={() => change(() => game)}
    >
      <Undo />
      Revert to the game
    </Button>
  );
}
