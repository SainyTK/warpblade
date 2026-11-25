import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { addStacks, consumeStacks, markFoe, stacksOf } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillLevel, skillValues, withBuild } from "../../../../game/skills/query";
import { nearestFoe } from "../../../../game/skills/targets";
import { game, hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { SKILL } from "../../constants/skillIds";
import { JADE_SPARKS } from "../../look";

/** needles tick this often and stay this long, and a mark lasts this long */
const NEEDLE = { every: 0.5, duration: 5, mark: 3 } as const;
/** how far from the hero a parried attacker may be */
const REACH = 70;

/** Jade Needle: lodge needles in one foe; at the most, Acupuncture bursts them all */
export function needleFoe(e: Enemy | null): void {
  if (!e || e.hp <= 0 || !skillLevel(SKILL.needle)) return;
  const v = skillValues(SKILL.needle);
  addStacks(e, SKILL.needle, {
    stacks: v.needles,
    max: v.max,
    damage: progress.stats.ad * v.damage,
    every: NEEDLE.every,
    duration: withBuild("duration", NEEDLE.duration),
  });
  if (v.mark) markFoe(e, SKILL.needle, withBuild("duration", NEEDLE.mark), v.mark);
  if (!skillEvolved(SKILL.needle) || stacksOf(e, SKILL.needle) < v.max) return;
  const n = consumeStacks(e, SKILL.needle);
  dealDamage(e, progress.stats.ad * v.burst * n, { source: SKILL.needle, kx: 0, ky: -30 });
  game.fx.push(createImpact(...enemyCenter(e), hero.face, true, JADE_SPARKS));
}

/** the foe nearest the hero within reach, the one a parry or a perfect dodge answered */
const nearby = (): Enemy | null => {
  const e = nearestFoe(hero.x, hero.y - 16);
  return e && Math.abs(e.x - hero.x) < REACH ? e : null;
};

/** a parry lodges needles in the attacker, and from level 8 a perfect dodge in the nearest foe */
export const jadeNeedle: SkillBehavior = {
  create: () => ({}),
  on: {
    parry() {
      needleFoe(nearby());
    },
    perfectDodge() {
      if (skillValues(SKILL.needle).dodge) needleFoe(nearby());
    },
  },
};
