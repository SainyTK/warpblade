import { Checkbox } from '@/components/ui/checkbox';
import { type HeroMotion, studioHero } from '@/constants/heroMotion';

interface CopyChoiceProps {
  motion: HeroMotion;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** One edited clip in the copy list, ticked when it goes in the note. */
export function CopyChoice({ motion, checked, onChange }: CopyChoiceProps) {
  return (
    <label className="flex compact:min-h-11 min-h-8 items-center gap-2.5 rounded-md px-1.5 text-sm hover:bg-muted">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      <span className="truncate">
        {studioHero(motion.hero).name} {motion.label}
      </span>
    </label>
  );
}
