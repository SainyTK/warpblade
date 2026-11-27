import { dealDamage } from "../../../../game/damage";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { addStacks, consumeStacks, stacksOf } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { game, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { CRIMSON } from "../../constants/colors";

const ID = "br_cinder";
const EMBERS = { every: 0.5, duration: 3, spread: 36, burst: 34 } as const;

function lay(foe: Enemy, stacks: number): void {
  if (foe.hp <= 0 || stacks <= 0) {
    return;
  }
  const v = skillValues(ID);
  addStacks(foe, ID, {
    stacks,
    max: withBuild("amount", v.max),
    damage: progress.stats.ad * v.damage,
    every: EMBERS.every,
    duration: withBuild("duration", EMBERS.duration),
  });
  if (skillEvolved(ID) && stacksOf(foe, ID) >= withBuild("amount", v.max)) {
    burst(foe);
  }
}

function burst(foe: Enemy): void {
  const v = skillValues(ID);
  const held = consumeStacks(foe, ID);
  game.fx.push(createFloorRing(foe.x, foe.y, EMBERS.burst, CRIMSON, 0.4));
  for (const other of game.enemies) {
    if (other.hp <= 0 || Math.abs(other.x - foe.x) > EMBERS.burst || Math.abs(other.y - foe.y) > EMBERS.burst) {
      continue;
    }
    dealDamage(other, progress.stats.ad * v.burst * held, {
      fromX: foe.x,
      kx: Math.sign(other.x - foe.x) * 60,
      source: ID,
    });
  }
}

function spread(foe: Enemy): void {
  const held = stacksOf(foe, ID);
  for (const other of game.enemies) {
    if (other !== foe && Math.abs(other.x - foe.x) < EMBERS.spread && Math.abs(other.y - foe.y) < EMBERS.spread) {
      lay(other, held);
    }
  }
}

export const cinderEdge: SkillBehavior = {
  create: () => ({}),
  on: {
    blow(_m, e) {
      if (!e.melee || e.source !== "attacks") {
        return;
      }
      const v = skillValues(ID);
      lay(e.foe, e.finisher ? Math.max(v.stacks, v.finisher) : v.stacks);
      if (e.finisher && v.spread && e.foe.hp > 0) {
        spread(e.foe);
      }
    },
    dash(_m, e) {
      const stacks = skillValues(ID).dash ?? 0;
      for (const foe of e.foes) {
        lay(foe, stacks);
      }
    },
  },
};
