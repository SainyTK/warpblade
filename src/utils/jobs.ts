import type { CharacterDef, HeroControls, HeroSkin } from "../types/character";
import type { HeroJob, JobDef } from "../types/job";

/** one of a hero's jobs by id; none for the base job (null) or an id the hero does not have */
export const findJob = (c: CharacterDef, id: string | null): JobDef | undefined =>
  id === null ? undefined : c.jobs?.find((j) => j.id === id);

/** the hero's look in a job: the job's own skin, or the hero's for the base job */
export const jobSkin = (c: CharacterDef, id: string | null): HeroSkin => findJob(c, id)?.skin ?? c.skin;

/** the hero's Controls lines in a job: the job's lines over the hero's own */
export function jobControls(c: CharacterDef, id: string | null): HeroControls {
  const job = findJob(c, id);
  if (!job) return c.controls;
  return {
    actions: { ...c.controls.actions, ...job.controls.actions },
    touch: { ...c.controls.touch, ...job.controls.touch },
    stick: job.controls.stick ?? c.controls.stick,
  };
}

/** what the hero screen writes under the name in a job, and the blurb under the stats */
export const jobTitle = (c: CharacterDef, id: string | null): string => findJob(c, id)?.title ?? c.title;
export const jobBlurb = (c: CharacterDef, id: string | null): string => findJob(c, id)?.blurb ?? c.blurb;

/** every job of every hero, in roster order */
export const allJobs = (characters: readonly CharacterDef[]): HeroJob[] =>
  characters.flatMap((c) => (c.jobs ?? []).map((job) => ({ hero: c.id, job })));

/** the unlock ids of every job, for the ids a save keeps */
export const jobUnlockIds = (characters: readonly CharacterDef[]): string[] =>
  allJobs(characters).map((j) => j.job.unlock.id);
