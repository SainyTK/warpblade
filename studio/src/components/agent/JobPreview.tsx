import { ExternalLink, Gamepad2, LoaderCircle, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useActiveJob } from '@/hooks/useActiveJob';
import { startPreview, stopPreview } from '@/services/jobApi';

/** Runs the game from the job's folder and links to it, so the owner can play what the agent built. */
export function JobPreview() {
  const { view } = useActiveJob();
  const [error, setError] = useState<string | null>(null);
  if (!view) {
    return null;
  }
  const preview = view.preview;
  const start = () => {
    setError(null);
    startPreview(view.id).catch((problem: unknown) =>
      setError(problem instanceof Error ? problem.message : 'The game could not start.'),
    );
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      {!preview || preview.status === 'failed' ? (
        <Button variant="outline" size="sm" onClick={start}>
          <Gamepad2 />
          Play this build
        </Button>
      ) : preview.status === 'starting' ? (
        <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <LoaderCircle className="size-3.5 animate-spin" />
          Starting the game
        </span>
      ) : (
        <>
          <Button
            variant="outline"
            size="sm"
            render={<a href={preview.url ?? '#'} target="_blank" rel="noreferrer" />}
          >
            <ExternalLink />
            Open game
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Stop the game"
            onClick={() => void stopPreview(view.id)}
          >
            <X />
          </Button>
        </>
      )}
      {(error ?? preview?.error) && (
        <span className="text-destructive text-xs">{error ?? preview?.error}</span>
      )}
    </div>
  );
}
