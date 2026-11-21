import type { CharacterDef } from "../types/character";
import type { SkillDef } from "../types/skill";
import { usesKaelDrill } from "./selection";

const DRILL_SKILLS: ReadonlySet<string> = new Set([
  "k_aegis",
  "k_echo",
  "k_familiar",
  "k_mirror",
  "k_rift",
  "k_splinters",
  "k_static",
]);

const drillDefinitions = new WeakMap<CharacterDef, CharacterDef>();

export function drillRewardPool(character: CharacterDef): CharacterDef {
  if (character.id !== "kael" || !usesKaelDrill()) {
    return character;
  }
  const known = drillDefinitions.get(character);
  if (known) {
    return known;
  }
  const skills = character.skills.filter(({ id }) => DRILL_SKILLS.has(id));
  const result = { ...character, skills };
  drillDefinitions.set(character, result);
  return result;
}

export const drillSkillText = (text: string, skill: SkillDef): string =>
  usesKaelDrill() && (skill.id === "k_splinters" || skill.id === "k_rift")
    ? text.replace("4th hit", "third slash")
    : text;
