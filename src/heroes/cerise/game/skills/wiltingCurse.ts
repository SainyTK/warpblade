import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { addStacks, consumeStacks, stacksOf } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillValues } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { foeAt } from "../abilities/spells";
import { atFloor, atFoe, ceriseFx } from "../fx";

const SOURCE = "ce_curse";

/** lay `n` stacks of the curse on a foe, and hold a walker's feet from the fourth level */
export function curse(e: Enemy, n: number): void {
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
      if (!foe) return;
      curse(foe, skillValues(SOURCE).stacks);
      const v = skillValues(SOURCE);
      const damage = progress.stats.ad * v.damage * v.stacks * 6;
      ceriseFx(SOURCE, "mark", atFoe(foe, 16), { damage, sigil: "rose", lift: 6 });
      if (skillEvolved(SOURCE)) ceriseFx(SOURCE, "spikes", atFloor(foe.x, foe.y, 20), { damage, quiet: true });
    },
    riposteLink(_m, { foe }) {
      const v = skillValues(SOURCE);
      if (v.linkStacks && foe && foe.hp > 0) curse(foe, v.linkStacks);
    },
    riposteEnd(_m, { foe }) {
      if (!skillEvolved(SOURCE) || !foe || foe.hp <= 0) return;
      const n = consumeStacks(foe, SOURCE);
      if (!n) return;
      const blow = progress.stats.ad * skillValues(SOURCE).tear * n;
      dealDamage(foe, blow, { fromX: hero.x, kx: 0, source: SOURCE });
      ceriseFx(SOURCE, "burst", atFoe(foe, 16), { damage: blow, sigil: "rose" });
      ceriseFx(SOURCE, "spikes", atFloor(foe.x, foe.y, 24), { damage: blow, quiet: true });
    },
    kill(_m, { foe }) {
      const v = skillValues(SOURCE);
      if (!v.burst || !stacksOf(foe, SOURCE)) return;
      const [x, y] = enemyCenter(foe);
      ceriseFx(SOURCE, "nova", atFloor(x, foe.y, v.burst), {
        damage: progress.stats.ad * v.damage * v.stacks * 4,
        quiet: true,
      });
      for (const e of game.enemies) {
        if (e === foe || e.hp <= 0) continue;
        const [ex, ey] = enemyCenter(e);
        if (Math.hypot(ex - x, ey - y) < v.burst) curse(e, v.stacks);
      }
    },
  },
};
