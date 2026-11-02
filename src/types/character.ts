import type { SkillBranch, UltimateId } from "./skill";
import type { Stats } from "./stats";

export interface CharacterDef {
  id: string;
  name: string;
  /** the ultimate Kael has from the start, until a level-up pick gives another */
  special: UltimateId;
  base: Stats;
  /** added per level after the first */
  growth: Partial<Stats>;
  branches: readonly SkillBranch[];
}
