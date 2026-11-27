import { skillLevel, skillValues } from "../../../../game/skills/query";
import { hero, progress } from "../../../../game/state";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { SKILL } from "../../constants/skillIds";
import { YIN_YANG, yunFx } from "../fx";
import { yun } from "../state";
import { mostSwords } from "../swords";

/** Harmony holds: every sword he can hold is held, or one short from level 5 */
export function harmonyHolds(): boolean {
  if (!skillLevel(SKILL.harmony)) return false;
  const short = skillValues(SKILL.harmony).short ? 1 : 0;
  return yun.swords >= mostSwords() - short;
}

/** every hit he deals while Harmony holds */
export const harmonyDamage = (): number => (harmonyHolds() ? 1 + skillValues(SKILL.harmony).bonus : 1);
/** damage he takes while Harmony holds */
export const harmonyGuard = (): number => (harmonyHolds() ? 1 - (skillValues(SKILL.harmony).guard ?? 0) : 1);

/** Harmony: while it holds, from level 3 he recovers HP */
interface Memory extends SkillMemory {
  held: boolean;
}

export const harmony: SkillBehavior = {
  create: (): Memory => ({ held: false }),
  update(memory, _s, dt) {
    const m = memory as Memory;
    const holds = harmonyHolds();
    if (holds && !m.held)
      yunFx(SKILL.harmony, "mark", { x: hero.x, y: hero.y - 34, face: hero.face }, { signature: YIN_YANG });
    m.held = holds;
    const heal = skillValues(SKILL.harmony).heal;
    if (heal && harmonyHolds() && hero.hp > 0) hero.hp = Math.min(progress.stats.hp, hero.hp + heal * dt);
  },
};
