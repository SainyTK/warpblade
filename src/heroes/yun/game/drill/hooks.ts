import { skillEvolved, skillLevel, skillValues } from "../../../../game/skills/query";
import type { DrillHooks, DrillModifiers } from "../../../../types/drill";
import type { DrillSkillState, YunDrillSkill } from "../../types/drillSkill";
import { YUN_DRILL_SKILLS } from "./skills";

const PREFIX = "drill.";

function drillNumbers(id: string): Record<string, number> {
  return Object.fromEntries(
    Object.entries(skillValues(id))
      .filter(([key]) => key.startsWith(PREFIX))
      .map(([key, value]) => [key.slice(PREFIX.length), value]),
  );
}

function held(): [YunDrillSkill, DrillSkillState][] {
  return YUN_DRILL_SKILLS.filter((skill) => skillLevel(skill.id) > 0).map((skill) => [
    skill,
    { values: drillNumbers(skill.id), evolved: skillEvolved(skill.id) },
  ]);
}

export function yunModifiers(neutral: DrillModifiers): DrillModifiers {
  const modifiers = { ...neutral };
  for (const [skill, state] of held()) {
    skill.modify?.(modifiers, state);
  }
  return modifiers;
}

export const YUN_DRILL_HOOKS: DrillHooks = {
  swordHit: (foe, infusion) => {
    for (const [skill, state] of held()) {
      skill.swordHit?.(foe, infusion, state);
    }
  },
  slashed: (strike, landed) => {
    for (const [skill, state] of held()) {
      skill.slashed?.(strike, landed, state);
    }
  },
  spellHit: (foe, spell) => {
    for (const [skill, state] of held()) {
      skill.spellHit?.(foe, spell, state);
    }
  },
  dashed: (foes) => {
    for (const [skill, state] of held()) {
      skill.dashed?.(foes, state);
    }
  },
  released: (cast) => {
    for (const [skill, state] of held()) {
      skill.released?.(cast, state);
    }
  },
  tick: (dt) => {
    for (const [skill, state] of held()) {
      skill.tick?.(dt, state);
    }
  },
};
