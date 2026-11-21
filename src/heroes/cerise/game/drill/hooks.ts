import { skillEvolved, skillLevel } from "../../../../game/skills/query";
import type { DrillHooks, DrillModifiers } from "../../../../types/drill";
import type { CeriseDrillSkill, DrillSkillState } from "../../types/drillSkill";
import { tickMarks } from "../mark";
import { releaseTempest } from "./release";
import { CERISE_DRILL_SKILLS } from "./skills";
import { readMoments, resetMoments } from "./skills/moments";
import { drillNumbers } from "./skills/numbers";

function held(): [CeriseDrillSkill, DrillSkillState][] {
  return CERISE_DRILL_SKILLS.filter((skill) => skillLevel(skill.id) > 0).map((skill) => [
    skill,
    { values: drillNumbers(skill.id), evolved: skillEvolved(skill.id) },
  ]);
}

export function ceriseModifiers(neutral: DrillModifiers): DrillModifiers {
  const modifiers = { ...neutral };
  for (const [skill, state] of held()) {
    skill.modify?.(modifiers, state);
  }
  return modifiers;
}

export const CERISE_DRILL_HOOKS: DrillHooks = {
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
    releaseTempest(cast);
    for (const [skill, state] of held()) {
      skill.released?.(cast, state);
    }
  },
  tick: (dt) => {
    tickMarks(dt);
    const moments = readMoments();
    for (const [skill, state] of held()) {
      for (const moment of moments) {
        skill.moment?.(moment, state);
      }
      skill.tick?.(dt, state);
    }
  },
  reset: resetMoments,
};
