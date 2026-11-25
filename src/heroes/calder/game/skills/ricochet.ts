import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { game, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { PHOSPHOR_SPARKS } from "../../constants/colors";
import type { CalderRound } from "../../types/events";
import { createTracerLine } from "../effects/tracerLine";

const SKILL = "ca_ricochet";

/** the nearest standing foe to (x, y) within `range` that the round has not struck yet */
function nextFoe(x: number, y: number, range: number, struck: readonly Enemy[]): Enemy | null {
  let best: Enemy | null = null;
  let bestD = range;
  for (const e of game.enemies) {
    if (e.hp <= 0 || struck.includes(e)) continue;
    const [ex, ey] = enemyCenter(e);
    const d = Math.hypot(ex - x, ey - y);
    if (d < bestD) {
      best = e;
      bestD = d;
    }
  }
  return best;
}

/** which rounds ricochet: a Trigger's, the warp's and the parry's from level 6, and every round as Pinball */
function ricochets(kind: CalderRound): boolean {
  if (skillEvolved(SKILL)) return true;
  if (kind === "trigger") return true;
  return !!skillValues(SKILL).more && (kind === "warp" || kind === "parry");
}

/** Ricochet: a round that struck a foe jumps on to the nearest other foe, and on again, each jump a tracer and a hit */
export const ricochet: SkillBehavior = {
  create: () => ({}),
  on: {
    calderBlast(_m, event) {
      if (!event.foes.length || !ricochets(event.kind)) return;
      const v = skillValues(SKILL);
      const range = withBuild("area", v.range);
      const struck = [...event.foes];
      let [x, y] = [event.x, event.y];
      for (let i = 0; i < v.bounces; i++) {
        const e = nextFoe(x, y, range, struck);
        if (!e) return;
        struck.push(e);
        const [ex, ey] = enemyCenter(e);
        game.fx.push(createTracerLine(x, y, ex, ey));
        game.fx.push(createImpact(ex, ey, Math.sign(ex - x) || 1, false, PHOSPHOR_SPARKS));
        const damage = progress.stats.ad * v.power * (1 + (v.grow ?? 0) * i);
        dealDamage(e, damage, { fromX: x, kx: Math.sign(ex - x) * 40, ky: -20, stagger: v.stagger, source: SKILL });
        [x, y] = [ex, ey];
      }
    },
  },
};
