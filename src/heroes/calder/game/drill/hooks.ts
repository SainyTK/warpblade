import { skillEvolved, skillLevel } from "../../../../game/skills/query";
import type { DrillHooks, DrillModifiers } from "../../../../types/drill";
import type { CalderDrillSkill, DrillSkillState } from "../../types/drillSkill";
import { resetLater, tickLater } from "./later";
import { drillNumbers } from "./numbers";
import { releaseRounds } from "./release";
import { resetChamber } from "./round";
import { CALDER_DRILL_SKILLS } from "./skills";
import { clearStruck, noteStruck, pullTrigger } from "./trigger";

function held(): [CalderDrillSkill, DrillSkillState][] {
  return CALDER_DRILL_SKILLS.filter((skill) => skillLevel(skill.id) > 0).map((skill) => [
    skill,
    { values: drillNumbers(skill.id), evolved: skillEvolved(skill.id) },
  ]);
}

export function calderModifiers(neutral: DrillModifiers): DrillModifiers {
  const modifiers = { ...neutral };
  for (const [skill, state] of held()) {
    skill.modify?.(modifiers, state);
  }
  return modifiers;
}

export const CALDER_DRILL_HOOKS: DrillHooks = {
  swordHit: (foe, infusion) => {
    noteStruck(foe);
    for (const [skill, state] of held()) {
      skill.swordHit?.(foe, infusion, state);
    }
  },
  slashed: (strike, landed) => {
    pullTrigger(strike, landed);
    for (const [skill, state] of held()) {
      skill.slashed?.(strike, landed, state);
    }
    clearStruck();
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
    releaseRounds(cast);
    for (const [skill, state] of held()) {
      skill.released?.(cast, state);
    }
  },
  tick: (dt) => {
    tickLater(dt);
    for (const [skill, state] of held()) {
      skill.tick?.(dt, state);
    }
  },
  reset: () => {
    resetLater();
    resetChamber();
    clearStruck();
  },
};
