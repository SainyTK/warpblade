import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createAccentRing } from "../../effects/jory/accentRing";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks, consumeStacks, stacksOf } from "../../enemies/skillStatus";
import { jory } from "../../hero/jory/memory";
import { game, hero, progress } from "../../state";
import { skillValues } from "../query";

const ID = "j_dissonance";
/** Dissonance lasts this many beats after the last stack */
const LASTS = 10;
/** Cacophony bursts at this many stacks, for this many times a stack's tick each */
const CACOPHONY = { at: 8, per: 4 } as const;

/** lay stacks of Dissonance, which tick once a beat at his tempo when they are laid */
function lay(e: Enemy, stacks: number): void {
  const v = skillValues(ID);
  addStacks(e, ID, {
    stacks,
    max: v.max ?? 6,
    damage: progress.stats.ap * (v.ap ?? 0),
    every: jory.beatLen,
    duration: jory.beatLen * LASTS,
  });
}

/** Cacophony: at enough stacks the Dissonance bursts for the stacks it held */
function burst(e: Enemy): void {
  const v = skillValues(ID);
  if (!v.cacophony || stacksOf(e, ID) < CACOPHONY.at) return;
  const n = consumeStacks(e, ID);
  dealDamage(e, progress.stats.ap * (v.ap ?? 0) * CACOPHONY.per * n, { fromX: hero.x, heavy: true, source: ID });
  const [cx, cy] = enemyCenter(e);
  game.fx.push(createAccentRing(cx, cy));
}

/**
 * Dissonance: an accented Crash (any Accent at its level) marks foes, each Accent on a marked foe adds a stack, and an
 * off-beat press halves every foe's stacks. It hurts on each beat; Cacophony bursts it at 8.
 */
export const dissonanceSkill: SkillBehavior = {
  create: () => ({}),
  on: {
    accent(_m, event) {
      const v = skillValues(ID);
      const e = event.foe;
      if (e.hp <= 0) return;
      if (event.blow === "crash" || v.any) lay(e, stacksOf(e, ID) > 0 ? 1 : (v.start ?? 1));
      else if (stacksOf(e, ID) > 0) lay(e, 1);
      burst(e);
    },
    beat(_m, event) {
      if (event.onBeat) return;
      for (const e of game.enemies) {
        const n = stacksOf(e, ID);
        if (!n) continue;
        consumeStacks(e, ID);
        if (n > 1) lay(e, Math.floor(n / 2));
      }
    },
  },
};
