import type { DefenseCue, DrillModifiers, DrillSpell, DrillStrikeId, SkillCast } from "../../../types/drill";
import type { Enemy } from "../../../types/enemy";

export type SkillNumbers = Readonly<Record<string, number>>;

export interface DrillSkillState {
  values: SkillNumbers;
  evolved: boolean;
}

export interface VesperDrillSkill {
  id: string;
  modify?(modifiers: DrillModifiers, skill: DrillSkillState): void;
  swordHit?(foe: Enemy, infusion: DrillSpell | null, strike: DrillStrikeId | "warp", skill: DrillSkillState): void;
  slashed?(strike: DrillStrikeId | "warp", landed: boolean, skill: DrillSkillState): void;
  spellHit?(foe: Enemy, spell: DrillSpell, skill: DrillSkillState): void;
  dashed?(foes: readonly Enemy[], skill: DrillSkillState): void;
  released?(cast: SkillCast, skill: DrillSkillState): void;
  parried?(cue: DefenseCue, skill: DrillSkillState): void;
  tick?(dt: number, skill: DrillSkillState): void;
}
