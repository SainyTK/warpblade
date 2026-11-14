import { skillEvolved, skillValues } from "../../../../game/skills/query";
import { rng } from "../../../../game/state";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { isHeroSource } from "../../../../utils/sources";
import { callHawk } from "../summons/hawk";

const ID = "za_hawk";
/** Sky of Hawks still waits this long between hawks, so a crowd felled at once does not fill the sky */
const EVOLVED_COOLDOWN = 0.6;

interface HawkMemory {
  cd: number;
}
const memoryOf = (m: SkillMemory): HawkMemory => m as unknown as HawkMemory;

/** Desert Hawk: a foe he fells may call a hawk from where it fell; from level 7 his skills' kills count too, and as Sky
 *  of Hawks every kill calls one */
export const desertHawk: SkillBehavior = {
  create: () => ({ cd: 0 }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    m.cd = Math.max(0, m.cd - dt);
  },
  on: {
    kill(memory, ev) {
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (m.cd > 0 || (!isHeroSource(ev.source) && !v.any)) return;
      const evolved = skillEvolved(ID);
      if (!evolved && !rng.chance(v.chance)) return;
      m.cd = evolved ? EVOLVED_COOLDOWN : v.cooldown;
      callHawk(ev.foe.x, ev.foe.y - 24);
    },
  },
};
