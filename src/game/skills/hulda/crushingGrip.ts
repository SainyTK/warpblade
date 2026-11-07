import { FRACTURE } from "../../../constants/hulda/fracture";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { hulda } from "../../hero/hulda/memory";
import { hero, progress } from "../../state";
import { skillValues } from "../query";

const ID = "h_fracture";

interface GripMemory {
  /** seconds until the crush's next tick */
  tick: number;
}

const memoryOf = (m: SkillMemory): GripMemory => m as unknown as GripMemory;

/** the foe is in her hands: a hold, a knee or a throw before it leaves them */
const crushing = (): boolean =>
  hulda.held !== null && (hero.state === "hold" || hero.state === "knee" || hero.state === "toss");

/** Crushing Grip: a foe in her hands takes the crush's damage over time, under the skill's own name */
export const crushingGrip: SkillBehavior = {
  create: () => ({ tick: FRACTURE.tick }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    const e = hulda.held;
    if (!e || !crushing()) {
      m.tick = FRACTURE.tick;
      return;
    }
    m.tick -= dt;
    if (m.tick > 0) return;
    m.tick += FRACTURE.tick;
    dealDamage(e, progress.stats.ad * skillValues(ID).crush * FRACTURE.tick, { source: ID, dot: true, kx: 0 });
  },
};
