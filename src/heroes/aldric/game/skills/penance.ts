import { HERO_GUARD } from "../../../../constants/combat";
import { dealDamage } from "../../../../game/damage";
import { createGlint } from "../../../../game/effects/flash";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { addStacks, consumeStacks, stacksOf } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillValues, withCharms } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { DAWN_RAMP } from "../../constants/light";
import { PENANCE } from "../../constants/skillNumbers";
import { foesNear } from "../strike";
import "../../types/events";

const ID = "al_penance";

/** the standing foe nearest where a blow came from, close enough to have thrown it */
function attackerAt(fromX: number): Enemy | null {
  let best: Enemy | null = null;
  let gap: number = HERO_GUARD.attackerReach;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const d = Math.abs(enemyCenter(e)[0] - fromX);
    if (d < gap) {
      best = e;
      gap = d;
    }
  }
  return best;
}

/** lay `stacks` of Penance on a foe; as Atonement, full Penance bursts */
function lay(e: Enemy, stacks: number): void {
  const v = skillValues(ID);
  addStacks(e, ID, {
    stacks,
    max: v.max,
    damage: progress.stats.ap * v.tick,
    every: PENANCE.every,
    duration: withCharms("duration", PENANCE.time),
  });
  if (!skillEvolved(ID) || stacksOf(e, ID) < v.max) return;
  const n = consumeStacks(e, ID);
  const [x, y] = enemyCenter(e);
  dealDamage(e, progress.stats.ap * v.burst * n, { source: ID, fromX: hero.x, ky: -30, heavy: true });
  game.fx.push(createGlint(x, y, DAWN_RAMP[5], 1));
}

/** a blow stopped on the shield: its attacker burns, and with Penance's seventh level the foes round it too */
function punish(fromX: number, stacks: number): void {
  const e = attackerAt(fromX);
  if (!e) return;
  lay(e, stacks);
  const spread = skillValues(ID).spread;
  if (!spread) return;
  const [x, y] = enemyCenter(e);
  for (const other of foesNear(x, y, spread)) if (other !== e) lay(other, 1);
}

/** the healing of Penance's sixth level: each half second, HP for each stack burning on a foe */
function heal(m: SkillMemory, dt: number): void {
  const per = skillValues(ID).heal;
  if (!per) return;
  m.t = (m.t as number) + dt;
  if ((m.t as number) < PENANCE.every) return;
  m.t = 0;
  let stacks = 0;
  for (const e of game.enemies) if (e.hp > 0) stacks += stacksOf(e, ID);
  hero.hp = Math.min(progress.stats.hp, hero.hp + per * stacks);
}

/** Penance: a foe whose blow the shield stops burns with stacking light; a parry lays the most */
export const penance: SkillBehavior = {
  create: () => ({ t: 0 }),
  update(m, _state, dt) {
    heal(m, dt);
  },
  on: {
    block(_m, ev) {
      punish(ev.fromX, skillValues(ID).stacks);
    },
    parry(_m, ev) {
      const v = skillValues(ID);
      punish(ev.fromX, v.parry ? v.max : v.stacks);
    },
    guardBash(_m, ev) {
      if (ev.foe && skillValues(ID).bash) lay(ev.foe, 1);
    },
  },
};
