import type { SkillBehavior } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createAccentRing } from "../../effects/jory/accentRing";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks, consumeStacks } from "../../enemies/skillStatus";
import { jory } from "../../hero/jory/memory";
import { game, hero, progress } from "../../state";
import { skillValues } from "../query";

const ID = "j_eardrum";
/** Ringing lasts this many beats after a Boom, and holds at most this many stacks */
const LASTS = 8;
const MOST = 9;
/** Deafening Roar bursts each stack for this much ability power */
const ROAR = 1.2;

/**
 * Ringing Ears: Boom leaves Ringing on every foe in its ring, which hurts on each beat, slows and, on the beat, blinds;
 * Deafening Roar consumes it on an on-beat Boom for a burst. The wider Boom and the damage taken live in his kit.
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
        addStacks(e, ID, {
          stacks: v.stacks ?? 1,
          max: MOST,
          damage: progress.stats.ap * (v.ap ?? 0),
          every: jory.beatLen,
          duration: jory.beatLen * LASTS,
        });
        if (v.slow) e.chill = Math.max(e.chill, v.slow);
        if (v.blind && event.onBeat) e.blind = Math.max(e.blind, v.blind);
      }
    },
  },
};
