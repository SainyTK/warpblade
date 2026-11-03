import type { JobEvent } from '@shared/api';

/** Follows a job's events from the page's position. Returns a function that stops following. */
export function followJob(
  id: string,
  epoch: string,
  after: number,
  onEvent: (event: JobEvent) => void,
): () => void {
  const source = new EventSource(`/api/jobs/${id}/events?epoch=${epoch}&after=${after}`);
  source.onmessage = (message) => onEvent(JSON.parse(message.data) as JobEvent);
  return () => source.close();
}
