import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { addStacks, consumeStacks, stacksOf } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { game, progress } from "../../../../game/state";
import { surfaceBelow } from "../../../../game/world";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { CRIMSON_SPARKS } from "../../constants/colors";
import { brynnFx, PLANTED } from "../fx";

const ID = "br_crush";
/** a crushed foe that falls passes its stacks to foes this close */
const SPREAD = 36;

/** lay `n` crush stacks */
function crush(foe: Enemy, n: number): void {
  const v = skillValues(ID);
  addStacks(foe, ID, {
    stacks: n,
    max: withBuild("amount", v.max),
    damage: progress.stats.ad * v.damage,
    every: v.every,
    duration: withBuild("duration", v.time),
  });
  if (v.halt) foe.halt = Math.max(foe.halt, v.every);
  const at = { x: foe.x, y: surfaceBelow(foe.x, foe.y - 4), reach: 12 + n * 2 };
  brynnFx(ID, "spikes", at, { damage: progress.stats.ad * v.damage * n * 6, quiet: n < 2 });
}

/** Crushing Weight: a foe her blows leave lying down (or, from its third level, thrown up) is crushed and bleeds; a
 *  slam on a foe in the air crushes it three times over; Grindstone's slam grinds every stack out at once */
export const crushingWeight: SkillBehavior = {
  create: () => ({}),
  on: {
    kill(_m, e) {
      const n = stacksOf(e.foe, ID);
      if (!skillValues(ID).spread || !n) return;
      for (const other of game.enemies)
        if (other !== e.foe && other.hp > 0 && Math.abs(other.x - e.foe.x) < SPREAD) crush(other, n);
    },
    blow(_m, e) {
      const v = skillValues(ID);
      const foe = e.foe;
      if (foe.hp <= 0) return;
      if (e.finisher && skillEvolved(ID) && stacksOf(foe, ID)) {
        const n = consumeStacks(foe, ID);
        dealDamage(foe, progress.stats.ad * v.grind * n, { fromX: foe.x, source: ID });
        game.fx.push(createImpact(foe.x, foe.y - 8, 1, true, CRIMSON_SPARKS));
        const at = { x: foe.x, y: surfaceBelow(foe.x, foe.y - 4), reach: 20 + n * 2 };
        brynnFx(ID, "spikes", at, { damage: progress.stats.ad * v.grind * n, signature: PLANTED });
        brynnFx(ID, "burst", { x: foe.x, y: foe.y - 10, reach: 12 }, { quiet: true, delay: 0.06 });
        return;
      }
      if (e.finisher && e.airborne && v.spike) crush(foe, v.spike);
      else if ((foe.stun > 0 && !foe.air) || (foe.air && v.air)) crush(foe, 1);
    },
  },
};
