import type { SourceId } from "../types/build";

/** the hero's own sources: their hits build Flow, and the hero holds them from the start of the run; every other
 *  source is a skill's id */
export const HERO_SOURCES: ReadonlySet<SourceId> = new Set<SourceId>(["attacks", "abilities", "ultimate"]);
