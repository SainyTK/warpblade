import { useContext } from 'react';
import { type ActiveJob, ActiveJobContext } from '@/providers/activeJobContext';

export function useActiveJob(): ActiveJob {
  const job = useContext(ActiveJobContext);
  if (!job) {
    throw new Error('ActiveJobProvider is required');
  }
  return job;
}
