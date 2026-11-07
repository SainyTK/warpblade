import { CHARMS } from "../../constants/charms";
import { RELIC_MAX_LEVEL } from "../../constants/growth";
import { learnRecipe } from "../../store/unlocks";
import type { CharmId, RelicId } from "../../types/build";
import { feat } from "../feat";
import { progress } from "../state";

/** a relic is taken at level 1 or goes up a level, up to its top */
export function raiseRelic(id: RelicId): void {
  const relics = progress.build.relics;
  const level = Math.min(RELIC_MAX_LEVEL, (relics[id] ?? 0) + 1);
  relics[id] = level;
  feat({ kind: "relicLevel", relic: id, level });
}

/** a charm is taken at level 1 or goes up a level, up to its top */
export function raiseCharm(id: CharmId): void {
  const charms = progress.build.charms;
  charms[id] = Math.min(CHARMS[id].maxLevel, (charms[id] ?? 0) + 1);
}

/** a relic takes its evolved form for the rest of the run, and its recipe is known from then on */
export function evolveRelic(id: RelicId): void {
  if (progress.build.evolved.includes(id)) return;
  progress.build.evolved = [...progress.build.evolved, id];
  learnRecipe(id);
  feat({ kind: "evolved", relic: id });
}
