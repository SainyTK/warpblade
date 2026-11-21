import { skillEvolved, skillLevel, skillValues } from "../../../../game/skills/query";
import type { DrillHooks, DrillModifiers, DrillSpell } from "../../../../types/drill";
import type { Enemy } from "../../../../types/enemy";
import { WHIRL } from "../../constants/whirl";
import { WOUND } from "../../constants/wounds";
import type { DrillSkillState, ZafirDrillSkill } from "../../types/drillSkill";
import { gainWhirl, tickWhirl } from "../whirl";
import { openWounds, shedDrops } from "../wounds";
import { cutBehind } from "./backCut";
import { resetLater, tickLater } from "./later";
import { releaseSandstorm } from "./release";
import { ZAFIR_DRILL_SKILLS } from "./skills";
import { twinTurn } from "./twinTurn";

const PREFIX = "drill.";
const STORM_ID = "za_storm";

function drillNumbers(id: string): Record<string, number> {
  return Object.fromEntries(
    Object.entries(skillValues(id))
      .filter(([key]) => key.startsWith(PREFIX))
      .map(([key, value]) => [key.slice(PREFIX.length), value]),
  );
}

function held(): [ZafirDrillSkill, DrillSkillState][] {
  return ZAFIR_DRILL_SKILLS.filter((skill) => skillLevel(skill.id) > 0).map((skill) => [
    skill,
    { values: drillNumbers(skill.id), evolved: skillEvolved(skill.id) },
  ]);
}

export function zafirModifiers(neutral: DrillModifiers): DrillModifiers {
  const modifiers = { ...neutral };
  for (const [skill, state] of held()) {
    skill.modify?.(modifiers, state);
  }
  return modifiers;
}

function landCut(foe: Enemy, infusion: DrillSpell | null): void {
  openWounds(foe, WOUND.cut);
  gainWhirl(WHIRL.perHit);
  for (const [skill, state] of held()) {
    skill.swordHit?.(foe, infusion, state);
  }
}

function stormBoost() {
  if (!skillLevel(STORM_ID)) {
    return { storm: 0, blind: false, twin: 0 };
  }
  const values = drillNumbers(STORM_ID);
  const evolved = skillEvolved(STORM_ID);
  return { storm: values.storm ?? 0, blind: !!values.blind, twin: evolved ? values.twin : 0 };
}

export const ZAFIR_DRILL_HOOKS: DrillHooks = {
  swordHit: landCut,
  slashed: (strike, landed) => {
    cutBehind(strike, landCut);
    if (strike === "third") {
      twinTurn(landCut);
    }
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
    releaseSandstorm(cast, stormBoost());
    for (const [skill, state] of held()) {
      skill.released?.(cast, state);
    }
  },
  tick: (dt) => {
    tickLater(dt);
    tickWhirl(dt);
    shedDrops();
    for (const [skill, state] of held()) {
      skill.tick?.(dt, state);
    }
  },
  reset: resetLater,
};
