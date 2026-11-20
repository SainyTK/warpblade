import { objectMemory, rememberPerSeat } from "../seatMemory";

/** the job of the hero in play: null for the hero's own. Set when a solo run starts or a hero is chosen; every seat of a
 *  co-op room plays its hero's own job */
const job: { id: string | null } = { id: null };
rememberPerSeat(objectMemory(job));

/** the job the hero in play fights in, or null for the hero's own job */
export const heroJob = (): string | null => job.id;

export function setHeroJob(id: string | null): void {
  job.id = id;
}
