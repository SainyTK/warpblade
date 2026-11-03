import { Bot, Send } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { JOB_TARGETS } from '@/constants/targets';
import { useBuildJob } from '@/hooks/useBuildJob';
import { OptionSelect } from '../common/OptionSelect';
import { ModelPicker } from './ModelPicker';
import { ModePicker } from './ModePicker';

/** Hands the open sketch to a new Claude Code agent with an instruction. */
export function BuildDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const form = useBuildJob(() => {
    setOpen(false);
    onCreated();
  });
  const keys = form.sketch?.motion.keys.length ?? 0;
  const cels = form.sketch?.effect.cels.length ?? 0;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="w-full" />}>
        <Bot />
        Build with an agent
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Build "{form.sketch?.name}"</DialogTitle>
          <DialogDescription>
            The agent gets the snapshots, the drawn frames and your instruction.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          autoFocus
          value={form.instruction}
          onChange={(event) => form.setInstruction(event.target.value)}
          placeholder="Make this the third ground hit, with the effect on the hit frame"
          className="min-h-28"
        />
        <div className="grid gap-2">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={form.motion && form.hasMotion}
              disabled={!form.hasMotion}
              onCheckedChange={(checked) => form.setMotion(checked)}
            />
            Motion ({keys} snapshots)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={form.effect && form.hasEffect}
              disabled={!form.hasEffect}
              onCheckedChange={(checked) => form.setEffect(checked)}
            />
            Effect ({cels} frames)
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ModelPicker value={form.model} onChange={form.setModel} />
          <ModePicker value={form.permissionMode} onChange={form.setPermissionMode} />
          <div className="w-40">
            <OptionSelect
              label="Where"
              value={form.target}
              options={JOB_TARGETS}
              onChange={(value) => form.setTarget(value === 'checkout' ? 'checkout' : 'worktree')}
            />
          </div>
        </div>
        {form.error && <p className="text-destructive text-sm">{form.error}</p>}
        <DialogFooter>
          <Button disabled={!form.ready || form.sending} onClick={form.submit}>
            <Send />
            {form.sending ? 'Sending' : 'Send to agent'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
