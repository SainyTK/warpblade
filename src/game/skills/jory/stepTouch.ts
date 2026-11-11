import { COMBO } from "../../../constants/combat";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createAccentRing } from "../../effects/jory/accentRing";
import { enemyCenter } from "../../enemies/enemy";
import { jory } from "../../hero/jory/memory";
import { game, hero, progress } from "../../state";
import { skillValues } from "../query";

const ID = "j_stepTouch";
/** an echo waiting for the next beat: the foe and what it deals */
interface Echo {
  foe: Enemy;
  damage: number;
}

/** strike one foe the step passed, as part of his own step */
function touch(e: Enemy, damage: number, stagger: boolean): void {
  if (e.hp <= 0) return;
  dealDamage(e, damage, { fromX: hero.x, kx: 0, stagger: stagger ? COMBO.stagger : undefined });
  const [cx, cy] = enemyCenter(e);
  game.fx.push(createAccentRing(cx, cy));
}

/**
 * Step Touch: Beat Step strikes the foes it passes, an echo strikes them again on the next beat, and an on-beat step
 * makes the next free (Moonwalk: four in a row). The step's extra reach lives in his kit.
 */
export const stepTouchSkill: SkillBehavior = {
  create: () => ({ echoes: [] as Echo[] }),
  on: {
    dash(m, event) {
      const v = skillValues(ID);
      const damage = progress.stats.ad * (v.power ?? 0);
      const echoes = m.echoes as Echo[];
      for (const e of event.foes) {
        touch(e, damage, !!v.stagger);
        if (v.echo) echoes.push({ foe: e, damage: damage * v.echo });
      }
    },
    tick(m) {
      const echoes = m.echoes as Echo[];
      for (const { foe, damage } of echoes) touch(foe, damage, false);
      m.echoes = [];
    },
    beat(_m, event) {
      if (event.button !== "L") return;
      const v = skillValues(ID);
      if (!event.onBeat) {
        jory.freeSteps = 0;
        return;
      }
      if (jory.freeSteps > 0) {
        jory.freeSteps--;
        return;
      }
      jory.freeSteps = v.moonwalk ? 4 : v.second ? 1 : 0;
    },
  },
};
