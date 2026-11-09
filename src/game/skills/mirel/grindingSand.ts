import { SAND } from "../../../constants/palette";
import { PK } from "../../../types/particle";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks, consumeStacks, markFoe, stacksOf } from "../../enemies/skillStatus";
import { mirel } from "../../hero/mirel/memory";
import { insideField } from "../../hero/mirel/stillfield";
import { game, particles, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";
import { nearestFoe } from "../targets";

const ID = "m_sandstorm";
/** seconds between grinds, the mark's length, and Sandstorm's burst */
const GRIND = { every: 1, mark: 0.5, burst: 80 } as const;

interface GrindMemory {
  tick: number;
}

const memoryOf = (m: SkillMemory): GrindMemory => m as unknown as GrindMemory;

/** sand swirling off a ground foe */
function swirl(x: number, y: number): void {
  if (!rng.chance(0.3)) return;
  particles.spawn(PK.MOTE, x + rng.range(-5, 5), y + rng.range(-6, 6), rng.range(-20, 20), rng.range(-10, 10), 0.4, {
    col: rng.chance(0.5) ? SAND.light : SAND.shade,
    size: 0.5,
  });
}

/**
 * Grinding Sand: every second inside her Stillfield a foe gains a stack of grinding sand; levels make the stacks last
 * after the field closes, raise their damage and most, mark ground foes and spread the grind on a kill. Sandstorm bursts
 * the closing field, every foe within 80 px taking a blow for each stack it carries.
 */
export const grindingSand: SkillBehavior = {
  create: () => ({ tick: 0 }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    const v = skillValues(ID);
    const field = mirel.field;
    for (const e of game.enemies) {
      if (e.hp <= 0 || !stacksOf(e, ID)) continue;
      const [cx, cy] = enemyCenter(e);
      swirl(cx, cy);
      if (v.taken) markFoe(e, ID, GRIND.mark, v.taken);
    }
    if (!field) {
      m.tick = 0;
      return;
    }
    m.tick += dt;
    if (m.tick < GRIND.every) return;
    m.tick -= GRIND.every;
    for (const e of game.enemies) {
      if (e.hp <= 0 || !insideField(e, field)) continue;
      addStacks(e, ID, {
        stacks: v.stacks,
        max: v.max,
        damage: progress.stats.ap * v.damage,
        every: 1,
        duration: GRIND.every + withCharms("duration", v.linger) + 0.05,
      });
    }
  },
  on: {
    kill(_memory, event) {
      const v = skillValues(ID);
      const n = stacksOf(event.foe, ID);
      if (!v.spread || !n) return;
      const [cx, cy] = enemyCenter(event.foe);
      const next = nearestFoe(cx, cy, [event.foe]);
      if (next)
        addStacks(next, ID, { stacks: n, max: v.max, damage: progress.stats.ap * v.damage, every: 1, duration: 2 });
    },
    field(_memory, event) {
      const v = skillValues(ID);
      if (event.open || !v.storm) return;
      for (const e of game.enemies) {
        if (e.hp <= 0) continue;
        const [cx, cy] = enemyCenter(e);
        if (Math.hypot(cx - event.x, cy - event.y) > withCharms("area", GRIND.burst)) continue;
        const n = consumeStacks(e, ID);
        if (n)
          dealDamage(e, progress.stats.ap * v.storm * n, {
            fromX: event.x,
            kx: Math.sign(cx - event.x) * 60,
            source: ID,
          });
      }
      for (let i = 0; i < 30; i++)
        particles.spawn(
          PK.DUST,
          event.x + rng.range(-20, 20),
          event.y + rng.range(-20, 20),
          rng.range(-120, 120),
          rng.range(-80, 40),
          rng.range(0.4, 0.9),
          {
            col: rng.chance(0.5) ? SAND.light : SAND.shade,
            size: rng.range(1, 2),
          },
        );
    },
  },
};
