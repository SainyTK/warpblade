import type { JobTarget } from '@shared/api';

export const JOB_TARGETS: readonly { value: JobTarget; label: string }[] = [
  { value: 'worktree', label: 'New worktree' },
  { value: 'checkout', label: 'This checkout' },
];
