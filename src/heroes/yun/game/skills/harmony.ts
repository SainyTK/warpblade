import { skillLevel, skillValues } from "../../../../game/skills/query";
import { hero, progress } from "../../../../game/state";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { SKILL } from "../../constants/skillIds";
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
export const harmony: SkillBehavior = {
  create: () => ({}),
  update(_m, _s, dt) {
    const heal = skillValues(SKILL.harmony).heal;
    if (heal && harmonyHolds() && hero.hp > 0) hero.hp = Math.min(progress.stats.hp, hero.hp + heal * dt);
  },
};
