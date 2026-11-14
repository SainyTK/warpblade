import { dealDamage } from "../../../../game/damage";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { addStacks, consumeStacks, stacksOf } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillValues, withCharms } from "../../../../game/skills/query";
import { game, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { CRIMSON } from "../../constants/colors";

const ID = "br_embers";
/** embers tick this often and last this long after the last one; the slam spreads them this far; a burst reaches this
 *  far */
const EMBERS = { every: 0.5, duration: 3, spread: 36, burst: 34 } as const;

/** lay `n` embers on a foe at the skill's numbers */
function lay(foe: Enemy, n: number): void {
  const v = skillValues(ID);
  addStacks(foe, ID, {
    stacks: n,
    max: withCharms("amount", v.max),
    damage: progress.stats.ad * v.damage,
    every: EMBERS.every,
    duration: withCharms("duration", EMBERS.duration),
  });
}

/** Forge Heart: a foe full of embers bursts, burning the foes round it for the embers it held */
function burst(foe: Enemy): void {
  const v = skillValues(ID);
  const n = consumeStacks(foe, ID);
  game.fx.push(createFloorRing(foe.x, foe.y, EMBERS.burst, CRIMSON, 0.4));
  for (const e of game.enemies) {
    if (e.hp <= 0 || Math.abs(e.x - foe.x) > EMBERS.burst || Math.abs(e.y - foe.y) > EMBERS.burst) continue;
    dealDamage(e, progress.stats.ad * v.burst * n, { fromX: foe.x, kx: Math.sign(e.x - foe.x) * 60, source: ID });
  }
}

/** Searing Edge: her string blows lay embers that burn; a heavy swing lays more, the slam spreads them, and evolved a
 *  foe full of them bursts */
export const searingEdge: SkillBehavior = {
  create: () => ({}),
  on: {
    blow(_m, e) {
      if (!e.move || e.foe.hp <= 0) return;
      const v = skillValues(ID);
      lay(e.foe, e.keen ? v.heavy : v.stacks);
      if (e.move === "slam" && v.slam) {
        const held = stacksOf(e.foe, ID);
        for (const other of game.enemies)
          if (other !== e.foe && other.hp > 0 && Math.abs(other.x - e.foe.x) < EMBERS.spread) lay(other, held);
      }
      if (skillEvolved(ID) && stacksOf(e.foe, ID) >= withCharms("amount", v.max)) burst(e.foe);
    },
  },
};
