import type { SkillBranch, UltimateId } from "./skill";
import type { Stats } from "./stats";

export interface CharacterDef {
  id: string;
  name: string;
  /** the weakest ultimate, learned like any other, and replaced by a stronger one */
  special: UltimateId;
  base: Stats;
  /** added per level after the first */
  growth: Partial<Stats>;
  branches: readonly SkillBranch[];
}
