import { HERO_SOURCES } from "../constants/damageSources";
import type { RelicId, SourceId } from "../types/build";
import type { RunReport, SourceResult } from "../types/run";
import { heldSources, runSeconds } from "./damageLedger";
import { character, game, progress } from "./state";

/** a relic's level and whether it evolved, from the build the hero ends with */
function relicState(id: RelicId): Pick<SourceResult, "level" | "evolved"> {
  return { level: progress.build.relics[id] ?? 0, evolved: progress.build.evolved.includes(id) };
}

const isRelic = (id: SourceId): id is RelicId => !HERO_SOURCES.has(id);

/** what the hero in play did this run; read before the run is reset */
export function runReport(): RunReport {
  return {
    hero: character.id,
    seconds: runSeconds(),
    level: progress.level,
    kills: game.kills,
    ultimate: progress.ultimate,
    sources: heldSources().map((s) => (isRelic(s.id) ? { ...s, ...relicState(s.id) } : s)),
  };
}
