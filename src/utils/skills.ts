import { CHARACTERS } from "../constants/characters/index";
import { EVOLVE_PARTNER_LEVEL, SKILL_MAX_LEVEL } from "../constants/growth";
import type { Build } from "../types/build";
import type { CharacterDef } from "../types/character";
import type { SkillDef, SkillLevel } from "../types/skill";

/** one of the hero's skills by id */
export const skillOf = (c: CharacterDef, id: string): SkillDef | undefined => c.skills.find((s) => s.id === id);

/** every hero's skills, for what is kept across runs by skill id (recipes) */
export const ALL_SKILLS: readonly SkillDef[] = CHARACTERS.flatMap((c) => c.skills);

/** any hero's skill by id */
export const findSkill = (id: string): SkillDef | undefined => ALL_SKILLS.find((s) => s.id === id);

/** the row a skill reads at a level: its evolution's once evolved */
export function skillRow(def: SkillDef, level: number, evolved: boolean): SkillLevel {
  if (evolved) return def.evolution.row;
  return def.levels[Math.max(1, Math.min(def.levels.length, level)) - 1];
}

/** the rows of every skill the build holds */
export function heldRows(c: CharacterDef, b: Build): SkillLevel[] {
  return c.skills.filter((s) => b.skills[s.id]).map((s) => skillRow(s, b.skills[s.id], b.evolved.includes(s.id)));
}

/** skills ready to evolve: at their top level, not evolved yet, with their partner held at `EVOLVE_PARTNER_LEVEL` */
export function readyEvolutions(c: CharacterDef, b: Build): string[] {
  return c.skills
    .filter(
      (s) =>
        (b.skills[s.id] ?? 0) >= SKILL_MAX_LEVEL &&
        !b.evolved.includes(s.id) &&
        (b.skills[s.evolution.partner] ?? 0) >= EVOLVE_PARTNER_LEVEL,
    )
    .map((s) => s.id);
}
