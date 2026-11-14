import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { addStacks, consumeStacks, stacksOf } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillValues } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { foeAt } from "../abilities/spells";

const SOURCE = "ce_curse";

/** lay `n` stacks of the curse on a foe, and hold a walker's feet from the fourth level */
function curse(e: Enemy, n: number): void {
  const v = skillValues(SOURCE);
  addStacks(e, SOURCE, {
    stacks: n,
    max: v.max,
    damage: progress.stats.ad * v.damage,
    every: 0.5,
    duration: v.duration,
  });
  if (v.halt) e.halt = Math.max(e.halt, v.halt);
}

/** Wilting Curse: a parry curses the attacker, links deepen it, a cursed foe that falls curses those round it, and
 *  evolved the chain's last link tears it out */
export const wiltingCurse: SkillBehavior = {
  create: () => ({}),
  on: {
    parry(_m, { fromX }) {
      const foe = foeAt(fromX);
      if (foe) curse(foe, skillValues(SOURCE).stacks);
    },
    riposteLink(_m, { foe }) {
      const v = skillValues(SOURCE);
      if (v.linkStacks && foe && foe.hp > 0) curse(foe, v.linkStacks);
    },
    riposteEnd(_m, { foe }) {
      if (!skillEvolved(SOURCE) || !foe || foe.hp <= 0) return;
      const n = consumeStacks(foe, SOURCE);
      if (n)
        dealDamage(foe, progress.stats.ad * skillValues(SOURCE).tear * n, { fromX: hero.x, kx: 0, source: SOURCE });
    },
    kill(_m, { foe }) {
      const v = skillValues(SOURCE);
      if (!v.burst || !stacksOf(foe, SOURCE)) return;
      const [x, y] = enemyCenter(foe);
      for (const e of game.enemies) {
        if (e === foe || e.hp <= 0) continue;
        const [ex, ey] = enemyCenter(e);
        if (Math.hypot(ex - x, ey - y) < v.burst) curse(e, v.stacks);
      }
    },
  },
};
