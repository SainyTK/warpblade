import { skillLevel, skillValues } from "../../../game/skills/query";
import { hero, progress } from "../../../game/state";
import { SKILL } from "../constants/skillIds";
import type { YunMoveId } from "../types/moves";
import { echoBlow } from "./echo";
import { isLead, THRUST, yunFx } from "./fx";
import { YUN_MOVES } from "./moves";
import { keenLanded } from "./skills/flowingWater";
import { needleFoe } from "./skills/jadeNeedle";
import { airCut, airEchoes } from "./skills/petalStorm";

/** moves of the air string */
const AIR: ReadonlySet<string> = new Set<YunMoveId>(["driftingCut", "fallingPetal"]);

/**
 * A move's blow is out: every held spirit sword repeats it as a thrust ahead, Keen when the blow was; a Keen blow that
 * landed answers Flowing Water and Jade Needle; an air cut answers Petal Storm
 */
export function afterStrike(id: YunMoveId, hits: number): void {
  if (hero.hitIndex < YUN_MOVES[id].hits.length) return;
  const air = AIR.has(id);
  echoBlow(hero.keen, air ? airEchoes() : 1);
  if (air) airCut(id, hits);
  if (!air && skillLevel(SKILL.crane)) {
    const at = { x: hero.x + hero.face * 8, y: hero.y - 18, face: hero.face, reach: 24 };
    const damage = progress.stats.ad * (skillValues(SKILL.crane).power ?? 1);
    yunFx(SKILL.crane, "slash", at, { damage, quiet: hits === 0 || !isLead(SKILL.crane), signature: THRUST });
  }
  if (!hero.keen || hits === 0) return;
  keenLanded(hero.lastHit);
  if (skillValues(SKILL.needle).keen) needleFoe(hero.lastHit);
}
