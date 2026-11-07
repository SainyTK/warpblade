import type { SourceId } from "../types/build";
import type { RunReport, SourceResult } from "../types/run";
import { isHeroSource } from "../utils/sources";
import { heldSources, runSeconds } from "./damageLedger";
import { character, game, progress } from "./state";

/** a skill's level and whether it evolved, from the build the hero ends with; the hero's own sources have none */
function skillState(id: SourceId): Pick<SourceResult, "level" | "evolved"> {
  if (isHeroSource(id)) return {};
  return { level: progress.build.skills[id] ?? 0, evolved: progress.build.evolved.includes(id) };
}

/** what the hero in play did this run; read before the run is reset */
export function runReport(): RunReport {
  return {
    hero: character.id,
    seconds: runSeconds(),
    level: progress.level,
    kills: game.kills,
    ultimate: progress.ultimate,
    sources: heldSources().map((s) => ({ ...s, ...skillState(s.id) })),
  };
}
