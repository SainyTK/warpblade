import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks, stacksOf } from "../../enemies/skillStatus";
import { jory } from "../../hero/jory/memory";
import { game, progress } from "../../state";
import { skillValues } from "../query";

const ID = "j_resonance";
/** Resonance hums for this many beats after the last stack was laid */
const LASTS = 8;
/** Sympathy spreads to foes this near */
const SPREAD = 40;

/** lay stacks of Resonance, which tick once a beat at his tempo when they are laid */
function resonate(e: Enemy, stacks: number): void {
  const v = skillValues(ID);
  addStacks(e, ID, {
    stacks,
    max: v.max ?? 3,
    damage: progress.stats.ap * (v.ap ?? 0),
    every: jory.beatLen,
    duration: jory.beatLen * LASTS,
  });
  if (v.slow) e.chill = Math.max(e.chill, v.slow);
}

/** Resonance: his blows lay stacks that hum on each beat; Accents lay two, and with Sympathy spread them */
export const resonanceSkill: SkillBehavior = {
  create: () => ({}),
  on: {
    blow(_m, event) {
      if (event.source !== "attacks" || event.foe.hp <= 0) return;
      resonate(event.foe, 1);
    },
    accent(_m, event) {
      const v = skillValues(ID);
      const e = event.foe;
      if (e.hp <= 0) return;
      if (v.double) resonate(e, 1);
      if (!v.sympathy) return;
      const n = stacksOf(e, ID);
      const [x, y] = enemyCenter(e);
      for (const o of game.enemies) {
        if (o === e || o.hp <= 0) continue;
        const [ox, oy] = enemyCenter(o);
        if (Math.hypot(ox - x, oy - y) <= SPREAD) resonate(o, n);
      }
    },
  },
};
