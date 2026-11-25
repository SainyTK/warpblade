import { useEffect, useState } from 'react';
import { listDrafts } from '@/services/draftApi';
import { useMotionStore } from '@/store/motionStore';

/** Loads the saved drafts once. Returns why they could not be read, if so. */
export function useDraftBoot(): string | null {
  const boot = useMotionStore((state) => state.boot);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    listDrafts()
      .then(boot)
      .catch((problem: unknown) =>
        setError(problem instanceof Error ? problem.message : 'The drafts could not be read.'),
      );
  }, [boot]);
  return error;
}
