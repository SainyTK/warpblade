import { COMBO, STAMINA } from "../../../constants/combat";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createAccentRing } from "../../effects/jory/accentRing";
import { enemyCenter } from "../../enemies/enemy";
import { jory } from "../../hero/jory/memory";
import { refundStamina } from "../../hero/stamina";
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
 * Step Touch: his dodge strikes the foes it passes, harder on the beat, and an echo strikes them again on the next beat;
 * an on-beat dodge gives stamina back (Moonwalk: all of it).
 */
export const stepTouchSkill: SkillBehavior = {
  create: () => ({ echoes: [] as Echo[] }),
  on: {
    dash(m, event) {
      const v = skillValues(ID);
      const onBeat = jory.dodgeOnBeat;
      const damage = progress.stats.ad * (v.power ?? 0) * (onBeat ? 1 + (v.onBeat ?? 0) : 1);
      const echoes = m.echoes as Echo[];
      for (const e of event.foes) {
        touch(e, damage, !!v.stagger);
        if (v.echo) echoes.push({ foe: e, damage: damage * v.echo });
      }
      if (onBeat) refundStamina(v.moonwalk ? STAMINA.dashCost : (v.refund ?? 0));
    },
    tick(m) {
      const echoes = m.echoes as Echo[];
      for (const { foe, damage } of echoes) touch(foe, damage, false);
      m.echoes = [];
    },
  },
};
