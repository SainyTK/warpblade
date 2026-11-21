import { skillEvolved, skillLevel, skillValues } from "../../../../game/skills/query";
import type { DrillSkillState, SayaDrillSkill } from "../../types/drillSkill";
import { SAYA_DRILL_SKILLS } from "./skills";

const PREFIX = "drill.";

function drillNumbers(id: string): Record<string, number> {
  return Object.fromEntries(
    Object.entries(skillValues(id))
      .filter(([key]) => key.startsWith(PREFIX))
      .map(([key, value]) => [key.slice(PREFIX.length), value]),
  );
}

export function heldSkills(): [SayaDrillSkill, DrillSkillState][] {
  return SAYA_DRILL_SKILLS.filter((skill) => skillLevel(skill.id) > 0).map((skill) => [
    skill,
    { values: drillNumbers(skill.id), evolved: skillEvolved(skill.id) },
  ]);
}
