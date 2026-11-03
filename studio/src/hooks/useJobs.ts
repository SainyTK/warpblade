import type { JobSummary } from '@shared/api';
import { useCallback, useEffect, useState } from 'react';
import { listJobs } from '@/services/jobApi';

const POLL_MS = 3000;

/** Every agent job, newest first, refreshed every few seconds. */
export function useJobs() {
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const refresh = useCallback(async () => {
    setJobs(await listJobs().catch(() => []));
  }, []);
  useEffect(() => {
    void refresh();
    const timer = setInterval(refresh, POLL_MS);
    return () => clearInterval(timer);
  }, [refresh]);
  return { jobs, refresh };
}
