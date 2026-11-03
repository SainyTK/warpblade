import type { JobSummary } from '@shared/api';
import { JobRow } from './JobRow';

export function JobList({ jobs }: { jobs: JobSummary[] }) {
  if (!jobs.length) {
    return (
      <p className="px-1 py-6 text-center text-muted-foreground text-sm">No agent jobs yet.</p>
    );
  }
  return (
    <ul className="grid gap-2">
      {jobs.map((job) => (
        <li key={job.id}>
          <JobRow job={job} />
        </li>
      ))}
    </ul>
  );
}
