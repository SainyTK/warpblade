import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { addStacks, consumeStacks, stacksOf } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillLevel, skillValues, withBuild } from "../../../../game/skills/query";
import { nearestFoe } from "../../../../game/skills/targets";
import { game, hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { DUSK_SPARKS } from "../../look/colors";
import type { VesperMoveId } from "../../types/moves";
import { shortBlowAt } from "../blades";

const ID = "ve_hex";
/** seconds between a sigil's ticks, and how far a fallen foe's sigils jump */
const SIGIL = { every: 0.5, jump: 70 } as const;

/** lay `n` sigils on a foe at the skill's numbers */
export function laySigils(e: Enemy, n: number): void {
  const v = skillValues(ID);
  addStacks(e, ID, {
    stacks: n,
    max: withBuild("amount", v.max),
    damage: progress.stats.ad * v.damage,
    every: SIGIL.every,
    duration: withBuild("duration", v.duration),
  });
}

/** Sigil Bloom: the moonrise blooms every sigil on the foes it struck, each a blow at once */
export function hexBloom(foes: readonly Enemy[]): void {
  if (!skillEvolved(ID)) return;
  const v = skillValues(ID);
  for (const e of foes) {
    const n = consumeStacks(e, ID);
    if (!n) continue;
    const [x, y] = enemyCenter(e);
    game.fx.push(createImpact(x, y, hero.face, true, DUSK_SPARKS));
    dealDamage(e, progress.stats.ad * v.bloom * n, { fromX: hero.x, source: ID });
  }
}

/** a stitch cut lays a sigil while the skill is held */
export function stitchSigil(e: Enemy): void {
  if (skillLevel(ID)) laySigils(e, 1);
}

/**
 * Dusk Sigil: short-blade blows (and from its third level long-blade blows too) lay dusk sigils that cut the foe on each
 * tick; a fallen foe's sigils jump to the nearest foe, a foe with five takes more from her, and as Sigil Bloom the moonrise
 * blooms them all at once.
 */
export const duskSigil: SkillBehavior = {
  create: () => ({}),
  on: {
    blow(_m, ev) {
      if (ev.source !== "attacks" || !ev.move) return;
      const short = shortBlowAt(ev.move as VesperMoveId, hero.hitIndex);
      if (short || skillValues(ID).long) laySigils(ev.foe, 1);
    },
    kill(_m, ev) {
      if (!skillValues(ID).spread) return;
      const n = stacksOf(ev.foe, ID);
      if (!n) return;
      const [x, y] = enemyCenter(ev.foe);
      const next = nearestFoe(x, y, [ev.foe]);
      if (next && Math.abs(next.x - x) <= SIGIL.jump) laySigils(next, n);
    },
  },
};
