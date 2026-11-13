import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createAccentRing } from "../../effects/jory/accentRing";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks, consumeStacks } from "../../enemies/skillStatus";
import { jory } from "../../hero/jory/memory";
import { game, hero, progress } from "../../state";
import { skillValues } from "../query";

const ID = "j_eardrum";
/** Ringing lasts this many beats after it is laid, and holds at most this many stacks */
const LASTS = 8;
const MOST = 9;
/** Deafening Roar bursts each stack for this much ability power */
const ROAR = 1.2;

/** lay Ringing on one foe at this level, slowing it */
function ring(e: Enemy, stacks: number): void {
  const v = skillValues(ID);
  addStacks(e, ID, {
    stacks,
    max: MOST,
    damage: progress.stats.ap * (v.ap ?? 0),
    every: jory.beatLen,
    duration: jory.beatLen * LASTS,
  });
  if (v.slow) e.chill = Math.max(e.chill, v.slow);
}

/**
 * Ringing Ears: Boom and Counterbeat leave Ringing on every foe in the ring, which hurts on each beat, slows and, on the
 * beat, blinds; a blow blocked on his drum rings its attacker; Deafening Roar consumes it on an on-beat Boom for a
 * burst. The wider ring and the damage taken live in his kit.
 */
export const ringingEarsSkill: SkillBehavior = {
  create: () => ({}),
  on: {
    boom(_m, event) {
      const v = skillValues(ID);
      for (const e of event.foes) {
        if (e.hp <= 0) continue;
        if (v.roar && event.onBeat) {
          const n = consumeStacks(e, ID);
          if (n) {
            dealDamage(e, progress.stats.ap * ROAR * n, { fromX: hero.x, source: ID });
            const [cx, cy] = enemyCenter(e);
            game.fx.push(createAccentRing(cx, cy));
          }
        }
        if (e.hp <= 0) continue;
        ring(e, v.stacks ?? 1);
        if (v.blind && event.onBeat) e.blind = Math.max(e.blind, v.blind);
      }
    },
    drumBlock(_m, event) {
      if (skillValues(ID).block && event.foe.hp > 0) ring(event.foe, 1);
    },
  },
};
