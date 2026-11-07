import { HERO_SOURCES } from "../constants/damageSources";
import type { HeroSource, SourceId } from "../types/build";

/** one of the hero's own presses, as opposed to a skill's id */
export const isHeroSource = (id: SourceId): id is HeroSource => HERO_SOURCES.has(id);
