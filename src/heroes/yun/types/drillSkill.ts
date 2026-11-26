import type { DrillModifiers, DrillSpell, DrillStrikeId, SkillCast } from "../../../types/drill";
import type { Enemy } from "../../../types/enemy";

export interface DrillSkillState {
  values: Readonly<Record<string, number>>;
  evolved: boolean;
}

export interface YunDrillSkill {
  id: string;
  modify?(modifiers: DrillModifiers, skill: DrillSkillState): void;
  swordHit?(foe: Enemy, infusion: DrillSpell | null, skill: DrillSkillState): void;
  slashed?(strike: DrillStrikeId | "warp", landed: boolean, skill: DrillSkillState): void;
  spellHit?(foe: Enemy, spell: DrillSpell, skill: DrillSkillState): void;
  dashed?(foes: readonly Enemy[], skill: DrillSkillState): void;
  released?(cast: SkillCast, skill: DrillSkillState): void;
  tick?(dt: number, skill: DrillSkillState): void;
}
