import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { addStacks } from "../../../../game/enemies/skillStatus";
import { skillValues } from "../../../../game/skills/query";
import { hero } from "../../../../game/state";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { STAIN_EVERY } from "../../constants/skillLook";
import { SKILL } from "../../constants/skills/ids";
import { sayaFx } from "../skillFx";
import { growStored, storedCuts } from "../store";

const memoryOf = (m: SkillMemory): { next: number } => m as unknown as { next: number };

/** Ink Stain: every foe holding stored cuts takes a share of them each beat, the cuts grow while they wait, and the
 *  stain lingers after a release */
export const inkStain: SkillBehavior = {
  create: () => ({ next: STAIN_EVERY }),
  update(m, _state, dt) {
    const mem = memoryOf(m);
    const v = skillValues(SKILL.stain);
    if (v.grow) growStored(1 + v.grow * dt);
    mem.next -= dt;
    if (mem.next > 0) return;
    mem.next = STAIN_EVERY;
    for (const c of storedCuts()) {
      if (c.foe.hp <= 0) continue;
      dealDamage(c.foe, c.amount * v.share * STAIN_EVERY, { dot: true, stagger: v.stagger, source: SKILL.stain });
    }
  },
  on: {
    release(_m, event) {
      const v = skillValues(SKILL.stain);
      for (const c of event.cuts) {
        const [x, y] = enemyCenter(c.foe);
        sayaFx(
          SKILL.stain,
          { x, y, face: hero.face },
          { damage: c.amount * (1 + (v.consume ?? 0) + (v.share ?? 0) * 4) },
        );
      }
      if (!v.linger) return;
      for (const c of event.cuts) {
        if (c.foe.hp <= 0) continue;
        const tick = c.amount * v.share * STAIN_EVERY;
        addStacks(c.foe, SKILL.stain, { stacks: 1, max: 1, damage: tick, every: STAIN_EVERY, duration: v.linger });
      }
    },
  },
};
