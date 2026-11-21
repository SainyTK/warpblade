import type { DrillModifiers, DrillSpell, DrillStrikeId, SkillCast } from "../../../types/drill";
import type { Enemy } from "../../../types/enemy";

export type SkillNumbers = Readonly<Record<string, number>>;
export type DrillBlow = DrillStrikeId | "warp";

export interface DrillSkillState {
  values: SkillNumbers;
  evolved: boolean;
}

export interface SheatheOptions {
  factor: number;
  clean: boolean;
  echo: number;
  stagger: number;
  mp: number;
}

export interface SayaDrillSkill {
  id: string;
  modify?(modifiers: DrillModifiers, skill: DrillSkillState): void;
  store?(blow: DrillBlow, skill: DrillSkillState): number;
  sheathe?(options: SheatheOptions, skill: DrillSkillState): void;
  swordHit?(foe: Enemy, blow: DrillBlow, infusion: DrillSpell | null, skill: DrillSkillState): void;
  slashed?(blow: DrillBlow, landed: boolean, skill: DrillSkillState): void;
  spellHit?(foe: Enemy, spell: DrillSpell, skill: DrillSkillState): void;
  dashed?(foes: readonly Enemy[], skill: DrillSkillState): void;
  released?(cast: SkillCast, skill: DrillSkillState): void;
  tick?(dt: number, skill: DrillSkillState): void;
}
