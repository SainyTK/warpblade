import type { PermissionModeId } from '@shared/permissionModes';
import { ArrowUp, Square } from 'lucide-react';
import { type KeyboardEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useActiveJob } from '@/hooks/useActiveJob';
import { ModelPicker } from './ModelPicker';
import { ModePicker } from './ModePicker';

/** A follow-up for the job's agent, with its model and permission mode. Enter sends, Shift+Enter breaks a line. */
export function JobComposer() {
  const job = useActiveJob();
  const [text, setText] = useState('');
  const [model, setModel] = useState<string | null>(null);
  const [mode, setMode] = useState<PermissionModeId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const view = job.view;
  if (!view) {
    return null;
  }
  const chosenModel = model ?? view.run?.model ?? view.model;
  const chosenMode = mode ?? view.run?.permissionMode ?? view.permissionMode;
  const setting = !view.brief;

  const send = async () => {
    if (!text.trim() || job.busy || setting) {
      return;
    }
    setError(null);
    try {
      await job.send(text, chosenModel, chosenMode);
      setText('');
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : 'The message was not sent.');
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void send();
    }
  };

  return (
    <div className="grid gap-2 border-border border-t p-3">
      {error && <p className="text-destructive text-xs">{error}</p>}
      <Textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={job.busy ? 'The agent is working' : 'Ask for a change'}
        className="max-h-40 min-h-16 text-sm"
      />
      <div className="flex items-center gap-1.5">
        <ModelPicker value={chosenModel} onChange={setModel} />
        <ModePicker
          value={chosenMode}
          onChange={(next) => {
            setMode(next);
            void job.setMode(next);
          }}
        />
        {job.busy ? (
          <Button
            variant="secondary"
            size="icon"
            aria-label="Stop"
            className="ml-auto"
            onClick={() => void job.stop()}
          >
            <Square />
          </Button>
        ) : (
          <Button
            size="icon"
            aria-label="Send"
            className="ml-auto"
            disabled={!text.trim() || setting}
            onClick={send}
          >
            <ArrowUp />
          </Button>
        )}
      </div>
    </div>
  );
}
