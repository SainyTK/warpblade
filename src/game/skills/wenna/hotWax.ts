import { WAX } from "../../../constants/palette";
import { PK } from "../../../types/particle";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks } from "../../enemies/skillStatus";
import { game, particles, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";

const ID = "w_hotWax";

/** a splash of hot wax round a point: foes in it carry Hot Wax stacks, and with its level a chill */
export function splashWax(x: number, y: number): void {
  const v = skillValues(ID);
  if (!v.damage) return;
  const radius = withCharms("area", v.radius);
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - x, (cy - (y - 6)) * 1.3) > radius) continue;
    addStacks(e, ID, {
      stacks: v.stacks,
      max: v.stacks * 3,
      damage: progress.stats.ap * v.damage,
      every: 1,
      duration: withCharms("duration", v.life),
    });
    if (v.chill) e.chill = Math.max(e.chill, 1);
  }
  for (let i = 0; i < 10; i++)
    particles.spawn(PK.SHARD, x, y - 3, rng.range(-70, 70), -rng.range(40, 110), rng.range(0.3, 0.6), {
      col: rng.chance(0.5) ? WAX[3] : WAX[2],
      size: rng.range(0.8, 1.6),
    });
}

/**
 * Hot Wax: a Wick that lands from her lamp splashes the foes near it; with its levels relights and Swap arrivals splash
 * too. Candlemaker (in her drips) doubles the Wax a splashed foe drips.
 */
export const hotWaxSkill: SkillBehavior = {
  create: () => ({}),
  on: {
    wick(_m, event) {
      if (!event.lit) return;
      const v = skillValues(ID);
      if (event.cause === "light" || (event.cause === "relight" && v.relight)) splashWax(event.x, event.y);
    },
    swap(_m, event) {
      if (skillValues(ID).swap) splashWax(event.from.x, event.from.y);
    },
  },
};
