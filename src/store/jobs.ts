import { CHARACTERS } from "../heroes/roster";
import { loadJobChoice, saveJobChoice } from "../services/jobChoice";
import type { JobDef } from "../types/job";
import { parseJobChoice } from "../utils/jobChoice";
import { findJob } from "../utils/jobs";
import { isFound } from "./unlocks";

/** The one owner of the job chosen for each hero, kept in this browser. A job that is locked or unknown is never chosen,
 *  so the hero plays their own job. */
let choice = parseJobChoice(loadJobChoice());

/** the job is open: found through its goal, or every job in a playtest session */
export const jobOpen = (job: JobDef): boolean => isFound(job.unlock.id);

/** the job chosen for the hero, or null for the hero's own job */
export function chosenJob(heroId: string): string | null {
  const c = CHARACTERS.find((h) => h.id === heroId);
  const job = c ? findJob(c, choice[heroId] ?? null) : undefined;
  return job && jobOpen(job) ? job.id : null;
}

/** choose a job for the hero, null for their own; false when that job is locked or unknown */
export function chooseJob(heroId: string, jobId: string | null): boolean {
  const c = CHARACTERS.find((h) => h.id === heroId);
  const job = c ? findJob(c, jobId) : undefined;
  if (jobId !== null && (!job || !jobOpen(job))) return false;
  const { [heroId]: _, ...rest } = choice;
  choice = jobId === null ? rest : { ...rest, [heroId]: jobId };
  saveJobChoice(choice);
  return true;
}
