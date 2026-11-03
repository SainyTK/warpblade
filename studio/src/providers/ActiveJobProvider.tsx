import { type ReactNode, useMemo } from 'react';
import { useJobView } from '@/hooks/useJobView';
import { decide, sendTurn, setJobMode, stopJob } from '@/services/jobApi';
import { type ActiveJob, ActiveJobContext } from './activeJobContext';

/** Owns the open job's live view and the actions on it, for every part of the job panel. */
export function ActiveJobProvider({ jobId, children }: { jobId: string; children: ReactNode }) {
  const { view, error } = useJobView(jobId);
  const value = useMemo<ActiveJob>(
    () => ({
      view,
      error,
      busy: Boolean(view?.run && view.run.status !== 'idle'),
      decide: async (approvalId, decision, answers) => {
        await decide(jobId, approvalId, { decision, answers: answers ?? null });
      },
      send: async (text, model, permissionMode) => {
        await sendTurn(jobId, { text, model, permissionMode });
      },
      stop: async () => {
        await stopJob(jobId);
      },
      setMode: async (permissionMode) => {
        await setJobMode(jobId, permissionMode);
      },
    }),
    [jobId, view, error],
  );
  return <ActiveJobContext.Provider value={value}>{children}</ActiveJobContext.Provider>;
}
