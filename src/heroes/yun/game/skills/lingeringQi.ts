import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { addStacks, consumeStacks, stacksOf } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillLevel, skillValues, withBuild } from "../../../../game/skills/query";
import { nearestFoe } from "../../../../game/skills/targets";
import { game, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { SKILL } from "../../constants/skillIds";
import { JADE_SPARKS } from "../../look";
import { isLead, RIBBON, yunFx } from "../fx";

/** a wound ticks this often and lasts this long after the last one was laid */
const TICK = { every: 0.5, duration: 4 } as const;

/** Lingering Qi: lay a qi wound on a foe; at its most, Qi Burst bursts them all */
export function woundFoe(e: Enemy, stacks = 1): void {
  if (!skillLevel(SKILL.wound) || e.hp <= 0) return;
  const v = skillValues(SKILL.wound);
  addStacks(e, SKILL.wound, {
    stacks,
    max: v.max,
    damage: progress.stats.ad * v.damage,
    every: TICK.every,
    duration: withBuild("duration", TICK.duration),
  });
  if (v.chill) e.chill = Math.max(e.chill, v.chill);
  const [cx, cy] = enemyCenter(e);
  const laid = progress.stats.ad * v.damage * stacksOf(e, SKILL.wound) * (TICK.duration / TICK.every);
  yunFx(SKILL.wound, "mark", { x: cx, y: cy }, { damage: laid, quiet: !isLead(SKILL.wound), signature: RIBBON });
  if (!skillEvolved(SKILL.wound) || stacksOf(e, SKILL.wound) < v.max) return;
  const n = consumeStacks(e, SKILL.wound);
  dealDamage(e, progress.stats.ad * v.burst * n, { source: SKILL.wound, kx: 0, ky: -20 });
  yunFx(
    SKILL.wound,
    "burst",
    { x: cx, y: cy, reach: 12 },
    { damage: progress.stats.ad * v.burst * n, signature: RIBBON },
  );
  game.fx.push(createImpact(...enemyCenter(e), 1, true, JADE_SPARKS));
}

/** the string's own blade blows lay wounds from level 5, and a wounded foe's death passes its wounds to the nearest */
export const lingeringQi: SkillBehavior = {
  create: () => ({}),
  on: {
    blow(_m, e) {
      if (e.melee && e.move && skillValues(SKILL.wound).blade) woundFoe(e.foe);
    },
    kill(_m, e) {
      passWounds(e.foe);
    },
  },
};

export function passWounds(foe: Enemy): void {
  if (!skillValues(SKILL.wound).spread) return;
  const n = stacksOf(foe, SKILL.wound);
  if (!n) return;
  const next = nearestFoe(foe.x, foe.y, [foe]);
  if (next) woundFoe(next, n);
}
