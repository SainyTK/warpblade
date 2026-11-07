import { PK } from "../../../types/particle";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { hex } from "../../../utils/color";
import { dealDamage } from "../../damage";
import { enemyCenter } from "../../enemies/enemy";
import { stacksOf } from "../../enemies/skillStatus";
import { game, particles, progress, rng } from "../../state";
import { skillValues } from "../query";

const ID = "s_barbed";
/** seconds between the extra ticks a moving foe bleeds, and how fast it must move to count */
const TICK = 0.5;
const MOVING = 12;
const BLOOD = hex("#b02a2a");

interface BarbedMemory {
  next: number;
}

const memoryOf = (m: SkillMemory): BarbedMemory => m as unknown as BarbedMemory;

/** Barbed Jaws: the bleed itself is laid by the snare's bite; a bleeding foe that moves bleeds faster, and drips */
export const barbedJaws: SkillBehavior = {
  create: () => ({ next: TICK }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    const v = skillValues(ID);
    for (const e of game.enemies)
      if (e.hp > 0 && stacksOf(e, ID) && rng.chance(0.08)) {
        const [cx, cy] = enemyCenter(e);
        particles.spawn(PK.SPARK, cx + rng.range(-3, 3), cy + 2, rng.range(-10, 10), 20, 0.4, { col: BLOOD });
      }
    m.next -= dt;
    if (m.next > 0) return;
    m.next += TICK;
    if (v.moving <= 1) return;
    for (const e of game.enemies) {
      const n = stacksOf(e, ID);
      if (e.hp <= 0 || !n || Math.abs(e.vx) < MOVING) continue;
      dealDamage(e, progress.stats.ap * v.rate * TICK * (v.moving - 1) * n, { dot: true, source: ID });
    }
  },
};
