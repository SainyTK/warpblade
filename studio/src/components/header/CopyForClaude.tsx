import type { MotionId } from '@shared/motionId';
import { Check, ClipboardCopy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { HeroMotion } from '@/constants/heroMotion';
import { useEditedMotions } from '@/hooks/useEditedMotions';
import { copyText } from '@/services/clipboard';
import { useMotionStore } from '@/store/motionStore';
import { claudeNote } from '@/utils/claudeNote';
import { CopyChoice } from './CopyChoice';

const COPIED_MS = 2000;

/** Copies a note for Claude naming the edited clips to apply: the ones ticked, or all of them. */
export function CopyForClaude() {
  const edited = useEditedMotions();
  const openMotion = useMotionStore((state) => state.motion);
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<ReadonlySet<MotionId>>(new Set());
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = setTimeout(() => setCopied(false), COPIED_MS);
    return () => clearTimeout(timer);
  }, [copied]);
  const selected = edited.filter((motion) => picked.has(motion.id));
  const copy = async (motions: readonly HeroMotion[]) => {
    setOpen(false);
    setCopied(await copyText(claudeNote(motions)));
  };
  const pick = (motion: MotionId, on: boolean) => {
    const next = new Set(picked);
    if (on) {
      next.add(motion);
    } else {
      next.delete(motion);
    }
    setPicked(next);
  };
  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setPicked(new Set(edited.some((motion) => motion.id === openMotion) ? [openMotion] : []));
        }
      }}
    >
      <PopoverTrigger render={<Button disabled={!edited.length} />}>
        {copied ? <Check /> : <ClipboardCopy />}
        {copied ? 'Copied' : `Copy for Claude${edited.length ? ` (${edited.length})` : ''}`}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 gap-2 p-1.5">
        <fieldset className="grid">
          <legend className="sr-only">Edited moves</legend>
          {edited.map((motion) => (
            <CopyChoice
              key={motion.id}
              motion={motion}
              checked={picked.has(motion.id)}
              onChange={(on) => pick(motion.id, on)}
            />
          ))}
        </fieldset>
        <div className="grid grid-cols-2 gap-1.5">
          <Button variant="secondary" disabled={!selected.length} onClick={() => copy(selected)}>
            Copy selected
          </Button>
          <Button onClick={() => copy(edited)}>Copy all</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
