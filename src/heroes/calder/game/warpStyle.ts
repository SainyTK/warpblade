import { enemyCenter } from "../../../game/enemies/enemy";
import { emitSkillEvent } from "../../../game/skills/events";
import { skillValues } from "../../../game/skills/query";
import { progress } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import type { WarpStyle } from "../../../types/moveset";
import { WARP_ROUND } from "../constants/warp";
import { blastFoe } from "./blastFoe";
import { roundPower, spendRounds } from "./chamber";
import { calder } from "./state";

const SKILL = "ca_tracer";

/** the arrival fires a loaded round into the foe: a small blast, a fifth of the arrival blow; Tracer Warp's later levels
 *  fire it with no round and widen it */
function arrived(foe: Enemy | null): void {
  if (!foe || foe.hp <= 0) return;
  const v = skillValues(SKILL);
  if (!v.free && !spendRounds(1)) return;
  const struck = blastFoe(foe, {
    damage: progress.stats.ad * (v.blast ?? WARP_ROUND.blast) * roundPower(),
    splash: v.splash ? progress.stats.ad * v.splash : 0,
    reach: v.reach ?? 0,
    kx: 40,
    hot: calder.hot,
  });
  const [x, y] = enemyCenter(foe);
  emitSkillEvent({ type: "calderBlast", x, y, foes: struck });
}

/** Calder's warp: the chamber sword thrown as drawn, and a round fired on arrival; Tracer Warp's numbers */
export const CALDER_WARP: WarpStyle = {
  arrived,
  tune: () => skillValues(SKILL),
};
