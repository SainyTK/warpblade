import type { JobView } from '@shared/api';
import { useEffect, useState } from 'react';
import { getJob } from '@/services/jobApi';
import { followJob } from '@/services/jobEvents';
import { applyJobEvent } from '@/utils/jobEvents';

/** One job's timeline, loaded once and then followed live. A reset from the server reloads it. */
export function useJobView(id: string | null): { view: JobView | null; error: string | null } {
  const [view, setView] = useState<JobView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generation, setGeneration] = useState(0);
  // biome-ignore lint/correctness/useExhaustiveDependencies: a new generation reloads the view after a reset.
  useEffect(() => {
    if (!id) {
      setView(null);
      return;
    }
    let stop = () => {};
    let cancelled = false;
    getJob(id)
      .then((loaded) => {
        if (cancelled) {
          return;
        }
        setView(loaded);
        setError(null);
        stop = followJob(id, loaded.epoch, loaded.seq, (event) => {
          if (event.type === 'reset') {
            stop();
            setGeneration((value) => value + 1);
            return;
          }
          setView((current) => (current ? applyJobEvent(current, event) : current));
        });
      })
      .catch((problem: unknown) =>
        setError(problem instanceof Error ? problem.message : 'The job could not be read.'),
      );
    return () => {
      cancelled = true;
      stop();
    };
  }, [id, generation]);
  return { view: view?.id === id ? view : null, error };
}
