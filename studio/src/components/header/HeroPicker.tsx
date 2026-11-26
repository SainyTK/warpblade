import { motionId } from '@shared/motionId';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { STUDIO_HEROES } from '@/constants/heroMotion';
import { useEditedMotions } from '@/hooks/useEditedMotions';
import { useOpenClip } from '@/hooks/useOpenClip';
import { useOpenMotion } from '@/hooks/useOpenMotion';

const ITEMS = STUDIO_HEROES.map((hero) => ({ value: hero.id, label: hero.name }));

/** Picks the hero to pose. The same clip stays open, so run moves from one hero's run to the next. */
export function HeroPicker() {
  const motion = useOpenMotion();
  const openClip = useOpenClip();
  const edited = new Set(useEditedMotions().map((entry) => entry.hero));
  return (
    <Select
      items={ITEMS}
      value={motion.hero}
      onValueChange={(hero) => {
        if (hero) {
          openClip(motionId(hero, motion.clip));
        }
      }}
    >
      <SelectTrigger aria-label="Hero" className="min-w-32 font-pixel">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STUDIO_HEROES.map((hero) => (
          <SelectItem key={hero.id} value={hero.id}>
            {hero.name}
            {edited.has(hero.id) && (
              <span role="img" aria-label="Edited" className="size-1.5 rounded-full bg-warning" />
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
