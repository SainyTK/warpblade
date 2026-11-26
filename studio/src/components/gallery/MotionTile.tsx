import { type HeroMotion, studioHero } from '@/constants/heroMotion';
import { useGameClip } from '@/hooks/useGameClip';
import { useOpenClip } from '@/hooks/useOpenClip';
import { cn } from '@/lib/utils';
import { useMotionStore } from '@/store/motionStore';
import { framesPerSecond } from '@/utils/clipTiming';
import { differsFromGame } from '@/utils/edited';
import { MotionPreview } from './MotionPreview';

/** One clip in the gallery: its preview, its name and a dot when it has edits the game does not have yet. */
export function MotionTile({ motion }: { motion: HeroMotion }) {
  const openClip = useOpenClip();
  const open = useMotionStore((state) => state.motion === motion.id);
  const draft = useMotionStore((state) => state.drafts[motion.id]);
  const game = useGameClip(motion.id);
  const edited = differsFromGame(draft, game);
  return (
    <button
      type="button"
      onClick={() => openClip(motion.id)}
      aria-pressed={open}
      className={cn(
        'flex compact:w-24 compact:shrink-0 flex-col gap-1 rounded-md border border-border bg-background p-1 text-left hover:border-border-strong',
        open && 'border-primary ring-1 ring-primary',
      )}
    >
      <MotionPreview
        skin={studioHero(motion.hero).skin}
        clip={draft ?? game}
        fps={framesPerSecond(motion, (draft ?? game).frames.length)}
      />
      <span className="flex items-center gap-1 px-0.5 text-[11px] leading-4">
        <span className="truncate">{motion.label}</span>
        {edited && (
          <span
            role="img"
            aria-label="Edited"
            className="ml-auto size-1.5 shrink-0 rounded-full bg-warning"
          />
        )}
      </span>
    </button>
  );
}
