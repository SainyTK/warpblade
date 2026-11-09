import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { foesBelow } from "../../hero/mirel/hover";
import { mirel } from "../../hero/mirel/memory";
import { hero, progress } from "../../state";
import { skillValues } from "../query";

const ID = "m_suspend";
/** seconds between the grinds of Hanging Hour's sand, and how long the slow holds after she passes */
const GRIND = { every: 0.25, slow: 0.4 } as const;

interface HangMemory {
  tick: number;
}

const memoryOf = (m: SkillMemory): HangMemory => m as unknown as HangMemory;

/**
 * Suspended, on the foes under her hover: they are slowed with its level, and Hanging Hour drops grinding sand on them.
 * The hover's own changes (longer, cheaper, faster drift, a second hover, free over a foe) live in her hover code.
 */
export const suspended: SkillBehavior = {
  create: () => ({ tick: 0 }),
  update(memory, _state, dt) {
    const m = memoryOf(memory);
    const v = skillValues(ID);
    if (!mirel.hovering || (!v.slow && !v.grind)) return;
    const below = foesBelow();
    if (v.slow) for (const e of below) e.chill = Math.max(e.chill, GRIND.slow);
    m.tick += dt;
    if (!v.grind || m.tick < GRIND.every) return;
    m.tick -= GRIND.every;
    for (const e of below)
      dealDamage(e, progress.stats.ad * v.grind * GRIND.every, { fromX: hero.x, dot: true, source: ID });
  },
};
