import { PAL } from "../../../constants/palette";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks, consumeStacks, stacksOf } from "../../enemies/skillStatus";
import { game, particles, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";

const ID = "w_singe";
/** Ashfall's burst reaches this far; Blue Flame adds this many stacks to a bite */
const ASH_REACH = 30;
const BLUE_STACKS = 2;

/** Ashfall: a foe at the most Singe bursts, its stacks spent on every foe near it */
function ashfall(e: Enemy, power: number): void {
  const n = consumeStacks(e, ID);
  const [cx, cy] = enemyCenter(e);
  for (const o of game.enemies) {
    if (o.hp <= 0) continue;
    const [ox, oy] = enemyCenter(o);
    if (Math.hypot(ox - cx, oy - cy) <= ASH_REACH)
      dealDamage(o, progress.stats.ap * power * n, { fromX: cx, kx: Math.sign(ox - cx) * 40, source: ID });
  }
  for (let i = 0; i < 12; i++)
    particles.spawn(
      PK.EMBER,
      cx + rng.range(-6, 6),
      cy + rng.range(-6, 6),
      rng.range(-40, 40),
      -rng.range(20, 70),
      0.6,
      {
        sparks: [PAL.wick[5], PAL.wick[4], PAL.wick[3], PAL.wick[1]],
      },
    );
}

/** lay Singe on a foe: a slow violet burn that stacks */
function singe(e: Enemy, stacks: number): void {
  const v = skillValues(ID);
  if (!v.damage || e.hp <= 0) return;
  addStacks(e, ID, {
    stacks,
    max: v.max,
    damage: progress.stats.ap * v.damage,
    every: 1,
    duration: withCharms("duration", v.life),
  });
  if (v.ash && stacksOf(e, ID) >= v.max) ashfall(e, v.ash);
}

/**
 * Singe: her Wicks' bites lay a slow burn that stacks; with its levels her own blows add it too and Singed foes take
 * more from her Wicks. Blue Flame's bites add two at once. Ashfall bursts a foe at the most stacks.
 */
export const singeSkill: SkillBehavior = {
  create: () => ({}),
  on: {
    bite(_m, event) {
      const extra = skillValues("w_fangs").blue ? BLUE_STACKS : 0;
      singe(event.foe, (skillValues(ID).stacks ?? 1) + extra);
    },
    blow(_m, event) {
      if (event.source !== "attacks" || !skillValues(ID).own) return;
      singe(event.foe, skillValues(ID).stacks ?? 1);
    },
  },
};
