import type { SourceId } from "../types/build";

/** the hero's own sources: their hits build Flow, and the hero holds them from the start of the run */
export const HERO_SOURCES: ReadonlySet<SourceId> = new Set<SourceId>(["attacks", "abilities", "ultimate"]);
