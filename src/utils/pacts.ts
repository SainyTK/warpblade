import { SKILL_MAX_LEVEL } from "../constants/growth";
import type { Build } from "../types/build";
import type { CharacterDef } from "../types/character";
import type { SkillPact } from "../types/skill";

export interface PactTotals {
  hp: number;
  mp: number;
  power: number;
}

const NO_PACT: PactTotals = { hp: 0, mp: 0, power: 0 };

export function pactAt(pact: SkillPact | undefined, level: number): PactTotals {
  if (!pact || level <= 0) return NO_PACT;
  const steps = Math.min(level, SKILL_MAX_LEVEL);
  return { hp: (pact.hp ?? 0) * steps, mp: (pact.mp ?? 0) * steps, power: (pact.power ?? 0) * steps };
}

export function pactTotals(c: CharacterDef, b: Build): PactTotals {
  const total = { ...NO_PACT };
  for (const skill of c.skills) {
    const held = pactAt(skill.pact, b.skills[skill.id] ?? 0);
    total.hp += held.hp;
    total.mp += held.mp;
    total.power += held.power;
  }
  return total;
}

export const rateFigure = (rate: number): string => Math.abs(rate).toFixed(1).replace(/\.0$/, "");
